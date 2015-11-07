var horas = new Number();
var minuto 	= new Number();
var segundo = new Number();
var time 	= new Number();
var pause = 0;
var x = 0;

function parar(){
		pause = parseInt($('#pause').val());
		if(pause === 0){
		x = 0;
  }
	if(x===0){
			$('#pause').val('1');
			$('#btnPause').html('Resume');
			$('#btn').removeClass('disabled');
			x = 1;
	}else{
		$('#pause').val('0');
		$('#btnPause').html('Pause');

		x = 0;
		cronometro(2);
	}
	vibrar();
}

function cronometro(aux){
	if(aux == 1) {
			horas = parseInt(($('#horas').val() === '' ? 0 : $('#horas').val()));
			if(horas == 0){
				 alert("Digite a quantidade de horas.");
		}else{
			horas--;
			// minuto = 60;
			minuto = 2;
			segundo = 0;
		}

		if(segundo != 0 || minuto != 0){
				segundo = segundo +1;
				$('#pause').val(0);
				$('#btn').addClass('hide');
				$('#btnPause').html('Pause');
				$('#btnPause').removeClass('hide');
				$('#btnStop').removeClass('hide');
		}

		if(segundo >60 || minuto > 60 || segundo< 0 || minuto < 0){
				alert("Erro! Confira o registro informado!");
				stop();
		}
	}
	if(aux == 2){
		$('#btn').addClass('disabled');
	}

	if(minuto === 0 && segundo === 0 && horas > 0) {
		minuto = 60;
		horas--;
	}

	if(minuto > 0 && segundo === 0){
		segundo = 60;
		minuto--;
	}

	if((segundo-1)>=0){
		segundo--;
		if(segundo == 0 && minuto == 0){
			time="00:00:00";
			
			var i = 1;
			var intervalo = window.setInterval(function(){
					if('vibrate' in navigator) {
						 navigator.vibrate([500, 100, 250, 100, 1000]);
					}

					i++;
					if(i == 60) clearInterval(intervalo);
			}, 1000);

			$('#btn').removeClass('disabled');
			}else if(segundo <10 && minuto === 0){
				 time="0"+segundo;
			}else if (horas > 0 && minuto >= 1){
				 time= (horas > 0 ? '0'+horas : horas) + ":" +(minuto < 10 ? '0'+minuto : minuto)+":"+(segundo < 10 ? '0'+segundo : segundo);
			}else if (horas <= 0 && minuto >= 1) {
				 time= (minuto < 10 ? '0'+minuto : minuto)+":"+(segundo < 10 ? '0'+segundo : segundo);
			}else{
				 time = segundo;
			}
			pause = parseInt($('#pause').val());
			if(pause === 0){
				document.getElementById('tempo').innerHTML = time;
				// setTimeout('cronometro();',1000);
				setTimeout('cronometro();',10);
			}
		 }else {
			 vibrar();
		 }
}

function vibrar(){
	
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  }
	else if (Notification.permission === "granted") {
    		
		var som = "";
		if($('#timer-sound').val() !== "0"){
			var som = $('#timer-sound').val();
		}
		
		var vibracaoConfig = [];
		if($('#timer-vibrate').prop('checked')){
			 vibracaoConfig = [200, 100, 200];
		}
		
		var options = {
			body: 'Compre mais tempo.',
			vibrate: vibracaoConfig,
			sound: som
		}
		
    var notification = new Notification("Tempo Esgotado!!!", options);
		setTimeout(notification.close.bind(notification), 40000);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }
}

function stop(){
	location.reload();
	$('#horas').val("");
}
