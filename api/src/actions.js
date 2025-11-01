const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const { checkBodyFields } =require("./helpers/bodyHelpers");
const { uuidv4 } =require("./helpers/uuidHelpers");
const {authCheck} = require("./helpers/authHelpers")

const pg = require('./db/db.js')

const { getIO } = require('./socket');

function broadcastMessage(message) {
  const io = getIO();
  io.emit('message', message);
}


router.post('/request', authCheck, (req, res) => {

  if(req.body && req.user) {
    if(checkBodyFields(req.body, ["request"])) {
      pg.get()("request").insert({ 
        ...req.body, 
        student_id: req.user.uuid, 
        request: req.body.request,
        active: req.body.active,
        uuid: uuidv4(), 
        payload: JSON.stringify({})
      }).returning("*").then((data) => {
        pg.logAction("request", JSON.stringify(req.body), req.user.uuid);
        broadcastMessage(JSON.stringify({
          ...req.body,
          user: {
            uuid: req.user.uuid,
            first_name: req.user.first_name,
            last_name: req.user.last_name
          }
        }));
        res.status(200).send({...data, message: "success"})
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

router.get("/request", authCheck, (req, res) => {
  const date = new Date();
const oneHourAgo = new Date(Date.now() - 3600 * 1000);
  pg.get()('request').select("*")
  .select('*')
  .where({student_id: req.user.uuid})
  .distinctOn('request')
  .orderBy([{ column: 'request' }, { column: 'created_at', order: 'desc' }])
  .then((d) => {
    res.send(d)
  })

})

router.post('/questions',authCheck, (req, res) => {
  if(req.body && req.user) {
    if(checkBodyFields(req.body, ["question", "uuid"])) {


      pg.get()("questions").insert({ ...req.body, student_id: req.user.uuid}).returning("*").then((data) => {
        pg.logAction("question", JSON.stringify(req.body), req.user.uuid);
        broadcastMessage(JSON.stringify({
          uuid: uuidv4(),
          ...req.body,
          user: {
            uuid: req.user.uuid,
            first_name: req.user.first_name,
            last_name: req.user.last_name
          }
        }));
        
        res.status(200).send({...data, message: "success"})
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

router.post('/checkin', authCheck, (req, res) => {
  if(req.body && req.user) {
    if(checkBodyFields(req.body, [ "checkin"])) {
      pg.get()("attendance").insert({ checkin: req.body.checkin, uuid: uuidv4(), student_id: req.user.uuid}).returning("*").then((data) => {
        pg.logAction("checkin", {}, req.user.uuid);        
        
        res.status(200).send({...data, message: "success"})
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(401).send({ message: "no field"})
    }
  } else {
    res.status(400).send({ message: "no user"})
  }
})

router.post('/mic-level',  authCheck, (req, res) => {
  if(req.body && req.user) {
    if(checkBodyFields(req.body, [ "level"])) {
      pg.get()("noiselevel").insert({ level: req.body.level, uuid: uuidv4(), student_id: req.user.uuid}).returning("*").then((data) => {
        res.status(200).send({...data, message: "success"})
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(401).send({ message: "no field"})
    }
  } else {
    res.status(400).send({ message: "no user"})
  }
})

module.exports = router
