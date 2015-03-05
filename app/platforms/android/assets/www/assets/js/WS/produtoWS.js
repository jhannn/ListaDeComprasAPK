var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//______________________________ AUTO COMPLETE MARCA _______________________________________// 
function autoCompleteMarca(flag){
	
	var id;
	if(flag==1){id = "#marcaDoProduto" }else{id="#marcaProduto"}
	
	var nomeMarca = $(id).val();
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Produto.asmx/autocompleteMarca"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeMarca:'"+nomeMarca+"'}"
		, success: function (data, status){                    
			var marcas = $.parseJSON(data.d); //salvando o nome das marcas em um array
			$(id).autocomplete({ source: marcas }); 
        }
        , error: function (xmlHttpRequest, status, err) {
            alert('Ocorreu um erro');
        }
    });	
}
//______________________________ AUTO COMPLETE PRODUTO _______________________________________// 
function autoComplete(flag){
	
	var id;
	if(flag==1){id = "#nomeProduto" }else{id="#nomeDoProduto"}
	
	var nomeProduto = $(id).val();
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Produto.asmx/autocomplete"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeProduto:'"+nomeProduto+"'}"
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
			$(id).autocomplete({ source: produtos }); 
        }
        , error: function (xmlHttpRequest, status, err) {
           alert('Ocorreu um erro');
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
	var passou=false;
	
	if(window.localStorage.ProdutoProcurado!=undefined && window.localStorage.ProdutoProcurado!=''){
		nome=window.localStorage.ProdutoProcurado;
		marca="";
		console.log(nome);
		window.localStorage.ProdutoProcurado='';
	}

	//------ Pesquisar por embalagem ----//
	if(nome != "" && embalagem != 0){
		dados =  "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"',nome:'"+nome+"',embalagem:'"+embalagem+"'}"
		url = "http://192.168.56.1/Servidor/Produto.asmx/pesquisarProdutosEmbalagem"
		passou=true;
	}
	
	//------ Pesquisar por nome -----//
	else if(nome != ""){
		dados = "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"',nome:'"+nome+"'}"
		url   = "http://192.168.56.1/Servidor/Produto.asmx/pesquisarProdutosNome";
		passou=true;
	}
	
	//------ Pesquisar por marca -----//
	else if(marca != ""){
		dados = "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',marca:'"+marca+"'}"
		url = "http://192.168.56.1/Servidor/Produto.asmx/pesquisarProdutosMarca"	
		passou=true;
	}
	
	else if(passou==false || window.localStorage.ProdutoProcurado!=undefined){
		document.getElementById("referencia").innerHTML = "";
		var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var nomeProduto = document.createElement("p");
				
		divRole.setAttribute("class", "btn btn-primary");
		divRole.setAttribute("data-target", "#cadastrar_produto_lista");
		divRole.setAttribute("data-toggle", "modal");
		divRole.innerHTML="Cadastrar um novo Produto!!"

		// divPrincipal.setAttribute("class","panel panel-default");				
		nomeProduto.setAttribute("class","alert-lista-nao-criada");				
		nomeProduto.innerHTML="Nada foi encontrado!! Cadastre um novo Produto!";
				
		divPrincipal.appendChild(nomeProduto);
		divPrincipal.appendChild(divRole);
				
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);
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
			if(produto.erro == "Erro de Pesquisa"){
				document.getElementById("referencia").innerHTML = "";
				var divPrincipal = document.createElement("div");
				var divRole = document.createElement("div");
				var nomeProduto = document.createElement("div");
				
				divRole.setAttribute("class", "btn btn-primary");
				divRole.setAttribute("data-target", "#cadastrar_produto_lista");
				divRole.setAttribute("data-toggle", "modal");
				divRole.innerHTML="Cadastrar um novo Produto!!"

				// divPrincipal.setAttribute("class","panel panel-default");				
				nomeProduto.setAttribute("class","alert-lista-nao-criada");				
				nomeProduto.innerHTML="Nada foi encontrado!! Cadastre um novo Produto!";
				
				divPrincipal.appendChild(nomeProduto);
				divPrincipal.appendChild(divRole);
				
				var pai = document.getElementById("referencia");
				pai.appendChild(divPrincipal);
			}else{	
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

//______________________________ ADICIONAR PRODUTO NA LISTA _______________________________________// 
function adicionarProdutoNaLista(){	
	var quantidade = parseInt($("#quantidadeDeProdutosParaAdicionarNaLista").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idProduto=parseInt(window.localStorage.idProdutoAdicionarLista);
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/cadastrarProduto"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idProduto:'"+idProduto+"',quantidade:'"+quantidade+"'}"
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d);
			if(produtos=="OK"){
				alert("Produto cadastrado com sucesso!");
				
				if(window.localStorage.flag == 1){								//indica que essa função foi chamada do checkin
					window.location = "checkinProdutos.html";					//vai para tela de checkin
					return;
				}else{															//função chamada da lista
					window.location = "visualizar-lista.html?id="+idLista;      
					return;		
				}
			
			}else{
				alert(itens.erro + "\n" + itens.Message);
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });	
}

//____________________________ RETORNAR ITENS ___________________________//
function retornarItens(){
	var idProduto = window.localStorage.itemVisializar;
	
	$.ajax({
            type: 'POST'
            , url: "http://192.168.56.1/Servidor/Item.asmx/retornarItem"
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idProduto:'"+idProduto+"'}"
            , success: function (data, status){
				var itens = $.parseJSON(data.d);
				
				//------------ ordenar -----------------//
				var i, j, preco,qualificacao,guardar;
				for (i = 1; i < itens.length; i++) {
				   qualificacao = itens[i].qualificacao;
				   guardar = itens[i];
				   preco = itens[i].preco;
				   j = i;
				   while((j>0) && 
				   (preco<itens[j-1].preco  || (qualificacao>itens[j-1].qualificacao && preco==itens[j-1].preco)))
				   {
						itens[j] = itens[j-1];
						j = j-1;
				   }
				   itens[j] = guardar;
				}	
				
				document.getElementById("iten_nome").innerHTML = itens[0].nomeProduto;
				for(var t=0; t<itens.length; t++)	
				listaItens(itens[t]);					
            }
            , error: function (xmlHttpRequest, status, err) {
                alert('Ocorreu um erro no servidor');
            }
        });
	
}


