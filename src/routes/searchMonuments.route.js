const { MonumentModel } = require('../db/sequelize');
const { Op } = require('sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/monuments/search', async (req, res) => {
        const { q, limit = 10, offset = 0, order = 'desc' } = req.query;

        if (!q || q.trim().length < 2) {
            const message = 'Le paramètre de recherche "q" est requis et doit contenir au moins 2 caractères.';
            return res.status(400).json({ message, data: null });
        }

        try {
            const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

            const monuments = await MonumentModel.findAndCountAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${q}%` } },
                        { description: { [Op.like]: `%${q}%` } }
                    ]
                },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['title', sortOrder]]
            });

            if (monuments.count > 0) {
                const message = `Recherche réussie. ${monuments.count} monument(s) trouvé(s).`;
                return res.json({ message, data: monuments.rows, total: monuments.count });
            } else {
                const message = `Aucun monument trouvé pour la recherche "${q}".`;
                return res.status(404).json({ message, data: null });
            }
        } catch (error) {
            const message = "La recherche n'a pas pu être effectuée. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
