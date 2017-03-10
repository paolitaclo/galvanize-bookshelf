'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

router.route('/token')
  .get((req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.status(200).send('false');
  })
  .post((req, res, next) => {
      if(req.body.pasword < 0 || !req.body.password) {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      }
      bcrypt.hash(req.body.password, 12)
        .then((hashed_password) => {
          return knex('users')
          .where('email', req.body.email)
          .then((userEmail) => {
            if(userEmail[0] || !userEmail[0]) {
              res.set('Content-Type', 'text/plain');
              res.status(400).send('Bad email or password');
            }
            return userEmail;
          })
          .then((users) => {
            return knex('users')
            .insert({
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              email: req.body.email,
              hashed_password: hashed_password
            }, '*');
          })
        .then((users) => {
          delete users[0].hashed_password;
          res.cookie('set-cookie', 'token',{httpOnly: true});
          res.send(camelizeKeys(users[0]));
          })
        .catch((err) => {
          next(err);
        });
      });
  });

// router.post('/token', (req, res, next => {
//   bcrypt.hash(req.body.password, 12)
//   .then()
// }))
module.exports = router;
