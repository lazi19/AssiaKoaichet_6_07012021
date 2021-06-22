
const mongoose = require('mongoose'); //importer mongoose

// Création d'un schema mangoose pour que les données de la base MongoDB ne puissent pas différer de
//celui précisé dans le schema Model des sauces. L'id est généré automatiquement par MongoDB
const sauceSchema = mongoose.Schema({
    id: { type: String, required: true }, // cet id va etre supprimer car le vrai id est généré automatiquement par MongoDB
    userId: { type: String, required: true },  // UserId du createur
    name: { type: String, required: true }, // Nom de la sauce
    manufacturer: { type: String, required: true },  // Créateur de la sauce
    description: { type: String, required: true },    // description de la sauce
    mainPepper: { type: String, required: true }, // Ingredients qui pimentent la sauce
    imageUrl: { type: String, required: true },   // Adresse de l'image de presentation de la sauce
    heat: { type: Number, required: true }, // Force le piquant de la sauce
    likes: { type: Number }, // nombre de Like reçu
    dislikes: { type: Number}, // nombre de dislike reçu
    usersLiked: { type: [String] },  // Utilisateurs qui Like la sauce
    usersDisliked: { type: [String] }, // Utilisateur qui DisLike la sauce

  });

  
 // On exporte ce shéma de donnée, on va donc pouvoir utiliser ce modèle pour interagir avec l'application
  module.exports = mongoose.model('Sauce', sauceSchema);