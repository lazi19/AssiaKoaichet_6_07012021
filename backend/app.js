const express = require('express'); // Charge (ou importe)le module express 

const app = express();  //app se sera notre application mais pour l'instant elle ne contiendra que la methode expresse qui permettra de cree une application expresse

// contourner le système de sécurité CORS(CORS bloque les appels HTTP d'être effectués entre des serveurs différents) en rajoutant cette fonction
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Fin contourner le système de sécurité CORS en rajoutant cette fonction

//creation de route POST
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

  app.post('/api/auth/login', (req, res) => {  // le premier argument de post '/api/stuff' est la route
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

  });

module.exports = app; // exporter la app