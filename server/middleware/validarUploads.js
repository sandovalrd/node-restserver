module.exports = (req, res, next) => {
    const extValidas = ['jpg', 'png', 'gif', 'jpeg'];
    const tiposValidos = ['productos', 'usuarios']

    if (!req.files) {
        return res.status(400).send({
            status: 'error',
            message: 'No hay archivos para subir!'
        });
    }

    const archivo = req.files.archivo;
    if (!archivo) {
        return res.status(400).send({
            status: 'error',
            message: 'No existe una variable archivo!'
        });
    }

    const archivoList = archivo.name.split('.');
    const extFile = archivoList[archivoList.length - 1];
    if (extValidas.indexOf(extFile.toLowerCase()) < 0) {
        return res.status(400).send({
            status: 'error',
            message: `Las extensiones validas son: ${extValidas.join(', ')}`
        });
    }

    const tipo = req.params.tipo;
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).send({
            status: 'error',
            message: `Los tipos de upload permitidos son: ${tiposValidos.join(' y ')}`
        });
    }

    next();
};