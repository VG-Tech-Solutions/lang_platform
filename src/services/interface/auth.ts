import { Request, Response, RequestHandler } from 'express';

export interface authController {
    login: RequestHandler;
}