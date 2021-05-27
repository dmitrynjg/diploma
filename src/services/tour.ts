import TourDto from '../models/tours/dto';
import * as tourRepository from '../repositories/tour/';

async function searchCitites(from: String, to: String) {
  const dto = new TourDto();
  return tourRepository.searchCities(from, to).then((res: any) => res);
}
const searchTicket = async (options: {
  from: String;
  to: String;
  adults: Number;
  children?: Number;
  dateStart: String;
  dateEnd: String;
}): Promise<TourDto> => {
  const dto = new TourDto();
  if (typeof options.from !== 'string') {
    dto.errCode = 'from_not_string';
    return dto;
  }
  if (typeof options.to !== 'string') {
    dto.errCode = 'to_not_string';
    return dto;
  }
  if (
    !/^([0-9]{1,})$/.test(String(options.adults)) ||
    (options.children && !/^([0-9]{1,})$/.test(String(options.children)))
  ) {
    dto.errCode = 'numberOfTicket_not_number';
    return dto;
  }
  if (
    !/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(String(options.dateStart)) &&
    !/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(String(options.dateEnd))
  ) {
    dto.errCode = 'dateStart_or_dateEnd_not_date';
    return dto;
  }
  if (new Date(String(options.dateStart)) >= new Date(String(options.dateEnd))) {
    dto.errCode = 'dateStart_greater_dateEnd';
    return dto;
  }
  // return tourRepository.searchTicket()
};
const createTour = async (tourInfo: {
  from: String;
  to: String;
  numberOfSeats: String | Number;
  price: Number | String;
  dateStart: String;
  dateEnd: String;
  desc: String;
  ownerId: Number | null;
}): Promise<TourDto> => {
  const dto = new TourDto();
  if (!/^([0-9]{1,})$/.test(String(tourInfo.ownerId))) {
    dto.errCode = 'userId_not_number';
    return dto;
  }
  if (typeof tourInfo.desc !== 'string') {
    dto.errCode = 'desc_not_string';
    return dto;
  }
  if (typeof tourInfo.from !== 'string') {
    dto.errCode = 'from_not_string';
    return dto;
  }
  if (typeof tourInfo.to !== 'string') {
    dto.errCode = 'to_not_string';
    return dto;
  }
  if (!/^([0-9]{1,})$/.test(String(tourInfo.numberOfSeats))) {
    dto.errCode = 'numberOfSeats_not_number';
    return dto;
  }

  if (!/^-?(0|[1-9]\d*)(\.[0-9]{1,})?$/.test(String(tourInfo.price))) {
    dto.errCode = 'price_not_number';
    return dto;
  }
  if (
    !/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(String(tourInfo.dateStart)) &&
    !/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(String(tourInfo.dateEnd))
  ) {
    dto.errCode = 'dateStart_or_dateEnd_not_date';
    return dto;
  }
  if (new Date(String(tourInfo.dateStart)) >= new Date(String(tourInfo.dateEnd))) {
    dto.errCode = 'dateStart_greater_dateEnd';
    return dto;
  }
  if (new Date(String(tourInfo.dateStart)) < new Date()) {
    dto.errCode = 'date_has_already_passed';
    return dto;
  }
  const searchResult = await tourRepository.searchCities(tourInfo.from, tourInfo.to);
  if (searchResult.errCode) {
    dto.errCode = searchResult.errCode;
    return dto;
  }
  return tourRepository.createTourInDB({
    ...tourInfo,
    from: searchResult.from,
    to: searchResult.to,
    price: Number(tourInfo.price),
    toCode: searchResult.toCode,
    fromCode: searchResult.fromCode,
  });
};

