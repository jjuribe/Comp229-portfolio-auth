/* 
Jose Uribe
Centennial College
juribeco@my.centennialcollege.ca
301236090
COMP229
June 2022
*/
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// enable jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');


// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

// connect to our Business Model
let Business = require('../models/business');

// helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in 
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', displayName: req.user ? req.user.displayName : '' });
}); 

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About' });
});

router.get('/aboutme', function(req, res, next) {
  res.render('aboutme', { title: 'About me' });
});

router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});

router.get('/login', function(req, res, next) {

  if(!req.user)
    {
        res.render('auth/login', 
        {
           title: "Login",
           messages: req.flash('loginMessage'),
           displayName: req.user ? req.user.displayName : '' 
        })
    }
    else
    {
        return res.redirect('/');
    }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local',
    (err, user, info) => {
        // server err?
        if(err)
        {
            return next(err);
        }
        // is there a user login error?
        if(!user)
        {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            // server error?
            if(err)
            {
                return next(err);
            }

            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.Secret, {
                expiresIn: 604800 // 1 week
            });

            /* TODO - Getting Ready to convert to API
            res.json({success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }, token: authToken});
            */

            return res.redirect('/business');
        });
    })(req, res, next);
});


router.get('/register', function(req, res, next) {
  if(!req.user)
    {
        res.render('auth/register',
        {
            title: "Register",
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else
    {
        return res.redirect('/');
    }
});

router.post('/register', function(req, res, next) {
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password
    email: req.body.email,
    displayName: req.body.displayName
});

User.register(newUser, req.body.password, (err) => {
    if(err)
    {
        console.log("Error: Inserting New User");
        if(err.name == "UserExistsError")
        {
            req.flash(
                'registerMessage',
                'Registration Error: User Already Exists!'
            );
            console.log('Error: User Already Exists!')
        }
        return res.render('auth/register',
        {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else
    {
        // if registration is successful, log the user in

        return passport.authenticate('local')(req, res, () => {
            res.redirect('/')
        });
    }
});
});

//session logoout
router.get('/logout', function(req, res, next) {
if(req.session) {
    // delete session object
    req.session.destroy(function(err) {
        if(err) {
            return next(err);
        } else {
            return res.redirect('/');
        }
    });
}
});

router.get('/business', requireAuth, function(req, res, next) {
  {
    Business.find((err, business) => {
        if(err)
        {
            return console.error(err);
        }
        else 
        {
            console.log((business));
            res.render('business/list', 
            {title: 'Business', 
            BusinessList: business, 
            displayName: req.user? req.user.displayName : ''});
        }
    }).sort({"name":1});
}
}
);

router.get('/business/add', requireAuth, function(req, res, next) {
  res.render('business/add', { title: 'Add Business', displayName: req.user ? req.user.displayName : '' });
}
);

// add a new business
router.post('/business/add', requireAuth, function(req, res, next) {
  // create a new instance of the Business model
  let newBusiness = new Business({
    name: req.body.name,
    number: req.body.number,
    email: req.body.email,
    user: req.user._id
});
  // save the new business and check for errors
  newBusiness.save((err) => {
    if(err)
    {   //console log the error
        console.log("Error: Inserting New Business");
        return next(err);
    }
    else
    { // if no error exists, then registration is successful
        console.log("New Business Inserted Successfully!");
        return res.redirect('/business');
    }
  });
});

router.get('/business/edit/:id', requireAuth, function(req, res, next) {
  Business.findById(req.params.id, (err, business) => {
    if(err)
    {
        return console.error(err);
    }
    else
    {
        res.render('business/edit', { title: 'Edit Business', business: business, displayName: req.user ? req.user.displayName : '' });
    }
  }
  );
}
);


router.post('/business/edit/:id', requireAuth, function(req, res, next) {
  Business.findById(req.params.id, (err, business) => {
    if(err)
    {
        return console.error(err);
    }
    else
    {
        business.name = req.body.name;
        business.number = req.body.number;
        business.email = req.body.email;
        business.save((err) => {
            if(err)
            {
                return console.error(err);
            }
            else
            {
                res.redirect('/business');
            }
        }
        );
    }
  });
});

router.get('/business/delete/:id', requireAuth, function(req, res, next) {
  Business.findById(req.params.id, (err, business) => {
    if(err)
    {
        return console.error(err);
    }
    else
    {
        business.remove((err) => {
            if(err)
            {
                return console.error(err);
            }
            else
            {
                res.redirect('/business');
            }
        }
        );
    }
  }
  );
}
);













module.exports = router;
