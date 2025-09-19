module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Monument', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le titre du monument est obligatoire.'
        },
        notEmpty: {
          msg: 'Le titre du monument est obligatoire.'
        },
        len: {
          args: [3, 70],
          msg: 'Le titre du monument doit contenir entre 3 et 70 caractères.'  
        },
        noForbiddenWords(value) {
          const forbiddenWords = ['test', 'fake', 'demo', 'example'];
          if(forbiddenWords.some(word => value.toLowerCase().includes(word))) {
            throw new Error('Le titre contient des mots interdits.');
          }
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      notNull: {
        msg: 'Le pays est obligatoire.'
      },
      notEmpty: {
        msg: "Le pays est obligatoire."
      },
      len: {
        args: [2, 100],
        msg: "Le nom du pays doit contenir entre 2 et 100 caractères."
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La ville est obligatoire.'
        },
        notEmpty: {
          msg: "La ville est requise."
        },
        len: {
          args: [2, 100],
          msg: "Le nom de la ville doit contenir entre 2 et 100 caractères."
        }
      }
    },
    buildYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "L'année de construction doit être un nombre entier."
        },
        min: {
          args: [-3000],
          msg: "L'année de construction ne peut pas être inférieure à -3000."
        },
        max: {
          args: [new Date().getFullYear()],
          msg: `L'année de construction ne peut pas être dans le futur.`
        }
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "L'URL de l'image n'est pas valide."
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: "La description ne peut pas dépasser 2000 caractères."
        }
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false,
    validate : { 
      cityNotEqualsCountry() {
        if(this.city && this.country && this.city.toLowerCase() === this.country.toLowerCase()) {
          throw new Error("La ville et le pays doivent être différents.");
        }
      }
    }

  });
}