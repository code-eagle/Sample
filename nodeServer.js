var express = require('express');
var request=require('request');
var path = require("path");
var elasticsearch = require('elasticsearch');
var _ = require('underscore');
var fs = require('fs');
var port=3001;
/* var hostname = 'http://172.29.48.84:8080'
 var client = new elasticsearch.Client({
		host: hostname,
		requestTimeout:5000000	
	}); */
	
var app = express();
app.configure(function() {
  app.set('view engine', 'html');
  //app.engine('html', hbs.__express);
 // app.use(express.logger({stream: logFile}));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  //app.use(flash());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
 // app.use(passport.initialize());
 // app.use(passport.session());
  app.use(app.router);
 // app.use(express.static('public'));
});

/* app.post('/hitURL',function(){
	var callback = function(result){
		res.send(result);
	};
	request({uri:req.body.url},function (error, response, body){
			callback(body);
		});
}); */		

app.get('/users',function(req,res){
	var users = require('./usersData.json');
	var activeUsers = _.reject(users.users, function(obj){ return obj.deleted; });
	console.log(JSON.stringify(req.headers));
	res.send(JSON.stringify(activeUsers));
}); 
	
app.get('/user/:id',function(req,res){
	//res.send('User id is: '+req.param("id"));
	var user = getUser(req.param("id"));
	
	res.send(JSON.stringify(user));
}); 

app.get('/deluser/:id',function(req,res){
	var users = require('./usersData.json');
	var id = parseInt(req.param("id"));
	var user = _.findWhere(users.users,{'id':id});
	user.deleted = true;
	fs.writeFile('./usersData.json',JSON.stringify(users,null,4));
	var activeUsers = _.reject(users.users, function(obj){ return obj.deleted; });
	res.send(JSON.stringify(activeUsers));
});

app.post('/addUser',function(req,res){
	var user = req.body;
	users = require('./usersData.json');
	user.id = users.users.length+1;
	users.users.push(user);
	fs.writeFile('./usersData.json',JSON.stringify(users,null,4));
	var activeUsers = _.reject(users.users, function(obj){ return obj.deleted; });
	res.send(JSON.stringify(activeUsers));
}); 

function getUser(id){
	var selectedUserObj = {'user':[]};
	var users = require('./usersData.json');
	var selectedUser = _.findWhere(users.users,{'id':parseInt(id)});
	//console.log(JSON.stringify(selectedUser));
	selectedUserObj.user.push(selectedUser);
	return selectedUserObj;
}
	
app.use(function(req,res,next){
	var file='.'+req._parsedUrl.pathname;
	//console.log('path '+file);
	res.sendfile(file);
});
app.listen(port);
console.log("listening at "+port)