var express = require("express");
var request = require('request');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
const session = require('express-session');
var rate = require('./rateOther');
var APIRouter = require('./routes/API');
var qrRouter = require('./routes/qr');
var chartRouter = require('./routes/chart');
var exchangeRouter = require('./routes/exchange');
var userRouter = require('./routes/user');
var schedule = require('node-schedule'); 
//var client = require('cheerio-httpcli');

var connection = mysql.createConnection({
    port : "3306",
    host     : 'localhost',
    user     : 'root',
    password : 'thdus3281',
    database : 'fintech'
});

var user = {
    email : '',
    name : '',
    password:'',
    logined : false
}

app = express();

var port = process.env.PORT || 3000;

connection.connect();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({  // 2
    secret: 'keyboard cat',  // 암호화
    resave: false,
    saveUninitialized: true,
}));

////////////////// ROUTER ///////////////////////////////

app.use('/user',userRouter);
app.use('/API',APIRouter);
app.use('/qr',qrRouter);
app.use('/chart',chartRouter);
app.use('/exchange',exchangeRouter);

////////////////////////////////////////////////////////

app.get('/',function(req,res){
    
    if(!req.session.user)  req.session.user = user;
    res.render('main', {session : req.session.user});        
})

/////////////////////////////////////////////
app.get('/nowRate', function(req, res){
    rate.RateTable(function(data){
        res.json(data);
    })
});

app.post('/savebox',function(req,res){
    var sql = "SELECT * FROM fintech.e_rate;";
    var ok = ''
    var goalday = ''
                
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    dd = dd+7;
    today = yyyy+'-'+mm+'-'+dd;
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        
        for(var i = 0;i<results.length;i++)
        {
            ok = results[i].E_check;
            goalday = results[i].E_date;
            //console.log(ok);

            console.log(today);
            if(results[i].E_date == today){
                if(ok == '0')
                {
                    //res.render('alarm',{result:'false'})
                    res.json({result:'false'});
                }
                else
                {
                    res.json({result:'true'});
                }
            }
        }
        
    })
});

app.get('/exchange2',function(req,res){
    res.render('exchang2');
});

app.get('/alarm',function(req,res){
    res.render('alarm');
})

app.listen(port);

console.log("Listening on port ", port);

// const authMiddleware = (req, res, next) => {
//     const token = req.headers['x-access-token'] || req.query.token;
//     console.error(token)
//     if(!token) {
//         return res.status(403).json({
//             success: false,
//             message: 'not logged in'
//         })
//     }

//     const p = new Promise(
//         (resolve, reject) => {
//             jwt.verify(token, tokenKey, (err, decoded) => {
//                 if(err) reject(err)
//                 resolve(decoded)
//             })
//         }
//     )

//     const onError = (error) => {
//         console.log(error);
//         res.status(403).json({
//             success: false,
//             message: error.message
//         })
//     }

//     p.then((decoded)=>{
//         req.decoded = decoded
//         next()
//     }).catch(onError)
// }

//module.exports = authMiddleware;