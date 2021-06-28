
// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les sauces
// Dans le routeur on ne veut QUE la logique de routing, ainsi la logique métier sera enregistrée dans le controller sauce.js


// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');

// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();

// Ajout des middleweares
const auth = require('../middleware/auth');             // On importe le middleware auth pour sécuriser les routes
const multer = require('../middleware/multer-config');  //On importe le middleware multer pour la gestion des images

// On associe les fonctions qui se trouve dans ../controllers/sauce aux différentes routes, on importe le controller
const sauceCtrl = require('../controllers/sauce');

// En exportant dans le controller la logique métier, les fonctions, on voit plus clairement quelles sont les routes dont on dispose
// et on utilisera une sémantique très claire pour comprendre ce qu'elles permettent.
// On a quelque chose de plus modulaire plus facile à comprendre et plus facile à maintenir

// Création des différentes ROUTES de l'API en leurs précisant, dans l'ordre, leurs middlewares et controllers

// Route qui permet de créer "une sauce"
// Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères et l'enregistre dans la base de données, en définissant correctement son image URL. Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides.
//creation de route post (premiere etape de CRUD creat) (post est Recevoir des donnees de l'application front-end) (le use fait reference a toute les methodes GET, POST, PUT, DELETE, PATCH, OPTIONS )


  //creation de route post pour sauce, permet de créer une nouvelle sauce
  router.post('/', auth, multer, sauceCtrl.createSauce );  
  
  //creation de route GET pour sauce. Permet de récuperer toutes les sauces de la base MongoDB
  router.get('/', auth, sauceCtrl.getAllSauces);
  
  // récupérer une seul sauce, identifiée par son id depuis la base MongoDB
  router.get('/:id', auth, sauceCtrl.getOneSauce);
  
  // Modifier une sauce (update)
  router.put('/:id', auth, multer, sauceCtrl.modifySauce);
  
  // Supprimer une sauce
  router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
   // like ou dislike une sauce
   router.post('/:id/like', auth, sauceCtrl.likeDislike);

  module.exports = router;