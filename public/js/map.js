import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.19.0/dist/maplibre-gl.mjs';

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: coordinates,
    zoom: 12
});

console.log(coordinates);

map.on('load', () => {
    // Create marker element
    const marker = new maplibregl.Marker({
        color: '#2563EB',
        anchor: 'bottom',
        offset: [0, -5]
    })
        .setLngLat(coordinates)
        .addTo(map);

    // Create popup
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 30
    }).setHTML(`
        <h3>Exact location provided after booking.</h3>
    `);

    // Show popup on hover
    marker.getElement().addEventListener('mouseenter', () => {
        marker.setPopup(popup);
        marker.togglePopup();
    });

    // Hide popup when mouse leaves
    marker.getElement().addEventListener('mouseleave', () => {
        marker.togglePopup();
    });
});