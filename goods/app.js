/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/main');
var tools = require('./routes/tools');
var do_reg = require('./routes/reg');
var do_login = require('./routes/login');
var user = require('./routes/user');

// var set_cookies = require('./routes/do_cookies')


//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.bodyParser());

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/index', routes.index);
app.get('/login', routes.login);
app.post('/do_login', do_login.login);
app.get('/admin', routes.admin);
app.get('/user', routes.user);

app.get('/search', routes.search);
app.get('/show', routes.show_goods);
app.get('/order', routes.order);
app.get('/needs', routes.needs);
//注册相关
app.get('/register', routes.reg);
app.post('/reg', do_reg.reg);
app.post('/do_check_nick/:nick', do_reg.check_nick);
app.post('/do_check_email/:email', do_reg.check_email);
app.post('/do_check_tel/:tel', do_reg.check_tel);
//user_center
//app.get('/user#user_center', routes.user);
app.post('/update_user_msg/:id', user.update_user_msg);
app.post('/change_user_msg/:id', user.change_user_msg);
app.post('/change_user_pwd/:id', user.change_user_pwd);
//user_car
//app.get('/user#user_car', routes.user_car)

app.delete('/remove_car/:id', user.remove_car);
//user_
//手动添加分类信息
app.post('/add_sort', tools.add_sorts);
app.get('/tools/addsort', routes.tools_add_sorts);
app.get('/icons', routes.icon);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
