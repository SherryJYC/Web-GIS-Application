//
var map;
var markersArray = [];
var directionsDisplay;
var directionsService;
var stepDisplay;
var trigStations;
var trigResults = [];					
var origin;	

function initialize() {
	directionsService = new google.maps.DirectionsService();
	
	var opts = {
		center: new google.maps.LatLng(22.38373, 114.118423),
		zoom: 11,
	};
	map = new google.maps.Map(document.getElementById('map'), opts);
	
    // Create a renderer for directions and bind it to the map.
	directionsDisplay = new google.maps.DirectionsRenderer({ map: map});
	
	// Instantiate an info window to hold step text.
	stepDisplay = new google.maps.InfoWindow();
}

function getPosition(){
	var getLat = document.getElementById('myLat').value;
	var getLng = document.getElementById('myLng').value;
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(getLat, getLng),
		zoom: 11
	});
	
	if((getLat == '')||(getLng == '')){
		alert('Please input latitude and langitude or use positioning!');
		}else{
		origin = new google.maps.LatLng(getLat, getLng);
		var myPositionMarker = new google.maps.Marker({
			position: origin,
			icon:'img/rsz_1rsz_me.png',
		map: map});	
		markersArray.push(myPositionMarker);
		// document.getElementById('getCurrentPosition').disabled=true;
		document.getElementById('calDistance').disabled=false;
		
	}
}

function getCurrentPosition(){
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude,
			position.coords.longitude);
			
			origin=pos;
			document.getElementById('myLat').value=pos.lat();
			document.getElementById('myLng').value=pos.lng();
			document.getElementById('calDistance').disabled=false;
			document.getElementById('myLat').disabled=true;
			document.getElementById('myLng').disabled=true;
			var curLocationMarker = new google.maps.Marker(
			{
				position:pos,
				icon: 'img/rsz_1rsz_me.png',
				map:map,
				title:"Current Location"
			});
			myContentString = "<div class='infowindow-content'>" + "Current Location" + "</div>";
			var myInfoWindow = new google.maps.InfoWindow({content:myContentString});
			google.maps.event.addListener(curLocationMarker,"click",function(){myInfoWindow.open(map,curLocationMarker);});
			
			
			map.setCenter(pos);
			}, function() {
			NoGeolocation(true);
		});
		
		} else {
		
		NoGeolocation(false);
	}
}

function NoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
		} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}
}

function loadTrig(){
	var station=document.getElementById('stnTitle');
	var xmlhttp;
	
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	// If specified, responseType must be empty string or "document"
	xmlhttp.responseType = 'string';
	
	// overrideMimeType() can be used to force the response to be parsed as XML
	xmlhttp.overrideMimeType('text/xml');
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			station.style="color:red;font-weight:bold;"
			var respondingText = xmlhttp.responseText;
			var tags = $.parseJSON(respondingText);
			
			trigStations = new Array();
			
			
			var pString = "";
			for (var i = 0 ; i < tags.length ; i++){
				trigStations.push([tags[i].id,tags[i].name,tags[i].lat, tags[i].long]);
			}
			
			console.log("received");
			for (var i = 0 ; i < trigStations.length; i++){
				var stationLatLng = new google.maps.LatLng(trigStations[i][2], trigStations[i][3]);
				trigStations[i][4]=dist (origin, stationLatLng);
			}
			sortTrigStations();
			addMarker();
			var trigLatLng = [];
			var stnNum = document.getElementById('stnNum').value;
			for (var i=0;i<stnNum;i++){
				trigLatLng[i]= new google.maps.LatLng(trigStations[i][2],trigStations[i][3]);
			}
			calculateDist(origin, trigLatLng);			
			document.getElementById('myLat').disabled=true;
			document.getElementById('myLng').disabled=true;
		}
	}
	xmlhttp.open("GET","./DB/FetchDB.php",true);
	xmlhttp.send();
	google.maps.event.trigger(map, 'resize');
	
}

function sortTrigStations(){
	
	trigStations.sort(
    function(a, b){
        return a[4]-b[4];
	}
	);
}

function addMarker() {
	var stnNum = document.getElementById('stnNum').value;
	for (var i=0;i<stnNum;i++){
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(trigStations[i][2], trigStations[i][3]),
			icon: 'img/rsz_trig.png',
		map: map});
		markersArray.push(marker);		
	};	
}
