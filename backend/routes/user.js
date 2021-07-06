
// On a besoin d'Express
const express = require('express');

// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();

//  on importe le controller
const userCtrl = require('../controllers/user');


const verifyPassword = require('../middleware/verifyPassword');

//creation de route POST pour l'inscription (l'utilisateur envoie ses coordonnées )
router.post('/signup', verifyPassword, userCtrl.signup);
    
//creation de route POST pour la connection (l'utilisateur envoie ses coordonnées )  
router.post('/login', userCtrl.login);
  

module.exports = router;