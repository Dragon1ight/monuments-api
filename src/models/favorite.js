// src/models/favorite.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Favorite',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId:     { type: DataTypes.INTEGER, allowNull: false },
      monumentId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: 'favorites',
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
      indexes: [
        { unique: true, fields: ['userId', 'monumentId'], name: 'unique_user_monument' }
      ]
    }
  );
};
