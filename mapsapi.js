//Create global variables
var map;
var marker;
var markers = [];
var largeInfowindow;
var listInfoWindow;
var infowindow;
var newArray;
var populateInfoWindow;
  
  //added error handler function for any problems with google maps
  function mapErrorHandler() {
    alert('There was a problem loading Google Maps');
  }

var ViewModel = function () {
  var self = this;

  //added binding for sidebar toggle
  self.showSidebar = ko.observable(true);          
  self.refineSearch = function() {    
    return self.showSidebar()
    };

    $('#toggle').on('click', function() {
  self.showSidebar(!self.showSidebar());
  });

  //Locations constructor
  var Locations = function (element) {
    this.title = element.title,
      this.isVisible = ko.observable(true),
      this.location = element.location,
      this.type = element.type,
      this.marker = element.marker;
  };

  //create knockout.js observable array
  self.locationPlaces = ko.observableArray([]);

  //loop through model, create new Locations, push to observable array 
  locations.forEach(function (locationItem) {
    self.locationPlaces.push(new Locations(locationItem));
  });

  //delcare selector options
  self.typeChoices = ['All places', 'Bars', 'Things to do', 'Diners'];
  self.typeSelector = ko.observable(self.typeChoices[0]);

  //knockout computed observable
  self.filterItems = ko.computed(function () {

    //variables to work on observables
    var listItem = self.locationPlaces();
    var typeSelector = self.typeSelector();

    //loop through locationplaces array
    for (var i = 0; i < listItem.length; i++) {

      //call function to clear all markers
      removeWindows();

      //filter function for Locations
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
      }

    }
  });

  //callback function for clicks on list items
  self.clickHandler = function (place) {
    //call function to clear all markers
    removeWindows();

    place.marker.setAnimation(google.maps.Animation.BOUNCE); // this = marker
    setTimeout(function () {
      place.marker.setAnimation(null);
    }, 750);
    map.panTo(marker.getPosition());
    //call for the JSON wikipedia infowindows for each place in the sidebar 
    populateInfoWindow(this.marker, infowindow);

  };

  //function to clear markers 
  function removeWindows() {
    if (listInfoWindow) {
      listInfoWindow.close();
    }
    if (infowindow) {
      infowindow.close();
    }
  }

};
// closes ViewModel

//declare new ViewModel
var vm = new ViewModel();


function initMap() {


  //declare new google map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 51.553676,
      lng: -0.007176
    },
    zoom: 14,
    //styles: styles,
    mapTypeControl: false
  });

  //event listener for screen resize
  var center = map.getCenter();
  google.maps.event.addDomListener(window, 'resize', function () {
    map.setCenter(center);
    map.fitBounds(bounds);
  });

  //function to change marker when pointer hovers over marker
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  //declare marker intial state and onchange
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');

  //var for google streetview infowindows - not used
  largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();


  infowindow = new google.maps.InfoWindow({
    maxWidth: 150
  });

  //loop through locations to create markers for each item
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    //tie locationPlaces markers to new markers
    vm.locationPlaces()[i].marker = marker;
    //push new marker into markers array
    markers.push(marker);
    bounds.extend(marker.position);

    //pop up title for each marker
    listInfoWindow = new google.maps.InfoWindow({
      content: marker.title
    });

    largeInfowindow = new google.maps.InfoWindow();

    //listeners to bounce each marker 

    marker.addListener('click', markerListener);

    //listener for mouseover event
    marker.addListener('mouseover', mouseOver);

    //listener for mouseout event
    marker.addListener('mouseover', mouseOut);
    
    bounds.extend(markers[i].position);

  }
  //closes the for loop

      function markerListener() { 
      var self = this;
      map.panTo(marker.getPosition());
      self.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
        self.setAnimation(null);
      }, 750);
      map.fitBounds(bounds);
      //function call to fill infowindow with wikipedia api 
      populateInfoWindow(this, infowindow);
    }


    function mouseOver() {
      this.setIcon(highlightedIcon);
    }

    function mouseOut() {
      this.setIcon(defaultIcon);
    }

  map.fitBounds(bounds);

  //pop up windows for wikipedia api
  populateInfoWindow = function(marker, infowindow) {

    //close any existing infowindows
    if (listInfoWindow) {
      listInfoWindow.close();
    }
    //wikipedia api request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

    //JQuery ajax 
    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      error: function(request,status,errorThrown) {
        alert('Sorry, the call to wikipedia failed')
   },
    }).done(function (response) {

      var articleUrl = response[3][0];
      var articleContent = response[2][0];

      if (articleUrl === undefined) {
        infowindow.setContent('<div>' + '<h3>' + marker.title + '</h3>' + '<p>' + 'No wikipedia entry for this place.' + '</p>' + '</div>');
        infowindow.open(map, marker);
      } else {

        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '<p>' + articleContent + '<a href="' + articleUrl + '" target="blank">' + '..' + ' Read More' + '</a>' + '</p>' + '</div>');
        infowindow.open(map, marker);

        //make sure marker window is cleared if infowindow is closed
        infowindow.addListener('closeclick', function () {
          infowindow.marker = null;
        });

        google.maps.event.addListener(map, 'click', function () {
          infowindow.close();
          infowindow.setMarker = null;
        });

      }

      map.fitBounds(bounds);
    });
  }
  //apply knockout bindings to viewModel 
  ko.applyBindings(vm);


}