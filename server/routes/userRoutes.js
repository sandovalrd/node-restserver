const Usuario = require('../models/User');
const bcrypt = require('bcrypt'); // npm install bcrypt --save
const _ = require('underscore'); // npm install underscore --save
const authorization = require('../middleware/authorization');
const adminRole = require('../middleware/adminRole');

module.exports = app => {

    app.get('/usuario', authorization, (req, res) => {
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;

        Usuario.find({ state: true }, 'name email role')
            .skip(desde)
            .limit(limite)
            .exec((err, users) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: err.message
                    });
                }
                Usuario.countDocuments({ state: true }, (err, total) => {

                    return res.send({
                        status: 'ok',
                        total,
                        users
                    });
                });
            });
    });

    app.post('/usuario', [authorization, adminRole], (req, res) => {
        const body = req.body;
        const { name, email, password, role } = body;

        const usuario = new Usuario({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            role
        });

        usuario.save((err, user) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: err.message
                });
            }

            return res.send({
                status: 'ok',
                user
            });
        })

    });

    app.put('/usuario/:id', [authorization, adminRole], (req, res) => {
        const id = req.params.id;
        const body = _.pick(req.body, ['name', 'email', 'role', 'img']);

        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: err.message
                });
            }
            return res.send({
                status: 'ok',
                user: usuarioDB
            });

        });


    });

    app.delete('/usuario/:id', [authorization, adminRole], (req, res) => {
        const id = req.params.id
        Usuario.findByIdAndRemove(id, (err, usuario) => {
            // Usuario.findByIdAndUpdate(id, { state: false }, { new: true, context: 'query' }, (err, usuario) => {
            if ((err) || (!usuario)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Usuario no existe!'
                });
            }

            return res.send({
                status: 'ok',
                usuario
            });
        })
    });

};