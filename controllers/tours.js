const { default: axios } = require('axios');
const { catchAsync } = require('../middlewares/catch');
const toursService = require('../services/tours');

const getTours = catchAsync(async (req, res) => {
  const { email } = req.user;
  const tours = await toursService.getTours(email);
  return res.send(tours);
});

const createTour = catchAsync(async (req, res) => {
  const { numberOfSeats, price, desc, from, to, dateStart, dateEnd } = req.body;
  const createResponse = await toursService.createTour({
    numberOfSeats,
    from,
    to,
    desc,
    price,
    dateStart,
    dateEnd,
    email: req.user.emails[0].value,
  });
  if (!createResponse.ok) {
    return res.status(500).send(createResponse);
  }
  return res.send(createResponse);
});

const buyTour = catchAsync(async (req, res) => {
  const { id, email, name, quantity } = req.body;
  const response = await toursService.buyTour({
    id,
    email: req.user ? req.user._json.email : email,
    name: req.user ? req.user.displayName : name,
    quantity,
  });
  if (!response.ok) {
    return res.status(500).send(response);
  }
  return res.send(response);
});

const updateTour = catchAsync(async (req, res) => {
  const { id, desc, price, numberOfSeats, from, to, dateStart, dateEnd } = req.body;
  const response = await toursService.updateTour({
    id,
    desc,
    price,
    numberOfSeats,
    from,
    to,
    dateStart,
    dateEnd,
  });
  if (!response.ok) {
    return res.status(500).send(response);
  }
  return res.send(response);
});

const adminPage = catchAsync(async (req, res) => {
  const tours = await toursService.getTours({ email: req.user.email });
  res.render('index', {
    list: tours.map((tour) => ({
      id: { value: tour.id, default: tour.id, type: 'hidden' },
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

const deleteTour = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await toursService.deleteTour(id);
  return res.send(response);
});

const uploadTour = catchAsync(async (req, res) => {
  console.log(req);
});

module.exports = { getTours, createTour, buyTour, updateTour, adminPage, deleteTour, uploadTour };
