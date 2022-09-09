const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const jwt_token = process.env.TOKEN_SECRET;

const authGuard = async (req, res, next) => {


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Check if Header has a token
    if(!token) return res.status(401).json({errors: ['Acesso negado.']});

    try {
        // Faz a verificação do token
        const verified = jwt.verify(token, jwt_token);
        req.user = await User.findById(verified.id).select('-password');
        next();

    } catch (error) {
        res.status(401).json({errors: ["Token inválido."]});
    }


}

module.exports = authGuard;