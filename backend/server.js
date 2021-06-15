//server sans amelioration
/*
const http = require('http'); // Charge le module HTTP ou importe
const app = require('./app'); // importer  le fichier app.js

app.set('port', process.env.PORT || 3000 )  // app.set('cle' , valeur) (app.set('key', value))  pour stocker des variables et pouvoir les recuperer (avec app.get('key')) afin de les utiliser plus tard (un peux comme localStorage)
const server = http.createServer(app); // création de notre server, est pour faire tourner le serveur il faux lui dir a la fonction express sur quel port elle va tourner on rajoutant la ligne: app.set('port', process.env.PORT || 3000 )

server.listen(process.env.PORT || 3000);

*/

// quelques améliorations à notre fichier server.js, pour le rendre plus stable et approprié pour le déploiement

const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000'); //la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
app.set('port', port);  // app.set('cle' , valeur) (app.set('key', value))  pour stocker des variables et pouvoir les recuperer (avec app.get('key')) afin de les utiliser plus tard (un peux comme localStorage)

const errorHandler = error => {        //la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
