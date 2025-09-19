exports.handleError = (res, error, message) => {
    if(error.name === 'SequelizeValidationError'){
        return res.status(400).json({ message, data: error.errors.map(e => e.message) });
    }
    if(error.name === 'SequelizeUniqueConstraintError'){
        return res.status(400).json({ message, data: error.errors.map(e => e.message) });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(500).json({ message: "Le token de rafraîchissement a expiré", data: null });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(500).json({ message: "Le token de rafraîchissement est invalide", data: null });
    }
    res.status(500).json({message : "Une erreur s'est produite. Réessayez dans quelques instants.", data: null });
};