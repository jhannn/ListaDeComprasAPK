var TOKEN = "124576453875";
// window.localStorage.produtoRecemAdicionado = "";

//____________________________________ FAZER LOGIN ______________________________________________//
function fazerLogin(){
    var email = $("#email_logar").val();
    var senha = $("#senha_logar").val();
	var token = TOKEN;
	
    if (email!='' && senha!=''){     
		$.ajax({
            type: 'POST'
            , url: "http://192.168.56.1/Servidor/Usuario.asmx/fazerLogin"
            , contentType: 'application/json; charset=utf-8'
            , dataType: 'json'
            , data: "{email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
            , success: function (data, status) {                    
				var retorno = $.parseJSON(data.d);
				if(retorno.erro == "Erro de Usuário"){
					alert(retorno.erro + "\n" + retorno.Message);
					return;							
				}else{
					window.localStorage.UsuarioNome=retorno.nome;
					window.localStorage.UsuarioEmail=email;
					window.localStorage.UsuarioId=retorno.id_usuario;
					window.localStorage.UsuarioToken=token;
					window.location = "principal.html";
					return;
				}
            }
            , error: function (xmlHttpRequest, status, err) {
                $('.resultado').html('Ocorreu um erro');
            }
        });		
    }else{
        alert("Email ou senha incorretos");
    }
}
//_____________________________ VERIFICAR LOGIN _______________________________//
function verificarLogin(lugar) {
    var idUsuario = window.localStorage.UsuarioId;
	var token = window.localStorage.UsuarioToken;
	if(typeof(idUsuario)===undefined || typeof(idUsuario)!=='string' || typeof(token)===undefined || typeof(token)!=='string'){
		idUsuario=-1;
		token='';
	}
		
	$.ajax({
		type: 'POST'
		, url: "http://192.168.56.1/Servidor/Usuario.asmx/verificarLogin"
		, contentType: 'application/json; charset=utf-8'
		, dataType: 'json'
		, data: "{idUsuario:'"+idUsuario+"',token:'"+token+"'}"
		, success: function (data, status) {						
			var retorno = $.parseJSON(data.d);
			
			if(retorno=="OK" && lugar!="index"){
				return;		
			}else if(retorno=="OK" && lugar=="index"){
				window.location = "principal.html";
				return;
			}else if(retorno!="OK" && lugar=="index"){
				return;
			}else{
				window.location = "index.html";
			}
		}
		, error: function (xmlHttpRequest, status, err) {
			$('.resultado').html('Ocorreu um erro');
		}
	});
}

//_______________________________ LOGOUT ____________________________________________//
function logout(){
	var id= window.localStorage.UsuarioId;
	var token= window.localStorage.UsuarioToken;
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Usuario.asmx/logout"
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+id+"',token:'"+token+"'}"
        , success: function (data, status){                    
			var retorno = $.parseJSON(data.d);
			if(retorno == "OK"){
				window.localStorage.UsuarioId=-1;
				window.localStorage.UsuarioEmail='';
				window.localStorage.UsuarioToken='';
				window.localStorage.UsuarioNome='';
				window.location = "index.html";
				return;							
			}else{
				alert(retorno.erro + "\n" + retorno.Message);
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            $('.resultado').html('Ocorreu um erro');
        }
    });
}

//___________________________________ RECUPERAR SENHA _________________________________________//
function recuperarSenha(){
	var emailUsuario = $("#emailPraRecuperarSenha").val();
	
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Usuario.asmx/recuperarSenha"
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{emailUsuario:'"+emailUsuario+"'}"
        , success: function (data, status){                    
			var retorno = $.parseJSON(data.d);
			if(retorno == "OK"){
				alert("Email enviado, verifique sua caixa de menssagem!");
				return;							
			}else if(retorno.erro == "Erro de Usuário"){
				alert(retorno.erro + "\n" + retorno.Message);
				return;		
			}else{
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
	var nome = $("#nome").val();
	var email = $("#email").val();
	var senha = $("#senha").val();
	var confirmar = $("#confirmarSenha").val();
	var token = '124576453875';
    
	if(nome!='' && email!='' && senha!=''){
		var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(!filter.test(document.getElementById("email").value)){
			alert('Por favor, digite o email corretamente');
			window.location = "#cadastrarUsuario";
			return;
		}
		if(senha.length<4){
			alert("Senha deve ter pelo menos 4 caracteres.");
			window.location = "#";
			return;
		}
		if(senha == confirmar){		
			$.ajax({
                type: 'POST'
                , url: "http://192.168.56.1/Servidor/Usuario.asmx/cadastrarUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{nomeUsuario:'"+nome+"',email:'"+email+"',senha:'"+senha+"',token:'"+token+"'}"
                , success: function (data, status){                    
					var retorno = $.parseJSON(data.d);
						console.log(retorno);
					if(retorno.erro != "Erro de Usuário"){
						localNotification();
						alert("Usuario cadastrado com sucesso!");
						window.localStorage.UsuarioNome=nome;
						window.localStorage.UsuarioEmail=email;
						window.localStorage.UsuarioToken=token;
						window.localStorage.UsuarioId=retorno.id_usuario;
						window.location = "principal.html";
						return;
					}else if(retorno.erro == "Erro de Usuário"){
						alert(retorno.erro + "\n" + retorno.Message);
						return
					}
					else{
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
		}else{
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}else{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}
}

//________________________________ ATUALIZAR SENHA USUARIO _______________________________________//
function atualizarSenhaUsuario() {
	var email = window.localStorage.UsuarioEmail;
	var senha = $("#senha").val();
	var novaSenha = $("#novaSenha").val();
	var confirmar = $("#confirmarSenha").val();
    
	if(email.trim()!='' && senha.trim()!='' && novaSenha.trim()!=''){
		if(novaSenha.length<4){
			alert("Senha deve ter pelo menos 4 caracteres.");
			window.location = "#";
			return;
		}
		if(novaSenha == confirmar){		
			$.ajax({
                type: 'POST'
                , url: "http://192.168.56.1/Servidor/Usuario.asmx/atualizarSenhaUsuario"
				, crossDomain:true
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: "{email:'"+email+"',senha:'"+senha+"',novaSenha:'"+novaSenha+"'}"
                , success: function (data, status){                    
					var retorno = $.parseJSON(data.d); 
						console.log(retorno);
					if(retorno == "OK"){
						alert("Usuario atualizado com sucesso!");
						window.location = "perfil.html";
						return;
					}else{
						alert(retorno.erro + "\n" + retorno.Message);
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
		}else{
			alert("Senhas não conferem!");	
			window.location = "#";
			return;
		}	
	}else{  
		alert("Campo vazio!");
		window.location = "#cadastrarUsuario";
		return;
	}	
}

function localNotification()
{
    window.plugin.notification.local.add({
    id:      1,
    title:   'Cadastro Realizado!',
    message: 'Usuário cadastrado com sucesso.',
    repeat:  'weekly'
    });
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