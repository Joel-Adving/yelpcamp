import Campground from '../models/campground.js'
import cloudinary from '../cloudinary/index.js'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'

const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken })

const campgrounds = () => {
    ///////////////////////
    const index = async (req, res, next) => {
        const campgrounds = await Campground.find({})

        res.render('campgrounds/index', { campgrounds })
    }

    const renderNewForm = async (_, res) => {
        res.render(`campgrounds/new`)
    }

    const renderCampground = async (req, res, next) => {
        const { id } = req.params
        const campground = await Campground.findById(id).populate('reviews').populate('author')
        await campground.populate('reviews.author')
        console.log(campground)
        if (!campground) {
            req.flash('error', 'Cannot find that campground')
            return res.redirect('/campgrounds')
        }

        res.render('campgrounds/show', { campground })
    }

    const createCampground = async (req, res, next) => {
        const geoData = await geoCoder
            .forwardGeocode({
                query: req.body.campground.location,
                limit: 1,
            })
            .send()

        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename.split('/')[1],
        }))
        const campground = await new Campground({
            ...req.body.campground,
            geometry: geoData.body.features[0].geometry,
            images,
            author: req.user._id,
        })
        await campground.save()
        // campground.location = geoData.body.features.place_name

        req.flash('success', 'Succesfully created a new campground!')
        res.redirect(`/campgrounds/${campground.id}`)
    }

    const editCampground = async (req, res, next) => {
        const { id } = req.params
        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename.split('/')[1],
        }))
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
        campground.images.push(...images)
        await campground.save()

        if (req.body.deleteImages) {
            const { deleteImages } = req.body
            if (typeof deleteImages === 'object') {
                deleteImages.forEach(async filename => {
                    await Campground.findByIdAndUpdate(id, {
                        $pull: { images: { filename: filename } },
                    })
                    await cloudinary.uploader.destroy(`YelpCamp/${filename}`)
                })
            }
            if (typeof deleteImages === 'string') {
                await Campground.findByIdAndUpdate(id, {
                    $pull: { images: { filename: deleteImages } },
                })
                await cloudinary.uploader.destroy(`YelpCamp/${deleteImages}`)
            }
        }

        if (!campground) {
            req.flash('error', 'Cannot find that campground')
            return res.redirect('/campgrounds')
        }
        res.redirect(`/campgrounds/${id}`)
    }

    const renderEditForm = async (req, res, next) => {
        const campground = await Campground.findById(req.params.id)
        res.render(`campgrounds/edit`, { campground })
    }

    const deleteCampground = async (req, res, next) => {
        await Campground.findByIdAndDelete(req.params.id)
        req.flash('success', 'Successfully deleted campground')
        return res.redirect('/campgrounds')
    }

    return {
        index,
        createCampground,
        editCampground,
        deleteCampground,
        renderNewForm,
        renderCampground,
        renderEditForm,
    }
}

export default campgrounds
