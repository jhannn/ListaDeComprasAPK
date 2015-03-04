var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//______________________ CADASTRAR ESTABELECIMENTO _________________________//
function cadastrarEstabelecimento(){
	confirme = confirm("O cadastro so podera ser realizado se voce estiver em um estabelecimento!\n Voce esta em um estabelecimento?");
	if(confirme){
		var nomeEstabelecimento = $("#nome").val();
		var bairroEstabelecimento = $("#bairroEstabelecimento").val();
		var cidadeEstabelecimento = $("#cidadeEstabelecimento").val();
		var unidadeEstabelecimento = $("#unidadeEstabelecimento").val();
		var idUsuario = ID_USUARIO;
		var token = TOKEN;	
		var latitude = window.localStorage.lat;
		var longitude = window.localStorage.lon;
		
		if(latitude == undefined && longitude == undefined){
			alert("Erro no geocalizador!");
			return;
		}
		
		var nonNumbers = /\D/;
		if(nonNumbers.test(unidadeEstabelecimento)){
			alert("Unidade so recebe digitos!");
		}else{
			if (nomeEstabelecimento != '' || bairroEstabelecimento!= '' || cidadeEstabelecimento!= '' || unidadeEstabelecimento!= ''){ 	
				$.ajax({
					type: 'POST'
					, url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/cadastrarEstabelecimento"
					, crossDomain:true
					, contentType: 'application/json; charset=utf-8'
					, dataType: 'json'
					, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"',numero:'"+parseInt(unidadeEstabelecimento)+"',latitude:'"+latitude+"',longitude:'"+longitude+"'}"
					, success: function (data, status){                    
						var estabelecimento	= $.parseJSON(data.d);
						if(typeof(estabelecimento.erro) === 'undefined'){
							alert("Estabelecimento criado com sucesso!");
							window.location = "estabelecimento.html";
							return;						
						}else{					
							alert(estabelecimento.erro + "\n" + estabelecimento.Message);
							return;
						}
					}
					, error: function (xmlHttpRequest, status, err) {
						alert("Ocorreu um erro");
					}
				});
			}else{
				alert("Campo vazio.");
				window.location = "estabelecimento.html#criar-estabelecimento";
				return false;
			}
		}
	}
}

//______________________ LISTAR ESTABELECIMENTO _________________________//
function listarEstabelecimento(){	

	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/listarEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'',bairro:'',cidade:''}"
        , success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);		
			for(var i=0; i<estabelecimentos.length ;i++)
			htmlListarEstabelecimentos(estabelecimentos[i]);
        }
        , error: function (xmlHttpRequest, status, err) {
            alert("Ocorreu um erro");
        }
    });
}


//______________________ EDITAR ESTABELECIMENTO _________________________//
function editarEstabelecimento(){	
	var nomeEstabelecimento = $("#novoNomeEstabelecimento").val();
	var bairroEstabelecimento = $("#novoBairroEstabelecimento").val();
	var cidadeEstabelecimento = $("#novoCidadeEstabelecimento").val();
	var unidadeEstabelecimento = $("#novoUnidadeEstabelecimento").val();
	var idEstabelecimento = parseInt(window.localStorage.idEstabelecimento);
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	
	var nonNumbers = /\D/;
	if(nonNumbers.test(unidadeEstabelecimento)){
		alert("Unidade so recebe digitos!");
	}else{
		if (nomeEstabelecimento != '' || bairroEstabelecimento!= '' || cidadeEstabelecimento!= '' || unidadeEstabelecimento!= ''){ 	
			$.ajax({
				type: 'POST'
				, url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/editarEstabelecimento"
				, crossDomain:true
				, contentType: 'application/json; charset=utf-8'
				, dataType: 'json'
				, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',id:'"+idEstabelecimento+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"',numero:'"+unidadeEstabelecimento+"'}"
				, success: function (data, status){                    
					var retorno = $.parseJSON(data.d);               
					if(typeof(retorno.erro) === 'undefined'){
						alert("Dados do estabelecimento alterados com sucesso!");
						window.location = "estabelecimento.html";
						return;							
					}else{
						alert(itens.erro + "\n" + itens.Message);
						return;
					}
				}
				, error: function (xmlHttpRequest, status, err) {
					alert("Ocorreu um erro");
				}
			});
		}else{
			alert("Campo vazio.");
			window.location = "estabelecimento.html#editar-estabelecimento";
			return false;
		}
	}
}

function estabelecimentoClicadoId(id){
	window.localStorage.idEstabelecimento = id;
	return;
}

//______________________ AUTOCOMPLETE ESTABELECIMENTO _________________________//
function autoCompleteEstabelecimento(){	
	var nomeEstabelecimento = $("#nomeEstabelecimento").val();
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/autoCompleteEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"'}"
		, success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);
			$("#nomeEstabelecimento").autocomplete({ source: estabelecimentos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            alert("Ocorreu um erro");
        }
    });	
}

