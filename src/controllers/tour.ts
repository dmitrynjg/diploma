import { Response, NextFunction } from 'express';
import { RequestWithPassport } from '../models/user/dto';
import * as tourService from '../services/tour';

interface editData {
  from?: String;
  to?: String;
  price?: Number | String;
  dateStart?: String;
  dateEnd?: String;
  numberOfSeats?: Number | String;
  desc?: String;
  ownerId: Number;
  tourId: Number;
}

const isTourOperator = (req: RequestWithPassport, res: Response, next: NextFunction): any => {
  if (req.user) {
    if (!req.user.isUser) {
      return next();
    }
  }
  return res.status(403).json({ ok: false, message: 'Вы не туроператор' });
};

const createTour = async (req: RequestWithPassport, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { from, to, numberOfSeats, price, dateStart, dateEnd, desc } = req.body;
    const data = await tourService.createTour({
      from,
      to,
      numberOfSeats,
      price,
      dateStart,
      dateEnd,
      desc,
      ownerId: req.isAuthenticated() ? req.user.id : 2,
    });
    return res.send(data);
  } catch (e) {
    return res.sendStatus(500);
  }
};

const editTour = async (req: RequestWithPassport, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { tourId, from, to, numberOfSeats, price, dateStart, dateEnd, desc } = req.body;

    const options: editData = { tourId, ownerId: req.isAuthenticated() ? req.user.id : 2 };
    if (from) {
      options.from = from;
    }
    if (to) {
      options.to = to;
    }
    if (numberOfSeats) {
      options.numberOfSeats = numberOfSeats;
    }
    if (price) {
      options.price = price;
    }
    if (dateStart) {
      options.dateStart = dateStart;
    }
    if (dateEnd) {
      options.dateEnd = dateEnd;
    }
    if (desc) {
      options.desc = desc;
    }

    const result = await tourService.editTour(options);
    return res.send(result);
  } catch (e) {
    return res.sendStatus(500);
  }
};

const deleteTour = async (req: RequestWithPassport, res: Response): Promise<any> => {
  try {
    const { id } = req.body;
    const result = await tourService.deleteTour({ id, ownerId: req.user ? req.user.id : 2 });
    return res.send(result);
  } catch (e) {
    return res.sendStatus(500);
  }
};

const searchTour = async (req: RequestWithPassport, res: Response): Promise<any> => {
  try {
    const { from, to, children, adults, dateStart, dateEnd } = req.body;
    const ticketInfo: any = await tourService.searchTicket({ from, to, children, adults, dateStart, dateEnd });
    if (ticketInfo.errCode) {
      return res.send(ticketInfo);
    }
    tourService.searchTour({ fromCode, toCode, dateStart, dateEnd, children, adults });
    return res.send(ticketInfo);
  } catch (e) {
    return res.sendStatus(500);
  }
};

export { isTourOperator, createTour, editTour, deleteTour, searchTour };
