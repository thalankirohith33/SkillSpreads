var express = require('express');
var router = express.Router();
var firebase = require('firebase')
/* GET users listing. */
var errorMessage = ''
router.post('/', function(req, res, next) {
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
      errorMessage = error


       return res.send({data : error.message})
    }).then(function (error) {
     if(errorMessage == '')
     {

         return res.send({data : "success"})
     }
     else
     {
       errorMessage = ''
     }
    })
});

module.exports = router;
