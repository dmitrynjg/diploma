const sequelize = require('../db');
const tourModel = require('../models/Tour');
const userModel = require('../models/User');
const axios = require('axios');
const travelpayotsApi = require('../modules/travelpayouts');
const orderModel = require('../models/Order');

const getTours = async (where, whereTour, offset, limit) => {
  const info = {};
  if (offset) {
    info.offset = offset;
  }
  if (limit) {
    info.limit = limit;
  }
  const list = await tourModel.findAll({
    attributes: [
      ['tour_id', 'id'],
      'title',
      ['tour_from_code', 'fromCode'],
      ['tour_to_code', 'toCode'],
      ['tour_desc', 'desc'],
      'price',
      [
        sequelize.cast(
          sequelize.literal(
            '(SELECT `tours`.`number_of_seats` - COALESCE((SELECT SUM(`orders`.`quantity`) FROM `orders` WHERE `orders`.`tour_id` = `tours`.`tour_id`), 0))'
          ),
          'DOUBLE'
        ),
        'freePlaces',
      ],
      'poster',
      ['number_of_seats', 'numberOfSeats'],
      ['tour_from', 'from'],
      ['tour_to', 'to'],
      ['date_start', 'dateStart'],
      ['date_end', 'dateEnd'],
      ['owner_id', 'ownerId'],
      ['tour_from_code', 'tourFromCode'],
      ['tour_to_code', 'tourToCode'],
    ],
    raw: true,
    include: [
      {
        all: true,
        model: userModel,
        attributes: [],
        where: where,
        on: {
          id: sequelize.literal('`tours`.`owner_id`'),
        },
      },
    ],
    where: whereTour,
    ...info,
  });
  return list;
};

const createTour = async ({
  numberOfSeats,
  title,
  from,
  to,
  desc,
  price,
  dateStart,
  dateEnd,
  fromCode,
  toCode,
  email,
}) => {
  const user = await userModel.findOne({
    attributes: ['id'],
    raw: true,
    where: {
      email: email,
    },
  });
  if (!user) {
    return user;
  }
  return tourModel
    .create({
      tour_desc: desc,
      poster: '../../uploads/default.png',
      title,
      price,
      number_of_seats: numberOfSeats,
      tour_from: from,
      tour_to: to,
      date_start: dateStart,
      date_end: dateEnd,
      owner_id: user.id,
      tour_from_code: fromCode,
      tour_to_code: toCode,
    })
    .then((res) => res.null);
};

const searchCities = async ({ from, to }) => {
  const data = {};
  return axios
    .get(encodeURI(`https://www.travelpayouts.com/widgets_suggest_params?q=Из ${from} в ${to}`))
    .then((res) => {
      if (Object.keys(res.data).length > 0 && res.data.origin && res.data.destination) {
        data.fromCode = res.data.origin.iata;
        data.toCode = res.data.destination.iata;
      }
      return data;
    });
};
const searchTickets = ({ dateStart, dateEnd, fromCode, toCode, quantity }) => {
  return travelpayotsApi
    .cheap({
      origin: fromCode,
      destination: toCode,
    })
    .then((res) =>
      res
        .map((ticket) => {
          return {
            id: ticket.flight_number,
            price: quantity * ticket.price,
            fromCode: ticket.origin,
            toCode: ticket.destination,
            dateStart,
            dateEnd,
            airline: ticket.airline,
            numberOfChanges: ticket.number_of_changes,
          };
        })
        .sort((current, next) => (current.price > next.price ? 1 : -1))
    );
};

const getTour = async ({ id }) => {
  return tourModel
    .findOne({
      raw: true,
      attributes: [
        ['tour_id', 'id'],
        [
          sequelize.cast(
            sequelize.literal(
              '(SELECT `tours`.`number_of_seats` - COALESCE((SELECT SUM(`orders`.`quantity`) FROM `orders` WHERE `orders`.`tour_id` = `tours`.`tour_id`), 0))'
            ),
            'DOUBLE'
          ),
          'freePlaces',
        ],
        'poster',
        ['tour_from', 'from'],
        ['tour_to', 'to'],
        ['date_start', 'dateStart'],
        ['date_end', 'dateEnd'],
        ['tour_from_code', 'fromCode'],
        ['tour_to_code', 'toCode'],
        ['number_of_seats', 'numberOfSeats'],
        ['tour_desc', 'desc'],
        ['owner_id', 'ownerId'],
      ],
      where: {
        tour_id: id,
      },
    })
    .then((res) => res);
};

const updateTour = async ({
  id,
  desc,
  price,
  numberOfSeats,
  from,
  to,
  dateStart,
  dateEnd,
  fromCode,
  toCode,
  title,
}) => {
  const updateData = {};
  if (desc) {
    updateData.tour_desc = desc;
  }
  if (price) {
    updateData.price = price;
  }
  if (numberOfSeats) {
    updateData.number_of_seats = numberOfSeats;
  }
  if (from) {
    updateData.tour_from = from;
  }
  if (to) {
    updateData.tour_to = to;
  }
  if (dateStart) {
    updateData.date_start = dateStart;
  }
  if (dateEnd) {
    updateData.date_end = dateEnd;
  }
  if (fromCode) {
    updateData.from_code = fromCode;
  }
  if (toCode) {
    updateData.to_code = toCode;
  }
  if (title) {
    updateData.title = title;
  }
  await tourModel.update(updateData, { where: { tour_id: id } });
};

const deleteTour = async (id) => {
  tourModel.destroy({
    where: {
      tour_id: id,
    },
  });
};

const createOrder = async ({ id, name, email, quantity, airlineId, flightPrice }) => {
  await orderModel.create({
    tour_id: id,
    name,
    email,
    quantity,
    airline_id: airlineId,
    flight_price: flightPrice,
  });
};

const uploadTour = async ({ id, image }) => {
  await tourModel.update({ poster: image }, { where: { tour_id: id } });
};

module.exports = {
  getTours,
  createTour,
  searchCities,
  searchTickets,
  getTour,
  createOrder,
  deleteTour,
  updateTour,
  uploadTour,
};
