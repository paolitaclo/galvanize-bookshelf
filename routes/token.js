'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');

router.route('/token')
  .get((req, res) => {
    console.log('cookie: ', req.cookie.token, req.cookie);
    if (req.cookie) {
      res.set('Content-Type', 'application/json');
      res.status(200).send('true');
    }
    else {
      res.set('Content-Type', 'application/json');
      res.status(200).send('false');
    }
  })
  .post((req, res, next) => {
    if (!req.body.email) {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Email must not be blank');
    }
    else if (!req.body.password) {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Password must not be blank');
    }
    else {
      return knex('users').where('email', req.body.email)
      .then((users) => {
        if (!users[0]) {
          res.set('Content-Type', 'text/plain');
          res.status(400).send('Bad email or password');
        }
        else {
          return bcrypt.compare(req.body.password, users[0].hashed_password)
          .then((userAuth) => {
            delete users[0].hashed_password;
            let claims = {
              sub: users[0].id,
              iss: 'https://localhost:8000'
            };
            let token = jwt.sign(claims, process.env.JWT_KEY);
            res.cookie('token', token, { path: '/', httpOnly: true });
            res.send(camelizeKeys(users[0]));
          })
          .catch((err) => {
            res.set('Content-Type', 'text/plain');
            res.status(400).send('Bad email or password');
          });
        }
      });
    }
  })
  .delete((req, res, next) => {
    res.clearCookie('token');
    res.status(200).send('true');
  });

module.exports = router;
