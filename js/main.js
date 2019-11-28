function standingTeams(data) {
  var html = '';
  var content = '';
  var str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);
  data.standings[0].table.forEach(function(team){
    content += `
    <tr>
    <td>${team.position}</td>
    <td style="text-align: left">${team.team.name}</td>
    <td>${team.playedGames}</td>
    <td>${team.won}</td>
    <td>${team.draw}</td>
    <td>${team.lost}</td>
    <td>${team.goalsFor}</td>
    <td>${team.goalsAgainst}</td>
    <td>${team.goalDifference}</td>
    <td><strong>${team.points}</strong></td>
    </tr>`;
  })
  html += `
  <div class="card">
    <table class="responsive-table striped">
    <thead>
      <tr>
      <th>Posisi</th>
      <th>Tim</th>
      <th>Main</th>
      <th>Menang</th>
      <th>Imbang</th>
      <th>Kalah</th>
      <th>GM</th>
      <th>GK</th>
      <th>Selisih</th>
      <th>Poin</th>
      </tr>
    </thead>
    <tbody>`+ content +`</tbody>
    </table>
  </div>`
  document.getElementById("header-title").innerHTML = "Klasemen Liga";
  document.getElementById("main-content").innerHTML = html;
};

function allTeams(data) {
  var html = `<div class="row">`;
  var str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);
  teamData = data;

  for (team of data.teams) {

    html += `
    <div class="col s12 m6">
    <div class="card">
    <div class="card-content">
      <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
      <div class="center flow-text">${team.name}</div>
      <div class="center">${team.area.name}</div>
      <div class="center">${team.founded}</div>
      <div class="center">${team.venue}</div>
      <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
    </div>
    <div class="card-action right-align">
      <a class="waves-effect waves-light btn-small green" id="${team.id}" onclick="insertTeamListener(${team.id})">
        <i class="material-icons left">star</i>Favorit</a>
    </div>
    </div>
    </div>`
  }
  document.getElementById("header-title").innerHTML = "Tim";
  document.getElementById("main-content").innerHTML = html;

  var dataDB = getFavTeams();
  dataDB.then(data => {
    for (team of data) {
      document.getElementById(team.id).classList.add("disabled");
      document.getElementById(team.id).innerHTML = `<i class="material-icons left">star</i>Favorit Anda`;
    }
  });
};
 
var dbPromise = idb.open('pwa2-teams', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
  }
});

function getFavTeams() {
  return dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readonly');
    var store = tx.objectStore('teams');
    return store.getAll();
  })
}

function getFavoriteTeams() {
  var dataDB = getFavTeams();
  dataDB.then(function(data){
    var html = `<div class="row">`;
    data.forEach(function(team){
      html += `
      <div class="col s12 m6">
      <div class="card">
      <div class="card-content">
        <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
        <div class="center flow-text">${team.name}</div>
        <div class="center">${team.area.name}</div>
        <div class="center">${team.founded}</div>
        <div class="center">${team.venue}</div>
        <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
      </div>
      <div class="card-action right-align">
        <a class="waves-effect waves-light btn-small red" onclick="deleteTeamListener(${team.id})">
          <i class="material-icons left">delete</i>Hapus</a>
      </div>
      </div>
      </div>`;
    });

    if(data.length == 0) html += '<h6 class="center-align">Kosong</h6>'
    document.getElementById("header-title").innerHTML = "Favorit Tim";
    document.getElementById("main-content").innerHTML = html;
  });
}

var insertTeamListener = teamId => {
  var team = teamData.teams.filter(el => el.id == teamId)[0]
  insertTeam(team);
  console.log("[Info] " + teamId + " ditambah ke favorit")
  document.getElementById(teamId).classList.add("disabled");
  document.getElementById(teamId).innerHTML += " Anda";
}

function insertTeam(team) {
  dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    store.put(team)
    return tx.complete;
  }).then(function() {
    M.toast({ html: `${team.name} berhasil disimpan!`})
  }).catch(err => {
    console.error('Error', err);
  });
}

var deleteTeamListener = teamId => {
  const confirma = confirm("Hapus dari favorit?")
  if (confirma == true) {
    deleteTeam(teamId);
    console.log("[Info] " + teamId + " dihapus dari favorit")
  }
}

function deleteTeam(teamId) {
  dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;
  }).then(function() {
    M.toast({ html: `Tim berhasil dihapus`});
    // if (Notification.permission === 'granted') {
    //    navigator.serviceWorker.ready.then(function(registration) {
    //      registration.showNotification("Tim berhasil dihapus");
    //    });
      
    // } else {
    //     console.error('Fitur notifikasi tidak diijinkan');
    // }
    getFavoriteTeams();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

if (!('serviceWorker' in navigator)) {
  console.log("[Service-Worker] tidak didukung browser ini");
} else {
  registerServiceWorker();
  requestPermission();
}

function registerServiceWorker() {
  return navigator.serviceWorker.register('sw.js')
    .then(function (registration) {
      console.log('[Service-Worker] registrasi berhasil');
      return registration;
    })
    .then()
    .catch(function (err) {
      console.error('[Service-Worker] registrasi gagal', err);
    });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function(result) {
      if (result === "denied") {
        console.log("[Notification] tidak diijinkan");
        return;
      } else if (result === "default") {
        console.log("[Notification] Pengguna menutup kotak dialog permintaan ijin");
        return;
      }
      console.log('[Notification] diizinkan');

      if (('PushManager' in window)) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                'BDOQW5ma2xkJAJ-cADQM7dGutGrdF6p8rphX0dgsFG5X82Kf04VR6mLn45NRIqBwQz4fFeyQn87XDHjsRDOip2U')
            }).then(function(subscribe) {
              console.log('[Subscribe] berhasil dengan endpoint: ', subscribe.endpoint);
              console.log('[Subscribe] berhasil dengan p256dh key: ', btoa(String.fromCharCode.apply(
                null, new Uint8Array(subscribe.getKey('p256dh')))));
              console.log('[Subscribe] berhasil dengan auth key: ', btoa(String.fromCharCode.apply(
                null, new Uint8Array(subscribe.getKey('auth')))));
            }).catch(function(e) {
              console.log('[Subscribe] gagal (perlu reload)');
            });
        });
      }
    });
  }
}