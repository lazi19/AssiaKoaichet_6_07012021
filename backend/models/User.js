const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');   // package qui valide l'unicité de l'email
const sanitizerPlugin = require('mongoose-sanitizer-plugin');  // package qui purifie les champs du model avant de les enregistrer dans la base MongoDB.

// On crée notre schéma de données dédié à l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}

});

// Plugin pour garantir un email unique
// On applique ce validateur au schéma avant d'en faire un modèle et on appelle la méthode plugin et on lui passe uniqueValidator
userSchema.plugin(uniqueValidator);

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
// On utilise le HTML Sanitizer de Google Caja pour effectuer cette désinfection.
userSchema.plugin(sanitizerPlugin);

// On exporte ce schéma sous forme de modèle : le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model('User', userSchema);