
var jqxhr = $.getJSON( "http://www.rlcsolucoes.com.br/papark/estabelecimentos/listar", function() {
    console.log( "success" );
    })
    .done(function() {
        console.log( "second success" );
     })
     .fail(function() {
         console.log( "error" );
         window.location.href = "ListaDeLojas.html"; 
     })
     .always(function() {
         console.log( "complete" );
     });