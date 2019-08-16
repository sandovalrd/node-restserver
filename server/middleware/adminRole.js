module.exports = (req, res, next) => {

    if (req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).send({
            status: 'error',
            message: 'Privilegios insuficientes'
        });
    }
    next();
};