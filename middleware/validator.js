import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((detail) => detail.message)
      });
    }

    next();
  };
};

export const signupSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const addBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  genre: Joi.string().required()
});