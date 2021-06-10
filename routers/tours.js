const tourController = require('../controllers/tours');
const express = require('express');
const { isAuth } = require('../middlewares/auth');
// import reactRender from '../reactRoutes';
const tourRouter = express();
tourRouter.get('/api/get/tours', isAuth(), tourController.getTours);
tourRouter.get('/admin/tours', isAuth(), tourController.adminPage);
tourRouter.get('/', tourController.indexPage);
tourRouter.post('/api/update/tour', isAuth(), tourController.updateTour);
tourRouter.post('/api/create/tour', isAuth(), tourController.createTour);
tourRouter.get('/api/delete/tour', isAuth(), tourController.deleteTour);
tourRouter.post('/api/upload/tour', tourController.uploadTour);
tourRouter.get('/search', tourController.searchPage);

module.exports = tourRouter;