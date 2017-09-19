//Create global variables
var map;
var marker;
var markers = [];
var largeInfowindow;
var listInfoWindow;
var infowindow;
var newArray;


//model
//hard code locations
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

    //Locations constructor
    var Locations = function(element) {
        this.title = element.title,
            this.isVisible = ko.observable(true),
            this.location = element.location,
            this.type = element.type,
            this.marker = element.marker
    };

    //create knockout.js observable array
    self.locationPlaces = ko.observableArray([]);

    //loop through model, create new Locations, push to observable array 
    locations.forEach(function(locationItem) {
        self.locationPlaces.push(new Locations(locationItem));
    });

    //delcare selector options
    self.typeChoices = ['All places', 'Bars', 'Things to do', 'Diners'];
    self.typeSelector = ko.observable(self.typeChoices[0]);

    //knockout computed observable
    self.filterItems = ko.computed(function() {

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
    self.clickHandler = function(place) {
        //call function to clear all markers
        removeWindows();

        place.marker.setAnimation(google.maps.Animation.BOUNCE); // this = marker
        setTimeout(function() {
            place.marker.setAnimation(null);
        }, 750);
        listInfoWindow.setContent(this.title);
        listInfoWindow.open(map, this.marker);
        //populateInfoWindow(this, infowindow);
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
// closes viewModel
//declare new viewModel
var vm = new viewModel();


function initMap() {
    //declare new google map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.555111,
            lng: -0.001083
        },
        zoom: 14,
        //styles: styles,
        mapTypeControl: false
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
        marker.addListener('click', function(place) {
            var self = this;
            self.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.setAnimation(null);
            }, 750);
            //function call to fill infowindow with wikipedia api 
            populateInfoWindow(this, infowindow);
        });

        //listener for mouseover event
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });

        //listener for mouseout event
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        bounds.extend(markers[i].position);

    }
    //closes the for loop

    map.fitBounds(bounds);

    //pop up windows for wikipedia api
    function populateInfoWindow(marker, infowindow) {

        //close any existing infowindows
        if (listInfoWindow) {
            listInfoWindow.close();
        }
        //wikipedia api search call
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

        //JQuery ajax 
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
        }).done(function(response) {

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
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });

                google.maps.event.addListener(map, 'click', function() {
                    infowindow.close();
                    infowindow.setMarker = null;
                });

                //not used 
                // var streetViewService = new google.maps.StreetViewService();
                // var radius = 50;
                // //in case status is okay, (pano found), compute position of streetview image, then calculate heading, then get a pano from that and set options
                // function getStreetView(data, status) {
                //     if (status == google.maps.StreetViewStatus.OK) {
                //         var nearStreetViewLocation = data.location.latLng;
                //         var heading = google.maps.geometry.spherical.computeHeading(
                //             nearStreetViewLocation, marker.position);
                //         infowindow.setContent('<div>' + marker.title + '</div>'); //+ '</div><div id="pano"</div>'
                //         var panoramaOptions = {
                //             position: nearStreetViewLocation,
                //             pov: {
                //                 heading: heading,
                //                 pitch: 30
                //             }
                //         };
                //         var panorama = new google.maps.StreetViewPanorama(
                //             document.getElementById('pano'), panoramaOptions);
                //     } else {
                //         infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No street view found</div>');
                //     }
                // }
                // //use streetview service to get the closest streetview image witin 50m
                // streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                // //open info window on correct marker
                // //infowindow.open(map, marker);

            }
        });
    }
    //apply knockout bindings to viewModel 
    ko.applyBindings(vm);


} //closes the init Map