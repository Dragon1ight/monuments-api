const { MonumentModel } = require('../db/sequelize');
const { Op } = require('sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/monuments', async (req, res) => {
        try {
            if (req.query.title) {
                const { title, limit, orderBy } = req.query;

                const monuments = await MonumentModel.findAll({
                    where: {
                        title: {
                            [Op.like]: `%${title}%`
                        }
                    },
                    limit: limit ? parseInt(limit) : undefined,
                    order: orderBy ? [[orderBy, 'ASC']] : undefined
                });

                if (monuments.length === 0) {
                    const message = `Aucun monument avec le nom "${title}" n'a été trouvé.`;
                    return res.status(404).json({ message, data: null });
                }

                const message = `Les monuments avec le nom "${title}" ont bien été trouvés.`;
                return res.json({ message, data: monuments });

            } else {
                const monuments = await MonumentModel.findAll();
                const message = 'La liste des monuments a bien été récupérée.';
                return res.json({ message, data: monuments });
            }

        } catch (error) {
            const message = "La liste des monuments n'a pas pu être récupérée. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};      