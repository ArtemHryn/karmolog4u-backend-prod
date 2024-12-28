import * as Joi from 'joi';

export const ProductArrayValidationSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .required()
        .description('Id of the product (MongoDB ObjectId)')
        .example('6744d2c8bd8f6d722ff28c49')
        .messages({
          'any.required': "id є обов'язковим полем",
          'string.base': 'id має бути рядком',
          'string.empty': 'id не може бути порожнім',
        }),
      collection: Joi.string()
        .valid('webinars', 'meditations', 'guidesAndBooks') // Замініть на допустимі значення для вашої колекції
        .required()
        .description('Collection of the product')
        .example('webinars')
        .messages({
          'any.required': "collection є обов'язковим полем",
          'string.base': 'collection має бути рядком',
          'string.empty': 'collection не може бути порожнім',
          'any.only':
            'collection має бути одним з таких значень: webinars, meditations, guidesAndBooks',
        }),
    }),
  )
  .min(1)
  .required();
