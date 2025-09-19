const { MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.post('/api/monuments', async (req, res) => {
        const { monument } = req.body;

        try {

            const createdMonument = await MonumentModel.create(monument);

            // Notifier tous les clients connectés
            req.app.get('io').emit('newMonument', {
                event: 'newMonument',
                data: {
                id: createdMonument.id,
                title: createdMonument.title,
                description: createdMonument.description,
                createdAt: createdMonument.created || new Date().toISOString()
                }
            });
            
            const message = `Le monument ${createdMonument.title} a bien été créé.`;
            res.status(201).json({ message, data: createdMonument });

        } catch (error) {
            const message = "Le monument n'a pas pu être créé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
}   