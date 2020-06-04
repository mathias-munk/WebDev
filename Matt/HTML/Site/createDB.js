db.serialize(function(){
    db.run("DROP TABLE IF EXISTS test");
    db.run("DROP TABLE IF EXISTS questions");
    db.run("DROP TABLE IF EXISTS attempt");
    db.run("CREATE TABLE test(ID INTEGER PRIMARY KEY autoincrement, setby INT NOT NULL, FOREIGN KEY(setby) REFERENCES user(id))")
    db.run("CREATE TABLE questions (id INTEGER PRIMARY KEY autoincrement, question TEXT, answer INT, test INT)");
    db.run("CREATE TABLE attempt (userID INTEGER NOT NULL, testID INTEGER NOT NULL, score INTEGER NOT NULL, FOREIGN KEY(userID) REFERENCES user(id), FOREIGN KEY (testID) REFERENCES test(ID), PRIMARY KEY(userID, testID))");
    
    var stmt = db.prepare("INSERT INTO test (setby) VALUES(?)");
    stmt.run(1);
    stmt.finalize;
    var stmt = db.prepare("INSERT INTO questions (question, answer, test) VALUES(?,?,?)");
    
    stmt.run("What is the complexity of a bubble sort?", 1, 1);
    stmt.run("What step is comparing the second and third values in a bubblesort?", 2, 1);
    stmt.run("placeholder",2, 1);
    stmt.finalize();
    var stmt = db.prepare("INSERT INTO attempt VALUES(?,?,?)");
    stmt.run(1,1,1);
    stmt.finalize;
    console.log("hi");
    db.each("SELECT id, question, answer, test FROM questions", (err,row)=>{
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

db.serialize(function(){

    db.run("DROP TABLE user");
    console.log("why");
    db.run("CREATE TABLE user (id INTEGER PRIMARY KEY autoincrement ,name VARCHAR(100) NOT NULL, pw VARCHAR(20) NOT NULL)");
    console.log("why");
    var stmt = db.prepare("INSERT INTO user(name, pw) VALUES(?,?)");
    for (var i =0; i<10;i++){
        stmt.run(generateName(), generateName());
    }
    stmt.finalize();
    db.each("SELECT id, name, pw FROM user", function(err, row){
        if(err){
            console.log(err.message);
        }
        console.log("User id: " +row.id, row.pw);
    });
});
