/*// Google Places API 
var GOOGLE_MAP_KEY = config.apiKey;

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
      '&key=' + GOOGLE_MAP_KEY +'&callback=initialize'; 
  document.body.appendChild(script);
}
window.onload = loadScript;*/

var map;
var infoWindow;
var request = {
    types: ['bakery|', 'cafe|', 'meal_delivery|', 'meal_takeaway|','restaurant']
}
var service;
var markers = [];
var randomPlace;

var priceSlider;

var circle;
var center = new google.maps.LatLng(37.42, -122,084058);
var radiusSlider;
var currentRadius;

var circleRadius;

function initialize(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 11
    });

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            center = new google.maps.LatLng(pos.lat, pos.lng);
            infoWindow.setPosition(pos);
            map.setCenter(pos);

            circle = new google.maps.Circle({
                strokeColor: '#FF9900',
                strokeOpacity: 0.8,
                fillColor: '#FF9900',
                fillOpacity: 0.35,
                map: map, 
                center: center,
                radius: 6500, 
                zindex: 100
            });
        }, function(){
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else{
        handleLocationError(false, infoWindow, map.getCenter());
    }

    infoWindow = new google.maps.InfoWindow();

    //Add listener to click on to change center for search
    google.maps.event.addListener(map, "click", function (event) {
        clearResults(markers);

        var pos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        center = new google.maps.LatLng(pos.lat, pos.lng);
        infoWindow.setPosition(pos);
        map.setCenter(pos);

        redrawCircle();
    }); 
}

function callback(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        //console.log(results);
        for(var i = 0; i < results.length; i++){
            markers.push(createMarker(results[i]));
        }
        randomPlace = getRandom(results);
        markers.push(createSpecialMarker(randomPlace));
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function toggleKeywords(source) {
    checkboxes = document.getElementsByName('keyword');
    for(var i = 0, n = checkboxes.length; i <n ; i++) {
      checkboxes[i].checked = source.checked;
    }
}

function createMarker(place){
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
    return marker;
}

function createSpecialMarker(place){
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        label: '!',
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
    return marker;
}

function clearResults(markers){
    for (var m in markers) {
        markers[m].setMap(null);
    }
    markers = []
}

function searchNow(){
    clearResults(markers)

    var priceRange = priceSlider.getValue();

    request = {
        keyword: getKeywords(),
        minPriceLevel: priceRange[0],
        maxPriceLevel: priceRange[1],
        location: map.center,
        opening_hours: {
            isOpen: openNow()
        },
        radius: radiusSlider.getValue(),
        types: ["restaurant|", "food|", "meal_delivery|", "meal_takeaway|", "cafe"]
    };
    //console.log(request.radius);
    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    google.maps.event.addListener(map, 'rightclick', function(event){
        map.setCenter(event.latLng)
        clearResults(markers)
        request.location = map.center;
        service.nearbySearch(request, callback);
    })
}


function getKeywords(){
    var keywordsArray = [];
    var checkboxes = document.querySelectorAll('input[name="keyword"][type=checkbox]:checked');

    for(var i = 0; i < checkboxes.length; i++){
        keywordsArray.push(checkboxes[i].value+"|");
    }
    return keywordsArray;
}

function openNow(){
    var isOpen = false;
    var radio = document.querySelector('input[name="isOpen"]:checked').value;
    
    if (radio == "yes"){
        isOpen = true;
    }
    return isOpen;
}

function redrawCircle(){
    document.getElementById("radiusSliderVal").textContent = radiusSlider.getValue();
    circle.setMap(null);
    circle = new google.maps.Circle({
        strokeColor: '#FF9900',
        strokeOpacity: 0.8,
        fillColor: '#FF9900',
        fillOpacity: 0.35,
        map: map, 
        center: center,
        radius: radiusSlider.getValue(), 
        zindex: 100
    });    
}

function getRandom(results){
    var randomResult = results[Math.floor(Math.random()*results.length)];
    document.getElementById("resultName").style.display = "block";
    document.getElementById('resultName').innerHTML = randomResult.name;
    document.getElementById("resultAddress").style.display = "block";
    document.getElementById('resultAddress').innerHTML = randomResult.vicinity;

    document.getElementById("resultGoogleMaps").style.display = "block";
    var newlink = "https://www.google.com/maps/search/?api=1&query="+ randomResult.name +
    "&query_place_id=" + randomResult.place_id;
    var link = document.getElementById("resultGoogleMaps");
    link.setAttribute("href", newlink);

    return randomResult;
}

google.maps.event.addDomListener(window, 'load', initialize);

document.addEventListener("DOMContentLoaded", function() {
    priceSlider = new Slider('#priceSlider', {});

    radiusSlider = new Slider('#radiusSlider', {
        tooltip: 'always'})
        .on('slide', redrawCircle);
}, false);


// TODO: Add marker to map center??
// TODO: No result found
// TODO: Only delivery + links to Rappi/Uber Eats, etc
// TODO: Improve UI
// TODO: Ads??
// TODO: Share to social media buttons
