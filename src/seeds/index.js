import mongoose from 'mongoose'
import Campground from '../models/campground.js'
import cities from './cities.js'
import { descriptors, places } from './seedHelpers.js'
import { LoremIpsum } from 'lorem-ipsum'
import axios from 'axios'

await mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')

const db = mongoose.connection
db.on('error', console.error.bind(console), 'connection error:')
db.once('open', () => {
    console.log('Database connected')
})

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4,
    },
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
})

const images = [
    {
        url: 'https://res.cloudinary.com/dkjmemmum/image/upload/v1643201177/YelpCamp/fycnphlypaa9pqqudyps.png',
        filename: 'fycnphlypaa9pqqudyps',
    },
    {
        url: 'https://res.cloudinary.com/dkjmemmum/image/upload/v1643201177/YelpCamp/omgxvfm6hjh2q6ditgwo.jpg',
        filename: 'omgxvfm6hjh2q6ditgwo',
    },
    {
        url: 'https://res.cloudinary.com/dkjmemmum/image/upload/v1643201177/YelpCamp/cqmdhwthqyc0fzctmei0.jpg',
        filename: 'cqmdhwthqyc0fzctmei0',
    },
    {
        url: 'https://res.cloudinary.com/dkjmemmum/image/upload/v1643201177/YelpCamp/cjshgnggjkmbbquvycbf.jpg',
        filename: 'cjshgnggjkmbbquvycbf',
    },
    {
        url: 'https://res.cloudinary.com/dkjmemmum/image/upload/v1643201177/YelpCamp/gynsdqgkcuud5seme1dr.jpg',
        filename: 'gynsdqgkcuud5seme1dr',
    },
    {
        url: 'https://res.cloudinary.com/dkjmemmum/image/upload/v1643201177/YelpCamp/cjgtv3asylvcjlqrjlxz.jpg',
        filename: 'cjgtv3asylvcjlqrjlxz',
    },
]

// let lastIndex
// const getRandNum = function () {
//     const n = Math.floor(Math.random() * images.length)
//     if (n === lastIndex) {
//         return getRandNum()
//     }
//     return n
// }

// const getRandImageIndex = function () {
//     const index = getRandNum()
//     lastIndex = index
//     return index
// }

const seedDB = async function () {
    await Campground.deleteMany({})

    const random = arr => Math.floor(Math.random() * arr.length)

    for (let i = 0; i < 300; i++) {
        const el = cities[random(cities)]
        const price = Math.floor(Math.random() * 20) + 10

        const newCamp = new Campground({
            title: `${descriptors[random(descriptors)]} ${places[random(places)]}`,
            images,
            price,
            author: '61eecfad0dc73c4b438686ee',
            description: lorem.generateSentences(2),
            location: `${el.city}, ${el.state}`,
            geometry: { type: 'Point', coordinates: [el.longitude, el.latitude] },
        })

        await newCamp.save()
    }
}

seedDB().then(() => {
    db.close()
})
