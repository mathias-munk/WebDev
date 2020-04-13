// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

var express = require("express");
var app = express();
var fs = require("fs");
var banned = [];
banUpperCase("./Public/", "");

// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(lower);
app.use(ban);
console.log("Doing some dumb shit");
app.use("/bootstrap.html", auth);
var options = { setHeaders: deliverXHTML };
app.use(express.static("public", options));
app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");


<<<<<<< HEAD
// Check the site, giving quick feedback if it hasn't been set up properly.
// Start the http service. Accept only requests from localhost, for security.
// If successful, the handle function is called for each request.
async function start() {
    try {
        await fs.access(root);
        await fs.access(root + "/homepage.html");
        types = defineTypes();
        paths = new Set();
        paths.add("/");
        let service = http.createServer(handle);
        service.listen(port, "localhost");
        let address = "http://localhost";
        if (port != 80) address = address + ":" + port;
        console.log("Server running at", address);
    }
    catch (err) { console.log(err); process.exit(1); }
}

// Serve a request by delivering a file.
async function handle(request, response) {
    let url = request.url;
    if (url.endsWith("/")) url = url + "homepage.html";
    let ok = await checkPath(url);
    if (! ok) return fail(response, NotFound, "URL not found (check case)");
    let type = findType(url);
    if (type == null) return fail(response, BadType, "File type not supported");
    let file = root + url;
    let content = await fs.readFile(file);
    deliver(response, type, content);
}
=======
// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();

>>>>>>> d51f3a2508f515226b24d6a876d986c28bb2b655

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
