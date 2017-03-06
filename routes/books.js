// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('books', (req, res, next) => {
  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.cover_url
    })
    .then((book) => {
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
