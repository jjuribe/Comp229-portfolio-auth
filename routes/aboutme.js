/* 
Jose Uribe
Centennial College
juribeco@my.centennialcollege.ca
301236090
COMP229
June 2022
*/

var express = require('express');
var router = express.Router();

/* GET About me page. */

router.get('/aboutme', function(req, res, next) {
  res.render('aboutme', { title: 'About Me' });
});


module.exports = router;
