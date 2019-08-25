const fileUpload = require('express-fileupload');
const validarUploads = require('../middleware/validarUploads');
const Usuario = require('../models/User');
const Producto = require('../models/Product')
const fs = require('fs');
const path = require('path');

module.exports = app => {
    app.use(fileUpload());

    app.put('/upload/:tipo/:id', validarUploads, (req, res) => {
        const data = req.files.archivo;
        const { tipo, id } = req.params
        const dataList = data.name.split('.');
        const extFile = dataList[dataList.length - 1];
        const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extFile.toLowerCase()}`;

        data.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
            if (err)
                return res.status(500).send({
                    status: 'error',
                    message: err.message
                });

            if (tipo === 'usuarios') {
                guardarImagenDb(id, res, nombreArchivo, Usuario, tipo);
            }
            if (tipo === 'productos') {
                guardarImagenDb(id, res, nombreArchivo, Producto, tipo);
            }
        });
    });

    function guardarImagenDb(id, res, nombreArchivo, tipoDb, tipo) {
        tipoDb.findById(id, (err, db) => {
            if (err) {
                borrarImg(nombreArchivo, tipo);
                return res.status(400).send({
                    status: 'error',
                    message: err.message
                });
            }
            if (!db) {
                borrarImg(nombreArchivo, tipo);
                return res.status(400).send({
                    status: 'error',
                    message: `No existe ${tipo.substring(0,tipo.length-1)}`
                });
            }

            borrarImg(db.img, tipo);
            db.img = nombreArchivo;
            db.save((err, db) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: err.message
                    });
                }
                res.send({
                    status: 'ok',
                    db
                });
            });
        });
    }

    function borrarImg(nombreArchivo, tipo) {
        const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }
}