'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string()
    .label('Email')
    .email()
    .required()
    .trim(),
    password: Joi.string()
    .label('password')
    .required()
    .trim()
    .min(8)
  }
};
