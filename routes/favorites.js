const express = require('express');

const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');

function validateToken(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, decodedClaim) => {
    if (err) {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    } else {
      req.token = decodedClaim;
      return next();
    }
  });
}

router.route('/favorites')
  .get(validateToken, (req, res, next) => {
      knex('favorites').join('books', 'favorites.book_id', 'books.id')
      .then((favorites) => {
        res.json(camelizeKeys(favorites));
      })
      .catch((err) => {
        next(err);
      });
  })
  .post(validateToken, (req, res, next) => {
    const decodedToken = req.token;
    return knex('favorites')
    .insert({
      book_id: req.body.bookId,
      user_id: decodedToken.sub,
    }, '*')
    .then((favorites) => {
      res.json(camelizeKeys(favorites[0]));
    })
    .catch((err) => {
      next(err);
    });
  })
  .delete(validateToken, (req, res, next) => {
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
      .where('book_id', req.body.bookId);
    })
    .then(() => {
      delete favorite.id;
      res.json(camelizeKeys(favorite));
    })
    .catch((err) => {
      next(err);
    });
  });

router.get('/favorites/:check', validateToken, (req, res, next) => {
  const queryDecam = decamelizeKeys(req.query);
  const key = (Object.getOwnPropertyNames(queryDecam)).toString();
  return knex('favorites')
  .where(key, Number(queryDecam[key]))
  .then((favorite) => {
    if (favorite[0]) {
      res.set('Content-Type', 'application/json');
      res.status(200).send('true');
    } else {
      res.set('Content-Type', 'application/json');
      res.status(200).send('false');
    }
  })
  .catch(() => {
    next();
  });
});

module.exports = router;
