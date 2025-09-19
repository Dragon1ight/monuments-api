const { MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.post('/api/monuments/:id/anecdotes', async (req, res) => {
        const id = parseInt(req.params.id);
        const { content } = req.body;

        try {
            const monument = await MonumentModel.findByPk(id);
            if (!monument) {
                return res.status(404).json({ message: `Le monument avec l'ID ${id} n'existe pas.`, data: null });
            }

            if (!content || content.length < 10) {
                return res.status(400).json({ message: 'Le contenu de l\'anecdote doit contenir au moins 10 caractères.', data: null });
            }

            const newAnecdote = await monument.createAnecdote({ content });
            
            res.status(201).json({ message: 'Nouvelle anecdote créée avec succès.', data: newAnecdote });
        } catch (error) {       
            const message = `Erreur lors de la création de l'anecdote pour le monument avec l'ID ${id}`;
            handleError(res, error, message);   
        }
    });
};