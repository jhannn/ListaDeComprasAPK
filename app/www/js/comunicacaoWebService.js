/*
var ID_USUARIO = 1;
var TOKEN = "124576453875";
*/
/*
//____________________________________ FAZER LOGIN ______________________________________________//
function fazerLogin() {
    var email = $("#email_logar").val();
    var senha = $("#senha_logar").val();
	var token = TOKEN;
	
    if (email != '' && senha != '') {
     
		 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/fazerLogin"
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var retorno = $.parseJSON(data.d);
					if(retorno == "-1")
                    
					{
						alert("Voce nao possui uma conta");
						return;							
					}
					else 
					{
						//alert("Logado com sucesso!");
						window.localStorage.UsuarioEmail=email;
						window.localStorage.UsuarioToken=token;
						window.location = "principal.html";
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
	 
	 
		
    } else {
        alert("Email ou senha incorretos");
    }
}
//_____________________________ VERIFICAR LOGIN _______________________________//
function verificarLogin(lugar) {
    var email = window.localStorage.UsuarioEmail;
	var token = window.localStorage.UsuarioToken;
		$.ajax({
		type: 'POST'
		, url: "http://localhost:52192/Servidor/Usuario.asmx/verificarLogin"
		, contentType: 'application/json; charset=utf-8'
		, dataType: 'json'
		, data: "{email:'"+email+"',token:'"+token+"'}"
		, success: function (data, status) {						
			var retorno = $.parseJSON(data.d);
			if(retorno == "-1" && lugar=="index")                
			{
				return;		
			}
			else if(retorno == "0" && lugar=="index")
			{
				window.location = "principal.html";
				return;
			}
			else if(retorno == "-1")
			{
				window.location = "index.html";
				return;
			}
		}
		, error: function (xmlHttpRequest, status, err) {
			$('.resultado').html('Ocorreu um erro');
		}
	});
}

//_______________________________ LOGOUT ____________________________________________//
function logout() {
	var email= window.localStorage.UsuarioEmail;
			  $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/logout"
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"'}"
                , success: function (data, status) {
                    
					var retorno = $.parseJSON(data.d);
					if(retorno == "0")                    
					{
						window.localStorage.UsuarioEmail='';
						window.localStorage.UsuarioToken='';
						window.localStorage.UsuarioNome='';
						window.location = "index.html";
						return;							
					}
					else 
					{
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
}

//___________________________________ RECUPERAR SENHA _________________________________________//
function recuperarSenha()
{
	var emailUsuario = $("#emailPraRecuperarSenha").val();
	
	$.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/recuperarSenha"
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{emailUsuario:'"+emailUsuario+"'}"
                , success: function (data, status) {
                    
					var retorno = $.parseJSON(data.d);
					if(retorno == "0")                    
					{
						alert("Email enviado, verifique sua caixa de menssagem!");
						return;							
					}
					else if(retorno == "1")
					{
						alert("Voce nao possui uma conta cadastrada");
						return;
					}
					else
					{
						alert("Ocorreu um erro!");
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });

}


//________________________________ CADASTRAR USUARIO _______________________________________//
function cadastrarUsuario() {
	//Pegar os parametros
	var nome = $("#nome").val();
	var email = $("#email").val();
	var senha = $("#senha").val();
	var confirmar = $("#confirmarSenha").val();
	var token = '124576453875';
    
	if(nome!='' && email!='' && senha!=''){ //checa se campos foram preenchidos
	//////teste email////////////////
		var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(!filter.test(document.getElementById("email").value)){
			alert('Por favor, digite o email corretamente');
			window.location = "#cadastrarUsuario";
			return;
		}
	///////////teste senha///////////
		if(senha.length<4){
			alert("Senha deve ter pelo menos 4 caracteres.");
			window.location = "#";
			return;
		}
	///// senha e confirmação de senha são iguais
		if(senha == confirmar){
		
		
			 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/cadastrarUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeUsuario:'"+nome+"',email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d);
                    
					if(itens[0] == "0")
					{
						alert("Usuario cadastrado com sucesso!");
						window.localStorage.UsuarioNome=nome;
						window.localStorage.UsuarioEmail=email;
						window.localStorage.UsuarioToken=token;
						window.location = "principal.html";
						return;
					}
					else if(itens[0] == "1")
					{
						alert("Ja possui uma conta com este email");
						return;
					}
					else
					{
						alert("Erro de token");
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });

			window.localStorage.UsuarioNome=nome;
			window.localStorage.UsuarioEmail=email;
			window.localStorage.UsuarioToken=token;
		}else{ //senhas não conferem
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}
	else //campos vazio
	{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}	
	//window.location = "principal.html#Inicio";
}

//________________________________ ATUALIZAR SENHA USUARIO _______________________________________//
function atualizarSenhaUsuario() {
	//Pegar os parametros
	var email = window.localStorage.UsuarioEmail;
	var senha = $("#senha").val();
	var novaSenha = $("#novaSenha").val();
	var confirmar = $("#confirmarSenha").val();
    
	if(email.trim()!='' && senha.trim()!='' && novaSenha.trim()!=''){ //checa se campos foram preenchidos
	///////////teste senha///////////
		if(novaSenha.length<4){
			alert("Senha deve ter pelo menos 4 caracteres.");
			window.location = "#";
			return;
		}
	///// senha e confirmação de senha são iguais
		if(novaSenha == confirmar){		
			 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/Usuario.asmx/atualizarSenhaUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"',senha:'"+senha+"',novaSenha:'"+novaSenha+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d);
                    
					if(itens[0] == "0")
					{
						alert("Usuario atualizado com sucesso!");
						window.location = "perfil.html";
						return;
					}
					else
					{
						alert("Ocorreu algum erro, repita o processo novamente!");
						return;
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });

			window.localStorage.UsuarioNome=nome;
			window.localStorage.UsuarioEmail=email;
			window.localStorage.UsuarioToken=token;
		}else{ //senhas não conferem
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}
	else //campos vazio
	{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}	
}
*/
//############# LISTAS ##################
/*
//___________________ CRIAR LISTA ________________________//
function criarLista() {
	//Pegar os parametros
	var nomeLista = $("#nome_lista").val();
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
	//pegar token
	
    if (nomeLista != '') { //se campo nao for vazio
	
		 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/criarLista"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeLista:'"+nomeLista+"',idUsuario:'"+idUsuario+"',token:'"+token+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d); //salvando retorno do metodo do servidor
                    
					if(itens == "-1")//erro ao criar lista
                    
					{
						alert("Erro ao criar lista");
						return;							
					}
					else 
					{
						alert("Lista criada com sucesso!");
						window.location = "visualizar-lista.html?id="+itens;
						return;
					}
				
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
	

    } else {
        alert("Campo vazio.");
		window.location = "principal.html#criar_lista";
		return false;
    }
}

//_____________________________________ RETORNAR LISTA _____________________________________//
function retornarListas(){	
	$.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/retornarListas" //chamando a função
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'						//tipos de dados de retorno
                , data: "{idUsuario:'"+ID_USUARIO+"'}" //passando os parametros
                , success: function (data, status) {
                    
					var lista = $.parseJSON(data.d); 		    //pegando retorno do servidor
					var idNome = 1;							   //indice para pegar o nome
					var idLista = 0;						  //indice para pegar o id
						for(var i=0; i<lista.length ;i++)	 //pecorre o tamanho da lista
						{

							if(lista[idLista] != undefined){
								var inp = document.createElement("div");
								var aTag = document.createElement('a');
								var iconEdit = document.createElement('div');
								iconEdit.setAttribute("class", "iconEdit");
								//iconEdit.setAttribute("onclick", "editarNomeLista();");
								iconEdit.setAttribute("data-target", "#editar_lista");
								iconEdit.setAttribute("data-toggle", "modal");
								var iconRemove = document.createElement('div');
								iconRemove.setAttribute("class", "iconRemove");
								iconRemove.setAttribute("onclick", "excluirLista();");
								aTag.setAttribute('href',"visualizar-lista.html?id="+lista[idLista]);
								aTag.innerHTML = lista[idNome];
								inp.setAttribute("id",lista[idLista]);
								inp.setAttribute("class", "alert alert-warning");
								inp.setAttribute("name", "listas");
								inp.setAttribute("role", "alert");
								//inp.textContent = lista[idNome];
								inp.appendChild(aTag);
								inp.appendChild(iconRemove);
								inp.appendChild(iconEdit);
								
							}
							
							var pai = document.getElementById("nomeLista");
							pai.appendChild(inp);
							idNome+=2;
							idLista+=2;
						}
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
}



//_____________________________________ ADICIONAR PRODUTOS À LISTA _____________________________________//
function adicionarProdutoALista()
{
	//Pegar os parametros
	var nomeDoProduto = $("#nomeDoProduto").val();
	var formatoDoCodigo = $("#formato").val();
	var codigoDeBarras = $("#cod_barra").val();
	var quantidade = parseInt($("#quantidade").val());
	var idLista = parseInt(window.localStorage.idListaClicada);
	
    if (nomeDoProduto.trim() != '')
	{ //se campo nao for vazio
	
		 $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/cadastrarProduto"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeProduto:'"+nomeDoProduto+"',codigoDeBarras:'"+codigoDeBarras+"',tipoCodigo:'"+formatoDoCodigo+"',quantidade:'"+quantidade+"',idLista:'"+idLista+"'}"
                , success: function (data, status) {
                    
					var itens = $.parseJSON(data.d); //salvando retorno do metodo do servidor
                    
					if(itens == "-1")//erro ao cadastrar o produto
                    
					{
						alert("Erro ao cadastrar o produto");
						return;							
					}
					else 
					{
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
	/*else
	{
        alert("Campo de Nome vazio.");
		return false;
    }*//*
}



//_____________________________________ RETORNAR PRODUTOS DA LISTA (VISUALIZAR LISTA) _____________________________________//
function retornarProdutosDaListas(){	
	//Pegar id pela URR e mostrar produtos da lista 
	var queries = {};
	$.each(document.location.search.substr(1).split('&'), function(c,q){
		var i = q.split('=');
		queries[i[0].toString()] = i[1].toString();
	});
	$("#nomeDaLista").html(queries['id']);
	var idLista=queries['id'];
	window.localStorage.idListaClicada=idLista;
	$.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/listarProdutosDaLista"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{idLista:'"+idLista+"'}"
                , success: function (data, status) {
                    
					var produtos = $.parseJSON(data.d); 		    //pegando retorno do servidor
					var idNome = 1;							   //indice para pegar o nome
					var idProduto = 0;						  //indice para pegar o id
					for(var i=0; i<produtos.length ;i++)	 //pecorre o tamanho da lista
					{
						if(produtos[idProduto] != undefined){
							var inp = document.createElement("div");
							var aTag = document.createElement('a');
							var iconEdit = document.createElement('div');
							iconEdit.setAttribute("class", "iconEdit");
							//iconEdit.setAttribute("onclick", "editarNomeLista();");
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
function editarNomeLista() {
	//Pegar os parametros
	var idLista = parseInt(window.localStorage.idListaClicada);
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
                , success: function (data, status) {                    
					var itens = $.parseJSON(data.d); //salvando retorno do metodo do servidor                    
					if(itens == "-1")//erro ao cadastrar o produto                    
					{
						alert("Erro ao alterar o nome da lista.");
						return;							
					}
					else 
					{
						alert("Nome da lista cadastrada com sucesso!");
						window.location = "visualizar-lista.html?id="+idLista;
						return;
					}
				
                }
                , error: function (xmlHttpRequest, status, err) {
                    $('.resultado').html('Ocorreu um erro');
                }
            });
}

//______________________________________ EXCLUIR LISTA _____________________________________________//
function excluirLista() {
	var idLista = parseInt(window.localStorage.idListaClicada);
	var idUsuario = ID_USUARIO;
	var token = TOKEN;
    $.ajax({
                type: 'POST'
                , url: "http://localhost:52192/Servidor/ListaDeProdutos.asmx/excluirLista"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{idLista:'"+idLista+"',idUsuario:'"+idUsuario+"',token:'"+token+"'}"
                , success: function (data, status) {                    
					var itens = $.parseJSON(data.d); //salvando retorno do metodo do servidor                    
					if(itens == "-1")//erro ao cadastrar o produto                    
					{
						alert("Erro ao excluir a lista.");
						return;							
					}
					else 
					{
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
*/
/*
__________________________________ CADASTRAR PRODUTO ______________________________________//
// var listaDeProdutos = [];
// var i = 0;
// function cadastrarProduto() {
	Pegar os parametros
	// var codigoDeBarras = $("#cod_barra").val();
	// var nomeDoProduto = $("#nome_produto").val();
	// var formatoCodigoDeBarras = $("#formato").val();
	
	// if(codigoDeBarras == "") //ta vazio
	// {
		// codigoDeBarras = -1;
		// formatoCodigoDeBarras = -1;
	// }
	
	// var produtos = new Array(codigoDeBarras,formatoCodigoDeBarras,nomeDoProduto);
	// listaDeProdutos[i++] = produtos;
	
	// window.location = "principal.html#editar_lista"
	// document.getElementById("exibir").innerHTML = "- " + listaDeProdutos[i-1][2] +"<br />";
// }

______________________________ AUTO COMPLETE _______________________________________// 


// /*$(function() 
// {	
	// $.ajax({
                // type: 'POST'
                // , url: "http://localhost:52192/Servidor/Produto.asmx/retornarProdutos"
                // , contentType: 'application/json; charset=utf-8'
                // , dataType: 'json'
                // , data: "{}"
                // , success: function (data, status) {
                    
					// var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
					// $("#div_da_label_aqui" ).autocomplete({ source: produtos }); 
                // }
                // , error: function (xmlHttpRequest, status, err) {
                    // $('.resultado').html('Ocorreu um erro');
                // }
            // });
			
 // });*/
 // */