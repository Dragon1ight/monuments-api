const { AnecdoteModel } = require('../db/sequelize');
const { handleError } = require('../../helper');    

module.exports = (app) => {
    app.delete('/api/anecdotes/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const anecdote = await AnecdoteModel.findByPk(id);
            if (!anecdote) {
                return res.status(404).json({ message: `L'anecdote avec l'ID ${id} n'existe pas.`, data: null });
            }

            await anecdote.destroy();
            res.json({ message: `L'anecdote avec l'ID ${id} a bien été supprimée.`, data: anecdote });
        } catch (error) {       
            const message = `Erreur lors de la suppression de l'anecdote avec l'ID ${id}`;
            handleError(res, error, message);   
        }
    });
};