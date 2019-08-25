const fs = require('fs');
const path = require('path');

module.exports = app => {

    app.get('/imagen/:tipo/:img', (req, res) => {
        const { tipo, img } = req.params
        const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }

        res.sendFile(noImagePath);
    });
}