import jwt from 'jsonwebtoken';
import { config } from '../helpers/env.js'; 
import User from "../models/user.model.js";
import CustomErrorHandler from '../utils/customErrorHandler.js';

export const authenticate = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            return next(CustomErrorHandler.unAuthorized());
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.userId);
       
        if(!user) {
            return next(CustomErrorHandler.unAuthorized());
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}