////________________________Editar Produto_____________________////
function editarProduto(){
	var nomeDoProduto = $("#nomeDoProdutoEditado").val();
	var codigoDeBarras = $("#cod_barraEditado").val();
	var marca = $("#marcaDoProdutoEditado").val();
	var embalagem = $('select[name=embalagemDoProdutoEditado]').val(); 
	var quantidade = parseInt($("#quantidadeDoProdutoEditado").val());
	var unidade = parseInt($("#unidadeDoProdutoEditado").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idProduto = parseInt(window.localStorage.idProdutoEditar);
	
	var url="http://192.168.56.1/Servidor/ListaDeProdutos.asmx/criarProduto";
	var data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idProduto:'"+idProduto+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',quantidade:'"+quantidade+"'}";
	
	if(codigoDeBarras.trim() !=''){
		url="http://192.168.56.1/Servidor/ListaDeProdutos.asmx/criarProdutoComCodigo";
		data="{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idProduto:'"+idProduto+"',marca:'"+marca+"',nome:'"+nomeDoProduto+"',unidade:'"+unidade+"',embalagem:'"+embalagem+"',codigo:'"+codigoDeBarras+"'tipoCod:'"+tipoCod+"',quantidade:'"+quantidade+"'}";
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
					alert("Produto editado com sucesso!");
					window.location = "visualizar-lista.html?id="+idLista;
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
	}   
}

//____________________________Id Produto no localStorage___________________//
function adicionarIdProdutoLocalStorage(id){
	window.localStorage.idProdutoAdicionarLista=id;
}

