// eslint-disable-next-line new-cap
const express = require('express');

const router = express.Router();
const knex = require('../knex');

router.route('/books')
  .get((req, res, next) => {
    knex('books')
      .orderBy('title')
      .then((books) => {
        res.send(books);
      })
      .catch((err) => {
        res.sendStatus(404);
        next(err);
      });
  })
  .post((req, res, next) => {
    knex('books')
      .insert({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.cover_url
      }, '*')
      .then((books) => {
        res.send(books[0]);
      })
      .catch((err) => {
        res.sendStatus(400);
        next(err);
      });
  });

router.route('/books/:id')
  .get((req, res, next) => {
    knex('books')
      .where('id', req.params.id)
      .first()
      .then((book) => {
        if (!book || req.params.id < 0 || Number.isNaN(req.params.id)) {
          return next();
        }
        res.send(book);
      })
      .catch((err) => {
        res.sendStatus(404);
        next(err);
      });
  })
  .patch((req, res, next) => {
    knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      return knex('books')
      .update({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.cover_url
      }, '*')
      .where('id', req.params.id);
    })
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      res.sendStatus(404);
      next(err);
    });
  })
  .delete((req, res, next) => {
    let book;
    knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }
      book = row;
      return knex('books')
      .del()
      .where('id', req.params.id);
    })
    .then(() => {
      delete book.id;
      res.send(book);
    })
    .catch((err) => {
      res.sendStatus(404);
      next(err);
    });
  });
module.exports = router;
