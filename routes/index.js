var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Tro' });
});

router.get('/create', function(req, res) {
  if(req.user){
    res.render('create', { title: 'Tro' });
  }
  else
    res.redirect('/auth/facebook');
});

module.exports = router;
