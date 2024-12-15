import * as Joi from 'joi';

export const newMeditationSchema = Joi.object()
  .keys({
    category: Joi.string().valid('OPENED', 'CLOSED', 'ARCANES').required(),
    name: Joi.object().keys({
      ru: Joi.string(),
      uk: Joi.string(),
    }),
    isWaiting: Joi.bool(),
    description: Joi.object().keys({
      ru: Joi.string(),
      uk: Joi.string(),
    }),
    video: Joi.string(),
    cover: Joi.string().optional(),
    price: Joi.number(),
    status: Joi.string().valid('DRAFT', 'HIDDEN', 'PUBLISHED').required(),
    discount: Joi.object().optional(),
  })
  .unknown(false);

export const updateMeditationSchema = Joi.object()
  .keys({
    category: Joi.string().valid('OPENED', 'CLOSED', 'ARCANES').required(),
    name: Joi.object()
      .keys({
        ru: Joi.string().required(),
        uk: Joi.string().required(),
      })
      .required(),
    isWaiting: Joi.bool().required(),
    description: Joi.object()
      .keys({
        ru: Joi.string().required(),
        uk: Joi.string().required(),
      })
      .required(),
    video: Joi.string().required(),
    cover: Joi.string().required(),
    price: Joi.string().required(),
    status: Joi.string().valid('DRAFT', 'HIDDEN', 'PUBLISHED').required(),
    discount: Joi.object().optional(),
  })
  .unknown(false);

export const changeStatusMeditationSchema = Joi.object()
  .keys({
    status: Joi.string().valid('DRAFT', 'HIDDEN', 'PUBLISHED').required(),
  })
  .unknown(false);
