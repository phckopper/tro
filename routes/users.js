var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/teste_tro');

var component = new Schema({
  name: String,
  type: String,
  imgs: [String],
  contributors_names: [String],
  contributors_ids: [String], 
  data: Schema.Types.Mixed,
});

var Component = mongoose.model('Component', component);

router.get('/typeahead', function(req, res) {
  Component.find({}, 'name', function(err, doc) {
    if(err) {
      res.status(500).write('bug');
    }
    else {
      res.json(doc);
    }
  });
});

/* GET component by id. */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  console.log(id);
  Component.findOne({'name': id}, function(err, doc) {
    if(err) {
      res.status(500).send("Erro do servidor. Foi mal :/");
    }
    else {
      if (doc) {
        console.log(doc);
        res.render('component', doc);
      }
      else {
        res.status(404).render('404', { url: req.url});
      }
    }
  });
});

/* GET edit component by id. */
router.get('/edit/:id', function(req, res, next) {
  if(req.user) {
    var id = req.params.id;
    console.log(id);
    Component.findOne({'name': id}, function(err, doc) {
      if(err) {
        res.status(500).send("Erro do servidor. Foi mal :/");
      }
      else {
        if (doc) {
          console.log(doc);
          res.render('edit', doc);
        }
        else {
          res.status(404).render('404', { url: req.url });
        }
      }
    });
  }
  else
    req.redirect('/auth/facebook');
});

router.post('/edit', function(req, res) {
  var name = req.body.name;
  var type = req.body.type;
  var imgs = req.body['img[]'];
  var data = req.body;
  console.log(req.body);
  delete data.name;
  delete data.type;
  delete data['img[]'];
  delete data['g-recaptcha-response'];
  console.log(name);
  Component.findOne({'name': name}, function(err, doc) {
    if(!err) {
      if(doc) {
        doc.name = name;
        doc.imgs = imgs,
        doc.data = data;
        if(doc.contributors_ids.indexOf(req.user.id) === -1) {
          doc.contributors_names.push(req.user.name);
          doc.contributors_ids.push(req.user.id);
        }       
        doc.save(function(err) {
          if(err) {
            res.status(500).send('erro do bd');
          }
          else {
            res.redirect('/api/' + name);
          }
        });
      }
      else {
        res.status(404).send("component not found");
      }
    }
    else {
      res.status(500).send('erro do bd');
    }
  });
});

router.post('/create', function(req, res) {
  if(req.user) {
    var name = req.body.name;
    var type = req.body.type;
    var imgs = req.body['img[]'];
    var data = req.body;
    delete data.name;
    delete data.type;
    delete data['img[]'];
    delete data['g-recaptcha-response'];
    var c = new Component({
      name: name,
      type: type,
      imgs: imgs,
      data: data,
      contributors_ids: [req.user.id],
      contributors_names: [req.user.name]
    });
    c.save(function(err) {
      if(err) {
        res.status(500).send('erro do bd');
      }
      else {
        res.redirect('/api/' + name);
      }
    });
  }
  else
    res.redirect('/auth/facebook');
});

module.exports = router;
