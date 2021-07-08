// On retrouve ici la logique métier en lien avec nos utilisateurs, appliqué aux routes POST pour les opérations d'inscription et de connexion

const bcrypt = require("bcrypt"); // On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const jwt = require("jsonwebtoken"); // On récupère le package jsonwebtoken
const User = require("../models/User"); // On récupère notre model User ,créer avec le schéma mongoose
const CryptoJS = require("crypto-js"); // On récupère le package crypto-js pour crypter l'adresse mail

// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
    .then((hash) => {
      // On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BDD mongoDB
      const user = new User({
        // Création du nouvel utilisateur avec le model mongoose

        email: CryptoJS.MD5(req.body.email).toString(), // On passe l'email (crypter avant de l'envoyer a la BDD) qui se  trouve dans le corps de la requête
        password: hash, // On récupère le mdp hashé de bcrypt
      });
      user
        .save() // On enregistre l'utilisateur dans la base de donnée
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Le Middleware pour la connexion d'un utilisateur vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur

exports.login = (req, res, next) => {
  User.findOne({ email: CryptoJS.MD5(req.body.email).toString() }) // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
    .then((user) => {
      //récupère moi ce user
      if (!user) {
        // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password) //Si on trouve l'utilisateur on utilise bcrypt pour comparer les hashs et savoir s'ils ont le même string d'origine
        .then((valid) => {
          if (!valid) {
            // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
            return res.status(401).json({ error: "Mot de passse incorrect !" });
          }
          res.status(200).json({
            // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token

            userId: user._id,
            token: jwt.sign(
              //nous utilisons la fonction sign de jsonwebtoken pour encoder un nouveau token ;
              { userId: user._id }, //ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;
              "RANDOM_TOKEN_SECRET", //pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
              { expiresIn: "24h" } //La durée de validité du token à 24 heures.
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};
