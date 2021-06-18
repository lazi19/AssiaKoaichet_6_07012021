const express = require('express'); // Charge (ou importe)le module express 
const bodyParser = require('body-parser'); // permet de traiter les requêtes POST provenant de l'application front-end(d'extraire l'objet JSON de la demande)
const mongoose = require('mongoose'); 

const Sauce = require('./models/Sauce');

mongoose.connect('mongodb+srv://test:test@cluster0.km05z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

  //creation de route POST pour la connection (l'utilisateur envoie ses coordonnées )
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

//creation de route post pour sauce
app.post('/api/sauces', (req, res, next) => { 
  // console.log(req.body);
  delete req.body._id;  
  const sauce = new Sauce({ // creation de nouvelle instance du model Sauce
    /*
      sauce: 'chaine',
      image: fichierOuLienPourImage,
    */

    userId: req.body.userId,  
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,//IngredientPricipal
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,  //heatIndice    
    
  });  
      /*
       res.status(201).json(
        {message: 'votre sauce a bien été créé ', sauce}        
        )
      */
     // la sauve garde dans la base de donnée
     sauce.save()
     .then(() => res.status(201).json({ message: 'Votre sauce a bien été créé'}))
     .catch(error => res.status(400).json({ error }));
   
    next();
 
});


 //creation de route GET pour sauce
  app.get('/api/sauces', (req, res, next) => {  // le premier argument de post '/api/stuff' est la route (l'utilisateur demande des informations )
    // console.log(req.body);
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
    
    next();
  });

  app.get('/api/sauces/:id', (req, res) => {  // le premier argument de get '/api/stuff' est la route
    const sauce = [
      {      
        name: '',
        manufacturer:'',
        description: '',
        imageUrl:'',
        IngredientPricipal: '',
        heatIndice:'',
        userId:''
      }
    ]
    
       
      // res.status(200).json(login);
    // res.status(200).json({message: 'Bienvenue '})
    res.status(200).json(sauce)
  
  });



module.exports = app; // exporter la app