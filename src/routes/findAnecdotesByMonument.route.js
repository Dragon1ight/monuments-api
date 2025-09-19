const { MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/monuments/:id/anecdotes', async (req, res) => {
        const id = parseInt(req.params.id);
        
        try {
            const monument = await MonumentModel.findByPk(id, {
                include: [
                    { association: 'anecdotes', attributes: ['content'] }
                ]
            });
            if (!monument) {
                return res.status(404).json({ message: `Le monument avec l'ID ${id} n'existe pas.`, data: null });
            }
            res.json({ message: `Anecdotes pour le monument ID ${id}`, data: monument.anecdotes }); 
        } catch (error) {
            const message = `Erreur lors de la récupération des anecdotes pour le monument avec l'ID ${id}`;
            handleError(res, error, message);   
        }
    });
};