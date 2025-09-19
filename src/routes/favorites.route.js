const { FavoriteModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
  // POST /api/favorites/:monumentId  -> ajoute un favori pour l'utilisateur connecté
  app.post('/api/favorites/:monumentId', async (req, res) => {
    try {
      const userId = req.user.id; // injecté par le middleware global
      const monumentId = Number(req.params.monumentId);

      const [fav, created] = await FavoriteModel.findOrCreate({
        where: { userId, monumentId }
      });

      if (!created) return res.status(400).json({ message: 'Déjà en favoris' });
      return res.status(201).json({ message: 'Ajouté aux favoris', data: fav });
    } catch (error) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Déjà en favoris' });
      }
      return handleError(res, error);
    }
  });

  // DELETE /api/favorites/:monumentId  -> supprime le favori
  app.delete('/api/favorites/:monumentId', async (req, res) => {
    try {
      const userId = req.user.id;
      const monumentId = Number(req.params.monumentId);

      await FavoriteModel.destroy({ where: { userId, monumentId } });
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error);
    }
  });

  // GET /api/favorites  -> liste les favoris de l'utilisateur (avec les infos du monument)
  app.get('/api/favorites', async (req, res) => {
    try {
      const userId = req.user.id;
      const rows = await FavoriteModel.findAll({
        where: { userId },
        include: [
          { model: MonumentModel, attributes: ['id', 'title', 'description', 'created'] }
        ],
        order: [['created', 'DESC']]
      });
      return res.json({ message: 'Favoris récupérés', data: rows });
    } catch (error) {
      return handleError(res, error);
    }
  });
};
