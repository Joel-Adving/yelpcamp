mapboxgl.accessToken = mapBoxToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
})

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${campground.title}</h5>
        <p>${campground.location}</p>`
        )
    )
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl())
