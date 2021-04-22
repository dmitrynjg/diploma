/* eslint-disable import/extensions */
import express from 'express';
import passport from 'passport';
import * as tourController from '../controllers/tour';

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/create/tour', tourController.createTour);
app.post('/api/edit/tour', tourController.editTour);
app.post('/api/delete/tour', tourController.deleteTour);

export = app;
