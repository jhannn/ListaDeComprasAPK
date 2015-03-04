var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;
// window.localStorage.produtoRecemAdicionado = "";

//___________________ CRIAR LISTA ________________________//
function criarLista(){
	var nomeLista = $("#nome_lista").val();
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	
    if (nomeLista != ''){ 	
		$.ajax({
            type: 'POST'
            , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/criarLista"
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',nomeLista:'"+nomeLista+"'}"
            , success: function (data, status){                    
				var lista = $.parseJSON(data.d); //salvando retorno do metodo do servidor                 
				if(typeof(lista.erro) === 'undefined'){
					alert("Lista criada com sucesso!");
					window.location = "visualizar-lista.html?id="+lista.id_listaDeProdutos;
					return;						
				}else{					
					alert(lista.erro + "\n" + lista.Message);
					return;
				}
			}
            , error: function (xmlHttpRequest, status, err) {
                $('.resultado').html('Ocorreu um erro');
            }
        });
    }else{
        alert("Campo vazio.");
		window.location = "principal.html#criar_lista";
		return false;
    }
}

//___________________ RETORNAR NOME LISTA ________________________//
function retornarNomeLista(){
	var idLista = parseInt(window.localStorage.idListaClicada);
    $.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/retornarLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        ,data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idListaDeProdutos:'"+idLista+"'}"
        , success: function (data, status){                    
			var nomeLista = $.parseJSON(data.d);               
			$("#tituloLista").html(nomeLista.nome);
		}
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_____________________________________ RETORNAR LISTA _____________________________________//
function retornarListas(){	
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a função
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'						//tipos de dados de retorno
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d);
			if(typeof(lista.erro) === 'undefined'){
				for(var i=0; i<lista.length ;i++){
					if(lista[i] != undefined){
						var inp = document.createElement("div");
						var aTag = document.createElement('a');
						var iconEdit = document.createElement('div');
						var iconRemove = document.createElement('div');
						
						iconEdit.setAttribute("class", "iconEdit");
						iconEdit.setAttribute("onclick", "listaClicadaEditar('"+lista[i].id_listaDeProdutos+"')");
						iconEdit.setAttribute("data-target", "#editar_lista");
						iconEdit.setAttribute("data-toggle", "modal");
						iconEdit.setAttribute("style", "right: 10px;");
						
						iconRemove.setAttribute("class", "iconRemove");
						iconRemove.setAttribute("onclick", "excluirLista('"+lista[i].id_listaDeProdutos+"')");
						
						aTag.setAttribute('class','titulos');
						
						if(window.localStorage.estab == "estab"){ //se a página lista foi chamada para o checkin de estabelecimeto
							aTag.setAttribute("href","checkinProdutos.html"); //se o nome for clicado vai pra checkin
							aTag.setAttribute("onclick","guardarIdListaCheckin('"+lista[i].id_listaDeProdutos+"')"); //salva o id da lista
						}else{
							aTag.setAttribute('href',"visualizar-lista.html?id="+lista[i].id_listaDeProdutos);					
						}
						
						aTag.innerHTML = lista[i].nome;
						
						inp.setAttribute("id",lista[i].id_listaDeProdutos);
						inp.setAttribute("class", "alert alert-warning");
						inp.setAttribute("name", "listas");
						inp.setAttribute("role", "alert");
						inp.appendChild(aTag);
						inp.appendChild(iconRemove);
						inp.appendChild(iconEdit);
					}							
					var pai = document.getElementById("nomeLista");
					pai.appendChild(inp);
				}
			}else{
				alert(itens.erro + "\n" + itens.Message);
				window.location = "index.html";
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//Função para guardar o id da lista clicada no local Storage 
//se ela tiver sido clicada para um checkin
function guardarIdListaCheckin(idLista){
	window.localStorage.listaClicadaCheckin = idLista;
}

function zerarChekinEstabelecimento(){
	localStorage.removeItem("estab");
}

//_____________________________________ ADICIONAR PRODUTOS À LISTA _____________________________________//
function criarProduto(){
	var nomeDoProduto = $("#nomeProduto").val();
	var codigoDeBarras = $("#cod_barra").val();
	var marca = $("#marcaDoProduto").val();
	var embalagem = $('select[name=embalagemCadastrar]').val(); 
	var quantidade = parseInt($("#quantidadeDoProduto").val());
	var unidade = parseInt($("#unidadeDoProduto").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	
	if(nomeDoProduto=="" || marca==""){alert("Preencha todos os campos!");return;}
	
	var url="http://192.168.56.1/Servidor/ListaDeProdutos.asmx/criarProduto";
	var data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',quantidade:'"+quantidade+"'}";
	
	if(codigoDeBarras.trim() !=''){
		url="http://192.168.56.1/Servidor/ListaDeProdutos.asmx/criarProdutoComCodigo";
		data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',codigo:'"+codigoDeBarras+"'tipoCod:'"+tipoCod+"',quantidade:'"+quantidade+"'}";
	}	
	
	if (nomeDoProduto.trim() != ''){
		$.ajax({
            type: 'POST'
            , url: url
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: data
            , success: function (data, status){
				var retorno=$.parseJSON(data.d);
				if(retorno=="OK"){
					alert("Produto cadastrado com sucesso!");
					
					if(window.localStorage.flag == 1){
						window.localStorage.produtoRecemAdicionado += ","+window.localStorage.listaClicadaCheckin+"-"+nomeDoProduto;
						window.location = "checkinProdutos.html";
						return;	
					}else{
						window.location = "visualizar-lista.html?id="+idLista;
						return;						
					}
				}else{
					alert(retorno.erro + "\n" + retorno.mensagem);
					return;
				}	
            }
            , error: function (xmlHttpRequest, status, err) {
                $('.resultado').html('Ocorreu um erro');
            }
        });
	}   
}

//_____________________________________ RETORNAR PRODUTOS DA LISTA (VISUALIZAR LISTA) _____________________________________//
function retornarProdutosDaListas(){	
	//Pegar id pela URR e mostrar produtos da lista 
	var queries = {};
	$.each(document.location.search.substr(1).split('&'), function(c,q){
		var i = q.split('=');
		queries[i[0].toString()] = i[1].toString();
	});
	
	// $("#nomeDaLista").html(queries['id']);
	var idLista=queries['id'];
	window.localStorage.idListaClicada= idLista;
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/retornarLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idListaDeProdutos:'"+idLista+"'}"
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);					   //indice para pegar o nome
			if(typeof(produtos.erro) === 'undefined'){
				for(var i=0; i<produtos.itens.length ;i++){
					if(produtos.itens[i] != undefined){
						var inp = document.createElement("div");
						var aTag = document.createElement('a');
						var iconEdit = document.createElement('div');
						var iconRemove = document.createElement('div');
						
						iconEdit.setAttribute("class", "icone-editar-produto");
						iconEdit.setAttribute("data-target", "#");
						iconEdit.setAttribute("data-toggle", "modal");
						
						iconRemove.setAttribute("class", "icone-remove-produto");
						iconRemove.setAttribute("onclick", "excluirProdutoDaLista('"+produtos.itens[i].id_produto+"')");
						
						aTag.innerHTML = produtos.itens[i].nome+"  Qtd. "+produtos.itens[i].quantidade;
						inp.setAttribute("id",produtos.itens[i].id_produto);
						inp.setAttribute("class", "alert alert-warning");
						inp.setAttribute("name", "produtos");
						inp.setAttribute("role", "alert");
						inp.appendChild(aTag);
						inp.appendChild(iconRemove);
						inp.appendChild(iconEdit);							
					}						
					var pai = document.getElementById("nomeDaLista");
					pai.appendChild(inp);
				}
			}else{
				alert(itens.erro + "\n" + itens.Message);
				window.location = "index.html";
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_____________________________ EDITAR NOME LISTA____________________________//
function editarNomeLista(){
	var idLista = parseInt(window.localStorage.idEditarLista);
	var idUsuario = ID_USUARIO;
	var novoNomeDaLista = $("#novo_nome_lista").val();
	var token = TOKEN;
    $.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/editarNomeLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',idLista:'"+idLista+"',novoNomeDaLista:'"+novoNomeDaLista+"'}"
        , success: function (data, status){                    
			var itens = $.parseJSON(data.d);               
			if(itens == "Ok"){
				alert("Nome da lista alterado com sucesso!");
				window.location = "listas.html";
				return;										
			}else{
				alert("Erro ao alterar o nome da lista.");
				return;	
			}
		}
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//______________________________________ EXCLUIR LISTA _____________________________________________//
function excluirLista(id){
	var confirme =  confirm ("Tem certeza que deseja excluir essa lista?")
	if(confirme){
		var idLista = id;
		var idUsuario = ID_USUARIO;
		var token = TOKEN;
	   
	   $.ajax({
			type: 'POST'
			, url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/removerLista"
			, crossDomain:true
			, contentType: 'application/json; charset=utf-8'
			, dataType: 'json'
			, data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',idLista:'"+idLista+"'}"
			, success: function (data, status){                    
				var itens = $.parseJSON(data.d);                
				if(itens == "OK"){
					alert("Lista excluida com sucesso!");
					window.location = "listas.html";
					return;			
				}else{
					alert("Erro ao excluir a lista.");
					return;	
				}				
			}
			, error: function (xmlHttpRequest, status, err) {
				$('.resultado').html('Ocorreu um erro');
			}
		});
	}
}

//_______________Excluir Produto da lista_______________________//
function excluirProdutoDaLista(id){
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	var idProduto = parseInt(id);
   
   $.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/removerProdutoDaLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+idUsuario+"',token:'"+token+"',idProduto:'"+idProduto+"',idLista:'"+idLista+"'}"
        , success: function (data, status){                    
			var retorno = $.parseJSON(data.d);                
			if(retorno == "OK"){
				alert("Produto excluido da lista!");
				window.location = "visualizar-lista.html?id="+idLista;
				return;						
			}else{
				alert(retorno.erro + "\n" + itens.Message);
				window.location = "visualizar-lista.html?id="+idLista;
				return;
			}				
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

function listaClicadaEditar(id) {
	window.localStorage.idEditarLista = id;
}

//_______________________ RETORNAR ESTABELECIMENTOS MAIS BARATO ______________________//

function retornarEstabelecimentosMaisBaratos(){	

	var idLista = parseInt(window.localStorage.idListaClicada);
	
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/buscarOfertas"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"'}"
		, success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);
			
			//------------ ordenar -----------------//
			var i, j, preco,oferta,guardar;
			for (i = 1; i < estabelecimentos.length; i++) {
			   preco = estabelecimentos[i].precoDaLista;
			   guardar = estabelecimentos[i];
			   oferta = estabelecimentos[i].itensEncontrados;
			   j = i;
			   while((j>0) && 
			   (oferta>estabelecimentos[j-1].itensEncontrados  || (preco<estabelecimentos[j-1].precoDaLista && oferta==estabelecimentos[j-1].itensEncontrados)))
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
	divPrincipal.setAttribute("style","margin-left: 0px;");
	divPrincipal.setAttribute("id","divEstab"+estabelecimentos.idEstabelecimento); //passando id do estabelecimento para a div principal
	divRole.setAttribute("class","panel-heading");
	h4.setAttribute("class","panel-title");
	a.setAttribute("style","color: #ffb503;");
		
	img.setAttribute("src","assets/img/setaFechada.png");
	img.setAttribute("id","seta"+estabelecimentos.idEstabelecimento);
	img.setAttribute("width","30px");
	img.setAttribute("style","color: #ffb503;margin: -10px;");
		
	nomeProduto.setAttribute("class","ajustes-lista");		
	nomeProduto.innerHTML = estabelecimentos.nomeEstabelecimento; //nome do estabelecimento
		
	oferta.setAttribute("class","ajustes-oferta");		
	oferta.innerHTML = estabelecimentos.itensEncontrados+"/"+estabelecimentos.itensTotal; //oferta
		
	valor.setAttribute("class","ajustes-valor");		
	valor.innerHTML = "R$ "+(estabelecimentos.precoDaLista).toFixed(2);//valor
		
	modal.setAttribute("id","mod"+estabelecimentos.idEstabelecimento);
	modal.setAttribute("class","modal-fechado");
	conteudo.innerHTML = "<p>Foram encontrados nesse supermercado "+estabelecimentos.itensEncontrados+" produtos,"+
							 " no total de "+estabelecimentos.itensTotal+" produtos cadastrados na sua lista de compras</br></p>"; 
		
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
	divPrincipal.setAttribute("onclick","controleModal("+estabelecimentos.idEstabelecimento+")");
}

var aberto = "nao";
var idAberto = "0";
function controleModal(idModal)
{
	if(aberto == "nao" && idAberto==0){ //abra modal
		document.getElementById("mod"+idModal).className = "modal-aberto";
		document.getElementById("seta"+idModal).src = "assets/img/setaAberta.png";
		aberto="sim";
		idAberto = idModal;
		return;
	}
	
	if(aberto == "sim" && idAberto==idModal){//feche modal
		document.getElementById("mod"+idModal).className = "modal-fechado";
		document.getElementById("seta"+idModal).src = "assets/img/setaFechada.png";
		aberto="nao";
		idAberto="0";
		return;
	}
}


////----------------------Loucuras de Johann ---------------------------//

function mostrarPesquisa(){
	var newFields = document.getElementById('botaoLoucao');
    newFields.style.display = 'block';
	var newFields = document.getElementById('nomeDoProduto');
    newFields.style.display = 'block';
}

function procurarProduto(){	
	var nome = $("#nomeDoProduto").val().trim();
	window.localStorage.ProdutoProcurado=nome;
	window.localStorage.flag = 0;
	window.location = "procurarProdutosLista.html";
}

function voltarParaAListaAnterior(){
	var idLista = window.localStorage.idListaClicada;
	var flag = window.localStorage.flag;
	if(flag==1){
		window.location = "checkinProdutos.html"
	}else{
		window.location = "visualizar-lista.html?id="+idLista;	
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