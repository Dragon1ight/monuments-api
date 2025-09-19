const { MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.put('/api/monuments/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        try {

            const [updatedRows] = await MonumentModel.update(req.body, {
                where: { id: id }
            });

            if (updatedRows === 0) {
                const message = `Le monument avec l'ID ${id} n'existe pas.`;
                return res.status(404).json({ message, data: null });
            }

            const monument = await MonumentModel.findByPk(id);

            if (!monument) {
                const message = `Le monument avec l'ID ${id} n'existe pas.`;
                return res.status(404).json({ message, data: null });
            }

            const message = `Le monument avec l'ID ${id} a bien été mis à jour.`;
            return res.json({ message, data: monument });

        } catch (error) {
            const message = "Le monument n'a pas pu être modifié. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
}   