//______________________ VISUALIZAR ESTABELECIMENTO _________________________//
function visualizarEstabelecimento(){	
	var queries = {};
	$.each(document.location.search.substr(1).split('&'), function(c,q){
		var i = q.split('=');
		queries[i[0].toString()] = i[1].toString();
	});	
	var idEstabelecimento=queries['id'];
	window.localStorage.idEstabelecimentoClicado= idEstabelecimento;
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/visualizarEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',id:'"+parseInt(idEstabelecimento)+"'}"
        , success: function (data, status){                    
			var estabelecimento = $.parseJSON(data.d);
			if(typeof(estabelecimento.erro) === 'undefined'){
				$("#tituloEstabelecimento").html(estabelecimento.nome);
				$("#cidade").html(estabelecimento.cidade);
				$("#bairro").html(estabelecimento.bairro);
				$("#numero").html(estabelecimento.numero);				
				return;					
			}else{
				alert(estabelecimento.erro + "\n" + estabelecimento.Message);
				return;	
			}					
		}
        , error: function (xmlHttpRequest, status, err) {
            alert("Ocorreu um erro");
        }
    });
}

/*==============================================
    GENERAL HTML AND STYLES    
    =============================================*/
/*listar estabelecimentos*/	
function htmlListarEstabelecimentos(estabelecimentos){
	if(estabelecimentos != undefined){
		var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeEstab = document.createElement('a');
		var pCidade = document.createElement('p');
		var pBairro = document.createElement('p');
		var pUnidade = document.createElement('p');
		var iconEdit = document.createElement('div');
		var imgMap = document.createElement('img');
		var modal = document.createElement("div");
		var conteudo = document.createElement("div");

		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divPrincipal.setAttribute("id","divEstab"+estabelecimentos.id_estabelecimento);
		divPrincipal.setAttribute("name", "estabelecimentos");
		divPrincipal.setAttribute("role", "alert");

		divRole.setAttribute("class","panel-heading");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		/* icone seta */					
		img.setAttribute("src","assets/img/setaFechada.png");
		img.setAttribute("width","30px");
		img.setAttribute("id","seta"+estabelecimentos.id_estabelecimento);
		img.setAttribute("style","color: #ffb503;");

		/* icone de editar */
		iconEdit.setAttribute("class", "iconEdit");
		iconEdit.setAttribute("onclick", "estabelecimentoClicadoId('"+estabelecimentos.id_estabelecimento+"')");
		iconEdit.setAttribute("data-target", "#editar_estabelecimento");
		iconEdit.setAttribute("data-toggle", "modal");

		/* tag do nome */
		nomeEstab.setAttribute('href',"visualizar-estabelecimento.html?id="+estabelecimentos.id_estabelecimento);
		nomeEstab.setAttribute('class',"titulos");
		nomeEstab.innerHTML = estabelecimentos.nome;

		/* icone do google maps */
		imgMap.setAttribute("src","assets/img/icone-mapa.png");
		imgMap.setAttribute("class","icone-mapa");		
		imgMap.setAttribute("onclick","googleMaps('"+estabelecimentos.latitude+"','"+estabelecimentos.longitude+"')");

		/* modal */
		modal.setAttribute("id",estabelecimentos.id_estabelecimento);
		modal.setAttribute("class","modal-fechado");
		conteudo.innerHTML = "<p class='conteudo-estab'>Cidade:</p> " + "<p class='informacao-modal'>"+estabelecimentos.cidade+"</p>" +
							 "<p class='conteudo-estab'>Bairro:</p> " + "<p class='informacao-modal'> "+estabelecimentos.bairro+"</p>" +
							 "<p class='conteudo-estab'>Unidade:</p>" + "<p class='informacao-modal'> "+estabelecimentos.numero+"</p>";

		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(iconEdit);
		h4.appendChild(imgMap)
		h4.appendChild(nomeEstab);
		a.appendChild(img);
		divPrincipal.appendChild(modal);
		modal.appendChild(conteudo);
	}	
	var pai = document.getElementById("nomeEstabelecimento");
	pai.appendChild(divPrincipal);	
	img.setAttribute("onclick","controleModalEstab("+estabelecimentos.id_estabelecimento+")");
}

//______________________ CONTROLE MODAL __________________________//
var aberto = "nao";
var idAberto = "0";
function controleModalEstab(idModal)
{
	if(aberto == "nao" && idAberto==0){ //abra modal
		document.getElementById(idModal).className = "modal-aberto";
		document.getElementById("seta"+idModal).src = "assets/img/setaAberta.png";
		aberto="sim";
		idAberto = idModal;
		return;
	}
	
	if(aberto == "sim" && idAberto==idModal){//feche modal
		document.getElementById(idModal).className = "modal-fechado";
		document.getElementById("seta"+idModal).src = "assets/img/setaFechada.png";
		aberto="nao";
		idAberto="0";
		return;
	}
}

function googleMaps(latitude,longitude){
	if(latitude == 0 && longitude == 0){
		alert("Estabelecimento nao possui localizacao cadastrada!");
	}else{
		window.location = "googleMaps.html";
		window.localStorage.latitude = latitude;
		window.localStorage.longitude = longitude;
	}
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

