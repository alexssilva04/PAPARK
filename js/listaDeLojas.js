
window.onload = function(){
	 buscarLocalizacao();
}

function carregarPontos(position) {
		var lat1 = position.coords.latitude;
		var lon1 = position.coords.longitude;
		var pontos = JSON.parse(localStorage.getItem('pontos'));
	
		if(pontos.length == 0){
			 var pontos = $.getJSON("pontos.json", function(){alert("Você está usando uma cópia local")});
		}
			
		var html = "";
		var pontosOrdenados = ordenar(pontos, lat1, lon1);

		$.each(pontosOrdenados, function(index, ponto) {
			$("#ListaDeLojas").append($("<li>").html(
					"<a href='#'><p>" + ponto.nome + "</p>" + 
					"<p> Distancia: " + ponto.distancia + "m </p></a>"));
		});
		var pontosOrdenador = ordenar(pontos);
}

function carregarLista () {
  var pontos = JSON.parse(localStorage.getItem('pontos'));
	
	if(pontos.length == 0){
		 alert("Você precisa se conectar pelo menos a primeira vez para buscar as lojas.")
	}else{
			$.each(pontos, function(index, ponto) {
				$("#ListaDeLojas").append($("<li>").html(
					"<a href='#'><p>" + ponto.descricao + "</p>" + 
					"<p>" + ponto.endereco + "</p></a>"));
		  });
  }
}

function buscarLocalizacao(){
	var geoService = navigator.geolocation;
		if (geoService) {
			 navigator.geolocation.getCurrentPosition(carregarPontos,errorHandler,{enableHighAccuracy:true});
		} else {
			 alert("Seu Navegador não suporta GeoLocalização.");
		}
}

function errorHandler(error){
	  alert("Não fo possível determinar sua localização. Você deve estar desconecado da internet!");
	  carregarLista();
}

function calcularDistancia (lat1, lat2, lon1, lon2) {
	 var r = 6371.0;
   
	 pointA_lat = parseFloat(lat1) * Math.PI / 180.0;
	 pointA_lon = parseFloat(lon1) * Math.PI / 180.0;

	 pointB_lat = parseFloat(lat2) * Math.PI / 180.0;
	 pointB_lon = parseFloat(lon2) * Math.PI / 180.0;

	 diff_lat = pointB_lat - pointA_lat;
	 diff_lon = pointB_lon - pointA_lon;

	 var a = Math.sin(diff_lat / 2) * Math.sin(diff_lat / 2) + 
		Math.cos(pointA_lat) * Math.cos(pointB_lat) * 
		Math.sin(diff_lon / 2) * Math.sin(diff_lon / 2);

	 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	 return Math.round(r * c * 1000);
}

function ordenar(pontos, lat1, lon1) {
		var pontosOrdenados = [];
		
	  $.each(pontos, function(index, ponto) {
			var distancia = calcularDistancia(lat1, ponto.latitude, lon1, ponto.longitude);
			pontosOrdenados.push({nome: ponto.descricao, distancia: distancia});
		});
	
		pontosOrdenados.sort(function (a, b) {
			if (a.distancia > b.distancia) {
				 return 1;
			}
			if (a.distancia < b.distancia) {
				 return -1;
			}
			return 0;
		});
	
	return pontosOrdenados;
}

	

