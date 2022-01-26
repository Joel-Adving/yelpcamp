import BaseJoi from 'joi'
import sanitizeHtml from 'sanitize-html'

const extension = joi => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!',
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttribues: {},
                })
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            },
        },
    },
})

const Joi = BaseJoi.extend(extension)

export const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.array().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.any(),
})

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required(),
})
