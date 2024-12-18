import * as Joi from 'joi';

export const newMeditationSchema = Joi.object()
  .keys({
    category: Joi.string().valid('OPENED', 'CLOSED', 'ARCANES').required(),
    name: Joi.object()
      .keys({
        ru: Joi.string().optional(),
        uk: Joi.string().optional(),
      })
      .optional(),
    isWaiting: Joi.bool(),
    description: Joi.object()
      .keys({
        ru: Joi.string().optional(),
        uk: Joi.string().optional(),
      })
      .optional(),
    video: Joi.string().optional(),
    cover: Joi.string().optional(),
    price: Joi.number().optional(),
    status: Joi.string().valid('DRAFT', 'HIDDEN', 'PUBLISHED').required(),
    discount: Joi.object().optional(),
  })
  .unknown(false);

export const updateMeditationSchema = Joi.object()
  .keys({
    category: Joi.string().valid('OPENED', 'CLOSED', 'ARCANES').required(),
    name: Joi.object()
      .keys({
        ru: Joi.string().optional(),
        uk: Joi.string().optional(),
      })
      .optional(),
    isWaiting: Joi.bool().optional(),
    description: Joi.object()
      .keys({
        ru: Joi.string().required(),
        uk: Joi.string().required(),
      })
      .optional(),
    video: Joi.string().optional(),
    cover: Joi.string().optional(),
    price: Joi.number().optional(),
    status: Joi.string().valid('DRAFT', 'HIDDEN', 'PUBLISHED').required(),
    discount: Joi.object().optional(),
  })
  .unknown(false);

export const changeStatusMeditationSchema = Joi.object()
  .keys({
    status: Joi.string().valid('DRAFT', 'HIDDEN', 'PUBLISHED').required(),
  })
  .unknown(false);
