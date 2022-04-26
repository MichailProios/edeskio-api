//Main Dependancies
/*****************************************************************************************************************************/
const express = require("express");
const listEndpoints = require("express-list-endpoints");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const pjson = require("./package.json");
const axios = require("axios");
const models = require("./models");
const edeskio_models = models.edeskio.models;
const sequelize = require("sequelize");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
/*****************************************************************************************************************************/

//https
/*****************************************************************************************************************************/
const fs = require("fs");
const https = require("https");
/*****************************************************************************************************************************/

//Routes
/*****************************************************************************************************************************/
const emailRoutes = require("./routes/emailRoutes");
const edeskioRoutes = require("./routes/edeskioRoutes");
/*****************************************************************************************************************************/

//Auth
/*****************************************************************************************************************************/
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const tblUsers = require("./models/edeskio/tblUsers");
/*****************************************************************************************************************************/

// const models = require("./models");
// const edeskio_models = models.edeskio.models;
// const sequelize = require("sequelize");

//Server Options
/*****************************************************************************************************************************/
const app = express();

app.use(
  compression({
    filter: function () {
      return true;
    },
  })
);
//app.use(helmet());
// app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    genid: (req) => {
      return uuidv4(); // use UUIDs for session IDs
    },
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
//require("./utilities/passport/passportConfig")(passport);

// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy(
    // { usernameField: 'email' },

    (username, password, done) => {
      const tblUsers = edeskio_models.tblUsers
        .findOne({
          where: {
            UserName: username,
          },
        })
        .then((value) => {
          let enteredPassword = "";
          let user = "";

          if (value) {
            enteredPassword = value.dataValues.Password;
            user = value.dataValues;
          }
          //const dbdata = value.dataValues.Email;

          // console.log(value);

          bcrypt.compare(password, enteredPassword, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch((error) => done(error));
    }
  )
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.UserName);
});

passport.deserializeUser((username, done) => {
  const tblUsers = edeskio_models.tblUsers
    .findOne({
      where: {
        UserName: username,
      },
    })
    .then((value) => {
      let dbdata = "";

      if (value) {
        dbdata = value.dataValues;
      }

      done(null, dbdata);
    })
    .catch((error) => done(error));
});
/*****************************************************************************************************************************/

//Endpoints
/*****************************************************************************************************************************/

// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.json("not authenticated");
};

app.get("/", (req, res) => {
  res.send(
    pjson.description + " v" + pjson.version + "<br/> <br/>" + new Date()
  );
});

// app.get("/api", isAuthenticated, (req, res) => {
//   // console.log("Validated claims: ", req.authInfo);

//   // Service relies on the name claim.
//   res.status(200);
// });

app.get("/endpoints", function (req, res) {
  res.send(listEndpoints(app));
});

app.use("/api/email", emailRoutes);
app.use("/api/edeskio", edeskioRoutes);

app.post("/login", (req, res, next) => {
  let isAuthenticated = req.isAuthenticated();
  let session = req.session;

  passport.authenticate("local", (err, user, info) => {
    if (info) {
      return res.status(401).send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      isAuthenticated = req.isAuthenticated();
      session = req.session;

      return res.status(200).send({ isAuthenticated, session });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      isAuthenticated = req.isAuthenticated();
      session = req.session;

      return res.status(200).send({ isAuthenticated, session });
    });
  })(req, res, next);
});

app.get("/user", (req, res) => {
  let isAuthenticated = req.isAuthenticated();
  let session = req.session;

  return res.status(200).send({ isAuthenticated, session });
});

// app.get("/authrequired", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("you hit the authentication endpoint\n");
//   } else {
//     res.redirect("/");
//   }
// });

// app.use(passport.initialize());
// app.use(passport.session());

/*****************************************************************************************************************************/

//HTTPS
/*****************************************************************************************************************************/
const httpsOptions = {
  key: fs.readFileSync("D:/edeskio/edeskio-api/security/key.pem"),
  cert: fs.readFileSync("D:/edeskio/edeskio-api/security/cert.pem"),
};

const serverHttps = https.createServer(httpsOptions, app);
/*****************************************************************************************************************************/

//Socket.io
/*****************************************************************************************************************************/
const io = require("socket.io")(serverHttps, {
  cors: { origin: true, credentials: true },
});

//Mount namespaces
require("./websockets/notifications")(io);

//Pass socket io instance to req
app.set("socketio", io);

/*****************************************************************************************************************************/

//Server
/*****************************************************************************************************************************/
serverHttps.listen(8443, () => {
  console.log("HTTPS server listening on port " + 8443);
  /*****************************************************************************************************************************/
});
