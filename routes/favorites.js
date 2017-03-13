const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.route('/favorites')
  .get((req, res, next) => {
    if (req.cookies.token) {
      return knex('favorites').join('books', 'favorites.book_id', 'books.id')
      .then((favorites) => {
        res.json(camelizeKeys(favorites));
      })
      .catch((err) => {
        next();
      });
    } else {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    }
  })
  .post((req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    }
    else {
      const decodedToken = jwt.decode(token);
      return knex('favorites')
      .insert({
        book_id: req.body.bookId,
        user_id: decodedToken.sub
      }, '*')
      .then((favorites) => {
        res.json(camelizeKeys(favorites[0]));
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
    } else {
      let favorite;
      knex('favorites')
      .where('book_id', req.body.bookId)
      .first()
      .then((row) => {
        if (!row) {
          return next();
        }
        favorite = row;

        return knex('favorites')
        .del()
        .where('book_id', req.body.bookId)
        .then(() => {
          delete favorite.id;
          res.set('Content-Type', 'application/json');
          res.send(camelizeKeys(favorite));
        })
        .catch((err) => {
          next();
        });
      })
    }
  });

router.get('/favorites/:check', (req, res, next) => {
  if (!req.cookies.token) {
    res.set('Content-Type', 'text/plain');
    res.status(401).send('Unauthorized');
  }
  else {
    let queryDecam = decamelizeKeys(req.query);
    let key = (Object.getOwnPropertyNames(queryDecam)).toString();

    return knex('favorites')
    .where(key, Number(queryDecam[key]))
    .then((favorite) => {
      if (favorite[0]) {
        res.set('Content-Type', 'application/json');
        res.status(200).send('true');
      }
      else {
        res.set('Content-Type', 'application/json');
        res.status(200).send('false');
      }
    })
    .catch((err) => {
      next();
    });
  }
});

module.exports = router;
