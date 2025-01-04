import * as Joi from 'joi';

export const createPromoCodeSchema = Joi.object()
  .keys({
    name: Joi.string().required().messages({
      'string.base': 'name має бути рядком',
      'any.required': "name є обов'язковим полем",
    }),
    discount: Joi.number().required().messages({
      'number.base': 'discount має бути числом',
      'any.required': 'start є обов’язковим',
    }),
    start: Joi.date().required().messages({
      'date.base': 'start має бути валідною датою',
      'any.required': 'start є обов’язковим',
    }),
    end: Joi.date().required().messages({
      'date.base': 'start має бути валідною датою',
      'any.required': 'start є обов’язковим',
    }),
    productName: Joi.string().required().messages({
      'string.base': 'productName має бути рядком',
      'any.required': 'productName є обов’язковим',
    }),
    collectionName: Joi.string().required().messages({
      'string.base': 'collectionName має бути рядком',
      'any.required': 'collectionName є обов’язковим',
    }),
    refId: Joi.string().required().messages({
      'string.base': 'refId має бути рядком',
      'any.required': 'refId є обов’язковим',
    }),
  })
  .unknown(false);

export const editPromoCodeSchema = Joi.object()
  .keys({
    name: Joi.string().required().messages({
      'string.base': 'name має бути рядком',
      'any.required': "name є обов'язковим полем",
    }),
    discount: Joi.number().required().messages({
      'number.base': 'discount має бути числом',
      'any.required': 'start є обов’язковим',
    }),
    start: Joi.date().required().messages({
      'date.base': 'start має бути валідною датою',
      'any.required': 'start є обов’язковим',
    }),
    end: Joi.date().required().messages({
      'date.base': 'start має бути валідною датою',
      'any.required': 'start є обов’язковим',
    }),
    // blocked: Joi.boolean().required().messages({
    //   'boolean.base': 'blocked має бути boolean',
    //   'any.required': "blocked є обов'язковим полем",
    // }),
    collectionName: Joi.string().required().messages({
      'string.base': 'collectionName має бути рядком',
      'any.required': 'collectionName є обов’язковим',
    }),
    refId: Joi.string().required().messages({
      'string.base': 'refId має бути рядком',
      'any.required': 'refId є обов’язковим',
    }),
  })
  .unknown(false);
