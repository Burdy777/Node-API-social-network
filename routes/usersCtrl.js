// VOIR LA RAISON BCRYPT NE FONCTIONNE PAS
const bcrypt = require('bcrypt');
const models = require('../models')
const jwts = require('./../jwtUtils')
const REGEX_PASSWORD = ''
const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
    register: function(req,res) {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password; 
        const bio =  req.body.bio;

        // si toute les données sont remplis
        if(email === null || username === null || password === null || bio === null) {
            return res.status(400).json({'error': 'Donnés incorrecte'})
        }
        // username longueur
        if(username.length < 3 || username.length > 15) {
            return res.status(400).json({'error':'username doit être compris entre 3 et 15'})
        }
        // email 
        if(!REGEX_EMAIL.test(email)) {
            return res.status(400).json({'error':'Erreur de mail'})
        }

        models.user.findOne({
            attributes: ['email'],
            where: {email: email}
        }).then((userFound) => {
                if(userFound) {
                    res.status(409).json({'error':'user already exist'})
                } else {
                    // insertion en BDD et decryptage du code
                    bcrypt.hash(password,5, (err, bcrypted) => {
                        // if(err) return res.status(500).json({'error': 'hashage something wrong' });
                       const newUser = models.user.create({
                        email: email,
                        username: username,
                        password: 'passwordFake',
                        bio: bio,
                        isAdmin: 0
                       }).then(newUser => { return res.status(201).json({'userId': newUser.id })
                       }).catch(err => { return res.status(500).json({'error': err + ' cannot add user'}) })
                    })
                }
        }).catch(() => {
            res.status(400).json({'error':'connection database is Dead'})
        })
    
    },
    login: function(req, res) {
        const password = 'passwordFake';
        const email = req.body.email;

        if(password == null || email == null) {
            return res.status(400).json({'error': 'Valeur obligatoire'});
        }
        if(!REGEX_EMAIL.test(email)) {
            return res.status(400).json({'error': 'Mauvais format d\'email'});
        }


        models.user.findOne({
            where: {email: email}
        }).then(userFound => {
            if(!userFound) {
                return res.status(404).json({'error': 'utlisateur n\'existe pas '})
            } else {
                bcrypt.compare(password, userFound.password, function(err, resBycrypt) {
                    if(userFound.password === password) {
                        return res.status(200).json({
                            'userId': userFound.id,
                             'token': jwts.generateToken(userFound)
                        })
                    } 
                    else {
                        return res.status(403).json({'error': 'mauvais mot de passe'})
                    }
                })
            }
            // return send.status(200).json({'error': 'utlisateur existe'})

        }).catch(err => send.status(500).json({'error': 'echec de connexion a la bd '}))
    }
}