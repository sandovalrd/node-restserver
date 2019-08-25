const Categoria = require('../models/Category');
const authorization = require('../middleware/authorization');
const adminRole = require('../middleware/adminRole');

module.exports = app => {

    // todas las categorias
    app.get('/categorias', authorization, (req, res) => {
        Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'name email')
            .exec((err, categorias) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: err.message
                    });
                }

                return res.send({
                    status: 'ok',
                    categorias
                });
            });
    });


    // Una categoria
    app.get('/categoria/:id', authorization, (req, res) => {
        const id = req.params.id;
        Categoria.findById(id, (err, category) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: err.message
                });
            }
            return res.send({
                status: 'ok',
                category
            });
        })
    });

    // Crear categoria
    app.post('/categoria', [authorization, adminRole], (req, res) => {
        const body = req.body;
        const { descripcion } = body;
        const usuario = req.usuario._id;

        const categoria = new Categoria({
            descripcion,
            usuario
        });

        categoria.save((err, user) => {
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

    // Actualizar categoria
    app.put('/categoria/:id', [authorization, adminRole], (req, res) => {
        const id = req.params.id;
        const body = req.body;

        Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, category) => {

            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: err.message
                });
            }
            if (body.descripcion === undefined) {
                return res.status(400).send({
                    status: 'error',
                    message: 'La categoria es obligatoria!'
                });
            }

            return res.send({
                status: 'ok',
                category
            });

        });

    });

    // Borrar categoria
    app.delete('/categoria/:id', [authorization, adminRole], (req, res) => {
        const id = req.params.id
        Categoria.findByIdAndRemove(id, (err, categoria) => {
            if ((err) || (!categoria)) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Categoria no existe!'
                });
            }

            return res.send({
                status: 'ok',
                categoria
            });
        })
    });

};