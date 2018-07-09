//
function calRoute(directionsService, directionsDisplay) {
	var rouTitle = document.getElementById('routeTitle');
	rouTitle.style="color:red;font-weight:bold;";
	directionsDisplay.setPanel(document.getElementById('panel'));
	var destinationElements = document.getElementsByName('destination');
	var idx=-1;
  	for (var i = 0; i < destinationElements.length; i++) 
	{ 
		if (destinationElements[i].checked) 
		{ 
            idx=i;//find the index of available trig station	 
		} 
	} 
	if(idx==-1){
		alert('Invalid Destination!');
	}
	else{
		var selected =destinationElements[idx].value.toString();
		var res = selected.replace("(", "").replace(")", "");
		var end2= res.substr(0, res.indexOf(", "));
		var x = res.substr(0,res.indexOf(", "));
		var y = res.substr(res.indexOf(", ")+1);
		var end = new google.maps.LatLng(x, y);
		var getLat = document.getElementById('myLat').value;
		var getLng = document.getElementById('myLng').value;
		var origin = new google.maps.LatLng(getLat, getLng);
		
		if(document.getElementById('drive').checked) {
			directionsService.route({
				origin: origin,
				destination: end,
				travelMode: 'DRIVING'
				}, function(response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
			}else if(document.getElementById('bike').checked) {
			directionsService.route({
				origin: origin,
				destination: end,
				travelMode: 'BICYCLING'
				}, function(response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
			}else if(document.getElementById('tran').checked) {
			directionsService.route({
				origin: origin,
				destination: end,
				travelMode: 'TRANSIT'
				}, function(response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
			}else if(document.getElementById('walk').checked) {
			directionsService.route({
				origin: origin,
				destination: end,
				travelMode: 'WALKING'
				}, function(response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		}
		
	}
}