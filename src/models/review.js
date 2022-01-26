import mongoose from 'mongoose'
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: { type: String, required: [true, 'Body cannot be empty.'] },
    rating: { type: Number, required: [true, 'PLease specify rating between 1 and 5.'] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const Review = mongoose.model('Review', reviewSchema)

export default Review
