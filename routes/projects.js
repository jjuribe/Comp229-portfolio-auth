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

/* GET projects page. */

router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});



module.exports = router;
