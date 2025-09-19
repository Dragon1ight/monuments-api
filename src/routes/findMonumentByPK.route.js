const { MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/monuments/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const monument = await MonumentModel.findByPk(id);

            if (!monument) {
                const message = `Le monument avec l'ID ${id} n'existe pas.`;
                return res.status(404).json({ message, data: null });
            }

            const message = `Le monument avec l'ID ${id} a bien été trouvé.`;
            return res.json({ message, data: monument });

        } catch (error) {
            const message = "Le monument n'a pas pu être récupéré. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};