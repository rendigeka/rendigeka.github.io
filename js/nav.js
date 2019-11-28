document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems, {edge: 'right'});
  loadNav();

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
  
            var sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      }
    };

    xhttp.open("GET", "asset/nav.html", true);
    xhttp.send();
  }

  var page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage(page);
  
  function loadPage(page) {
    if(page == 'home') getStanding()
    if(page == 'teams') getAllTeams()
    if(page == 'fav-teams') getFavoriteTeams()
  }
});
