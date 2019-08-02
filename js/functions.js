var map;
var infoWindow;
var request = {
    types: ['bakery|', 'cafe|', 'meal_delivery|', 'meal_takeaway|','restaurant']
}
var service;
var markers = [];

var center = new google.maps.LatLng(37.42, -122,084058);

function initialize(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13
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
        }, function(){
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else{
        handleLocationError(false, infoWindow, map.getCenter());
    }

    request = {
        keyword: 'italian',
        location: center,
        radius: 8047
    };

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    // google.maps.event.addListener(map, 'rightclick', function(event){
    //     map.setCenter(event.latLng)
    //     clearResults(markers)
    //     var request = {
    //         location: event.latLng,
    //         radius: 8047,
    //         types: ['cafe']
    //     };
    //     service.nearbySearch(request, callback);
    // })
}

function callback(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        //console.log(results);
        for(var i = 0; i < results.length; i++){
            markers.push(createMarker(results[i]));
        }
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
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

function clearResults(markers){
    for (var m in markers) {
        markers[m].setMap(null);
    }
    markers = []
}


function sub1(){
    clearResults(markers)
    // getPricing();
    // if price is checked
    // include refinement by price

    request = {
        keyword: getKeywords(),
        location: center,
        radius: 8047,
        //types: ['bakery|', 'cafe|', 'meal_delivery|', 'meal_takeaway|','restaurant']
        types: ["restaurant|", "food|", "point_of_interest|", "establishment|", "meal_delivery|", "meal_takeaway|", "cafe"]
    };
    //console.log(request);

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
        console.log(keywordsArray[i]);
    }
    return keywordsArray;
}

function getPriceLevel(){
    var pricesArray = [];
    var checkboxes = document.querySelectorAll('input[name="pricing"][type=checkbox]:checked');

    for(var i = 0; i < checkboxes.length; i++){
        pricesArray.push(checkboxes[i].value);
    }
}

google.maps.event.addDomListener(window, 'load', initialize);