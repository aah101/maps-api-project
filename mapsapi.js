  //model
var locations = [
        {title: 'Northcote Arms', type: 'Pubs', location: {lat: 51.560395, lng: -0.001637 }},
        {title: 'All you read is love', type: 'Cafe/Bookshop', location: {lat: 51.570642, lng: 0.014055 }},
        {title: 'Little Saigon', type: 'Restaurants', location: {lat: 51.569132, lng: 0.012022 }},
        {title: 'The Red Lion', type: 'Pubs', location: {lat: 51.567992, lng: 0.010976 }},
        {title: 'Marmelo', type: 'Restaurants', location: {lat: 51.564073, lng: -0.005854 }},
        {title: 'Leyton Technical', type: 'Pubs', location: {lat: 51.558887, lng: -0.007482 }},
        {title: 'Hitchcock house', type: 'Sights', location: {lat: 51.560066, lng: 0.007322}},
        {title: 'Mora Italian', type: 'Restaurants', location: {lat: 51.559262, lng: 0.006974 }},
        {title: 'Olympic Stadium', type: 'Sports, Sights', location: {lat: 51.539469, lng: -0.016590 }},
        {title: 'Roof East', type: 'Restaurant, Bar, Entertainment', location: {lat: 51.541811, lng: -0.001248 }},
        {title: 'Westfield', type: 'Shopping, restaurants, bars, casino', location: {lat: 51.543452, lng: -0.006527 }},
        {title: 'London Aquatics Centre', type: 'Sports, Sights', location: {lat: 51.540972, lng: -0.010674 }},
        {title: 'The Breakfast Club', type: 'Restaurants', location: {lat: 51.550681, lng: -0.024590 }}
       ];



// TODO: Create a map variable
     var map;
     var markers = [];

     function initMap() {

       map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.555111, lng: -0.001083},
        zoom: 14,
        //styles: styles,
        mapTypeControl: false
      });

      //ko.applyBindings(title);

      var myObservable = ko.observableArray(this.locations);

      //so viewModel is within the initMap scope
      var viewModel = function() {
      var self = this;
      self.title = ko.observable('');
      self.location = ko.observable();
      //var markerRef;
          //filter method to go in here
      self.locationPlaces = ko.observableArray(locations);

      //added from here
        for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
        position: position,
        title: title,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });


    locations[i].marker = marker;

    markers.push(marker);

    marker.addListener('click', function() {
      var self = this;
      populateInfoWindow(this, largeInfowindow);
      self.setAnimation(google.maps.Animation.BOUNCE),  // this = marker
      setTimeout(function(){self.setAnimation(null)}, 750); 

    });

    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });

    // function clickFunction(location) {
    //     if (this.title) {
    //         //markerRef = this.marker;
    //         //map.setZoom(15); //Zoom the map
    //         //map.panTo(this.latlng);
    //         marker.setAnimation(google.maps.Animation.BOUNCE);
    //         //         //google.maps.event.trigger(location.marker, 'click');
    //            setTimeout(function() {
    //           marker.setAnimation(null); // End marker animation after 2 seconds 
    //         }, 750);
    //   }
    // }
    //marker.addListener(function(location) {  
    
      bounds.extend(markers[i].position);
  }
//closes the for loop

      self.clickFunction = function(location) {
        if (this.title) {

        marker.setAnimation(google.maps.Animation.BOUNCE),  // this = marker
        setTimeout(function(){marker.setAnimation(null)}, 750);
            //markerRef = this.marker;
            //map.setZoom(15); //Zoom the map
            //map.panTo(this.latlng);
            // marker.setAnimation(google.maps.Animation.BOUNCE);
            // //         //google.maps.event.trigger(location.marker, 'click');
            //    setTimeout(function() {
            //   marker.setAnimation(null); // End marker animation after 2 seconds 
            // }, 750);
      }
    }
};
    //var vm = new viewModel();
    ko.applyBindings(new viewModel());

//     this.myComputedObservable = ko.computed(function() {
//         return self.personName() + " " + self.personAge();
//     });
// };



        var largeInfowindow = new google.maps.InfoWindow();
          var bounds = new google.maps.LatLngBounds();
        var defaultIcon = makeMarkerIcon('0091ff');
        var highlightedIcon = makeMarkerIcon('FFFF24')

//         for (var i = 0; i < locations.length; i++) {
//         var position = locations[i].location;
//         var title = locations[i].title;
//         var marker = new google.maps.Marker({
//         position: position,
//         title: title,
//         map: map,
//         animation: google.maps.Animation.DROP,
//         icon: defaultIcon,
//         id: i
//       });