//____________________________Id Produto no localStorage___________________//
function pegarIdProdutoEditar(id){
	window.localStorage.idProdutoEditar=id;	
}

//---------- Construção de HTML no javascript --------------//
function listaEstilo(produto)
{
	var divPrincipal = document.createElement("div");
		var divProduto = document.createElement("div");
		var divRole = document.createElement("div");
		var iconEdit = document.createElement('div');
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeProduto = document.createElement("a");
		
		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divProduto.setAttribute("class","panel-heading");
		divRole.setAttribute("style", "display: block;");
		divRole.setAttribute("style", "width: 93% !important;");
		divRole.setAttribute("onclick", "adicionarIdProdutoLocalStorage('"+produto.id_produto+"')");
		divRole.setAttribute("data-target", "#adicionar_quantidade_de_produto_na_lista");
		divRole.setAttribute("data-toggle", "modal");	
		
		iconEdit.setAttribute("class", "iconEdit");
		iconEdit.setAttribute("style", "bottom: 32px;");
		iconEdit.setAttribute("onclick", "pegarIdProdutoEditar('"+produto.id_produto+"')");
		iconEdit.setAttribute("data-target", "#editar_produto");
		iconEdit.setAttribute("data-toggle", "modal");
		
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		img.setAttribute("src","assets/img/setaFechada.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");
		
		nomeProduto.setAttribute("class","lista-pesquisa");		
		nomeProduto.setAttribute("href","visualizar-itens.html");		
		nomeProduto.setAttribute("onclick","itemVisializar('"+produto.id_produto+"');");		
		nomeProduto.innerHTML = produto.nome;
		
		//--------//
		divPrincipal.appendChild(divProduto);
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divProduto.appendChild(divRole);
		divProduto.appendChild(iconEdit);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeProduto);
		a.appendChild(img);
		
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);	
}

//______ listar itens ________//
function listaItens(produto)
{
	var divPrincipal = document.createElement("div");
		var divProduto = document.createElement("div");
		var divRole = document.createElement("div");
		var iconEdit = document.createElement('div');
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var estrela = document.createElement("img");
		var nomeEstabelecimento = document.createElement("p");
		var preco = document.createElement("p");
		var qualificacao = document.createElement("p");
		
		//--estilos--
		divPrincipal.setAttribute("class","panel panel-default");
		divProduto.setAttribute("class","panel-heading");
		divProduto.setAttribute("id",produto.id_item);
		divRole.setAttribute("style", "display: block;");
		divRole.setAttribute("style", "width: 93% !important;");
		
		h4.setAttribute("class","panel-title");
		a.setAttribute("style","color: #ffb503;");
		
		img.setAttribute("src","assets/img/setaFechada.png");
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");
		
		nomeEstabelecimento.innerHTML = produto.nomeEstabelecimento;
		nomeEstabelecimento.setAttribute("class","estab-nome-item");
		
		preco.innerHTML = "R$ " +(produto.preco).toFixed(2);
		preco.setAttribute("class","preco-item");
		
		qualificacao.innerHTML = produto.qualificacao;
		qualificacao.setAttribute("class","qualificacao");
		
		estrela.setAttribute("src","assets/img/estrela.png");
		estrela.setAttribute("style","height: 20px; margin-top: -4px;");
		
		//--------//
		divPrincipal.appendChild(divProduto);
		divPrincipal.appendChild(divRole);
		divPrincipal.appendChild(h4);
		divPrincipal.appendChild(a);
		divPrincipal.appendChild(img);
		divProduto.appendChild(divRole);
		divProduto.appendChild(iconEdit);
		divRole.appendChild(h4);
		h4.appendChild(a);
		h4.appendChild(nomeEstabelecimento);
		h4.appendChild(preco);
		h4.appendChild(qualificacao);
		qualificacao.appendChild(estrela);
		a.appendChild(img);
		
		var pai = document.getElementById("referencia");
		pai.appendChild(divPrincipal);	
}

function itemVisializar(idProduto){
	window.localStorage.itemVisializar = idProduto;
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