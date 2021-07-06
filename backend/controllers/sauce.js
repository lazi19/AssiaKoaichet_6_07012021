
// On prend toute la logique métier pour la déporter dans le fichier sauce.js de controllers
// On ne garde que la logique de routing dans le fichier sauce.js du router. On importe aussi le model Sauce
// On a ajouté le controller sauce avec une constante sauceCtrl dans le fichier sauce.js du router


// Récupération du modèle créé grâce à la fonction schéma de mongoose
// Récupération du modèle 'Sauce'
const Sauce = require('../models/Sauce');

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');

// Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => { 
    // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    
    const sauce = new Sauce({ // creation de nouvelle instance du model Sauce
     
      userId: sauceObject.userId,  
      name: sauceObject.name,
      manufacturer: sauceObject.manufacturer,
      description: sauceObject.description,
      mainPepper: sauceObject.mainPepper,//IngredientPricipal
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
      heat: sauceObject.heat,  //heatIndice    
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
      // comme on peut utiliser un raccourci (spread) pour remplacer tt l'objet comme ceci (...sauceObject)
    });
       // la sauve garde de la sauce  dans la base de donnée
       sauce.save()
       .then(() => res.status(201).json({ message: ' Sauce enregistré !'}))  // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
       .catch(error => res.status(400).json({ error }));  // On ajoute un code erreur en cas de problème
       
  };

// Permet de modifier une sauce
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // Si la modification contient une image 
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
  };

// Permet de supprimer la sauce
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        } )
      })
      .catch(error => res.status(500).json({ error}));
    
  };

  // Permet de récupérer une seule sauce, identifiée par son id depuis la base MongoDB
  exports.getOneSauce = (req, res, next) => { 
        // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
         Sauce.findOne({ _id: req.params.id })
           .then(sauce => res.status(200).json(sauce)) // Si ok on retourne une réponse et l'objet
           .catch(error => res.status(404).json({ error }));   // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
         
  };
 
  // Permet de récuperer toutes les sauces de la base MongoDB
  exports.getAllSauces = (req, res, next) => { 
        // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauces de la base de données
        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
    
       
  };

  // Permet de liker ou disliker une  sauces 
  exports.likeDislike = (req, res, next) => {  

        const userId = req.body.userId; //  // (est le createur de la sauce) ou la personne connecter
        const sauceId = req.params.id ; // On prend l'id de la sauce qui se trouve dans  url
        const like = req.body.like;   // Like présent dans le body
        console.log('sauceId :' + sauceId);
        console.log('userId :' + userId);
        console.log('like :' + like);
       
    if (like === 1 ){

        Sauce.updateOne({ _id: sauceId}, { $push: { usersLiked: userId}, $inc: {likes: 1} })
        .then(() => res.status(200).json({ message:  "Utilisateur aime la sauce. Like ajouté !" }))
        .catch((error) =>  res.status(400).json({ error }))
    }

    if (like === -1 ){

      Sauce.updateOne({ _id: sauceId}, { $push: { usersDisliked: userId}, $inc: {dislikes: 1} })
      .then(() => res.status(200).json({ message: " Utilisateur n'aime pas la sauce. Dislike ajouté ! " }))
      .catch((error) => res.status(400).json({ error }) )
      
    }

    if (like === 0  ){
      Sauce.findOne({ _id: sauceId })
      .then((sauce) => { 
          if (sauce.usersLiked.includes(userId)){ // si dans le usersLiked y a notre userId (si notre utilisateur a deja liker cette sauce )( La méthode includes() permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.)
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
            .then(() => res.status(200).json({ message: 'Like retiré !' }))
            .catch((error) => res.status(400).json({ error }))
          }
          
          if (sauce.usersDisliked.includes(userId)){
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
            .catch((error) => res.status(400).json({ error })) 
          }
    
      })
      .catch((error) => res.status(404).json({ error }))
    }
  }