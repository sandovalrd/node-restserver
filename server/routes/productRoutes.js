const Producto = require('../models/Product');
const authorization = require('../middleware/authorization');

module.exports = app => {

    // busqueda irregular
    app.get('/productos/busqueda/:termino', authorization, (req, res) => {
        const { termino } = req.params;
        const regex = new RegExp(termino, 'i');

        Producto.find({ nombre: regex })
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: err.message
                    });
                }
                return res.send({
                    status: 'ok',
                    productos
                });
            });
    })

    // todas los productos
    app.get('/productos', authorization, (req, res) => {
        Producto.find({ disponible: true })
            .sort('descripcion')
            .populate('usuario', 'name email')
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: err.message
                    });
                }
                return res.send({
                    status: 'ok',
                    productos
                });
            });
    });

    // Un producto
    app.get('/producto/:id', authorization, (req, res) => {
        const id = req.params.id;
        Producto.findById(id)
            .populate('usuario', 'name email')
            .populate('categoria', 'descripcion')
            .exec((err, producto) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: err.message
                    });
                }
                return res.send({
                    status: 'ok',
                    producto
                });
            });
    });

    // Crear producto
    app.post('/producto', authorization, (req, res) => {
        const body = req.body;
        const { nombre, precioUni, descripcion, disponible, categoria } = body;
        const usuario = req.usuario._id;
        const producto = new Producto({
            nombre,
            precioUni,
            descripcion,
            disponible,
            categoria,
            usuario
        });
        producto.save((err, producto) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: err.message
                });
            }

            return res.send({
                status: 'ok',
                producto
            });
        });
    });

    // Actualizar producto
    app.put('/producto/:id', authorization, (req, res) => {
        const id = req.params.id;
        const body = req.body;

        Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, producto) => {

            if (err) {
                return res.status(401).send({
                    status: 'error',
                    message: err.message
                });
            }

            return res.send({
                status: 'ok',
                producto
            });

        });
    });

    // Borrar producto
    app.delete('/producto/:id', authorization, (req, res) => {
        const id = req.params.id;
        const disponible = req.body.disponible;

        Producto.findByIdAndUpdate(id, { disponible: disponible }, { new: true, runValidators: true, context: 'query' }, (err, producto) => {

            if (err) {
                return res.status(401).send({
                    status: 'error',
                    message: err.message
                });
            }

            return res.send({
                status: 'ok',
                producto
            });

        });
    });
};