const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'users' }
});


module.exports = mongoose.model('Producto', productSchema);