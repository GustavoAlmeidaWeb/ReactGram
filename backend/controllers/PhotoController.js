const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const User = require('../models/User');

// Insert photo, 
const insertPhoto = async (req, res) => {

    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;
    const user = await User.findById(reqUser._id);

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name, 
    });

    // if photo was created successfully, return data
    if(!newPhoto){
        res.status(422).json({
            errors: ['Houve algum problema, por favor tente mais tarde.'],
        })
        return;
    }

    res.status(200).json(newPhoto);
}

// Remover photo from DB
const deletePhoto = async (req, res) => {

    const { id } = req.params;
    const reqUser = req.user;

    try {
        
        const photo = await Photo.findById(mongoose.Types.ObjectId(id));

        // Check if photo exists
        if(!photo){
            res.status(404).json({
                errors: ['A foto não foi encontrada.'],
            })
            return;
        }

        // Check if photo belongs to user
        if(!photo.userId.equals(reqUser._id)){
            res.status(422).json({
                errors: ['Ocorreu algum problema, por favor tente novamente mais tarde.'],
            });
            return;
        }

        await Photo.findByIdAndDelete(photo._id);
        res.status(200).json({id: photo._id, message: "Foto excluída com sucesso."});

    } catch (error) {

        res.status(404).json({
            errors: ['A foto não foi encontrada.'],
        })
        return;
        
    }
}

// Get all photos
const getAllPhotos = async (req, res) => {

    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);

}

// Get user Photos
const getUserPhotos = async (req, res) => {

    // Get url id
    const {id} = req.params;

    const photos = await Photo.find({userId: id}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);
}

// get photo by id
const getPhotoById = async (req, res) => {

    // Get url id
    const {id} = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    if(!photo) {
        res.status(404).json({
            errors: ["Foto não encontrada."]
        })
        return;
    }
    return res.status(200).json(photo);
}

// Updated a Photo
const updatePhoto = async (req, res) => {

    // Get url id
    const {id} = req.params;
    const {title} = req.body;

    const reqUser = req.user;
    const photo = await Photo.findById(id);

    // Check if photo exists
    if(!photo){
        res.status(404).json({
            errors: ["Foto não encontrada."]
        })
        return;
    }

    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({
            errors: ["Ocorreu um erro, por favor tente mais tarde."]
        })
        return;
    }

    if(title){
        photo.title = title;
    }

    await photo.save();
    res.status(200).json({photo, message: 'Foto atualizada com sucesso.'});

}

// Comment Functionallity
const commentPhoto = async (req, res) => {

    // Get url id
    const {id} = req.params;
    const {comment} = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);

    // Check if photo exists
    if(!photo){
        res.status(404).json({
            errors: ["Foto não encontrada."]
        })
        return;
    };

    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };


    // Put user id in likes array
    photo.comments.push(userComment);
    await photo.save();
    res.status(200).json({
        comment: userComment,
        message: "A comentário foi adicionado com sucesso."
    })

}

// Like Functionallity
const likePhoto = async (req, res) => {

    // Get url id
    const {id} = req.params;
    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // Check if photo exists
    if(!photo){
        res.status(404).json({
            errors: ["Foto não encontrada."]
        })
        return;
    }
    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({
            errors: ["Você já curtiu a foto."]
        })
        return;
    }

    // Put user id in likes array
    photo.likes.push(reqUser._id);
    await photo.save();
    res.status(200).json({
        photoId: id,
        userId: reqUser._id,
        message: "A foto foi curtida."
    })

}

// Search photos by title
const searchPhotos = async (req, res) => {

    const {q} = req.query;
    const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);

}


module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
}