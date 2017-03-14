

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys } = require('humps');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

router.route('/token')
  .get((req, res) => {
    if (req.cookies.token) {
      res.set('Content-Type', 'application/json');
      res.status(200).send('true');
    } else {
      res.set('Content-Type', 'application/json');
      res.status(200).send('false');
    }
  })
  .post((req, res) => {
    if (!req.body.email) {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Email must not be blank');
    } else if (!req.body.password) {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Password must not be blank');
    } else {
      return knex('users').where('email', req.body.email)
      .then((users) => {
        if (!users[0]) {
          res.set('Content-Type', 'text/plain');
          res.status(400).send('Bad email or password');
        } else {
          return bcrypt.compare(req.body.password, users[0].hashed_password);
        }
      })
      .then(() => {
        return knex('users').where('email', req.body.email);
      })
      .then((userResult) => {
        delete userResult[0].hashed_password;
        const claims = {
          sub: userResult[0].id,
          iss: 'https://localhost:8000',
        };
        const token = jwt.sign(claims, process.env.JWT_KEY);
        res.cookie('token', token, { path: '/', httpOnly: true });
        res.send(camelizeKeys(userResult[0]));
      })
      .catch(() => {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      });
    }
  })
  .delete((req, res) => {
    res.clearCookie('token');
    res.status(200).send('true');
  });

module.exports = router;
