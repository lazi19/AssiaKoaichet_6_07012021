
// App.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route user, aux route sauce

// import des modules npm - Ajout des plugins externes
const express = require('express'); // Charge (ou importe)le module express => Framework basé sur node.js
const bodyParser = require('body-parser'); // permet de traiter les requêtes POST provenant de l'application front-end(d'extraire l'objet JSON des requetes POST)

// On importe mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');    // Plugin Mongoose pour se connecter à la data base Mongo Db


// const bcrypt = require('bcrypt');      // On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
// const jwt = require('jsonwebtoken');   // On récupère le package jsonwebtoken
// const auth = require('../middleware/auth');

// On donne accès au chemin de notre système de fichier
const path = require('path');             // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier

// Déclaration des routes
// On importe la route dédiée aux sauces
const  sauceRoutes = require('./routes/sauce');
// On importe la route dédiée aux utilisateurs
const  userRoutes = require('./routes/user');

// const Sauce = require('./models/Sauce'); //transferer dans sauce controllers  // On récupère notre model Sauce ,créer avec le schéma mongoose
// const User = require('./models/User');    //transferer dans user controllers  // On récupère notre model User ,créer avec le schéma mongoose


// mongoose.connect('mongodb+srv://test:test@cluster0.km05z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
// Connection à la base de données MongoDB 
mongoose.connect('mongodb+srv://testSauce:testSauce@cluster0.km05z.mongodb.net/testSauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création d'une application express
const app = express();  //app se sera notre application mais pour l'instant elle ne contiendra que la methode expresse qui permettra de cree une application expresse

// contourner le système de sécurité CORS(CORS bloque les appels HTTP d'être effectués entre des serveurs différents) en rajoutant cette fonction
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
    // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// Fin contourner le système de sécurité CORS en rajoutant cette fonction

app.use(bodyParser.json());       //transforme le corp de la requette(les données arrivant de la requête POST)en JSON, en objet js utilisable

// Gestion de la ressource image de façon statique
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')) );
// Routes pour la gestion de toute les ressources de l'API attendues - Routage
// Middleware qui va transmettre les requêtes  url vers les routes correspondantes

// Va servir les routes dédiées au sauce
app.use('/api/sauces', sauceRoutes);

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);



// Export de l'application express pour déclaration dans server.js
module.exports = app;