const editTour = async (tourInfo: {
  from?: String;
  to?: String;
  numberOfSeats?: String | Number;
  price?: Number | String;
  dateStart?: String;
  dateEnd?: String;
  desc?: String;
  // ownerId: Number | null;
  tourId: Number;
  ownerId: Number;
}): Promise<TourDto> => {
  const dto = new TourDto();
  if (!/^([0-9]{1,})$/.test(String(tourInfo.tourId))) {
    dto.errCode = 'tourId_not_number';
    return dto;
  }
  if (!/^([0-9]{1,})$/.test(String(tourInfo.ownerId))) {
    dto.errCode = 'ownerId_not_number';
    return dto;
  }
  const userTourList: Array<TourDto> = await tourRepository.getUserTours(tourInfo.ownerId);
  const editTour: Array<TourDto> = userTourList.filter((tour: TourDto) => tour.id === Number(tourInfo.tourId));
  if (editTour.length === 0) {
    dto.errCode = 'tour_not_found';
    return dto;
  }

  const options: any = {};
  if (tourInfo.from) {
    if (typeof tourInfo.from !== 'string') {
      dto.errCode = 'from_not_string';
      return dto;
    }
    options.from = tourInfo.from;
  }

  if (tourInfo.to) {
    if (typeof tourInfo.to !== 'string') {
      dto.errCode = 'to_not_string';
      return dto;
    }
    options.to = tourInfo.to;
  }

  if (tourInfo.numberOfSeats) {
    if (!/^([0-9]{1,})$/.test(String(tourInfo.numberOfSeats))) {
      dto.errCode = 'numberOfSeats_not_number';
      return dto;
    }
    options.numberOfSeats = tourInfo.numberOfSeats;
  }

  if (tourInfo.price) {
    if (!/^-?(0|[1-9]\d*)(\.[0-9]{1,})?$/.test(String(tourInfo.price))) {
      dto.errCode = 'price_not_number';
      return dto;
    }
    options.price = Number(tourInfo.price);
  }

  if (tourInfo.dateStart) {
    if (!/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(String(tourInfo.dateStart))) {
      dto.errCode = 'dateStart_not_date';
      return dto;
    }
    options.dateStart = tourInfo.dateStart;
  }

  if (tourInfo.dateEnd) {
    if (!/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(String(tourInfo.dateEnd))) {
      dto.errCode = 'dateEnd_not_date';
      return dto;
    }
    options.dateEnd = tourInfo.dateEnd;
  }
  if (editTour[0].dateEnd === null || editTour[0].dateStart === null) {
    return dto;
  }

  const endDate: Date = new Date(String(tourInfo.dateEnd || editTour[0].dateEnd));
  const startDate: Date = new Date(String(tourInfo.dateStart || editTour[0].dateStart));
  if (startDate > endDate) {
    dto.errCode = 'dateStart_greater_dateEnd';
    return dto;
  }
  if (tourInfo.desc) {
    if (typeof tourInfo.desc !== 'string') {
      dto.errCode = 'desc_not_string';
      return dto;
    }
    options.desc = tourInfo.desc;
  }

  const searchResult = await tourRepository.searchCities(
    options.from ? tourInfo.from : editTour[0].from,
    options.to ? tourInfo.to : editTour[0].to
  );

  if (searchResult.errCode) {
    return searchResult;
  }
  if (options.from) {
    options.fromCode = searchResult.fromCode;
  }
  if (options.to) {
    options.toCode = searchResult.toCode;
  }
  if (Object.keys(options).length === 0) {
    dto.errCode = 'not_edit_data';
    return dto;
  }
  options.id = Number(tourInfo.tourId);

  await tourRepository.updateTour(options);
  return dto;
};

const deleteTour = async (options: { id: Number; ownerId: Number }): Promise<TourDto> => {
  const dto = new TourDto();
  if (!/^([0-9]{1,})$/.test(String(options.id))) {
    dto.errCode = 'tourId_not_number';
    return dto;
  }
  const userTourList: Array<TourDto> = await tourRepository.getUserTours(options.ownerId);
  const editTour: Array<TourDto> = userTourList.filter((tour: TourDto) => tour.id === Number(options.id));

  if (editTour.length === 0) {
    dto.errCode = 'tour_not_found';
    return dto;
  }
  await tourRepository.deleteTour(options.id);
  return dto;
};

const searchTour = async (options: {
  fromCode: String;
  toCode: String;
  dateStart: String;
  dateEnd: String;
  children: Number;
  adults: Number;
}) => {
  if(typeof options.fromCode !== 'string') {

  }
  if (!/^([0-9]{1,})$/.test(String(options.id))) {
    dto.errCode = 'tourId_not_number';
    return dto;
  }
};

export { createTour, searchCitites, editTour, deleteTour, searchTicket, searchTour };
