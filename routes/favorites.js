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

router.route('/favorites')
  .get((req, res, next) => {
    if (!req.cookies.token) {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    }
    else {
      return knex('favorites')
      .orderBy('author')
      .then((favorites) => {
        console.log(favorites);
        res.set('Content-Type', /json/);
        res.send(camelizeKeys(favorites));
      })
      .catch((err) => {
        next();
      });
    }
  })
  .post((req, res, next) => {
    if (!req.cookies.token) {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    }
    else {
      return knex('favorites')
      .orderBy('author')
      .then((favorites) => {
        console.log(favorites);
        res.set('Content-Type', /json/);
        res.send(camelizeKeys(favorites));
      })
      .catch((err) => {
        next();
      });
    }
  })
  .delete((req, res, next) => {
    if (!req.cookies.token) {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    }
    else {
      return knex('favorites')
      .orderBy('author')
      .then((favorites) => {
        console.log(favorites);
        res.set('Content-Type', /json/);
        res.send(camelizeKeys(favorites));
      })
      .catch((err) => {
        next();
      });
    }
  })

module.exports = router;
