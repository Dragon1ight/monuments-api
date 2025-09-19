const { UserModel } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const { handleError } = require('../../helper');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./src/auth/jwtRS256.key');

module.exports = (app) => {
    app.post('/api/register', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Le nom d'utilisateur et le mot de passe sont requis", 
                data: null 
            });
        }

        try {
            const hash = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({ username, password: hash });

            const token = jwt.sign(
                { userName: newUser.username }, 
                privateKey, 
                { algorithm: 'RS256', expiresIn: '1h' }
            );
            
            return res.status(201).json({ 
                message: "Utilisateur créé avec succès", 
                data: { userId: newUser.id, token } 
            });
        } catch (error) {
            const message = "L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};