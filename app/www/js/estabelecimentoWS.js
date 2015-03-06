var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

function cadastrarEstabelecimento(){
	var nomeEstabelecimento = $("#nome").val();
	var bairroEstabelecimento = $("#bairroEstabelecimento").val();
	var cidadeEstabelecimento = $("#cidadeEstabelecimento").val();
	var unidadeEstabelecimento = $("#unidadeEstabelecimento").val();
	var idUsuario = ID_USUARIO;
	var token = TOKEN;	
		
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
				, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"',numero:'"+parseInt(unidadeEstabelecimento)+"'}"
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
					$('.resultado').html('Ocorreu um erro');
				}
			});
		}else{
			alert("Campo vazio.");
			window.location = "estabelecimento.html#criar-estabelecimento";
			return false;
		}
	}
}

function listarEstabelecimento(){	
	nomeEstabelecimento='';
	bairroEstabelecimento='';
	cidadeEstabelecimento='';
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/listarEstabelecimento"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'"+nomeEstabelecimento+"',bairro:'"+bairroEstabelecimento+"',cidade:'"+cidadeEstabelecimento+"'}"
        , success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);		
			for(var i=0; i<estabelecimentos.length ;i++){
				if(estabelecimentos[i] != undefined){
					var inp = document.createElement("div");
					var aTag = document.createElement('a');
					var pCidade = document.createElement('p');
					var pBairro = document.createElement('p');
					var pUnidade = document.createElement('p');
					var iconEdit = document.createElement('div');
					var imgMap = document.createElement('img');

					iconEdit.setAttribute("class", "iconEdit");
					iconEdit.setAttribute("onclick", "estabelecimentoClicadoId('"+estabelecimentos[i].id_estabelecimento+"')");
					iconEdit.setAttribute("data-target", "#editar_estabelecimento");
					iconEdit.setAttribute("data-toggle", "modal");
					aTag.setAttribute('href',"visualizar-estabelecimento.html?id="+estabelecimentos[i].id_estabelecimento);
					aTag.innerHTML = estabelecimentos[i].nome;
					imgMap.setAttribute("src","img/icone-mapa.png");
					imgMap.setAttribute("class","icone-mapa");		
					imgMap.setAttribute("onclick","googleMaps()");		
					pCidade.innerHTML = "<label>Cidade:  </label>"+estabelecimentos[i].cidade;
					pBairro.innerHTML = "<label>Bairro:  </label>"+estabelecimentos[i].bairro;
					pUnidade.innerHTML = "<label>Unidade:  </label>"+estabelecimentos[i].numero;
					inp.setAttribute("id",estabelecimentos[i].id_estabelecimento);
					inp.setAttribute("class", "alert alert-warning");
					inp.setAttribute("name", "estabelecimentos");
					inp.setAttribute("role", "alert");
					inp.appendChild(aTag);
					inp.appendChild(pCidade);
					inp.appendChild(imgMap);
					inp.appendChild(pBairro);
					inp.appendChild(pUnidade);
					inp.appendChild(iconEdit);
				}							
				var pai = document.getElementById("nomeEstabelecimento");
				pai.appendChild(inp);
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function googleMaps()
{
	window.location = "googleMaps.html";
}

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
					$('.resultado').html('Ocorreu um erro');
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
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

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
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_______________________ RETORNAR ESTABELECIMENTOS MAIS BARATO ______________________//

function retornarEstabelecimentosMaisBaratos(){	

	var idLista = parseInt(window.localStorage.idListaClicada);
	
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/listarEstabelecimentosMaisBarato"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"'}"
		, success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);
			
			//------------ ordenar -----------------//
			var i, j, preco,oferta,guardar;
			for (i = 1; i < estabelecimentos.length; i++) {
			   preco = estabelecimentos[i].precoLista;
			   guardar = estabelecimentos[i];
			   oferta = estabelecimentos[i].produtosEncontrados;
			   j = i;
			   while((j>0) && 
			   (oferta>estabelecimentos[j-1].produtosEncontrados || 
			   (oferta==estabelecimentos[j-1].produtosEncontrados && preco<estabelecimentos[j-1].precoLista)) )
			   {
					estabelecimentos[j] = estabelecimentos[j-1];
					j = j-1;
			   }
			   estabelecimentos[j] = guardar;
			}
			//------------------------------------------//

			document.getElementById("referenciaEstab").innerHTML = "";
			for(var i=0 ;i<estabelecimentos.length ;i++){
				listaEstiloEstab(estabelecimentos[i]); 
			}	
			
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

function listaEstiloEstab(estabelecimentos)
{
	var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeProduto = document.createElement("p");
		var oferta = document.createElement("p");
		var valor = document.createElement("p");
		var modal = document.createElement("div");
		var conteudo = document.createElement("div");

		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divPrincipal.setAttribute("id",estabelecimentos.idEstabelecimento); //passando id do estabelecimento para a div principal
		divRole.setAttribute("class","panel-heading");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		img.setAttribute("src","img/detalhes.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");
		
		nomeProduto.setAttribute("class","ajustes-lista");		
		nomeProduto.innerHTML = estabelecimentos.nomeEstabelecimento; //nome do estabelecimento
		
		oferta.setAttribute("class","ajustes-oferta");		
		oferta.innerHTML = estabelecimentos.produtosEncontrados+"/"+estabelecimentos.totalProdutos; //oferta
		
		valor.setAttribute("class","ajustes-valor");		
		valor.innerHTML = "R$"+estabelecimentos.precoLista;//valor
		
		modal.setAttribute("id","modal"+estabelecimentos.idEstabelecimento);
		modal.setAttribute("class","modal-fechado");
		conteudo.innerHTML = "<p>Foram encontrados nesse supermercado "+estabelecimentos.produtosEncontrados+" produtos,"+
							 " no total de "+estabelecimentos.totalProdutos+" produtos cadastrados na sua lista de compras</br></p>"; 
		
		//--------//
		
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeProduto);
		h4.appendChild(oferta);
		h4.appendChild(valor);
		a.appendChild(img);
		divPrincipal.appendChild(modal);
		modal.appendChild(conteudo);
		
		var pai = document.getElementById("referenciaEstab");
		pai.appendChild(divPrincipal);	
		divPrincipal.setAttribute("onclick","controleModal(modal"+estabelecimentos.idEstabelecimento+")");
}

var aberto = "nao";
var idAberto = "0";
function controleModal(id)
{
	if(aberto == "nao" && idAberto==0){ //abra modal
		document.getElementById(id.id).className = "modal-aberto";
		aberto="sim";
		idAberto = id.id;
		return;
	}
	
	if(aberto == "sim" && idAberto==id.id){//feche modal
		document.getElementById(id.id).className = "modal-fechado";
		aberto="nao";
		idAberto="0";
		return;
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





