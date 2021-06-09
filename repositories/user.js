const sequelize = require('../db');
const orderModel = require('../models/Order');
const tourModel = require('../models/Tour');

const getTour = async ({ id, name, email, quantity }) => {
  const info = await tourModel.findOne({
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
      ['poster'],
      ['tour_from', 'from'],
      ['tour_to', 'to'],
      ['date_start', 'dateStart'],
      ['date_end', 'dateEnd'],
      ['tour_from_code', 'fromCode'],
      ['tour_to_code', 'toCode'],
      ['number_of_seats', 'numberOfSeats'],
      ['owner_id', 'ownerId'],
    ],
    where: {
      tour_id: id,
    },
  });
  if (!info) {
    return info;
  }
  return info;
};

module.exports = { getTour };
