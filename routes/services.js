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

/* GET services page. */

router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});







module.exports = router;
