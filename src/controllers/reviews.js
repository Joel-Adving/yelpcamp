import Campground from '../models/campground.js'
import Review from '../models/review.js'

const reviews = () => {
    ///////////////////
    const createReview = async (req, res) => {
        const review = await new Review({
            ...req.body.review,
            author: req.user._id,
        })
        const campground = await Campground.findById(req.params.id).populate('reviews')
        if (campground.reviews.some(rev => rev.author.equals(req.user._id))) {
            req.flash('error', 'Reviews are limited to one per campground.')
            return res.redirect(`/campgrounds/${campground.id}`)
        }
        campground.reviews.push(review)
        await Promise.all([review.save(), campground.save()])
        req.flash('success', 'Successfully added review!')
        res.redirect(`/campgrounds/${campground.id}`)
    }

    const deleteReview = async (req, res) => {
        const { id, reviewid } = req.params
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewid },
        })
        await Review.findByIdAndDelete(reviewid)
        req.flash('success', 'Successfully deleted review!')
        res.redirect(`/campgrounds/${id}`)
    }

    return {
        createReview,
        deleteReview,
    }
}

export default reviews
