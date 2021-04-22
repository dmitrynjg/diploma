import { Request } from "express";

export interface RequestWithPassport extends Request {
  user?: {
    id: number,
    name: string,
    email: string,
    isUser: boolean;
  },
}