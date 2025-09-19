module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Anecdote', {
        id: {   
            type: DataTypes.INTEGER,    
            primaryKey: true,    
            autoIncrement: true    
        },
        content: {    
            type: DataTypes.TEXT,    
            allowNull: false,    
            validate: {    
                notNull: {    
                    msg: 'Le contenu de l\'anecdote est obligatoire.'    
                },    
                notEmpty: {    
                    msg: 'Le contenu de l\'anecdote ne peut pas être vide.'    
                },
            }
        },
        monument_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: false,
    });
}  
    