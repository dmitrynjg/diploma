const tourController = require('../controllers/tours');
const express = require('express');
const { isAuth } = require('../middlewares/auth');

const tourRouter = express();
tourRouter.get('/api/get/tours', isAuth(), tourController.getTours);
tourRouter.get('/api/get/tour', tourController.getTour);
tourRouter.get('/admin/tours', isAuth(), tourController.adminPage);
tourRouter.get('/', tourController.indexPage);
tourRouter.get('/search', tourController.searchPage);
tourRouter.post('/api/update/tour', isAuth(), tourController.updateTour);
tourRouter.post('/api/create/tour', isAuth(), tourController.createTour);
tourRouter.get('/api/delete/tour', isAuth(), tourController.deleteTour);
tourRouter.post('/api/buy/tour', isAuth(), tourController.buyTour);
tourRouter.post('/api/upload/tour', tourController.uploadTour);
tourRouter.post('/api/get/slides', tourController.getSlides);
tourRouter.post('/api/upload/slide', tourController.uploadSlide);
tourRouter.get('/api/delete/slide', tourController.deleteSlide);



module.exports = tourRouter;
