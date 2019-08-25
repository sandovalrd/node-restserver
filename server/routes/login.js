const Usuario = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// google authentication
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(keys.cliend_id);

// Verificar el token de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: keys.cliend_id,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

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
                role: user.role,
                _id: user._id
            }, keys.seedToken, { expiresIn: keys.expiresIn });

            return res.send({
                status: 'Ok',
                token: token
            });
        })
    });

    app.post('/google', async(req, res) => {

        const token = req.body.idtoken;
        const googleUser = await verify(token)
            .catch(e => {
                return res.status(403).json({
                    status: 'error',
                    message: e.message
                });
            });

        Usuario.findOne({ email: googleUser.email }, (err, user) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: err.message
                });
            };
            if (!user) {

                let usuario = new Usuario();
                usuario.name = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.role = 'ADMIN_ROLE';
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, user) => {

                    if (err) {
                        return res.status(500).send({
                            ok: false,
                            err
                        });
                    };

                    const token = jwt.sign({
                        usuario: user
                    }, keys.seedToken, { expiresIn: keys.expiresIn });

                    return res.send({
                        status: 'ok',
                        token,
                    });
                });
            }

            if (user.google === false) {
                return res.status(400).send({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: user
                }, keys.seedToken, { expiresIn: keys.expiresIn });

                return res.send({
                    ok: true,
                    name: user.name,
                    email: user.email,
                    token
                });
            }
        });
    });
}