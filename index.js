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

function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $("#results-list").append(
      `<li><h3>${responseJson.data[i].fullName}, ${responseJson.data[i].states}</h3>
      <p>${responseJson.data[i].designation}</p>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
      </li>`
    )};
  $("#results").removeClass("hidden");
}

function getParkDetails(newState, limit=10) {

  const NpsParams = {
    api_key: NpsApiKey,
    stateCode: newState,
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