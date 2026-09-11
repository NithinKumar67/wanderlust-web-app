const mapElement = document.getElementById('map');

const maptoken = mapElement.dataset.token;
const coordinates = JSON.parse(mapElement.dataset.coordinates);

const listingLocation = mapElement.dataset.location;
const country = mapElement.dataset.country;
const title = mapElement.dataset.title;

const map = new mapboxgl.Map({
    accessToken: maptoken,
    container: 'map',
    center: coordinates,
    zoom: 9
});

new mapboxgl.Marker({color: 'red'})
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
                <h5>${title}</h5>
                <p>${listingLocation}, ${country}</p>
                <p>Enjoy your stay at this beautiful destination!</p>
            `)
    )
    .addTo(map);