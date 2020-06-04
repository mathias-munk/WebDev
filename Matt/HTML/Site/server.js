// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

var express = require("express");
var app = express();

const https = require('https'), fs = require("fs");

var banned = [];
banUpperCase("./Public/", "");

// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(lower);
app.use(ban);
app.use("/bootstrap.html", auth);
var options = { setHeaders: deliverXHTML, key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem')};
app.use(express.static("public", options));
https.createServer({
    
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app)
  .listen(3000, function () {
    console.log('Example app listening on port 3000! Go to https://localhost:3000/')
  })

  app.set('view engine', 'ejs');

  app.get('/', function(req, res) {
      res.render('pages/homepage');
  });
  app.get('/learnhome', function(req, res) {
      res.render('pages/learnhome');
  });
  app.get('/learnbubble', function(req, res) {
      res.render('pages/learnbubble');
  });
  app.get('/learnmerge', function(req, res) {
      res.render('pages/learnmerge');
  });
  
  app.get('/learnquick', function(req, res) {
      res.render('pages/learnquick');
  });
  
  app.get('/testhome', function(req, res) {
      res.render('pages/testhome');
  });

  app.get('/testbubble', function(req, res) {
      res.render('pages/testbubble');
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
    console.log("Doing some dumb shit");
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
