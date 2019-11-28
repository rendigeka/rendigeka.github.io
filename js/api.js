const league_id = 2021;
const token = '5bc97521e19d46ea8cfddc40cfbdfde7';

var base_url = "https://api.football-data.org/v2/";
var teams_url = `${base_url}competitions/${league_id}/teams`;
var standing_url = `${base_url}competitions/${league_id}/standings`;
var teamData;

var fetchApi = url => {
  return fetch(url, { headers: {'X-Auth-Token': token }});
}

var status = response => {
  if (response.status !== 200) {
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

var json = response => {
  return response.json();
}

var error = error => {
  console.log("Error: " + error);
}

function getStanding() {
  if ('caches' in window) {
    caches.match(standing_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          standingTeams(data);
        });
      }
    });
  }
  fetchApi(standing_url)
    .then(status)
    .then(json)
    .then(function(data) {
      standingTeams(data);
    })
  .catch(error);
}

function getAllTeams() {
  if ('caches' in window) {
    caches.match(teams_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          allTeams(data);
        });
      }
    });
  }
  fetchApi(teams_url)
    .then(status)
    .then(json)
    .then(function(data) {
      allTeams(data);
    })
  .catch(error);
}
