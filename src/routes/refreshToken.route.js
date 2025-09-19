const { UserModel } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const { handleError } = require('../../helper');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./src/auth/jwtRS256.key');
const { Op } = require('sequelize');

module.exports = (app) => {
    app.post('/api/refresh-token', async (req, res) => {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {   
            return res.status(400).json({
                message: "Le token de rafraîchissement est requis",
                data: null
            });
        }

        try {
            const decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] });
            const username = decoded.userName;

            const user = await UserModel.findOne({ 
                where: { 
                    username,
                    refreshToken: { [Op.eq]: refreshToken },
                    refreshTokenExpiry: { [Op.gt]: new Date() }
                } 
            });
            
            if (!user) {
                return res.status(401).json({
                    message: "Token de rafraîchissement invalide ou expiré",
                    data: null
                });
            }

            const newAccessToken = jwt.sign(
                { userName: user.username }, 
                publicKey, 
                { algorithm: 'RS256', expiresIn: '1m' }
            );

            return res.json({
                message: "Nouveau token d'accès généré avec succès",
                data: { accessToken: newAccessToken }
            });
            
        }
        catch (error) {
            return handleError(res, error, message);
        }
    });
};