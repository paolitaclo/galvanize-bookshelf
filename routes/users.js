'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const camelizeKeys = require('humps');
const bcrypt = require('bcrypt-as-promised');

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('users')
        .insert({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_password
        }, '*')
      })
    .then((users) => {
      delete users[0].hashed_password;
      res.send(camelizeKeys(users[0]));
      })
    .catch((err) => {
      next(err);
    });
  });

module.exports = router;
