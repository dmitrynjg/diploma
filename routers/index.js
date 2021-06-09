const express = require('express');
const userRouter = require('./users');
const tourRouter = require('./tours');

const router = express();
router.use(userRouter);
router.use(tourRouter);

module.exports =router;
