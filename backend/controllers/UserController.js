const User = require('../models/User.js');
const Photo = require('../models/Photo.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const jwt_token = process.env.TOKEN_SECRET;

// Generate user token
const generateToken = (id) => {
    return jwt.sign({id}, jwt_token, {
        expiresIn: '7d',
    });
};

// Register user and Sign in

const register = async(req, res) => {
    
    const {name, email, password} = req.body;

    // Check If User Exists
    const user = await User.findOne({email});

    if(user){
        res.status(422).json({ errors: ["Por favor, utilize outro e-mail."]});
        return;
    }

    // Password Hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
    });

    // Check se houver algum problema na criação do usuario
    if(!newUser){
        res.status(422).json({errors: ["Houve um erro, por favor tente mais tarde."]});
        return;
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })

};

// Sign user in
const login = async (req, res) => {
    const { email, password }= req.body;

    // Verifica se o usuario existe
    const user = await User.findOne({email});

    if(!user){
        res.status(404).json({errors: ["Usuario não encontrado."]});
        return;
    }

    // Compara as senhas
    if(!(await bcrypt.compare(password, user.password))){
        res.status(422).json({errors: ["A senha está incorreta."]});
        return;
    }

    // retorno da API
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

// Get current user
const getCurrentUser = (req, res) => {
    const user = req.user;

    if(!user){
        res.status(404).json({errors: ['Usuário não encontrado ou não autenticado.']})
        return;
    }

    res.status(200).json(user);
}

// Delete our profile and photos
const deleteProfile = async (req, res) => {
    
    const user = req.user;

    try{
        
        if(!user){
            res.status(404).json({errors: ['Usuário não encontrado.']})
            return;
        }
        
        await Photo.deleteMany({userId: user._id});
        await User.findByIdAndDelete(user._id);

        res.status(200).json({message: "Perfil excluído com sucesso."});

    } catch (error) {
        res.status(404).json({errors: ['Usuário não encontrado.']})
        return;
    }
}

// Update User
const update = async (req, res) => {

    const {name, password, bio} = req.body;
    let profileImage = null;

    if(req.file) {
        profileImage = req.file.filename;
    }

    const reqUser = req.user;
    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select('-password');

    if(name){
        user.name = name;
    }
    if(password){

        // Password Hash
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
    }
    if(profileImage){
        user.profileImage = profileImage;
    }
    if(bio){
        user.bio = bio;
    }

    await user.save();
    res.status(200).json(user);
}

const getUserById = async (req, res) => {

    const {id} = req.params;

    try {

        const user = await User.findById(mongoose.Types.ObjectId(id)).select('-password');

        if(!user){
            res.status(404).json({errors: ['Usuário não encontrado.']})
            return;
        }
    
        res.status(200).json(user);
        
    } catch (error) {

        res.status(404).json({errors: ['Usuário não encontrado.']})
        return;
        
    }    
}

module.exports = { 
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
    deleteProfile
};