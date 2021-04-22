import tourDto from '../../models/tours/dto';
import axios, { AxiosResponse } from 'axios';
import db from '../../utils/db/';
import travelpayouts from '../../utils/travelpayots/';

const searchCities = async (fromName: String, toName: String): Promise<tourDto> => {
  const dto = new tourDto();
  await axios
    .get(encodeURI(`https://www.travelpayouts.com/widgets_suggest_params?q=Из ${fromName} в ${toName}`))
    .then((res: AxiosResponse) => {
      if (Object.keys(res.data).length > 0 && res.data.origin && res.data.destination) {
        dto.from = res.data.origin.name;
        dto.to = res.data.destination.name;
        dto.fromCode = res.data.origin.iata;
        dto.toCode = res.data.destination.iata;
      } else {
        dto.errCode = 'cities_not_found';
      }
    });
  return dto;
};

const createTourInDB = async (options: {
  from: String;
  fromCode: String;
  to: String;
  toCode: String;
  numberOfSeats: Number | String;
  price: Number;
  dateStart: String;
  dateEnd: String;
  desc: String;
  ownerId: Number;
}): Promise<tourDto> => {
  let dto = new tourDto();
  const user = await db.fetchObj('SELECT user_id FROM users WHERE user_id = ?', [options.ownerId]);
  if (Object.keys(user).length === 0) {
    dto.errCode = 'user_not_found';
    return dto;
  }
  dto = Object.assign(dto, options);
  console.log(options);
  const [insert] = await db.query(
    `
  INSERT INTO \`tours\`
  (
  \`desc\`, 
  \`number_of_seats\`,
  \`price\`,  
  \`tour_from\`, 
  \`tour_to\`, 
  \`date_start\`, 
  \`date_end\`, 
  \`owner_id\`, 
  \`tour_from_code\`,
  \`tour_to_code\`) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      options.desc,
      options.numberOfSeats,
      options.price,
      options.from,
      options.to,
      options.dateStart,
      options.dateEnd,
      options.ownerId,
      options.fromCode,
      options.toCode,
    ]
  );
  dto.id = insert.insertId;
  return dto;
};

const getUserTours = async (userId: Number): Promise<Array<tourDto>> => {
  const dto = new tourDto();
  const data = await db.fetchAll('SELECT * FROM tours WHERE owner_id = ?', [userId]).then((res) => {
    return res.map((tour) =>
      Object.assign(dto, {
        id: tour.tour_id,
        ownerId: tour.owner_id,
        price: tour.price,
        from: tour.tour_from,
        to: tour.tour_to,
        fromCode: tour.tour_from_code,
        toCode: tour.tour_to_code,
        dateStart: new Date(tour.date_start).toISOString(),
        dateEnd: new Date(tour.date_end).toISOString(),
        numberOfSeats: tour.number_of_seats,
        desc: tour.desc,
      })
    );
  });
  return data;
};

const updateTour = async (options: {
  id: Number;
  from?: String;
  fromCode?: String;
  to?: String;
  toCode?: String;
  numberOfSeats?: Number | String;
  price?: Number;
  dateStart?: String;
  dateEnd?: String;
  desc?: String;
}): Promise<void> => {
  const editData = JSON.parse(
    JSON.stringify({
      tour_from: options.from,
      tour_from_code: options.fromCode,
      tour_to: options.to,
      tour_to_code: options.toCode,
      number_of_seats: options.numberOfSeats,
      price: options.price,
      desc: options.desc,
      date_start: options.dateStart,
      date_end: options.dateEnd,
    })
  );

  await db.query(`UPDATE tours SET ${Object.keys(editData).map((key) => `\`${key}\` = ?`)} WHERE \`tour_id\` = ?`, [
    ...Object.values(editData),
    options.id,
  ]);
};

const deleteTour = async (id: Number): Promise<void> => {
  await db.query('DELETE FROM tours WHERE tour_id = ?', [id]);
};

const searchTicket = async (options: {
  from: String;
  to: String;
  isOneWay: boolean;
  departDate: String;
  returnDate: String;
  adults: Number;
  infants?: Number;
  children?: Number;
}): Promise<any> => {
  const foundСities: tourDto = await searchCities(options.from, options.to);
  if (foundСities.errCode) {
    return foundСities;
  }
  travelpayouts
    .cheap({
      origin: foundСities.fromCode,
      destination: foundСities.toCode,
      depart_date: options.departDate,
      return_date: options.returnDate,
      generateUrls: { adults: options.adults, infants: options.infants, children: options.children, currency: 'rub', locale: 'ru' },
    })
    .then((res: any) => {
      console.log(res);
    });
};

export { searchCities, createTourInDB, getUserTours, updateTour, deleteTour, searchTicket };
