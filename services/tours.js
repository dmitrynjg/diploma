const validator = require('validator');
const tourRepository = require('../repositories/tours');

const getTours = async (where) => tourRepository.getTours(where).then((res) => res);

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

const createTour = async ({ numberOfSeats, from, to, price, dateStart, dateEnd, email, desc }) => {
  try {
    if (!validator.isEmail(email || '')) {
      return { ok: false, message: 'Это не email' };
    }
    if (!validator.isDate(dateStart || '')) {
      return { ok: false, message: 'Дата отправки яв-ся не дата' };
    }
    if (!validator.isDate(dateEnd || '')) {
      return { ok: false, message: 'Дата окончание яв-ся не дата' };
    }

    if (new Date(dateStart) >= new Date(dateEnd)) {
      return { ok: false, message: 'Дата начало тура должна быть раньше чем дата окончания' };
    }
    if (!validator.isInt(String(numberOfSeats || ''))) {
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

const updateTour = async ({ id, desc, price, numberOfSeats, from, to, dateStart, dateEnd, fromCode, toCode }) => {
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

module.exports = { getTours, createTour, searchCities, buyTour, updateTour, deleteTour };