//     locations[i].marker = marker;

//     markers.push(marker);

//     marker.addListener('click', function() {
//       var self = this;
//       populateInfoWindow(this, largeInfowindow);
//       self.setAnimation(google.maps.Animation.BOUNCE),  // this = marker
//       setTimeout(function(){self.setAnimation(null)}, 750); 

//     });

//     marker.addListener('mouseover', function() {
//       this.setIcon(highlightedIcon);
//     });

//     marker.addListener('mouseout', function() {
//       this.setIcon(defaultIcon);
//     });

//     // function clickFunction(location) {
//     //     if (this.title) {
//     //         //markerRef = this.marker;
//     //         //map.setZoom(15); //Zoom the map
//     //         //map.panTo(this.latlng);
//     //         marker.setAnimation(google.maps.Animation.BOUNCE);
//     //         //         //google.maps.event.trigger(location.marker, 'click');
//     //            setTimeout(function() {
//     //           marker.setAnimation(null); // End marker animation after 2 seconds 
//     //         }, 750);
//     //   }
//     // }
//     //marker.addListener(function(location) {  
    
//       bounds.extend(markers[i].position);
//   }
// //closes the for loop


    //this closes the viewModel


    // document.getElementById('titleList').addEventListener('click', function() {
        
    //       if (titleList.title) {
    //        map.setZoom(15);
    //        map.panTo(this.latlng);
    //        list.setAnimation(google.maps.Animation.BOUNCE);
    //    } 
    // });



      //   for (var i = 0; i < locations.length; i++) {
      //     if (title === locations[i].title) {
      //         populateInfoWindow(title, largeInfoWindow)   
      //     }
      //     else {console.log('There is no marker for this place')
      //     }
      //   }
      // });

        //populateInfoWindow(locations[i].marker, largeInfowindow);

    
// self.listViewClick = function(list) {
//         //google.maps.event.trigger(list.marker, 'click'); //Associate the marker with the list view item when clicked
//         if (this.title) {
//             map.setZoom(15); //Zoom the map
//             map.panTo(this.latlng);
//             list.marker.setAnimation(google.maps.Animation.BOUNCE); // Cause markers to bounce when clicked
//             //$('.sidebar').toggleClass('slide-out'); //Hide sidebar if true and class is already toggled on
//             } 
//          

map.fitBounds(bounds);//what does this do?


function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
      //'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +  '|40|_|%E2%80%A2',
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +  '|40|_|%E2%80%A2',
          new google.maps.Size(21,34),
          new google.maps.Point(0,0),
          new google.maps.Point(10,34),
          new google.maps.Size(21,34));
          return markerImage;
        }

//called by onclick
function populateInfoWindow(marker, infowindow) {

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
var heading  = google.maps.geometry.spherical.computeHeading(
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
// use streetview service to get the closest streetview image witin 50m
streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
//open info window on correct market
infowindow.open(map, marker);

        }//8 to 7, by my count, check again. so two over

      }//closes populateInfoWindow

    }//closes initMap


//     document.getElementById("button1").addEventListener('click', function() {
//      document.getElementById("myDropdown").classList.toggle("show");
//     });


// // Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {

//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     for (var i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }



// document.getElementById('show-listings').addEventListener('click', showListings);
// document.getElementById('hide-listings').addEventListener('click', hideListings);
// document.getElementById('toggle-drawing').addEventListener('click', function(){
// toggleDrawing(drawingManager);
// });

// document.getElementById('zoom-to-area').addEventListener('click', function() {
  //         zoomToArea();
  //       });

// document.getElementById('search-within-time').addEventListener('click', function() {
  //         searchWithinTime();
  //       });


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
   // </script>
   // <!--TffODO: Load the JS API ASYNCHRONOUSLY below.-->
   // <script async defer
   // src="https://maps.googleapis.com/maps/api/js?libraries=places,drawing,geometry&key=AIzaSyB_QOWtSCQ1B67BoVzsX_vM2KaOiFamI7U&v =3&callback=initMap">
   // //https://maps.googleapis.com/maps/api/distancematrix/json?origins=4800+ElCaminoReal+LosAltos+CA&destinations==2465+LathemStreet+MountainView+CA&key=AIzaSyB_QOWtSCQ1B67BoVzsX_vM2KaOiFamI7U
   // //milan to florecne
   // //https://maps.googleapis.com/maps/api/directions/json?origin=Florence&destination=Milan&waypoints=Bologna|Venice|Genoa&key=AIzaSyB_QOWtSCQ1B67BoVzsX_vM2KaOiFamI7U