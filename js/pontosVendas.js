var map;
var idInfoBoxAberto;
var infoBox = [];
var markers = [];
var posicaoPessoa;
var startpos;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

window.onload = function(){
	buscarLocalizacao();	
}

function initialize() {
	var marcadorAtual = markers[idInfoBoxAberto];
	var posicaoLoja = marcadorAtual.position;
	var posicaoPessoa = startpos;
  
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
			zoom: 14,
			center: posicaoPessoa
  }
  map = new google.maps.Map(document.getElementById("mapa"), mapOptions);
  directionsDisplay.setMap(map);
  calcRoute(posicaoLoja, posicaoPessoa);
  
}

function calcRoute(posicaoLoja, posicaoPessoa) {
  var selectedMode = "DRIVING";
  var request = {
      origin: posicaoPessoa,
      destination: posicaoLoja,
      travelMode: google.maps.TravelMode[selectedMode]
  };
  directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				 directionsDisplay.setDirections(response);
			}
  });
}

function buscarLocalizacao(){
	var geoService = navigator.geolocation;
		if (geoService) {
			 navigator.geolocation.getCurrentPosition(carregarPontos,errorHandler,{enableHighAccuracy:true});
		} else {
			 alert("Seu Navegador não suporta GeoLocalização.");
		}
}

function abrirInfoBox(id, marker) {
	if (typeof(idInfoBoxAberto) == 'number' && typeof(infoBox[idInfoBoxAberto]) == 'object') {
		 infoBox[idInfoBoxAberto].close();
	}
	infoBox[id].open(map, marker);
	idInfoBoxAberto = id;
}

var closeInfoBox = function() {
    for (var i in infoBox) {
        infoBox[i].close();
    }
}

function parseDouble(value){
  if(typeof value == "string") {
    value = value.match(/^-?\d*/)[0];
  }
  return !isNaN(parseInt(value)) ? value * 1 : NaN;
}

function rota(posicao){
	initialize(posicao);
}

function carregarPontos(position) {
	var idPonto;
	startpos = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
	var options = { 
				zoom : 15, 
				center : startpos, 
				mapTypeId : google.maps.MapTypeId.ROADMAP 
			};

	map = new google.maps.Map(document.getElementById("mapa"), options);		
	var retorno = $.getJSON('http://www.rlcsolucoes.com.br/papark/estabelecimentos/listar', function(pontos) {
				
		localStorage.setItem('pontos', JSON.stringify(pontos));

		var posicaoDoUsuario = {"id": pontos.length+1, "latitude": position.coords.latitude, "longitude":  position.coords.longitude,
		"descricao": "Posição Atual"};
		pontos.push(posicaoDoUsuario);

		var latlngbounds = new google.maps.LatLngBounds();
		
		$.each(pontos, function(index, ponto) {
				var icone;

				if(index == pontos.length -1) {
					  icone = 'images/icon60.png'
				}else {
					 icone = 'images/marcador.png'	
				}
						
				var marker = new google.maps.Marker({
						position: new google.maps.LatLng(parseFloat(ponto.latitude), parseFloat(ponto.longitude)),
						title: "Estabelecimento: " + ponto.descricao,
						icon: icone
				});
				
				var pontoAtualAux = [];
				pontoAtualAux.push(ponto.latitude);
				pontoAtualAux.push(ponto.latitude);
			
				var myOptions = {
						content: "<p>" + ponto.descricao + "</p><p><button onclick='rota("+pontoAtualAux+")'>Traçar Rota</button></p>",
						pixelOffset: new google.maps.Size(-150, 0)
				};

			  idPonto = ponto.id;
			
				infoBox[idPonto] = new InfoBox(myOptions);
				infoBox[idPonto].marker = marker;

				infoBox[idPonto].listener = google.maps.event.addListener(marker, 'click', function (e) {
					  abrirInfoBox(ponto.id, marker);
				});
				markers.push(marker);
				latlngbounds.extend(marker.position);
		});		
		var markerCluster = new MarkerClusterer(map, markers);
		map.fitBounds(latlngbounds);	
	});
}

function errorHandler(error){
	   alert("Não é possivel buscar sua localização " + error.code + ",Message: " + error.message);
}

