//
var origMarker; var destMarker; var num=2;
var latt; var lngt
var origString = "Origin";
var origwindow;
var destString = "Destination";
var destwindow;
var map;
var avoidTolls=false;
var tollcnt=0;
  function initMap() {

		var styledMapType = new google.maps.StyledMapType(
           [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0d2428"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#e5c163"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#c4c4c4"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#e5c163"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#0d2428"
            },
            {
                "saturation": "81"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0d2428"
            },
            {
                "lightness": "0"
            },
            {
                "saturation": "0"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#e5c163"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#e5c163"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#575757"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#999999"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
],

            {name: 'Night Map'});
        map = new google.maps.Map(document.getElementById('map'), {
          //mapTypeControl: false,
          center: {lat: 22.38373, lng: 114.118423},
          zoom: 13,
		  mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'Night Map']
          }
        });
		
		origwindow = new google.maps.InfoWindow({
			content: origString
		});
	
		destwindow = new google.maps.InfoWindow({
			content: destString
			});
		map.mapTypes.set('Night Map', styledMapType);
		
		
		google.maps.event.addListener(map, 'click', function(event) {
			if (origMarker && destMarker) {alert("Click RESET to reset your markers!")}
			if (origMarker==null && destMarker== null){
				if(num<=0) {alert("Click reset to add new origin and destination");}
				else if (num==2){
					latt=event.latLng.lat();
					lngt = event.latLng.lng();
					origMarker = new google.maps.Marker({
						draggable:true,
						position: {lat: latt, lng: lngt},
						icon:"./img/rsz_orig.png",
						map: map
					});
					origMarker.addListener('click', function() {
						origwindow.open(map, origMarker);
					});
					num-=1;
				}
				else if (num==1){
					latt=event.latLng.lat();
					lngt = event.latLng.lng();
					destMarker = new google.maps.Marker({
						draggable:true,
						position: {lat: latt, lng: lngt},
						icon:"./img/rsz_dest.png",
						map: map
					});
					destMarker.addListener('click', function() {
						destwindow.open(map, destMarker);
					});
					num-=1;
				}
			}
			else if (origMarker!=null && destMarker==null){
				latt=event.latLng.lat();
					lngt = event.latLng.lng();
					destMarker = new google.maps.Marker({
						draggable:true,
						position: {lat: latt, lng: lngt},
						icon:"./img/rsz_dest.png",
						map: map
					});
					destMarker.addListener('click', function() {
						destwindow.open(map, destMarker);
					});
					num=0;
			}
			else if (origMarker==null && destMarker!=null){
				latt=event.latLng.lat();
					lngt = event.latLng.lng();
					origMarker = new google.maps.Marker({
						draggable:true,
						position: {lat: latt, lng: lngt},
						icon:"./img/rsz_orig.png",
						map: map
					});
					origMarker.addListener('click', function() {
						origwindow.open(map, origMarker);
					});
					num-=0;
			}
		});	

		//call Autocomplete function
        new AutocompleteDirectionsHandler(map);
		
		//Category serach box
		// Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var newmarker=new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            });
			var infor = new google.maps.InfoWindow();
			
			
			
			google.maps.event.addListener(newmarker, 'click', function() {
				infor.setContent(place.name + '</br><input type="button" style="background-color:tomato;color:white;" onclick="setMarker(1,'  + place.geometry.location.lat() + ',' + place.geometry.location.lng() + ')" ' + ' value="Set as Destination"/>'+'</br><input type="button" style="background-color:tomato;color:white;" onclick="setMarker(0,'  + place.geometry.location.lat() + ',' + place.geometry.location.lng() + ')" ' + ' value="Set as Origin"/>');
				infor.open(map, this);
		
			});
			markers.push(newmarker);
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
		
      
	  
	  }
       /**
        * Functions
       */
	  function setMarker(idx, mlat,mlng){
				if (origMarker && destMarker){alert("You can click RESET to reset markers!");}
				else {
					if (idx==1){
						destMarker = new google.maps.Marker({
						map: map,
						icon:"./img/rsz_dest.png",
						title: 'Your destination',
						position:{lat: mlat, lng: mlng}

						});	
						alert("Destination set. Click on map to add origin!");
					}
					else if (idx==0){
						origMarker = new google.maps.Marker({
						map: map,
						icon:"./img/rsz_orig.png",
						title: 'Your origin',
						position:{lat: mlat, lng: mlng}

						});	
						alert("Origin set. Click on map to add destination!");
					
					}
				}
		}
		
	  function setToll(){
		 if (tollcnt%2==0){
			 this.checked=true;
			 avoidTolls=true;
			 tollcnt+=1;
		 }
		 else if(tollcnt%2==1){
			 this.checked=false;
			 avoidTolls=false;
			 tollcnt+=1;
		 }
	  }
	  function route(){//Route for added markers
		  if (origMarker && destMarker){
			if(document.getElementById('changemode-walking').checked==true) {map.travelMode="WALKING";}
			else if(document.getElementById('changemode-transit').checked==true) {map.travelMode="TRANSIT";}
			else if(document.getElementById('changemode-driving').checked==true) {map.travelMode="DRIVING";}
			map.directionsService = new google.maps.DirectionsService;
			map.directionsDisplay = new google.maps.DirectionsRenderer({
				draggable: true,
				map: map,
				panel: document.getElementById('right-panel')
			});
			
			map.directionsService.route({
				origin: origMarker.getPosition(),
				destination: destMarker.getPosition(),
				travelMode: map.travelMode,
				avoidTolls: avoidTolls
			}, function(response, status) {
			if (status === 'OK') {
				map.directionsDisplay.setDirections(response);
			} else {
            window.alert('Directions request failed due to ' + status);
			}
			});
		
		 }  
		 else {alert("You need to select two markers!");}
	  }
      function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'WALKING';
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);
		this.directionsDisplay.setPanel(document.getElementById('right-panel'));//setPanel to show detailed routes

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});

        this.setupClickListener('changemode-walking', 'WALKING');
        this.setupClickListener('changemode-transit', 'TRANSIT');
        this.setupClickListener('changemode-driving', 'DRIVING');
		this.setupClickListener('toll', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(modeSelector);
      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function() {
          me.travelMode = mode;
          me.route();
        });
      };

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;

        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode,
		  avoidTolls: avoidTolls
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      };