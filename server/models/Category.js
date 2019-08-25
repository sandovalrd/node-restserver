const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'EL nombre de la categoria en obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'users' },
});


module.exports = mongoose.model("category", categorySchema);