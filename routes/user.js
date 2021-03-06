var express = require("express");
var mysql = require('mysql');
var router = express.Router();

//var client = require('cheerio-httpcli');

var connection = mysql.createConnection({
    port : "3306",
    host     : 'localhost',
    user     : 'root',
    password : 'thdus3281',
    database : 'fintech'
});

connection.connect();

router.get('/signup', function(req, res){
    res.render('signup');
});

router.get('/mypage', function(req, res){
    var sql = " SELECT * FROM fintech.e_rate ";
    
    connection.query(sql, function (error, results, fields) {
        if(error){
        console.error(error);
        }
        else {
            console.log(results);
            res.render('mypage' , {datas : results});
        }
    });
    
})

router.get('/wallet', function(req, res){
    var sql = "SELECT * FROM fintech.e_rate"

    connection.query(sql, function (error, results, fields) {
        if(error){
        console.error(error);
        }
        else {
            console.log(results);
            res.render('wallet' , {datas : results});
        }
    });
})

router.get('/register', function(req, res){
    res.render('register');
})

router.get('/viewLogin', function(req, res){
    res.render('login');
})

router.get('/logout', (req, res) => {      // 3
    req.session.destroy();
    res.redirect('/');
  });

router.post('/login', function(req, res){
    var sql = " SELECT * FROM fintech.user " +
    " WHERE email = ? AND password = ? ";

    connection.query(sql,[req.body.id, req.body.pwd], function (error, results, fields) {
        if(error){
        console.error(error);
        }
        else {
            console.log(results);
            if(req.body.id === results[0].email && req.body.pwd === results[0].password){
                req.session.user = results[0];                
                req.session.user.logined = true;
                res.render('main',{session : req.session.user});
            }else{
                res.send(`
                <h1>Who are you?</h1>
                <a href="/user/login">Back </a>
                `);
            }
        }
    });
})

module.exports = router;