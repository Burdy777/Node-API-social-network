const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

// config body-parser, 
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());


server.get('/', (req,res) => {
    res.setHeader('Content-type', 'text/html');
    res.status(200).send('<h1>Serveur Node Js </h1>');
})
server.use('/api/', apiRouter);

server.listen(3000)
