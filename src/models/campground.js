import mongoose from 'mongoose'
import Review from './review.js'

const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: String,
    filename: String,
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } }

const campgroundSchema = new Schema(
    {
        title: {
            type: String,
        },
        price: {
            type: Number,
            default: 0,
            min: 0,
        },
        images: [imageSchema],
        description: {
            type: String,
        },
        location: {
            type: String,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    opts
)

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a style="text-decoration: none;" href="/campgrounds/${this.id}"><h5>${this.title}</h5><hp>${this.location}</hp></a>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ id: { $in: doc.reviews } })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema)

export default Campground
