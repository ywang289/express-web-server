
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  var class1 = 'class' in req.query ? req.query.class : 'this is nothing';
  res.render('class', { class: class1 });
});




module.exports = router;