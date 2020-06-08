// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.
"use strict";
var express = require("express");
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var questions = [];
const helmet = require('helmet');
const https = require('https'), fs = require("fs");
var banned = [];
var backurl;
const dbconfig = require('./Config/initdb');
banUpperCase("./Public/", "");

// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(lower);
app.use(ban);
app.use("/bootstrap.html", auth);
var options = { setHeaders: deliverXHTML, key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem')};
app.use(express.static("public", options));
app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true,
    
}));


var sqlite3 = require('sqlite3').verbose();
let db;
function checkNew(){
try{
    console.log("inside the try statement"); 
    if(fs.existsSync("./Config/testingdb")){
        console.log("inside the use old statement"); 
        db = new sqlite3.Database("./Config/testingdb");
    }
    else{
        
        dbconfig.initThis();
        db = new sqlite3.Database("./Config/testingdb");
    }
}
catch(err){
    console.log(err);
    
}
}
checkNew();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(helmet());
https.createServer({
    
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app)
  .listen(3000, function () {
    console.log('Example app listening on port 3000! Go to https://localhost:3000/')
  })

  app.set('view engine', 'ejs');

  app.get('/', function(req, res) {
      res.render('pages/homepage',{login: req.session.loggedin, username:req.session.username});
  });
  app.get('/learnhome', function(req, res) {
      res.render('pages/learnhome',{login: req.session.loggedin, username:req.session.username});
  });
  app.get('/learnbubble', function(req, res) {
      res.render('pages/learnbubble', {login: req.session.loggedin, username:req.session.username});
  });
  app.get('/learnmerge', function(req, res) {
      res.render('pages/learnmerge', {login: req.session.loggedin, username:req.session.username});
  });
  
  app.get('/learnquick', function(req, res) {
      res.render('pages/learnquick', {login: req.session.loggedin, username:req.session.username});
  });

  app.get('/testhome', async(req, res) =>{
      console.log(req.session.username);
      db.all("SELECT * FROM attempt WHERE userID = ? ",[req.session.username] ,(err,results)=>{
        if(err){
            console.error(err.message);
        }
       
        console.log(req.session.loggedin);
        console.log(typeof req.session.loggedin);
        res.render('pages/testhome', {login: req.session.loggedin,username:req.session.username,scores: results});
        res.end();
    });
  });

  app.get('/login', function(req, res) {
        res.render('pages/login', {login: req.session.loggedin, username:req.session.username});
  });

  app.get('/signup', function(req, res) {
      res.render('pages/signup', {login: req.session.loggedin, username:req.session.username});
  });




app.get('/result/:testid/:score',(req,res)=>{
    var date = new Date();
    var TIMESTAMP = date.toISOString();
        const userId = req.params.userid;
        const testid = req.params.testid;
        const score = req.params.score;
        console.log(userId +" "+ testid + " " + score);
        db.serialize(function(){
            var stmt = db.prepare("INSERT INTO attempt (userId, testId, score, timeCompleted) VALUES(?,?,?, ?)");
            stmt.run(req.session.username, testid, score, TIMESTAMP);
            db.each("SELECT userID, testID, score FROM attempt", (err,row)=>{
                if(err){
                    console.error(err.message);
                }
                console.log(row.userID + "\t" + row.testID + "\t" + row.score);
            });
        });
  });

  app.get('/testbubble', function(req,res){
    if(req.session.loggedin){
        res.render('pages/testbubble', {login: req.session.loggedin, username:req.session.username});
    }
    else{
        backurl = req.header('Referer') || '/';
        console.log(backurl);
        console.log("trying the redirect");
        res.redirect('/login');
    }
  });
  app.get('/testmerge', function(req,res){
    if(req.session.loggedin){
        res.render('pages/testmerge', {login: req.session.loggedin, username:req.session.username});
    }
    else{
        backurl = req.header('Referer') || '/';
        console.log(backurl);
        console.log("trying the redirect");
        res.redirect('/login');
    }
  });

  app.get('/testquick', function(req,res){
    if(req.session.loggedin){
        res.render('pages/testquick', {login: req.session.loggedin, username:req.session.username});
    }
    else{
        backurl = req.header('Referer') || '/';
        console.log(backurl);
        console.log("trying the redirect");
        res.redirect('/login');
    }
  });
  app.get('/data', function(req,res){
    getQuestions(1);
    setTimeout(function(){
          console.log("hi" + JSON.stringify(questions));
          res.send(questions);
    }, 100);  
  });

  app.get('/report', function(req,res){
        res.render('pages/report',{login: req.session.loggedin, username:req.session.username});
  });
  
  app.get('/loginredirect', function(req,res){
        res.render('pages/login',{login: req.session.loggedin, username:req.session.username});
  });

app.use('/auth', function(request, response) {
    
    
    var username = request.body.username;
    var password = request.body.password;
    
    console.log(username);
	if (username && password) {
        db.all("SELECT * FROM user WHERE name = ? AND pw = ? ",[username, password] ,(err,results)=>{
            if(err){
                console.error(err.message);
            }
            console.log(results.length);
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
                if(backurl){
                    response.redirect(backurl);
                }
                else{
                    response.redirect('/');  
                }
				
			} else {
				response.redirect('/loginredirect')
			}			
			response.end();
        });
    }
	 else {
		response.redirect('/login')
	}
});

app.post('/register', function(request, response){
    var username = request.body.regusername;
    var password = request.body.regpassword;
    
    if(request.body.regusername == null){
        
        username = request.body.username2;
        password = request.body.password2;
    }

    if(username && password){
        db.all("SELECT * FROM user WHERE name = ? AND pw = ? ",[username, password] ,(err,results)=>{
            if(err){
                console.error(err.message);
            }
            console.log(results.length);
			if (results.length > 0) {
				
				response.render('pages/login',{login: req.session.loggedin, username:req.session.username});
			} else {
                db.run("INSERT INTO user (name, pw) VALUES(?,?)",[username, password]);
                request.session.username = username;
                request.session.loggedin =  true;
                response.render('pages/learnhome',{login: req.session.loggedin, username:req.session.username});
			}			
			response.end();
        });
    }
    else{
        response.send("error receiving username and password");
    }
});
app.get('/logout', function(request,response){
    
    request.session.loggedin = false;
    request.session.username = "";
    response.redirect('/');
});

// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}


// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

// Redirect the browser to the login page.
function auth(req, res, next) {
    
    res.redirect("/pagetemplate.html");
}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
    if (path.endsWith(".html")) {
        res.header("Content-Type", "application/xhtml+xml");
    }
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}



function getQuestions(testID){
    
    let sql = 'SELECT question, answer1, answer2, answer3, correct FROM questions WHERE test = ?'
    questions = [];
    db.serialize(function(){

    
     db.all(sql, [testID], (err, rows) =>{
        if(err){
            throw err;
        }
        rows.forEach(row=>
            questions.push({
                'question': row.question,
                'answers':{
                    a: row.answer1,
                    b: row.answer2, 
                    c: row.answer3,
                },
                'correctAnswer': row.correct
            })
            )
          
        console.log(questions.length);
    });
    });
    console.log(questions.length + "bottom of test q's");
}



