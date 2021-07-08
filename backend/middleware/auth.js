// Middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

const jwt = require('jsonwebtoken'); // On récupère le package jsonwebtoken

// On vérifie le TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes.

// Ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];           // On récupère le token dans le headers de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split nous decompose se qui se trouve dans la cle authorization les chaine separer par un espace il nous renvoi un tableau de deux elemnet on prend que le deuxieme )
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');   // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé initialement ( Controller user), les clés doivent correspondre

        const userId = decodedToken.userId;                              // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
        if(req.body.userId && req.body.userId !== userId) {
           throw 'user ID non valable ! ';                               // si le token ne correspond pas au userId : erreur (les instructions situées après l'instruction throw ne seront pas exécutées) et le contrôle sera passé au premier bloc catch de la pile d'appels.)
        } else {
            next();                                                      // si tout est valide on passe au prochain middleware
        }
    } catch (error) {                                                      // probleme d'autentification si erreur dans les inscrutions
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};