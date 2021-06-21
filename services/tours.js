const isBase64 = require('is-base64');
const validator = require('validator');
const tourRepository = require('../repositories/tours');

const getTours = async (where) => tourRepository.getTours(where).then((res) => res.rows);

const getTour = async ({ id }) => {
  try {
    if (!validator.isInt(id)) {
      return { ok: false, message: 'Id должен быть целым числом' };
    }
    const tour = await tourRepository.getTour({ id });
    if (!tour) {
      return { ok: false, message: 'Тур не найден' };
    }
    return { ok: true, data: tour };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const searchCities = async ({ from, to }) => {
  if (typeof from !== 'string') {
    return { ok: false, message: 'from должен быть текстом' };
  }
  if (typeof to !== 'string') {
    return { ok: false, message: 'to должен быть текстом' };
  }
  return tourRepository.searchCities({ from, to }).then((res) => {
    return res;
  });
};

const uploadTour = async ({ id, image }) => {
  try {
    if (!isBase64(image, { mimeRequired: true })) {
      return { ok: false, message: 'Вы должны передать картинку в base64' };
    }
    if (!validator.isInt(String(id))) {
      return { ok: false, message: 'id должно быть числом' };
    }
    await tourRepository.uploadTour({ id, image });
    return { ok: true, message: 'Картинка сохранена' };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const getSlides = async (tourIdList) => {
  if (!tourIdList.every((value) => validator.isInt(String(value)))) {
    return { ok: false, message: 'в списке id должны быть только числа' };
  }
  const list = await tourRepository.getSlides(tourIdList);
  return { ok: true, list };
};

const createTour = async ({ numberOfSeats, from, to, price, dateStart, dateEnd, email, desc, title }) => {
  try {
    if (!validator.isEmail(String(email))) {
      return { ok: false, message: 'Это не email' };
    }
    if (!validator.isDate(String(dateStart))) {
      return { ok: false, message: 'Дата отправки яв-ся не дата' };
    }
    if (!validator.isDate(dateEnd)) {
      return { ok: false, message: 'Дата окончание яв-ся не дата' };
    }
    if (typeof title !== 'string') {
      return { ok: false, message: 'Заголовок должен быть тектсом' };
    }
    if (new Date(dateStart) >= new Date(dateEnd)) {
      return { ok: false, message: 'Дата начало тура должна быть раньше чем дата окончания' };
    }
    if (!validator.isInt(String(numberOfSeats))) {
      return { ok: false, message: 'количество мест должно быть целым числом' };
    }
    if (typeof from !== 'string') {
      return { ok: false, message: 'место отправки должно быть текстом' };
    }
    if (typeof to !== 'string') {
      return { ok: false, message: 'место прибытия должно быть текстом' };
    }
    if (typeof desc !== 'string') {
      return { ok: false, message: 'описание должно быть текстом' };
    }
    if (!validator.isNumeric(String(price || ''))) {
      return { ok: false, message: 'цена должна быть числом' };
    }
    const searchCitities = await tourRepository.searchCities({ from, to });
    if (Object.keys(searchCitities).length === 0) {
      return { ok: false, message: 'Города не нейдены' };
    }
    const tour = await tourRepository.createTour({
      numberOfSeats,
      title,
      from,
      to,
      desc,
      price,
      dateStart,
      dateEnd,
      fromCode: searchCitities.fromCode,
      toCode: searchCitities.toCode,
      email,
    });
    if (tour) {
      return { ok: true, message: 'Тур создан' };
    }
    return { ok: false, message: 'Не удалось создать тур' };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const buyTour = async ({ id, name, email, quantity, airlineId }) => {
  try {
    if (!validator.isEmail(String(email || ''))) {
      return { ok: false, message: 'email введен неправильно' };
    }
    if (!validator.isInt(String(id || ''))) {
      return { ok: false, message: 'id должен быть числом' };
    }
    if (!validator.isInt(String(airlineId || ''))) {
      return { ok: false, message: 'airlineId должен быть числом' };
    }
    if (typeof name !== 'string') {
      return { ok: false, message: 'имя должно быть текстом' };
    }
    if (!validator.isInt(String(quantity || ''))) {
      return { ok: false, message: 'Количество должен быть числом' };
    }
    if(quantity <= 0) {
      return { ok: false, message: 'Количество билетов не может быть меньше 1' };
    }
    const response = await tourRepository.getTour({ id });
    if (!response) {
      return { ok: false, message: 'Тур не найден' };
    }
    if (response.freePlaces < quantity) {
      return { ok: false, message: 'Осталось меньше мест' };
    }
    const tickets = await tourRepository.searchTickets({
      dateStart: response.dateStart,
      dateEnd: response.dateEnd,
      fromCode: response.fromCode,
      toCode: response.toCode,
      quantity,
    });
    const ticket = await tickets.filter((ticket) => ticket.id === airlineId)[0];
    if (!ticket) {
      return { ok: false, message: 'рейс не найден' };
    }
    await tourRepository.createOrder({
      quantity,
      email,
      name,
      id,
      airlineId,
      flightPrice: ticket.price,
    });
    return { ok: true, message: 'Покупка прошла успешно' };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const updateTour = async ({ id, desc, price, numberOfSeats, from, to, dateStart, dateEnd, title }) => {
  try {
    const updateData = {};
    if (!validator.isInt(String(id))) {
      return { ok: false, message: 'id должно быть числом' };
    }
    updateData.id = id;
    const tourInfo = await tourRepository.getTour({ id });
    if (!tourInfo) {
      return { ok: false, message: 'Такого тура не существует' };
    }
    if (desc) {
      if (typeof desc !== 'string') {
        return { ok: false, message: 'Описание должно быть текстом' };
      }
      updateData.desc = desc;
    }
    if (title) {
      if (typeof title !== 'string') {
        return { ok: false, message: 'Заголовок должен быть текстом' };
      }
      updateData.title = title;
    }
    if (price) {
      if (!validator.isNumeric(String(price))) {
        return { ok: false, message: 'Цена должна быть числом' };
      }
      updateData.price = price;
    }
    if (numberOfSeats) {
      if (!validator.isNumeric(String(numberOfSeats))) {
        return { ok: false, message: 'Количество мест должно быть числом' };
      }
      updateData.numberOfSeats = numberOfSeats;
    }
    if (from) {
      if (typeof from !== 'string') {
        return { ok: false, message: 'from должен быть текстом' };
      }
      updateData.from = from;
    }
    if (to) {
      if (typeof to !== 'string') {
        return { ok: false, message: 'Too должна быть числом' };
      }
      updateData.to = to;
    }
    if (dateStart) {
      if (!validator.isDate(dateStart)) {
        return { ok: false, message: 'дата отправки должна быть датой' };
      }
      updateData.dateStart = dateStart;
    }
    if (dateEnd) {
      if (!validator.isDate(dateEnd)) {
        return { ok: false, message: 'дата окончание должна быть датой' };
      }
      updateData.dateEnd = dateEnd;
    }
    if (new Date(dateStart ? dateStart : tourInfo.dateStart) >= new Date(dateEnd ? dateEnd : tourInfo.dateEnd)) {
      return { ok: false, message: 'Дата начало тура должна быть раньше чем дата окончания' };
    }
    if (from || to) {
      const searchCitities = await tourRepository.searchCities({
        from: from ? from : tourInfo.from,
        to: to ? to : tourInfo.to,
      });
      if (Object.keys(searchCitities).length === 0) {
        return { ok: false, message: 'Города не нейдены' };
      }
      if (from) {
        updateData.fromCode = searchCitities.fromCode;
      }
      if (to) {
        updateData.toCode = searchCitities.toCode;
      }
    }
    await tourRepository.updateTour(updateData);
    return { ok: true, message: 'Изменение прошло успешно' };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const deleteTour = async (id) => {
  try {
    if (!validator.isInt(String(id))) {
      return { ok: false, message: 'Id должно быть целым числом' };
    }
    await tourRepository.deleteTour(id);
    return { ok: true, message: 'Удаление прошло успешно' };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const searchTours = async ({ from, to, page, dateStart, dateEnd }) => {
  try {
    const limit = 5;
    const where = {};
    if (page) {
      if (!validator.isInt(String(page))) {
        return { ok: false, message: 'page должна быть числом' };
      }
      if (page < 1) {
        return { ok: false, message: 'page должна быть минимум 1' };
      }
    }
    if (from) {
      if (typeof from !== 'string') {
        return { ok: false, message: 'from должен быть текстом' };
      }
    }
    if (to) {
      if (typeof to !== 'string') {
        return { ok: false, message: 'Too должна быть числом' };
      }
    }
    if (dateStart) {
      if (!validator.isDate(String(dateStart))) {
        return { ok: false, message: 'дата отправки должна быть датой' };
      }
      where.date_start = new Date(dateStart);
    }
    if (dateEnd) {
      if (!validator.isDate(String(dateEnd))) {
        return { ok: false, message: 'дата окончание должна быть датой' };
      }
      where.date_end = new Date(dateEnd);
    }

    if (from && to) {
      const searchCities = await tourRepository.searchCities({ from, to });

      if (Object.keys(searchCities).length === 0) {
        return { ok: false, message: 'Города не нейдены' };
      }
      where.tour_from_code = searchCities.fromCode;
      where.tour_to_code = searchCities.toCode;
    }
    const response = await tourRepository.getTours(where, ((page ? page : 1) - 1) * limit, limit);
    const tours = response.rows;
    let data = [];
    const cities = [];

    tours.forEach((tour) => {
      if (cities.indexOf(`${tour.fromCode} ${tour.toCode}`) === -1) {
        cities.push(`${tour.fromCode} ${tour.toCode}`);
      }
    });
    const ticketPrice = {};
    await Promise.all(
      cities.map(async (name) => {
        const fromAndTo = name.split(' ');
        const tickets = await tourRepository.searchTickets({
          dateStart,
          dateEnd,
          fromCode: fromAndTo[0],
          toCode: fromAndTo[1],
          quantity: 1,
        });

        ticketPrice[name] = tickets[0];
      })
    );
    data = tours.map((tour) => {
      const ticketKey = `${tour.fromCode} ${tour.toCode}`;
      return {
        ...tour,
        ticketPrice: ticketPrice[ticketKey].price,
        airId: ticketPrice[ticketKey].id,
        airline: ticketPrice[ticketKey].airline,
        numberOfChanges: ticketPrice[ticketKey].numberOfChanges,
      };
    });
    return { ok: true, message: 'Поиск завершен', data, countPage: Math.ceil(response.count / limit) };
  } catch (e) {
    return { ok: false, message: 'Произошла ошибка' };
  }
};

const uploadSlide = async ({ slide, id }) => {
  if (!isBase64(slide, { mimeRequired: true })) {
    return { ok: false, message: 'slide должен быть в base64' };
  }
  if (!validator.isInt(String(id))) {
    return { ok: false, message: 'id тура должен быть числом' };
  }
  await tourRepository.uploadSlide({ slide, id });
  return { ok: true, message: 'Загрузка слайда прошла успешно' };
};

const deleteSlide = async (id) => {
  if (!validator.isInt(String(id))) {
    return { ok: false, message: 'id слайда должно быть числом' };
  }
  await tourRepository.deleteSlide(id);
  return { ok: true, message: 'Слайд удален' };
};

module.exports = {
  uploadSlide,
  deleteSlide,
  getTour,
  getTours,
  createTour,
  searchCities,
  buyTour,
  updateTour,
  deleteTour,
  uploadTour,
  searchTours,
  getSlides,
};
