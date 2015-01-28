var ID_USUARIO = window.localStorage.UsuarioId;
var TOKEN = window.localStorage.UsuarioToken;

//___________________ CRIAR LISTA ________________________//
function criarLista(){
	console.log(ID_USUARIO);
	console.log(TOKEN);
	var nomeLista = $("#nome_lista").val();
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	
    if (nomeLista != ''){ 	
		$.ajax({
            type: 'POST'
            , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/criarLista"
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{nomeLista:'"+nomeLista+"',idUsuario:'"+idUsuario+"',token:'"+token+"'}"
            , success: function (data, status){                    
				var itens = $.parseJSON(data.d); //salvando retorno do metodo do servidor  
				console.log(itens.erro);               
				if(typeof(itens.erro) === 'undefined'){
					alert("Lista criada com sucesso!");
					window.location = "visualizar-lista.html?id="+itens.id_listaDeProdutos;
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
		window.location = "principal.html#criar_lista";
		return false;
    }
}

//___________________ RETORNAR NOME LISTA ________________________//
function retornarNomeLista(){
	var idLista = parseInt(window.localStorage.idListaClicada);
    $.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarLista"
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
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a função
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'						//tipos de dados de retorno
       , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d); 		    //pegando retorno do servidor
			
			for(var i=0; i<lista.length ;i++){
				if(lista[i] != undefined){
					var inp = document.createElement("div");
					var aTag = document.createElement('a');
					var iconEdit = document.createElement('div');
					iconEdit.setAttribute("class", "iconEdit");
					iconEdit.setAttribute("onclick", "listaClicadaEditar('"+lista[i].id_listaDeProdutos+"')");
					iconEdit.setAttribute("data-target", "#editar_lista");
					iconEdit.setAttribute("data-toggle", "modal");
					var iconRemove = document.createElement('div');
					iconRemove.setAttribute("class", "iconRemove");
					iconRemove.setAttribute("onclick", "excluirLista('"+lista[i].id_listaDeProdutos+"')");
					aTag.setAttribute('href',"visualizar-lista.html?id="+lista[i].id_listaDeProdutos);
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
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//_____________________________________ ADICIONAR PRODUTOS À LISTA _____________________________________//
function adicionarProdutoALista(){
	var nomeDoProduto = $("#nomeDoProduto").val();
	var formatoDoCodigo = $("#formato").val();
	var codigoDeBarras = $("#cod_barra").val();
	var quantidade = parseInt($("#quantidade").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	
    if (nomeDoProduto.trim() != ''){
		$.ajax({
            type: 'POST'
            , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/cadastrarProduto"
			, crossDomain:true
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{nomeProduto:'"+nomeDoProduto+"',codigoDeBarras:'"+codigoDeBarras+"',tipoCodigo:'"+formatoDoCodigo+"',quantidade:'"+quantidade+"',idLista:'"+idLista+"'}"
            , success: function (data, status){
                var itens = $.parseJSON(data.d); //salvando retorno do metodo do servidor
                if(itens == "-1"){
					alert("Erro ao cadastrar o produto");
					return;							
				}else{
					alert("Produto cadastrado com sucesso!");
					window.location = "visualizar-lista.html?id="+idLista;
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
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarProdutosDaLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idLista:'"+idLista+"'}"
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);					   //indice para pegar o nome
			var idProduto = 0;						  //indice para pegar o id
			for(var i=0; i<produtos.length ;i++){
				if(produtos[idProduto] != undefined){
					var inp = document.createElement("div");
					var aTag = document.createElement('a');
					var iconEdit = document.createElement('div');
					iconEdit.setAttribute("class", "iconEdit");
					iconEdit.setAttribute("data-target", "#");
					iconEdit.setAttribute("data-toggle", "modal");
					var iconRemove = document.createElement('div');
					iconRemove.setAttribute("class", "iconRemove");
					iconRemove.setAttribute("onclick", "");
					aTag.innerHTML = produtos[i].nome;
					inp.setAttribute("id",produtos[i].id);
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
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/editarNomeLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idLista:'"+idLista+"',novoNomeDaLista:'"+novoNomeDaLista+"',idUsuario:'"+idUsuario+"',token:'"+token+"'}"
        , success: function (data, status){                    
			var itens = $.parseJSON(data.d);               
			if(itens == "-1"){
				alert("Erro ao alterar o nome da lista.");
				return;							
			}else{
				alert("Nome da lista alterado com sucesso!");
				window.location = "listas.html";
				// window.location = "visualizar-lista.html?id="+idLista;
				return;
			}
		}
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//______________________________________ EXCLUIR LISTA _____________________________________________//
function excluirLista(id) {
	var idLista = id; //parseInt(window.localStorage.idListaClicada);
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
   
   $.ajax({
        type: 'POST'
        , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/removerLista"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idLista:'"+idLista+"',idUsuario:'"+idUsuario+"',token:'"+token+"'}"
        , success: function (data, status){                    
			var itens = $.parseJSON(data.d);                
			if(itens == "-1"){
				alert("Erro ao excluir a lista.");
				return;							
			}else{
				alert("Lista excluida com sucesso!");
				window.location = "listas.html";
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