const { Sequelize, DataTypes } = require('sequelize');
let monuments = require('./monuments-list')

const sequelize = new Sequelize(
    'monumento',
    'root',
    '',
    {
        host: 'localhost',
        port : 3306,
        dialect: 'mysql',
        logging: true
    }
);

sequelize
        .authenticate()
        .then(() => {
            console.log('La connexion à la base de données a été établie avec succès.');
        })
        .catch(err => {
            console.error('Impossible de se connecter à la BDD:', err);
        });

const MonumentModel = require('../models/monument')(sequelize, DataTypes);
const UserModel = require('../models/user')(sequelize, DataTypes);
const AnecdoteModel = require('../models/anecdote')(sequelize, DataTypes);
const FavoriteModel = require('../models/favorite')(sequelize, DataTypes);

MonumentModel.hasMany(AnecdoteModel, { foreignKey: 'monument_id', as: 'anecdotes' }); 
AnecdoteModel.belongsTo(MonumentModel, { foreignKey: 'monument_id', as: 'monument' });

// Many-to-Many User <-> Monument via Favorite
UserModel.belongsToMany(MonumentModel, {
    through: FavoriteModel,
    foreignKey: 'userId',
    otherKey: 'monumentId',
    as: 'favorites'
});
MonumentModel.belongsToMany(UserModel, {
    through: FavoriteModel,
    foreignKey: 'monumentId',
    otherKey: 'userId',
    as: 'fans'
});
// Direct associations for include on Favorite
FavoriteModel.belongsTo(UserModel, { foreignKey: 'userId' });
FavoriteModel.belongsTo(MonumentModel, { foreignKey: 'monumentId' });

const initDb = async () => {
    return sequelize.sync()
            .then(() => {
        
                // monuments.forEach(async (monument) => {
                //     MonumentModel.create({
                //         title: monument.name,
                //         country: monument.country,
                //         city: monument.city,
                //         buildYear: monument.buildYear,
                //         picture: monument.picture,
                //         description: monument.description
                //     })
                // })
                console.log("Les modèles ont été synchronisés avec la base de données.");
        
            })
            .catch((error) => {
                console.error("Une erreur s'est produite lors de la synchronisation des modèles :", error);
            });
}
module.exports = {
    initDb,
    MonumentModel,
    UserModel,
    AnecdoteModel,
    FavoriteModel
};