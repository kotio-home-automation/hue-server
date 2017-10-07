var express = require('express');
var router = express.Router();

let huejay = require('huejay');


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./hubdata');
}

var clientip = localStorage.getItem('clientip');
var client;
var username = localStorage.getItem('username');
var user;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (clientip && username) {
    client = new huejay.Client({
      host: clientip,
      username: username
    });
  }
  res.render('index', { title: 'Huejay test', client: client, message: 'Press function' });
});

router.get('/findbridges', function(req, res, next) {
  huejay.discover()
  .then(bridges => {
    for (let bridge of bridges) {
      if (username) {
        client = new huejay.Client({
          host: bridge.ip,
          username: username
        });
      } else {
        client = new huejay.Client({
          host: bridge.ip
        });
      }
      console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
      // console.log(JSON.stringify(client, null, '\t'));
      renderPage(res, JSON.stringify(bridges, null, '\t'));      
    }
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`);
    renderPage(res, JSON.stringify(error, null, '\t'));    
  });
});

router.get('/newuser', function(req, res, next) {
  user = new client.users.User;
  user.deviceType = 'huejay';
  client.users.create(user).then(user => {
    console.log('new user created: ', user.username);
    renderPage(res, JSON.stringify(user, null, '\t'));    
  }).catch(error => {
    if (error instanceof huejay.Error && error.type === 101) {
      return console.log(`Link button not pressed. Try again...`);
    }
    console.log(error.stack);
    renderPage(res, JSON.stringify(error, null, '\t'));    
  });
});

router.get('/isauthenticated', function(req, res, next) {
  client.bridge.isAuthenticated()
  .then(() => {
    console.log('Successful authentication');
    renderPage(res, 'Authenticated ok!');    
  }).catch(error => {
    console.log('Could not authenticate');
    renderPage(res, JSON.stringify(error, null, '\t'));    
  });
});

router.get('/lights', function(req, res, next) {
  console.log('returning lights');
  client.lights.getAll().then(lights => {
    console.log('Maybe?');
    res.json(lights);
  })
});

router.get('/groups', function(req, res, next) {
  console.log('returning groups');
  client.groups.getAll().then(groups => {
    console.log('got groups');
    res.json(groups);
  })
});

router.post('/turnon', function(req, res, next) {
  console.log(req.body);
  client.lights.getAll().then(lights => {
    for (let light of lights) {
      if (req.body.lights.indexOf(light.id) != -1) {
        console.log('Turning on ', light.id);
        light.on = true;
        client.lights.save(light);
      }
    }
  }).then(() => {
    return client.groups.getAll();
  }).then(groups => {
    res.json(groups);
  })
});

router.post('/turnoff', function(req, res, next) {
  console.log(req.body);
  client.lights.getAll().then(lights => {
    for (let light of lights) {
      if (req.body.lights.indexOf(light.id) != -1) {
        console.log('Turning off ', light.id);
        light.on = false;
        client.lights.save(light);
      }
    }
  }).then(() => {
    return client.groups.getAll();
  }).then(groups => {
    res.json(groups);
  })
});


router.get('/getlights', function(req, res, next) {
  return client.lights.getAll().then(lights => {
    renderPage(res, JSON.stringify(lights, null, '\t'));
  });
});

router.get('/getgroups', function(req, res, next) {
  client.groups.getAll().then(groups => {
    renderPage(res, JSON.stringify(groups, null, '\t'));
  });
});

router.get('/turnonall', function(req, res, next) {
  client.lights.getAll().then(lights => {
    for (let light of lights) {
      light.on = true;
      console.log('Turning on: ', light.name);      
      client.lights.save(light);
    }
    renderPage(res, 'Turning on all lights');    
  });
});

router.get('/turnoffall', function(req, res, next) {
  client.lights.getAll().then(lights => {
    for (let light of lights) {
      light.on = false;
      console.log('Turning off: ', light.name);
      client.lights.save(light);
    }
    renderPage(res, 'Turning off all lights');        
  });
});

function renderPage(res, message) {
  res.render('index', { title: 'Huejay test', message: message } );      
}



module.exports = router;
