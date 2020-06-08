// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.
"use strict";
var express = require("express");
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var questions = [];
const helmet = require('helmet');
const https = require('https'), fs = require("fs");
var banned = [];
var backurl;
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
      res.render('pages/homepage',{login: req.session.loggedin});
  });
  app.get('/learnhome', function(req, res) {
      res.render('pages/learnhome',{login: req.session.loggedin});
  });
  app.get('/learnbubble', function(req, res) {
      res.render('pages/learnbubble', {login: req.session.loggedin});
  });
  app.get('/learnmerge', function(req, res) {
      res.render('pages/learnmerge', {login: req.session.loggedin});
  });
  
  app.get('/learnquick', function(req, res) {
      res.render('pages/learnquick', {login: req.session.loggedin});
  });

    
  app.get('/testhome', async(req, res) =>{
      console.log(req.session.username);
      db.all("SELECT * FROM attempt WHERE userID = ? ",[req.session.username] ,(err,results)=>{
        if(err){
            console.error(err.message);
        }
        console.log(results.length);
        console.log(req.session.loggedin);
        console.log(typeof req.session.loggedin);
        res.render('pages/testhome', {login: req.session.loggedin,scores: results});
        res.end();
    });
  });

  app.get('/login', function(req, res) {
        res.render('pages/login', {login: req.session.loggedin});
  });

  app.get('/signup', function(req, res) {
      res.render('pages/signup',{login: req.session.loggedin});
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
        res.render('pages/testbubble');
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
        res.render('pages/report',{login: req.session.loggedin});
  });
  
  app.get('/loginredirect', function(req,res){
        res.render('pages/login',{login: req.session.loggedin});
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
				
				response.render('pages/login',{login: req.session.loggedin});
			} else {
                db.run("INSERT INTO user (name, pw) VALUES(?,?)",[username, password]);
                request.session.username = username;
                request.session.loggedin =  true;
                response.render('pages/learnhome',{login: req.session.loggedin});
			}			
			response.end();
        });
    }
    else{
        response.send("error receiving username and password");
    }
});
app.post('/logout', function(request,response){
    req.session.loggedin = false;
    req.session.username = "";
    res.render('/', {login: req.session.loggedin});
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





var sqlite3 = require('sqlite3').verbose();
let db;
var path = "./testingdb";
db = new sqlite3.Database("./testingdb");

async function initThis(){
//try{
    //if(fs.existsSync(path)){
       // db = new sqlite3.Database("./testingdb");
  //  }
//}
   // catch { 
        
        db.serialize(function(){
        
            db.run("DROP TABLE IF EXISTS user");
            console.log("why");
            db.run("CREATE TABLE user ( name TEXT PRIMARY KEY, pw TEXT NOT NULL)");
            console.log("why 2");
            var stmt = db.prepare("INSERT INTO user(name, pw) VALUES(?,?)");
            stmt.run("tias", "m");
            stmt.finalize();
            db.each("SELECT name, pw FROM user", function(err, row){
                if(err){
                    console.log(err.message);
                }
                console.log("User id: " +row.name, row.pw);
            });
        db.serialize( async function(){
            var date = new Date();
            var TIMESTAMP = date.toISOString();
            db.run("DROP TABLE IF EXISTS test");
            db.run("DROP TABLE IF EXISTS questions");
            db.run("DROP TABLE IF EXISTS attempt");
            db.run("CREATE TABLE test(ID INTEGER PRIMARY KEY autoincrement, setby INT NOT NULL, FOREIGN KEY(setby) REFERENCES user(id))")
             db.run("CREATE TABLE questions (id INTEGER PRIMARY KEY autoincrement, question TEXT, answer1 TEXT, answer2 TEXT, answer3 TEXT, correct TEXT, test INT)");
             db.run("CREATE TABLE attempt (id INTEGER PRIMARY KEY autoincrement, userID TEXT, testID INTEGER NOT NULL, score INTEGER NOT NULL, timeCompleted DATETIME, FOREIGN KEY(userID) REFERENCES user(name), FOREIGN KEY (testID) REFERENCES test(ID))");
            
            var stmt = db.prepare("INSERT INTO test (setby) VALUES(?)");
            stmt.run(1);
            stmt.finalize;
            var stmt = db.prepare("INSERT INTO questions (question, answer1,answer2,answer3,correct, test) VALUES(?,?,?,?,?,?)");
            
            stmt.run("What is the complexity of a bubble sort?", "hi", "no", "yes", "a", 1);
            stmt.run("What step is comparing the second and third values in a bubblesort?","hi", "no", "yes", "a", 1);
            stmt.run("placeholder", "hi", "no", "yes","b", 1);
            stmt.finalize();
            var stmt = db.prepare("INSERT INTO attempt (userID, testID, score, timeCompleted) VALUES(?,?,?, ?)");
            stmt.run("tias",1,1, TIMESTAMP);
            stmt.finalize;
            console.log("hi");
            db.each("SELECT id, question, answer1, test FROM questions", (err,row)=>{
                if(err){
                    console.error(err.message);
                }
                console.log(row.id + "\t" + row.question + "\t" + row.answer);
            });
             db.each("SELECT userID, testID, score FROM attempt", (err,row)=>{
                if(err){
                    console.error(err.message);
                }
                console.log(row.userID + "\t" + row.testID + "\t" + row.score);
            });
            var file = getQuestions(1);
        });
        
        
        });
   // }
        
}

initThis();




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


