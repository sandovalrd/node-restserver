const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = (req, res, next) => {
    const token = req.get('Authorization');

    jwt.verify(token, keys.seedToken, (err, user) => {
        if (err) {
            return res.status(401).send({
                status: 'error',
                message: 'Invalido Token!'
            });
        }
        req.usuario = user;
        next();
    });
};