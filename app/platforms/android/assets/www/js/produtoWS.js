var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//______________________________ AUTO COMPLETE MARCA _______________________________________// 
function autoCompleteMarca(){
	
	var nomeMarca = $("#marcaProduto").val();
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Produto.asmx/autocompleteMarca"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeMarca:'"+nomeMarca+"'}"
		, success: function (data, status){                    
			var marcas = $.parseJSON(data.d); //salvando o nome das marcas em um array
			$("#marcaProduto").autocomplete({ source: marcas }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}
//______________________________ AUTO COMPLETE PRODUTO _______________________________________// 
function autoComplete(){
	
	var nomeProduto = $("#nomeDoProduto").val();
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Produto.asmx/autocomplete"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeProduto:'"+nomeProduto+"'}"
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
			$("#nomeDoProduto").autocomplete({ source: produtos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

//_______________________ PESQUISAR PRODUTO POR NOME ___________________________//
function pesquisarProduto()
{

	var nome = $("#nomeDoProduto").val().trim();
	var marca = $("#marcaProduto").val().trim();
	var embalagem = $('select[name=embalagem]').val(); 
	
	var dados;
	var url;

	//------ Pesquisar por embalagem ----//
	if(nome != "" && embalagem != 0){
		dados =  "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"',nome:'"+nome+"',embalagem:'"+embalagem+"'}"
		url = "http://192.168.56.1/Servidor/Produto.asmx/pesquisarProdutosEmbalagem"
	}
	
	//------ Pesquisar por nome -----//
	else if(nome != ""){
		dados = "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"',nome:'"+nome+"'}"
		url   = "http://192.168.56.1/Servidor/Produto.asmx/pesquisarProdutosNome";
	}
	
	//------ Pesquisar por marca -----//
	else if(marca != ""){
		dados = "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"'}"
		url = "http://192.168.56.1/Servidor/Produto.asmx/pesquisarProdutosMarca"	
	}
	
	else
	{
		alert("Preencha pelo menos Nome ou Marca");
	}
	
	$.ajax({
        type: 'POST'
        , url: url
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: dados
		, success: function (data, status){  
			var produto = $.parseJSON(data.d);
			
			if(produto.erro == "Erro de Pesquisa") {	alert(produto.Message);	}
			else
			{	
				document.getElementById("referencia").innerHTML = "";
				for(var i=0 ;i<produto.length ;i++)
				{ listaEstilo(produto[i]); }	
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

//---------- Construção de HTML no javascript --------------//
function listaEstilo(produto)
{
	var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeProduto = document.createElement("p");
		
		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divRole.setAttribute("class","panel-heading");
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		img.setAttribute("src","img/detalhes.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");
		
		nomeProduto.setAttribute("class","ajustes-lista");		
		nomeProduto.innerHTML = produto.nome;
		
		//--------//
		
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeProduto);
		a.appendChild(img);
		
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);	
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
