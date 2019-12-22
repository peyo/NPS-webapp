"use strict";

const NpsApiKey = "9WM6xhhATZ9TowDYuhGGFiB5nRGPLcRtSKCbc9MZ";
const NpsSearchURL = "https://developer.nps.gov/api/v1/parks";
const GoogleApiKey = "AIzaSyDWl7qyVdWeTZeOUmsVpBXM9rQcS9kFbRw";
const GoogleGeocodeURL = "https://maps.googleapis.com/maps/api/geocode/json";

function formatQueryParams(params) {
    const QueryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return QueryItems.join("&");
}

//displays results of responseJson data in the DOM.
//provides info of the park
function displayResults(responseJson) {
     $("#results-list").empty();
     for (let i = 0; i < responseJson.data.length; i++){
         $("#results-list").append(
        `<li><h3>${responseJson.data[i].fullName}, ${responseJson.data[i].states}</h3>
         <p>${responseJson.data[i].designation}</p>
         <p>${responseJson.data[i].description}</p>
         <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
         <p id="address-${i}"></p>`
         )};
     $("#results").removeClass("hidden");

    convertLatLong(responseJson);
}

//takes inputed data from the DOM and adds to NPS endpoint
//to fetch data from NPS API
function getParkDetails(state, limit=10) {
    const NpsParams = {
        api_key: NpsApiKey,
        stateCode: state,
        limit
    };
    
    const NpsQueryString = formatQueryParams(NpsParams)
    const NpsUrl = NpsSearchURL + "?" + NpsQueryString;
    
    fetch(NpsUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        $("#js-error-message").text(`Something went wrong with the NPS API: ${err.message}`);
    });
}

//takes lat long data from NPS response and
//changes the syntax to be applicable to Google Geocode API parameters
//then fetches response from Google Geocode API
function convertLatLong(responseJson) {   
    const LatLongList = [];
    for (let i = 0; i < responseJson.data.length; i++){
        LatLongList.push(`${responseJson.data[i].latLong}`);
    }

    let newLatLongList = LatLongList;
    for (let i = 0; i < LatLongList.length; i++){
        newLatLongList[i] = LatLongList[i].replace(/ |lat:|long:/g, "")
    }
    
    let newNewLatLongList = newLatLongList;
    newNewLatLongList = Array.from(newNewLatLongList, item => item || "0,0");

    const GoogleParams = {
        key: GoogleApiKey,
    };
    
    const GoogleQueryString = formatQueryParams(GoogleParams);
    const GeocodeUrl = GoogleGeocodeURL + "?" + GoogleQueryString;
    
    const UrlWithLatLongList = [];
    for (let i = 0; i < newNewLatLongList.length; i++){
        const UrlWithLL = GeocodeUrl + "&latlng=" + newNewLatLongList[i];
        UrlWithLatLongList.push(UrlWithLL);
    }
    
    for (let i = 0; i < UrlWithLatLongList.length; i++){
        fetch(UrlWithLatLongList[i])
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => formatAddress(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong with the Google Geocode API: ${err.message}`);
        });
    }
}

//takes response from Google Geocode API
//then concats all addresses in global array as 'merged'
const formattedAddresses = [];
function formatAddress(address) {
    if(address.results[0] === undefined) {
        formattedAddresses.push("No address found.")
    } else {
        formattedAddresses.push(address.results[1].formatted_address)
    }
    let merged = [].concat.apply([], formattedAddresses);
    addAddress(merged)
}

//takes merged addresses and
//adds them to the appropriate place in DOM 
function addAddress(merged) {
    for (let i = 0; i < merged.length; i++){
            $(`#address-${i}`).html(merged[i]);
    }
}

function watchForm() {
    $("form").submit(event => {
      event.preventDefault();
      const state = $("#js-state-searches").val();
      const limit = $("#js-max-results").val();
      
      let newState = state;
      newState = state.replace(/\s/g, "");
      getParkDetails(newState, limit);
    });
  }

$(watchForm);