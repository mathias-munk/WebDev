
var sqlite3 = require('sqlite3').verbose();
let db;
var path = "./Config/testingdb";
console.log("inside initthis");


async function initThis(){
        db = new sqlite3.Database(path);
        
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
            
            stmt.run("What is the complexity of a bubble sort?", "O(n)", "O(n^2)", "O(log(n))", "b", 1);
            stmt.run("What is the first step of a bubble sort?","Compare i to i +1", "add 1 to i", "Loop", "a", 1);
            stmt.run("When does a bubble sorting algorithm finish", "when the list is fully sorted", "After 7 steps", "After 5 steps","a", 1);
            stmt.run("What is another name for the bubble sort", "thinking sort", "blinking sort", "sinking sort","c", 1);
            stmt.run("A bubblesort is made up of comparisons and what?", "floating", "swap", "popping","b", 1);
            stmt.run("What is the complexity of a merge sort?", "O(n)", "O(n^2)", "O(nlog(n))", "c", 2);
            stmt.run("Who invented the merge sort", "John Van Neumann", "John Van Bluemann", "John Van Pooman","a", 2);
            stmt.run("Which of these isn't a type of merge sort", "top-down", "bottom-up", "left-right","c", 2);
            stmt.run("What storage type initially made use of merge sort?", "Hard Disk", "Solid State Drive", "Magnetic tape","c", 2);
            stmt.run("What type of sort is a merge sort?", "Erratic", "Unstable", "Stable","c", 2);
            stmt.run("What is the complexity of a merge sort?", "O(n)", "O(n^2)", "O(nlog(n))", "b", 3);
            stmt.run("Who invented the quick sort", "John Van Neumann", "Tony Hoare", "John Van Pooman","b", 3);
            stmt.run("What is the name of the crucial part of the quick sort", "pivot", "twist", "comparison","a", 3);
            stmt.run("What type of algorithm is a quick sort?", "Divide and Conquer", "Invade and Pillage", "Efficient","a", 3);
            stmt.run("What type of sort is a quick sort?", "Comparison", "Unstable", "Stable","a", 3);

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
        });
        
        
        });
   
        db.close;
}




function close(){
    db.close;
}



module.exports = {
    
    initThis,
    close
};