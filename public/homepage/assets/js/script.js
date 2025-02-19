$("#goto-bottom").on('click', () => {
    const bottomElement = document.getElementById('pilot-section');
    bottomElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // You can use 'end' or 'center' for different scroll alignments
    });
})

let map = null;

let accessToken = 'pk.eyJ1IjoidHJldjkxNSIsImEiOiJjbTZrMDFqcGgwM2x5Mm1uOXI5ZGRhZDc5In0.nNDZwLeLluTeaACdTKhBSQ';

mapboxgl.accessToken = accessToken;

async function getCoordinates(address) {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();
    const coordinates = data.features[0].geometry.coordinates;

    return coordinates; // [longitude, latitude]
}

async function drawCircle(address, radius) {
    const coordinates = await getCoordinates(address); // [longitude, latitude]

    map.addLayer({
        id: 'circle',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                }
            }
        },
        paint: {
            'circle-radius': radius, // Set the radius of the circle in pixels or meters
            'circle-color': '#FF0000', // Circle color
            'circle-opacity': 0.5 // Opacity of the circle
        }
    });
}


function initializeMap() {

    map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [-100, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 4.2, // starting zoom
        scrollZoom: false,
        doubleClickZoom: false
    });

    map.on("load", () => {
        $.get(`http://localhost:8000/api/user/pilots`, (data, status) => {
            data.forEach(pilot => {
                let address = pilot.u_address;
                let radius = pilot.u_operation_radius;

                drawCircle(address, radius);
            });
        })
    })

}

initializeMap();