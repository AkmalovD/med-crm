import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  CORS_ORIGIN: Joi.string().uri().required(),
});
