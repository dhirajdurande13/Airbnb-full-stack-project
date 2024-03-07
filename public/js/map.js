
    // pahle show.js run hogi usme env varible set honge js main baad main niche ki script map.js access hogi
    // let mapToken= mapToken;
    // console.log(mapToken);
	mapboxgl.accessToken = mapToken;//use mapbox token in the .env file not in the script which is already defined  
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12',
        // center: [73.8567, 18.5204], // starting position [lng, lat]
        center: listing.geomatry.coordinates, // starting position [lng, lat]
        zoom: 8 // starting zoom
    });

     // Create a default Marker and add it to the map.
    //  console.log(coordinates);
    // we can add also multiple markers
     const marker = new mapboxgl.Marker({color: 'red'})
     .setPopup(new mapboxgl.Popup({offset: 25})
     .setHTML(`<h5>${listing.title}</h5><p>Exact location provided after booking!</p>`))
     .setLngLat(listing.geomatry.coordinates)//listing.geomatry.coordinatres
     .addTo(map);

// adding an icon

// map.on('load', () => {
//     // Load an image from an external URL.
//     map.loadImage(
//         'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
//         (error, image) => {
//             if (error) throw error;

//             // Add the image to the map style.
//             map.addImage('cat', image);

//             // Add a data source containing one point feature.
//             map.addSource('point', {
//                 'type': 'geojson',
//                 'data': {
//                     'type': 'FeatureCollection',
//                     'features': [
//                         {
//                             'type': 'Feature',
//                             'geometry': {
//                                 'type': 'Point',
//                                 'coordinates': listing.geomatry.coordinates
//                             }
//                         }
//                     ]
//                 }
//             })
//         })
//     })
