const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const { checkBodyFields } =require("./../helpers/bodyHelpers");
const { uuidv4 } =require("./../helpers/uuidHelpers");
const {decodeToken} = require("./../helpers/authHelpers")

const pg = require('./../db/db.js')

const getInfo = (req) => {
  return {
    ip: req.ip,
    ips: req.ips,
    remote: req.socket.remoteAddress,
    method: req.method,
    url: req.originalUrl,
    ua: req.get('User-Agent'),
    referer: req.get('Referer'),
    lang: req.get('Accept-Language'),
    contentType: req.get('Content-Type'),
    tls: req.socket.encrypted ? {
      proto: req.socket.getProtocol(),
      cipher: req.socket.getCipher()
    } : null,
    sessionId: req.session?.id
  };
}

router.get('/validate', decodeToken, (req, res) => {
  const info = getInfo(req);
  if(req.user) {
    delete req.user.password;
    pg.logAction("login", info, req.user.uuid); 
    res.send(req.user);
  } else {
    res.status(400).send()
  }
})
router.post('/login', (req, res) => {
  const info = getInfo(req);
  if(req.body) {
    if(checkBodyFields(req.body, ["email", "password"])) {
      pg.get()("users").select("*").where(req.body).then((data) => {
        if(data.length > 0) {
          pg.logAction("login", info, data[0].uuid); 
          const token = jwt.sign(data[0], 'weaponofmathdestruction');
          res.status(200).send({...data[0], token, message: "success"})
        } else {
          res.status(400).send({ "message": "wrong credentials"})

        }
      })
      .catch((e) => {
        console.log(e)
        res.status(501).send()
      })
    }
    else {
      res.status(402).send({ "fields": "no"})
    }
  } else {
    res.status(401).send({"message": "no"})
  }
})

router.post('/register', (req, res) => {
  if(req.body) {
    if(checkBodyFields(req.body, ["first_name", "last_name","class", "email", "password"])) {
      req.body.uuid = uuidv4();
      pg.get()("users").insert(req.body).returning("*").then((data) => {
        console.log(data)
        pg.logAction("register", req.body, data[0].uuid);

        const token = jwt.sign(data[0], 'weaponofmathdestruction');

        res.status(200).send({...data[0], token, message: "success"})
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(402).send({ "fields": "no"})
    }
  } else {
    res.status(401).send({"message": "no"})
  }
})

router.get('/', (req, res) => {
  pg.get()("users").select(["uuid", "first_name", "last_name", "class"]).then((data) => {
    res.send(data)
  })
})

router.post('/', (req, res) => {
  console.log(req.body)
  if(req.body) {
    if(checkBodyFields(req.body, ["uuid", "first_name", "last_name", "class", "year"])) {
      pg.get()("users").insert(req.body).returning("*").then((data) => {
        res.status(200).send(data)
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(402).send({ "fields": "no"})
    }
  } else {
    res.status(401).send({"message": "no"})
  }
})

module.exports = router
