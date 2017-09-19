//Create a map variable
  var map;
  var marker;
  var markers = [];
  var largeInfowindow;
  // var bounds;
  //var infoWindow;
  var infowindow;
  var newArray;

//model

  var locations = [{
          title: 'Northcote Arms',
          type: 'Bars',
          location: {
              lat: 51.560395,
              lng: -0.001637
          }
      },
      {
          title: 'All you read is love',
          type: 'Diners',
          location: {
              lat: 51.570642,
              lng: 0.014055
          }
      },
      {
          title: 'Little Saigon',
          type: 'Diners',
          location: {
              lat: 51.569132,
              lng: 0.012022
          }
      },
      {
          title: 'The Red Lion',
          type: 'Bars',
          location: {
              lat: 51.567992,
              lng: 0.010976
          }
      },
      {
          title: 'Marmelo',
          type: 'Diners',
          location: {
              lat: 51.564073,
              lng: -0.005854
          }
      },
      {
          title: 'Leyton Technical',
          type: 'Bars',
          location: {
              lat: 51.558887,
              lng: -0.007482
          }
      },
      {
          title: 'Hitchcock house',
          type: 'Things to do',
          location: {
              lat: 51.560066,
              lng: 0.007322
          }
      },
      {
          title: 'Mora Italian',
          type: 'Diners',
          location: {
              lat: 51.559262,
              lng: 0.006974
          }
      },
      {
          title: 'Olympic Stadium',
          type: 'Things to do',
          location: {
              lat: 51.539469,
              lng: -0.016590
          }
      },
      {
          title: 'Roof East',
          type: 'Bars',
          location: {
              lat: 51.541811,
              lng: -0.001248
          }
      },
      {
          title: 'Westfield',
          type: 'Things to do',
          location: {
              lat: 51.543452,
              lng: -0.006527
          }
      },
      {
          title: 'London Aquatics Centre',
          type: 'Things to do',
          location: {
              lat: 51.540972,
              lng: -0.010674
          }
      },
      {
          title: 'The Breakfast Club',
          type: 'Diners',
          location: {
              lat: 51.550681,
              lng: -0.024590
          }
      }
  ];
//closes model



var viewModel = function() {
          var self = this;

          var Locations = function(element) {
          this.title = element.title,
          this.isVisible = ko.observable(true),
          this.location = element.location,
          this.type = element.type,
          this.marker = element.marker
          }

          self.locationPlaces = ko.observableArray([]);

          locations.forEach(function(locationItem) {
          self.locationPlaces.push(new Locations(locationItem));
          });


          self.typeChoices = ['All places', 'Bars', 'Things to do', 'Diners'];
          self.typeSelector = ko.observable(self.typeChoices[0]);

          self.filterItems = ko.computed(function() {           
          //   self.locationPlaces().forEach(function(createMarker) {
          //   if(createMarker.marker) {
          //     createMarker.marker.setVisible(true);
          //   }
          // }); return self.locationPlaces();
          //this one seems closest so far
          var listItem = self.locationPlaces();
          var typeSelector = self.typeSelector();
 
          for (var i = 0; i < listItem.length; i++) {
          if (typeSelector === self.typeChoices[0]) {
          listItem[i].isVisible(true);
           if (marker) {
          listItem[i].marker.setVisible(true);
            }

          } else if (typeSelector !== listItem[i].type) {
            listItem[i].isVisible(false);
            listItem[i].marker.setVisible(false);

          } else {
            listItem[i].isVisible(true);
            listItem[i].marker.setVisible(true);
          };
      }
    });

          // self.locationPlaces().forEach(function(myItem, index) {
          // myItem.id = index;
          // });

self.clickHandler = function(place) {
              place.marker.setAnimation(google.maps.Animation.BOUNCE); // this = marker
                  setTimeout(function() {
                      place.marker.setAnimation(null)
                  }, 750);
                  
                  //populateInfoWindow(this, infowindow);
          };


 //Initiate google event to open infoWindow when list item is clicked
  // self.openWindow = function(place) {
  //   google.maps.event.trigger(place.marker, 'click');
  // };//add click to this? https://discussions.udacity.com/t/uncaught-typeerror-cannot-read-property---e3--of-undefined/359044/6


 }

// closes viewModel

//initialises new viewModel
var vm = new viewModel();


