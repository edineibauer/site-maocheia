function getMapTypes() {

  return new Promise((resolve, reject) => {
    fetch('place-types.json')
      .then(function (response) {
        if (response.ok) {
          resolve(response.json());
        } else {
          console.log('ok');
          reject(false);
        }
      })
      .catch(function (error) {
        console.log('problema: ' + error.message);
        reject(false);
      });

  });
}

function mapInit(element, options) {
  return new google.maps.Map(element, options);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: Geolocalização falhou.' :
    'Error: Seu nevegador não suporta geolocalização.');
  infoWindow.open(map);
}

var MapWorker = function (selector) {
  this.el = document.querySelector(selector);
  this.map = mapInit(this.el, {
    center: new google.maps.LatLng(-28.6783, -49.3704),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  });

  this.infoWindow = new google.maps.InfoWindow({map: this.map});

};

MapWorker.prototype.setRoute = function (from, to) {

};

MapWorker.prototype.getPlaceTypes = function (from, to) {
  return new Promise((resolve, reject) => {
    getMapTypes()
      .then((data) => {
        resolve(data)
      }).catch(() => {
      reject(false);
    });
  });
};

MapWorker.prototype.currentLocation = function () {

  const _this = this;

  return new Promise((resolve, reject) => {

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {

        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

      }, function () {
        reject(handleLocationError(true, _this.infoWindow, _this.map.getCenter()));
      });
    } else {
      // Browser doesn't support Geolocation
      reject(handleLocationError(false, _this.infoWindow, _this.map.getCenter()));
    }

  });

};

