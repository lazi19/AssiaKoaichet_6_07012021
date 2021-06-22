const express = require('express'); // Charge (ou importe)le module express 
const bodyParser = require('body-parser'); // permet de traiter les requêtes POST provenant de l'application front-end(d'extraire l'objet JSON de la demande)
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); // On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const jwt = require('jsonwebtoken');

const Sauce = require('./models/Sauce'); // On récupère notre model Sauce ,créer avec le schéma mongoose
const User = require('./models/User'); // On récupère notre model User ,créer avec le schéma mongoose
// mongoose.connect('mongodb+srv://test:test@cluster0.km05z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',

mongoose.connect('mongodb+srv://testSauce:testSauce@cluster0.km05z.mongodb.net/testSauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();  //app se sera notre application mais pour l'instant elle ne contiendra que la methode expresse qui permettra de cree une application expresse

// contourner le système de sécurité CORS(CORS bloque les appels HTTP d'être effectués entre des serveurs différents) en rajoutant cette fonction
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Fin contourner le système de sécurité CORS en rajoutant cette fonction

app.use(bodyParser.json()); //transformer le corp de la requette en objet javascript utilisable

//creation de route POST pour l'inscription (l'utilisateur envoie ses coordonnées )
/*

app.post('/api/auth/signup', (req, res, next) => {
    const signup = 
      {
        email: 'userMail',
        password: 'userPassword',
       
      };
    
    // res.status(200).json(signup);
    res.status(201).json({message: 'votre compte a bien été créé '})
    next();
    // console.log(signup);
  });

*/

// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
app.post('/api/auth/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)  // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
      .then(hash => {                 // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BDD mongoDB
          const user = new User({     // Création du nouvel utilisateur avec le model mongoose
 
              email: req.body.email,  // On passe l'email qu'on trouve dans le corps de la requête
              password: hash          // On récupère le mdp hashé de bcrypt
          });
          user.save()                 // On enregistre l'utilisateur dans la base de donnée
              .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
              .catch(error => res.status(400).json({ error }));

      })
      .catch(error => res.status(500).json({ error }));

});


  //creation de route POST pour la connection (l'utilisateur envoie ses coordonnées )

  /*

 app.post('/api/auth/login', (req, res, next) => {  // le premier argument de post '/api/stuff' est la route
       const login = 
      {
        email: 'userMail',
        password: 'userPassword',
       
      };

    // res.status(200).json(login);
    // res.status(200).json({message: 'Bienvenue '})
    res.status(201).json({
        userId: 'id',
        toKen: 'ken'
    })
    next();
  });

   */

  // Le Middleware pour la connexion d'un utilisateur vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur

  app.post('/api/auth/login', (req, res, next) => {
    User.findOne({ email: req.body.email })             // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
        .then(user => {                                 //récupère moi ce user
           if (!user) {                                 // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
               return res.status(401).json({ error: 'Utilisateur non trouvé !' });
           } 
           bcrypt.compare(req.body.password, user.password) //Si on trouve l'utilisateur on utilise bcrypt pour comparer les hashs et savoir s'ils ont le même string d'origine 
            .then(valid => {
                if (!valid) {                               // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
                    return res.status(401).json({ error: 'Mot de passse incorrect !' });
                }
                res.status(200).json({                     // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token

                    userId: user._id,
                    token: jwt.sign(                      //nous utilisons la fonction sign dejsonwebtoken pour encoder un nouveau token ;
                      { userId: user._id },               //ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;
                      'RANDOM_TOKEN_SECRET',              //pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
                      { expiresIn: '24h' }                //La durée de validité du token à 24 heures.
                    )
                });
           })
           .catch(error => res.status(500).json({ error }));
        })

        .catch(error => res.status(500).json({ error }));

});

//creation de route post pour sauce, permet de créer une nouvelle sauce
app.post('/api/sauces', (req, res, next) => { 
  // console.log(req.body);
  
  delete req.body._id;  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  const sauce = new Sauce({ // creation de nouvelle instance du model Sauce
    /*
      sauce: 'chaine',
      image: fichierOuLienPourImage,
    */
    // id: req.body.id,
    userId: req.body.userId,  
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,//IngredientPricipal
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,  //heatIndice    
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
    // comme on peut utiliser un raccourci (spread) pour remplacer tt l'objet comme ceci ...req.body
  });  
      /*
       res.status(201).json(
        {message: 'votre sauce a bien été créé ', sauce}        
        )
      */
     // la sauve garde de la sauce  dans la base de donnée
     sauce.save()
     .then(() => res.status(201).json({ message: 'Votre sauce a bien été créé'}))  // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
     .catch(error => res.status(400).json({ error }));  // On ajoute un code erreur en cas de problème
   
    // next();
 
});


 //creation de route GET pour sauce. Permet de récuperer toutes les sauces de la base MongoDB
  app.get('/api/sauces', (req, res, next) => {  // le premier argument de post '/api/stuff' est la route (l'utilisateur demande des informations )
    // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauces de la base de données
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

    /*
    const sauces = [
      {
        name: 'nom de la sauce ',
        manufacturer:'le fabricant',
        description: ' la description',
        imageUrl:'image url',
        IngredientPricipal: ' ingredient pricipale',
        heatIndice:' degré de  piquant  ',
        userId:''
      }
    ]
    */ 
      // res.status(200).json(login);
    // res.status(200).json({message: 'Bienvenue '})
    
    // next();
  });

// récupérer une seul sauce, identifiée par son id depuis la base MongoDB
  app.get('/api/sauces/:id', (req, res, next) => {  // le premier argument de get '/api/stuff' est la route
    // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
     Sauce.findOne({ _id: req.params.id })
       .then(sauce => res.status(200).json(sauce)) // Si ok on retourne une réponse et l'objet
       .catch(error => res.status({ error }));   // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
     
   });

// Modifier une sauce (update)
  app.put('/api/sauces/:id', (req, res, next) => {
      Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
          .catch(error => res.status(400).json({ error }));
    });

    // Supprimer une sauce
    app.delete('/api/sauces/:id', (req, res, next) => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });




   


module.exports = app; // exporter la app