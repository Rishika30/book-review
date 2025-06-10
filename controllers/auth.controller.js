import { config } from '../helpers/env.js';
import User from '../models/user.model.js';
import CustomErrorHandler from '../utils/customErrorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(CustomErrorHandler.alreadyExist('This email is already taken!'));
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRES_IN });
        res.status(201).json({
            message: 'Signup successful',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email
            }
          });
    } catch (err) {
        return next(err);
    }
}

export const logIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        return next(CustomErrorHandler.wrongCredentials());
      }
  
      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
  
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email
        }
      });
    } catch (err) {
      next(err);
    }
};
  