/**
 * Module dependencies
 */

var express = require('express'),
    MongoStore = require('connect-mongo')(express),
    flash = require('express-flash'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    expressValidator = require('express-validator');



/**
 * Controllers
 */

var homeController = require('./controllers/home'),
    userController = require('./controllers/user'),
    contactController = require('./controllers/contact'),
    forgotController = require('./controllers/forgot'),
    resetController = require('./controllers/reset');
    itemController = require('./controllers/item');



/**
 * Keys + Passport config
 */

var secrets = require('./config/secrets'), 
    passportConf = require('./config/passport');



/**
 * Create Express server
 */

var app = express();



/**
 * Mongoose config
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});



/**
 * Express config
 */

var hour = 3600000,
    day = (hour * 24),
    week = (day * 7),
    month = (day * 30);

app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
  app.use(express.logger('dev'));
});
app.use(require('connect-assets')({
  src: 'public',
  helperContext: app.locals
}));
app.use(express.bodyParser({
  uploadDir: './tmp/'
}));
app.use(express.compress());
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    db: mongoose.connection.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.token = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.use(function(req, res) {
  res.status(404);
  res.render('404', {
    title: "oh oh 404 - that's not here"
  });
});
app.use(express.errorHandler());



/**
 * Application routes
 */

app.get( '/', homeController.index);
app.get( '/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get( '/logout', userController.logout);
app.get( '/forgot', forgotController.getForgot);
app.post('/forgot', forgotController.postForgot);
app.get( '/reset/:token', resetController.getReset);
app.post('/reset/:token', resetController.postReset);
app.get( '/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get( '/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get( '/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get( '/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get( '/items', passportConf.isAuthenticated, itemController.getItems);
app.get( '/items/new-item', passportConf.isAuthenticated, itemController.getNewItem);
app.post('/items/new-item', passportConf.isAuthenticated, itemController.postNewItem);
app.get( '/items/single-item/:itemId', passportConf.isAuthenticated, itemController.getSingleItem);
app.post('/items/single-item/:itemId', passportConf.isAuthenticated, itemController.postUpdateSingleItem);
app.get( '/items/single-item-detail/:itemId', passportConf.isAuthenticated, itemController.getSingleItemDetail);
app.get( '/items/delete-item/:itemId', passportConf.isAuthenticated, itemController.deleteItem);
app.get( '/items/undo-delete/:itemId', passportConf.isAuthenticated, itemController.undoDeleteItem);
app.get( '/items/tag/:category', passportConf.isAuthenticated, itemController.getCategory);
app.get( '/items/deleted', passportConf.isAuthenticated, itemController.getDeletedItems);



/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
