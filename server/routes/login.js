const Usuario = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = app => {

    app.post('/login', (req, res) => {
        const body = req.body;
        const { password, email } = body;

        if ((password === undefined) || email === undefined) {
            return res.status(400).send({
                status: 'Error',
                message: 'Faltan parametros!'
            });
        }

        Usuario.findOne({ email }, (err, user) => {

            if (err) {
                return res.status(500).send({
                    status: 'Error!'
                });
            }

            if ((!user) || (!bcrypt.compareSync(password, user.password))) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Usuario o contraseña incorrectas!'
                });
            }

            const token = jwt.sign({
                name: user.name,
                email: user.email,
                role: user.role
            }, keys.seedToken, { expiresIn: 60 * 60 * 24 });

            return res.send({
                status: 'Ok',
                token: token
            });
        })
    });

}