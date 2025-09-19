const { handleError } = require('../../helper');
const { MonumentModel } = require('../db/sequelize');

module.exports = (app) => {
    app.delete('/api/monuments/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const monument = await MonumentModel.findByPk(id);

            if (!monument) {
                const message = `Le monument avec l'ID ${id} n'existe pas.`;
                return res.status(404).json({ message, data: null });
            }

            await MonumentModel.destroy({
                where: { id: id }
            });

            const message = `Le monument avec l'ID ${id} a bien été supprimé.`;
            return res.json({ message, data: monument });

        } catch (error) {
            const message = "Le monument n'a pas pu être supprimé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
