// bin/maria.js

const maria = require("mysql");
// 설치한 모듈인 mysql을 사용하기 위해 불러왔습니다.

const con = maria.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1214",
    database: "board",
});

con.connect(function (err) {

    if (err) throw err;

    console.log("Connected!");

    var sql = "CREATE TABLE IF NOT EXISTS messages (name VARCHAR(255), content VARCHAR(255))";

    con.query(sql, function (err, result) {

        if (err) throw err;

        console.log("Table created");
    });

});

module.exports = con;