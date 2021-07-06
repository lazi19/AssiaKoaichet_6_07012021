
// App.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route user, aux route sauce

// import des modules npm - Ajout des plugins externes
const express = require('express'); // Charge (ou importe)le module express => Framework basé sur node.js
const bodyParser = require('body-parser'); // permet de traiter les requêtes POST provenant de l'application front-end(d'extraire l'objet JSON des requetes POST)

// On importe mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');    // Plugin Mongoose pour se connecter à la data base Mongo Db

// On donne accès au chemin de notre système de fichier(dans notre cas les images)
const path = require('path');             // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier


// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
const helmet = require('helmet'); // il complète CORS
const nocache = require('nocache');  //  le cache est une mémoire qui stocke les informations les plus souvent utilisées par les logiciels et applications sur nos appareils .

// Déclaration des routes
const  sauceRoutes = require('./routes/sauce');   // On importe la route dédiée aux sauces
const  userRoutes = require('./routes/user');     // On importe la route dédiée aux utilisateurs

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

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

// Sécuriser Express en définissant divers en-têtes HTTP - https://www.npmjs.com/package/helmet#how-it-works
// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet());  //il fait le même travail que CORS mais mieux (il empêche le chargement des pages lorsqu'elles détectent des attaques de scripts comme injecter dans un site Web du code côté client malveillant. )

app.use(bodyParser.json());       //transforme le corp de la requette(les données arrivant de la requête POST) JSON, en objet js utilisable.

//Désactive la mise en cache du navigateur pour securiser les données .
app.use(nocache());


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