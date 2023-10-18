// Creating the map object
let myMap = L.map("map", {
    center: [39.000, -98.000],
    zoom: 5
  });
  
  //Tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  

//set the depth colors
function getColor(depth) {
    if (depth >= 90) {
        return "#500000";
    } else if (depth >= 70) {
        return "#874411";
    } else if (depth >= 50) {
        return "#c99b2c";
    } else if (depth >= 30) {
        return "#eecc4f";
    } else if (depth >= 10) {
        return "#fff444";
    } else if (depth >= -10) {
        return "#98ff0c";
    }
}

//save url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//get info from url
d3.json(url).then(function(data) {
    //displaay for more earthquake information
    data.features.forEach(function(feature) {
        var mag = feature.properties.mag * 6;
        var depth = Math.round(feature.geometry.coordinates[2] * 10000) / 10000;
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];

        L.circleMarker([lat, lng], {
          radius: mag,
          color: getColor(depth),
          fillOpacity: 0.7
        })
        .bindPopup(`<h3>Mag: ${feature.properties.mag}, Depth: ${depth}km, Loc: ${feature.properties.place}</h3>`)
        .addTo(myMap);
    });
    
// create the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var magnitude = [-10, 10, 30, 50, 70, 90];
    
        for (var i=0; i<magnitude.length; i++){
        
        div.innerHTML +=
       "<i style='background: " + getColor(magnitude[i] + 1) + "'></i> " +
       magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
    }   
    return div; 
    };
    
    legend.addTo(myMap);
});