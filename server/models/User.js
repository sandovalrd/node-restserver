const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido!'
}

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es obligatorio'] },
    img: { type: String },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    state: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

userSchema.methods.toJSON = function() {

    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, { message: '{VALUE} ya se encuentra definido!' });

module.exports = mongoose.model('users', userSchema);