function initMap() {

      map = new google.maps.Map(document.getElementById('map'), {
          center: {
              lat: 51.555111,
              lng: -0.001083
          },
          zoom: 14,
          //styles: styles,
          mapTypeControl: false
      });

          function makeMarkerIcon(markerColor) {
            var markerImage = new google.maps.MarkerImage(
              //'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +  '|40|_|%E2%80%A2',
              'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34),
              new google.maps.Size(21, 34));
          return markerImage;
      }

            var defaultIcon = makeMarkerIcon('0091ff');
            var highlightedIcon = makeMarkerIcon('FFFF24')

            largeInfowindow = new google.maps.InfoWindow();
            var bounds = new google.maps.LatLngBounds();


              infowindow = new google.maps.InfoWindow({
              maxWidth: 150
              });

              //findout why this didn't work
              //woldn't push markers across to LocationsPlaces, came through undefined
          for (var i = 0; i < locations.length; i++) {
              var position = locations[i].location;
              var title = locations[i].title;
              markers[i] = new google.maps.Marker({
              position: position,
              title: title,
              // position: position,
              // title: title,
              map: map,
              animation: google.maps.Animation.DROP,
              icon: defaultIcon,
              id: i
          });

          vm.locationPlaces().marker = markers;
          locations[i].marker = marker;
          bounds.extend(markers[i].position);
          
          //markers.push(marker);

          markers[i].addListener('click', function(marker, i) {
            var self = this;//console.log(this);

            //populateInfoWindow(this, infowindow);
            self.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
              self.setAnimation(null)
            }, 750);
            //toggleBounce(marker);
          })

          markers[i].addListener('mouseover', function() {
              this.setIcon(highlightedIcon);
          })

          markers[i].addListener('mouseout', function() {
              this.setIcon(defaultIcon);
          });

          bounds.extend(markers[i].position);
        }
      //closes the for loop
            map.fitBounds(bounds);

            //   //map.panTo(marker.getPosition());


          function populateInfoWindow(marker, infowindow) {
            //console.log(marker);
            //google.maps.event.trigger(this.marker, 'click');
          if (infowindow.marker != marker) {
              infowindow.marker = marker;
              infowindow.setContent('<div>' + marker.title + '</div>');
              infowindow.open(map, marker);

              //make sure marker window is cleared if infowindow is closed
              infowindow.addListener('closeclick', function() {
                  infowindow.marker = null;
              });

              var streetViewService = new google.maps.StreetViewService();
              var radius = 50;
              //in case status is okay, (pano found), compute position of streetview image, then calculate heading, then get a pano from that and set options
              function getStreetView(data, status) {
                  if (status == google.maps.StreetViewStatus.OK) {
                      var nearStreetViewLocation = data.location.latLng;
                      var heading = google.maps.geometry.spherical.computeHeading(
                          nearStreetViewLocation, marker.position);
                      infowindow.setContent('<div>' + marker.title + '</div><div id="pano"</div>');
                      var panoramaOptions = {
                          position: nearStreetViewLocation,
                          pov: {
                              heading: heading,
                              pitch: 30
                          }
                      };
                      var panorama = new google.maps.StreetViewPanorama(
                          document.getElementById('pano'), panoramaOptions);
                  } else {
                      infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No street view found</div>');
                  }
              }
              //use streetview service to get the closest streetview image witin 50m
              streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
              //open info window on correct marker
              infowindow.open(map, marker);

          }

    };

          ko.applyBindings(vm);


};//closes the init Map




  // $("button").mouseover(function() {
  //   $("ul").addClass("show");
  //   // $("ul").removeClass("dropdown-content");

  // });

  // $("button").mouseout(function() {
  //     $("ul").removeClass(".show");
  //   });

  

  //} //closes initMap

  //   function zoomToArea() {
  //   // Initialize the geocoder.
  //   var geocoder = new google.maps.Geocoder();
  //   // Get the address or place that the user entered.
  //   var address = document.getElementById('zoom-to-area-text').value;
  //   // Make sure the address isn't blank.
  //   if (address == '') {
  //     window.alert('You must enter an area, or address.');
  //   } else {
  //     // Geocode the address/area entered to get the center. Then, center the map
  //     // on it and zoom in
  //     geocoder.geocode(
  //       { address: address,
  //         componentRestrictions: {locality: 'London'}
  //       }, function(results, status) {
  //         if (status == google.maps.GeocoderStatus.OK) {
  //           map.setCenter(results[0].geometry.location);
  //           map.setZoom(15);
  //         } else {
  //           window.alert('We could not find that location - try entering a more' +
  //               ' specific place.');
  //         }
  //       });
  //   }

  // }