const http = require('http');
const url = require('url');
const mysql = require('mysql');
const express = require('express');

const app = express();
const endPointRoot = "/API/v1";

const db = mysql.createConnection({
    host: "localhost",
    user: "manroopk_finalproj",
    password: "Yolo.246",
    database: "manroopk_finalproj"
});
db.connect((err) => {
    if(err) { throw err; }
    console.log("Mysql: Connected");
});

db.promise = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if(err) { reject(new Error()); }
            else { resolve(result); }
        });
    });
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.nevilmills.ca");
    res.header("Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With");
    next();
});

app.use(express.urlencoded({ extended: false }));

/**
 * GET /adminstats
 */
app.get(endPointRoot + "/adminstats", (req, res) => {
    // Increment stats table
    db.promise(`UPDATE adminstats SET requests = requests + 1 WHERE
    endpoint = '/API/v1/adminstats'`)
    .catch((err) => {
        console.log(err);
    });
    db.promise(`SELECT * FROM adminstats`)
    .then((result) => {
        res.status(200);
        res.send(JSON.stringify(result));
    })
    .catch((err) => {
        console.log(err);
    });
});

/**
 * GET /getleaderboard
 */
app.get(endPointRoot + "/getleaderboard/", (req, res) => {
    // Increment stats table
    db.promise(`UPDATE adminstats SET requests = requests + 1 WHERE
    endpoint = '/API/v1/getleaderboard'`)
    .catch((err) => {
        console.log(err);
    });
    db.promise(`SELECT * FROM leaderboard`)
    .then((result) => {
        res.status(200);
        res.send(JSON.stringify(result));
    })
    .catch((err) => {
        console.log(err);
    });
});

/**
 * POST /login
 */
app.post(endPointRoot + '/login', async (req, res) => {
    // Increment stats table
    db.promise(`UPDATE adminstats SET requests = requests + 1 WHERE
    endpoint = '/API/v1/login'`)
    .catch((err) => {
        console.log(err);
    });

    let userInfo;
    db.promise(`SELECT * FROM user WHERE username= '${req.body.username}'
    AND password= '${req.body.password}'`)
    .then((result) => {
        console.log(result);
        if(result.length == 0) {
            res.status(401);
            res.send("unsuccessful");
            throw "login failed! wrong username or password";
        }
        else {
            userInfo = result[0];
            //Send the current highscore of the user.
            db.promise(`SELECT * FROM leaderboard WHERE username=
            '${req.body.username}'`)
            .then((result) => {
                //No score has been set yet.
                if(result.length == 0) {
                    res.status(200);
                    res.send(userInfo);
                }
                //Send the fetched row
                else {
                    userInfo = result[0];
                    res.status(200);
                    res.send(JSON.stringify(userInfo));
                }
                
            }).catch((err) => {
                console.log(err + " Error with query");
            });
            
        }
    }).catch((err) => {
        console.log(err + "Error with query.");
    });
});

/**
 * POST /register
 */
 app.post(endPointRoot + '/register', async (req, res) => {
    // Increment stats table
    db.promise(`UPDATE adminstats SET requests = requests + 1 WHERE
    endpoint = '/API/v1/register'`)
    .catch((err) => {
        console.log(err);
    });

    db.promise(`SELECT * FROM user WHERE username= '${req.body.username}'`)
    .then((result) => {
        let sql;
        if(result.length == 0) {
            sql = `INSERT INTO user (username, password) VALUES
            ('${req.body.username}', '${req.body.password}')`;
            return db.promise(sql);
        }
        else {
            res.status(409);
            res.send("unsuccessful");
            throw "Account already exists";
        }
    }).then((result) => {
        res.status(200);
        res.send("success");
    })
    .catch((err) => {
        console.log(err + " Error with query.");
    })
});

/**
 * PUT /updatehighscore
 */
 app.put(endPointRoot + '/updatehighscore', async (req, res) => {
    // Increment stats table
    db.promise(`UPDATE adminstats SET requests = requests + 1 WHERE
    endpoint = '/API/v1/updatehighscore'`)
    .catch((err) => {
        console.log(err);
    });

    db.promise(`SELECT * FROM leaderboard WHERE username= '${req.body.username}'`)
    .then((result) => {
        let sql;
        if(result.length == 0) {
            sql = `INSERT INTO leaderboard (username, highscore) VALUES
            ('${req.body.username}', '${req.body.highscore}')`;
            return db.promise(sql);
        }
        else {
            sql = `UPDATE leaderboard SET highscore =
            ${req.body.highscore} WHERE username = '${req.body.username}'`;
            db.promise(sql).then((result) => {
                res.status(200);
                res.send();
            }).catch((err) => {
                res.status(500);
                res.send();
            });
            
        }
    }).catch((err) => {
        console.log(err + " Error with query.");
    })
});

/**
 * DELETE /deleteUser
 */
 app.delete(endPointRoot + '/deleteUser', async (req, res) => {
    // Increment stats table
    db.promise(`UPDATE adminstats SET requests = requests + 1 WHERE
    endpoint = '/API/v1/deleteUser'`)
    .catch((err) => {
        console.log(err);
    });

   db.promise(`DELETE FROM user WHERE username= '${req.body.username}'`)
   .then((result) => {
       res.status(200);
       res.send();
    }).catch((err) => {
       res.status(500);
       res.send()
   })
});

app.listen();
