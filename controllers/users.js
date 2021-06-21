const sequelize = require('../db');
const { catchAsync } = require('../middlewares/catch');
const orderModel = require('../models/Order');
const tourModel = require('../models/Tour');
const userModel = require('../models/User');
const { getTours } = require('../repositories/tours');

const signin = catchAsync(async (req, res) => {
  const { user } = req;
  const info = await userModel.findOne({
    raw: true,
    where: {
      email: user.email,
    },
  });
  if (!info) {
    await userModel.create({
      email: user._json.email,
      name: user._json.name || user._json.given_name || user.displayName,
    });
  }
  return res.redirect('../../');
});

const getProfileInfo = catchAsync(async (req, res) => {
  const { user } = req;
  const userInfo = await userModel.findOne({
    raw: true,
    where: user.id,
  });
  if (!userInfo) {
    return res.send('Такого пользователя нет');
  }

  const orders = await orderModel.findAll({
    attributes: [
      'quantity',
      ['order_id', 'id'],
      ['airline_id', 'airlineId'],
      ['tour_id', 'tourId'],
      ['flight_price', 'flightPrice'],
    ],
    raw: true,
    where: {
      email: req.user.email,
    },
  });

  let rows = [];
  const tourIdList = {};
  orders.forEach((order) => {
    if (!tourIdList[order.tourId]) {
      tourIdList[order.tourId] = null;
    }
  });
  if (Object.keys(tourIdList).length > 0) {
    await getTours({
      tour_id: Object.keys(tourIdList),
    }).then((res) => {
      res.rows.forEach((tour) => {
        tourIdList[tour.id] = tour;
      });
    });
    rows = orders
      .filter((order) => {
        return tourIdList[order.tourId] !== null;
      })
      .map((order) => {
        return { ...order, ...tourIdList[order.tourId] };
      });
  }
  return res.render('profile', { orders: rows, user: req.user });
});

module.exports = { signin, getProfileInfo };
