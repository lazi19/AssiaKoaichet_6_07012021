
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
// const auth = require('../middleware/auth');


//creation de route POST pour l'inscription (l'utilisateur envoie ses coordonnées )
router.post('/signup', userCtrl.signup);
    
//creation de route POST pour la connection (l'utilisateur envoie ses coordonnées )  
router.post('/login', userCtrl.login);
  

module.exports = router;