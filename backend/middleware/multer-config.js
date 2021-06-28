// On importe multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// On crée un dictionnaire des types MIME pour définire le format des images 
// la creation d'un objet pour ajouter une extention en fonction du type mime du ficher

const MIME_TYPES = {               
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'    
};

// nous créons une constante storage , à passer à multer comme configuration, 
//qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants et les renommer
const storage = multer.diskStorage({

    destination: (req, file, callback) => {                   //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;
        callback(null, 'images')                             // On passe le dossier images qu'on a créé dans le backend
    },

    filename: (req, file, callback) => {                        // avec la fonction filename on dit à multer quel nom de fichier on utilise pour éviter les doublons

        const name = file.originalname.split(' ').join('_');      // On génère un nouveau nom avec le nom d'origine, on supprime les espaces (white space avec split) et on insère des underscores à la place

        const extension = MIME_TYPES[file.mimetype];          // Elle utilise  la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;
        callback(null, name + Date.now() + '.' + extension);    // On appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur
                                                                // et on crée le filename en entier, on ajoute un timestamp, un point et enfin l'extension du fichier
    }
});

module.exports = multer({ storage}).single('image');    //nous exportons ensuite l'élément(le module) multer entièrement configuré, lui passons notre constante storage (l'objet storage),  la méthode single pour dire que c'est un fichier unique et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
