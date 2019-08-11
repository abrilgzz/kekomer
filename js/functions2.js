var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?";
var apiKey = "3A-ZsVHEZZnbToAWkcwOIM_h8DdSJT-pq4RAQLChitYjfp8ICX8Mr80W1-uwQbf3bojtE3iffbTRslDoZfCh35uijFPivpnVRUd6GgzRcqhrRTpWE_d_sA3092NPXXYx" 

var myLatitude;
var myLongitude;

getLocation();

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      
    } else { 
      alert("Geolocation is not supported by this browser.");
    }
  }

function showPosition(position) {
    myLatitude = position.coords.latitude;
    myLongitude = position.coords.longitude;
    console.log(myLatitude, myLongitude);
}

$(document).ready(function() {
    $("#button2").click(function(e){
        e.preventDefault();
        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin":"*",
                "Authorization": `Bearer ${apiKey}`
            },
            data: {
                "term": "restaurants",
                "latitude": myLatitude,
                "longitude": myLongitude,
                "categories": getCategories(),
                "price": getPriceLevel(),
                "open_now": openNow()
            }
        }).then(function(res) {
            console.log(res);
            getRandomYelp(res.businesses);
        });
    });
});

function getCategories(){
    var categoriesArray = [];
    var checkboxes = document.querySelectorAll('input[name="category"][type=checkbox]:checked');
    
    if (checkboxes.length == 0)
        return [];

    for(var i = 0; i < checkboxes.length; i++){
        categoriesArray.push(checkboxes[i].value);
    }

    return categoriesArray.join();
}

function getPriceLevel(){
    var pricesArray = [];
    var checkboxes = document.querySelectorAll('input[name="pricing"][type=checkbox]:checked');

    if (checkboxes.length == 0)
        return [];

    for(var i = 0; i < checkboxes.length; i++){
        pricesArray.push(checkboxes[i].value);
    }

    return pricesArray.join();
}

function openNow(){
    if (document.getElementById('openNow').checked){
        return true
    }
    else{
        return false;
    }
}

function getRandomYelp(results){
    var randomResult = results[Math.floor(Math.random()*results.length)];
    console.log("randomResult: ", randomResult.name);
    console.log("randomResult address: ", randomResult.location.address1);
    document.getElementById('resultName').innerHTML = randomResult.name;
    document.getElementById('resultAddress').innerHTML = randomResult.location.address1;
    
}

function getDistance(){

}

// $.ajax({
//     url: queryURL,
//     method: "GET",
//     headers: {
//         "accept": "application/json",
//         "x-requested-with": "xmlhttprequest",
//         "Access-Control-Allow-Origin":"*",
//         "Authorization": `Bearer ${apiKey}`
//     },
//     data: {
//         "term": "restaurants",
//         "latitude": 25.575,
//         "longitude": -100.23
//     }
// }).then(function(res) {
//     var results = res.data
//     console.log(res);
// });



// function isClosed(){
//     var isClosed = true;
//     var radio = document.querySelector('input[name="isClosed"]:checked').value;
    
//     if (radio == "no"){
//         isClosed = false;
//     }
// }