//
var method=null;

function rad (x) 
{
	return x*Math.PI/180;
}

function dist (p1, p2) {
	var R = 6371; 
	var dLat  = rad(p2.lat() - p1.lat());
	var dLong = rad(p2.lng() - p1.lng());
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d.toFixed(4);
}

function calculateDist(ori,trigLatLng) {
	directionsDisplay.setDirections({routes: []});	
	var service = new google.maps.DistanceMatrixService();
	
	
	if(document.getElementById('drive').checked) {
		service.getDistanceMatrix(
		{	
			origins: [ori],
			destinations: trigLatLng,
			travelMode: google.maps.TravelMode['DRIVING'],
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, 
		callback);
		method="Driving";
		}else if(document.getElementById('bike').checked) {
		service.getDistanceMatrix(
		{	
			origins: [ori],
			destinations: trigLatLng,
			travelMode: google.maps.TravelMode['BICYCLING'],
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, 
		callback);
		method="Bicycling";
		}else if(document.getElementById('tran').checked) {
		service.getDistanceMatrix(
		{	
			origins: [ori],
			destinations: trigLatLng,
			travelMode: google.maps.TravelMode['TRANSIT'],
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, 
		callback);
		method="Transportation";
		}else if(document.getElementById('walk').checked) {
		service.getDistanceMatrix(
		{	
			origins: [ori],
			destinations: trigLatLng,
			travelMode: google.maps.TravelMode['WALKING'],
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, 
		callback);
		method="Walking";
	}
	
}
function callback(response, status) {
	trigResults=[];
	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
		} else {
		var origins = response.originAddresses;
		var destinations = response.destinationAddresses;
		
		for (var i = 0; i < origins.length; i++) {
			var results = response.rows[i].elements;
			for (var j = 0; j < results.length; j++) {
				if(results[j].status == 'OK')
				trigResults[j] = new Array(trigStations[j][0], trigStations[j][1], 1, trigStations[j][4], results[j].distance.text, results[j].duration.text);
				else 
				trigResults[j] = new Array(trigStations[j][0], trigStations[j][1], 0, trigStations[j][4], 0, 0);
			}
		}
		
		
		if(document.getElementById('edist').checked) {
			trigResults.sort(
			function(a, b){
				return parseFloat(a[3])-parseFloat(b[3]);
			}
			);
			}else if(document.getElementById('time').checked) {
			trigResults.sort(
			function(a, b){
				return parseFloat(a[5])-parseFloat(b[5]);
			}
			);
			}else if(document.getElementById('tdist').checked) {
			trigResults.sort(
			function(a, b){
				return parseFloat(a[4])-parseFloat(b[4]);
			}
			);
		}
		showResults();
	}
}

function showResults(){
	var container = document.getElementById("outresult");
	container.innerHTML ="";
	container.setAttribute("style","height:100%;overflow-y:scroll");
	
	for(var i=0; i< trigResults.length; i++)
	{
		var radio = document.createElement("input");
		radio.setAttribute("type","radio");
		radio.setAttribute("name","destination");
		var destinationValue = new google.maps.LatLng(trigStations[i][2], trigStations[i][3]);
		radio.setAttribute('value',destinationValue);
		
		
		if(trigResults[i][2]==1)
		{
			container.innerHTML += trigResults[i][0] + ": " + trigResults[i][1];
			container.appendChild(radio);
			container.innerHTML += "<br> Distance: " + trigResults[i][3] + "km <br>" + method+":"+ trigResults[i][4] + "<br>" +"Time Required:"+ trigResults[i][5]+ "<hr>";
		}
		else
		{
			container.innerHTML += trigResults[i][0] + ": " + trigResults[i][1] + "<br>" + "Distance: " + trigResults[i][3] + "km <br>" + "No travelling route available. <hr>";
		}
	}
}

