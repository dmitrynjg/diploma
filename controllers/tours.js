const { default: axios } = require('axios');
const { catchAsync } = require('../middlewares/catch');
const toursService = require('../services/tours');

const getTours = catchAsync(async (req, res) => {
  const { email } = req.user;
  const tours = await toursService.getTours({ email });
  return res.send(tours);
});

const indexPage = catchAsync(async (req, res) => {
  const response = await toursService.searchTours({
    page: 1,
    dateStart: null,
    dateEnd: null,
    from: null,
    to: null,
  });
  const slides = {};
  const slideResponse = await toursService.getSlides(
    response.data.map((tour) => {
      slides[tour.id] = [];
      return tour.id;
    })
  );
  if (!slideResponse.ok) {
    return res.send(slideResponse);
  }

  slideResponse.list.forEach((slide) => {
    slides[slide.tourId].push(slide);
  });

  let list = [];
  if (response.ok) {
    list = response.data.map((tour) => {
      return { ...tour, slides: slides[tour.id] };
    });
  }
  res.render('index', { user: req.user, list, page: 1, countPage: 1 });
});

const createTour = catchAsync(async (req, res) => {
  const { numberOfSeats, price, desc, from, to, dateStart, dateEnd, title } = req.body;
  const createResponse = await toursService.createTour({
    numberOfSeats,
    from,
    to,
    desc,
    price,
    dateStart,
    dateEnd,
    email: req.user.email,
    title,
  });
  if (!createResponse.ok) {
    return res.status(500).send(createResponse);
  }
  return res.send(createResponse);
});

const buyTour = catchAsync(async (req, res) => {
  const { id, email, name, quantity, airId } = req.body;
  const response = await toursService.buyTour({
    id,
    email: req.user ? req.user.email : email,
    name: req.user ? req.user.name : name,
    quantity,
    airlineId: airId,
  });
  if (!response.ok) {
    return res.status(500).send(response);
  }
  return res.send(response);
});

const updateTour = catchAsync(async (req, res) => {
  const { id, desc, price, numberOfSeats, from, to, dateStart, dateEnd, title } = req.body;
  const response = await toursService.updateTour({
    id,
    desc,
    price,
    numberOfSeats,
    from,
    to,
    dateStart,
    dateEnd,
    title,
  });
  if (!response.ok) {
    return res.status(500).send(response);
  }
  return res.send(response);
});

const adminPage = catchAsync(async (req, res) => {
  const tours = await toursService.getTours({ owner_id: req.user.id });
  res.render('admin', {
    user: req.user,
    list: tours.map((tour) => ({
      id: { value: tour.id, default: tour.id, type: 'hidden' },
      title: { value: tour.title, default: tour.title, type: 'text' },
      poster: { value: tour.poster, default: tour.poster },
      desc: { value: tour.desc, default: tour.desc, type: 'text' },
      price: { value: tour.price, default: tour.price, type: 'number' },
      numberOfSeats: { value: tour.numberOfSeats, default: tour.numberOfSeats, type: 'number' },
      from: { value: tour.from, default: tour.from, type: 'text' },
      to: { value: tour.to, default: tour.to, type: 'text' },
      dateStart: { value: tour.dateStart, default: tour.dateStart, type: 'date' },
      dateEnd: { value: tour.dateEnd, default: tour.dateEnd, type: 'date' },
      places: { value: tour.freePlaces, default: tour.freePlaces, type: 'number' },
    })),
  });
});

const getSlides = catchAsync(async (req, res) => {
  const { tourIdList } = req.body;
  const response = await toursService.getSlides(tourIdList);
  return res.send(response);
});

const deleteTour = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await toursService.deleteTour(id);
  return res.send(response);
});

const uploadTour = catchAsync(async (req, res) => {
  const { id, image } = req.body;
  const response = await toursService.uploadTour({ id, image });
  return res.send(response);
});

const uploadSlide = catchAsync(async (req, res) => {
  const { slide, id } = req.body;
  const response = await toursService.uploadSlide({ slide, id });
  return res.send(response);
});

const searchPage = catchAsync(async (req, res) => {
  const { page, dateStart, dateEnd, from, to } = req.query;
  const response = await toursService.searchTours({ page, dateStart, dateEnd, from, to });
  const slides = {};
  const slideResponse = await toursService.getSlides(
    response.data.map((tour) => {
      slides[tour.id] = [];
      return tour.id;
    })
  );
  if (!slideResponse.ok) {
    return res.send(slideResponse);
  }

  slideResponse.list.forEach((slide) => {
    slides[slide.tourId].push(slide);
  });

  let list = [];
  if (response.ok) {
    list = response.data.map((tour) => {
      return { ...tour, slides: slides[tour.id] };
    });
  }
  res.render('search', { list, page: page ? page : 1, countPage: response.countPage, user: req.user });
});

const deleteSlide = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await toursService.deleteSlide(id);
  return res.send(response);
});

const getTour = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await toursService.getTour({ id });
  return res.send(response);
});

module.exports = {
  getTour,
  getTours,
  deleteSlide,
  createTour,
  buyTour,
  updateTour,
  adminPage,
  deleteTour,
  uploadTour,
  indexPage,
  searchPage,
  uploadSlide,
  getSlides,
};
