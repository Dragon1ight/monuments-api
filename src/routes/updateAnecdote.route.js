const { AnecdoteModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.put('/api/anecdotes/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const { content } = req.body;

        try {
            const anecdote = await AnecdoteModel.findByPk(id);
            if (!anecdote) {
                return res.status(404).json({ message: `L'anecdote avec l'ID ${id} n'existe pas.`, data: null });
            }

            anecdote.content = content || anecdote.content;
            await anecdote.save();
            
            res.json({ message: `L'anecdote avec l'ID ${id} a bien été mise à jour.`, data: anecdote });
        } catch (error) {       
            const message = `Erreur lors de la mise à jour de l'anecdote avec l'ID ${id}`;
            handleError(res, error, message);   
        }
    });
};