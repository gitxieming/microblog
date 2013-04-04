
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  // , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

//使用ejs layout
var partials = require('express-partials');
// fixed Cannot read property 'Store' of undefined
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');

var flash = require('connect-flash');
var sessionStore = new MongoStore({
              db : settings.db
            }, function() {
              console.log('connect mongodb success...');
});
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(flash());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    cookie : {
      maxAge : 60000 * 20 //20 minutes
    },    
    store: sessionStore
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);
// app.get('/users', user.list);


//fixed 
routes(app);
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
