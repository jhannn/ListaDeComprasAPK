var ID_USUARIO = window.localStorage.UsuarioId;						//id do usuario
var TOKEN = window.localStorage.UsuarioToken;						//token do usuario
var string = window.localStorage.produtoRecemAdicionado;			//string do localstorage com os id das listas e dos produtos recem adicionados no checkin
if(string == undefined){											//se string for indefinida
	window.localStorage.produtoRecemAdicionado = "";				//crie a variavel no localStoragee
	string = window.localStorage.produtoRecemAdicionado;			//salve na variavel string
}
var produtosRecemAdicionado = string.split(",");					//converter string em array

//______________________________ AUTO COMPLETE MARCA _______________________________________// 
function autoCompleteMarca(){
	
	var nomeMarca = $("#marcaDoProduto").val();													//salva valor do campo na variavel
	$.ajax({																					//chama a função do servidor
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Produto.asmx/autocompleteMarca"					
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeMarca:'"+nomeMarca+"'}"		//passa os dados para o servidor
		, success: function (data, status){                    
			var marcas = $.parseJSON(data.d); 													//salva o retorno do servidor em marcas
			$("#marcaDoProduto").autocomplete({ source: marcas }); 								//autoComplete 
        }
        , error: function (xmlHttpRequest, status, err) {										//erro no servidor
            alert('Ocorreu um erro no servidor');												//alerta de erro
        }
    });	
}
//______________________________ AUTO COMPLETE PRODUTO _______________________________________// 
function autoCompleteProduto(){
	
	var nomeProduto = $("#nomeDoProduto").val();												//salva valor do campo na variavel
	$.ajax({																					//chama a função do servidor
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Produto.asmx/autocomplete"
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nomeProduto:'"+nomeProduto+"'}"  //passa os dados para o servidor
		, success: function (data, status){                    
			var produtos = $.parseJSON(data.d); //salvando o nome dos produtos em um array
			$("#nomeDoProduto").autocomplete({ source: produtos }); 
        }
        , error: function (xmlHttpRequest, status, err) {										//erro no servidor
            alert('Ocorreu um erro no servidor');												//alerta de erro
        }
    });	
}

//_____________________ PESQUISA _______________________//

function mostrarPesquisa(){
	var newFields = document.getElementById('botaoLoucao');			
    newFields.style.display = 'block';
	var newFields = document.getElementById('nomeDoProduto');
    newFields.style.display = 'block';
}

function procurarProduto(flag){	
	var nome = $("#nomeDoProduto").val().trim();
	if(flag==1){
	window.localStorage.idListaClicada = window.localStorage.listaClicadaCheckin;
	window.localStorage.flag = 1;
	}
		
	window.localStorage.ProdutoProcurado=nome;
	window.location = "procurarProdutosLista.html";
}

//_____________________ CONTROLE CHECKIN _____________________//
function controleCheckin(flag){
	if(flag == "index"){																//checkin na index
		window.location = "checkinEstabelecimento.html";								//ir para a página de checkin
		window.localStorage.idListaClicada = "";										//zerar idListaClicada do servidor
		window.localStorage.idEstabelecimentoClicado = "";								//zerar idEstabelecimento do servidor
		
	}else if(flag == "lista"){  														//checkin na lista
		window.localStorage.listaClicadaCheckin = window.localStorage.idListaClicada;	//atualiza listaclicadoCheckin com listaClicada
		window.location = "checkinEstabelecimento.html";								//ir para a página de checkin
	}
}

function checkinEstab(){
	var idEstabelecimento = window.localStorage.idEstabelecimentoClicado;
	window.localStorage.estabelecimentoClicadoCheckin = idEstabelecimento;
	window.localStorage.estab = "estab";											//local storage para ser acessado em lista
}

//_____________________ ACHAR ESTABELECIMENTO MAIS PRÓXIMO ____________________//
function distLatLong(lat1,lon1,lat2,lon2) {
  var R = 6371; // raio da terra
  var Lati = Math.PI/180*(lat2-lat1);  //Graus  - > Radianos
  var Long = Math.PI/180*(lon2-lon1); 
  var a = 
	Math.sin(Lati/2) * Math.sin(Lati/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(Long/2) * Math.sin(Long/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // distância en km
  return((d*1).toFixed(4));
}

function deg2rad(degree) {
    return degree * (Math.PI / 180);
}

//_____________________ LISTA OS ESTABELECIMENTOS PARA O CHECKIN _____________________//
function listarEstabelecimento(){	
var idListaClicada = window.localStorage.idListaClicada;										//salva lista clicada do localStorage
var latitudeGeolocation = window.localStorage.lat;												//pegando latitude usuario
var longitudeGeolocation = window.localStorage.lon;												//pegando longitude usuario

	$.ajax({																					//chamando função do servidor
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/Estabelecimento.asmx/listarEstabelecimento"		//url
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',nome:'',bairro:'',cidade:''}" 	//dados da função
        , success: function (data, status){                    
			var estabelecimentos = $.parseJSON(data.d);											//salvando o retorno do servidor em estabelecimentos
				
				//---- calculo da menor distancia ---//
				var menorDistancia = "";
				var estabelecimentoMenorDistancia;
				var indice = 0;
				for(var pos=0; pos<estabelecimentos.length; pos++){
					var distancia = distLatLong(latitudeGeolocation,longitudeGeolocation,estabelecimentos[pos].latitude,estabelecimentos[pos].longitude);
					if(menorDistancia == "" && distancia<1.0){
						menorDistancia = distancia;
						estabelecimentoMenorDistancia = estabelecimentos[pos];
						indice = pos;
					}else if(distancia<menorDistancia && distancia<1.0){
						menorDistancia = distancia;
						estabelecimentoMenorDistancia = estabelecimentos[pos];
						indice = pos;
					}
				}
				
				if(menorDistancia != ""){
					//----- estabelecimento mais barato no inicio da lista ----//
					var guardarPrimeiroElemento = estabelecimentos[0];
					estabelecimentos[0] = estabelecimentoMenorDistancia;
					estabelecimentos[indice] = guardarPrimeiroElemento;
							
					alert("O estabelecimeto mais próximo é o "+estabelecimentoMenorDistancia.nome +"\n"+ estabelecimentoMenorDistancia.bairro);					
				}
			
				if(idListaClicada != ""){														//se estiver em uma lista
					for(var i=0; i<estabelecimentos.length ;i++)								//for para listar estabelecimentos
					htmlListarEstabelecimentos(estabelecimentos[i],"lista");					//chamando html para listar estabelecimentos
				}else{																			//se nao estiver em nenhuma lista
					for(var i=0; i<estabelecimentos.length ;i++)								//for para listar estabelecimentos
					htmlListarEstabelecimentos(estabelecimentos[i],"index");					//chamando html para listar estabelecimentos
				}		
        }
        , error: function (xmlHttpRequest, status, err) {										//erro no servidor
            alert('Ocorreu um erro no servidor');												//alerta de erro
        }
    });
}

//_________________ LISTA AS LISTAS PARA SER REALIZADO O CHECKIN _________________//
function escolherListas(idEstabelecimento){	
	$.ajax({
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/listarListas" //chamando a função
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'		
		, data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"'}"
        , success: function (data, status){                    
			var lista = $.parseJSON(data.d);
			if(typeof(lista.erro)=== 'undefined'){
				if(lista.length != 0){
					var confirme = confirm("Você não está em nenhuma lista\n deseja escolher uma lista?");
					if(confirme){
						document.getElementById("nomeLista").innerHTML = "";
						for(var i=0; i<lista.length ;i++)
						htmlListarListas(lista[i],idEstabelecimento);							
					}
				}else{
					var alerta = document.createElement("p");
					alerta.innerHTML = "Você não possui nenhuma lista cadastrada";
					alerta.setAttribute("class","alert-lista-nao-criada");			
					var pai = document.getElementById("nomeLista");
					pai.appendChild(alerta);
				}
				
			}else{
				alert(lista.mensagem);
				window.location = "index.html";
				return;
			}
        }
        , error: function (xmlHttpRequest, status, err) {
            alert('Ocorreu um erro no servidor');
        }
    });
}

//_________________ LISTA PRODUTOS PARA SER REALIZADO O CHECKIN _________________//
function retornarProdutosCheckIn(){	
	var idLista = window.localStorage.listaClicadaCheckin;							//pegando id da listaClicadaCheckin do localStorage
	var idEstabelecimento =	window.localStorage.estabelecimentoClicadoCheckin; 		//pegando id do estabelecimentoClicadoCheckin do localStorage

	$.ajax({																		//chamando servidor
        type: 'POST'
        , url: "http://192.168.56.1/Servidor/ListaDeProdutos.asmx/retornarItens" //url
		, crossDomain:true
        , contentType: 'application/json; charset=utf-8'
        , dataType: 'json'
        , data: "{idUsuario:'"+ID_USUARIO+"',token:'"+TOKEN+"',idLista:'"+idLista+"',idEstabelecimento:'"+idEstabelecimento+"'}" //dados 
        , success: function (data, status){                    
			var produtos = $.parseJSON(data.d);								//salvando retorno do servidor na variavel produtos
			document.getElementById("produtos_checkIn").innerHTML = "";		//zerando o html;
				for(var i=0; i<produtos.length ;i++)						//for para listar produtos
				htmlListarProdutos(produtos[i]);							//chamando html para listar produtos
        }
        , error: function (xmlHttpRequest, status, err) {					//erro do servidor
            alert('Ocorreu um erro no servidor');							//alerta de erro
        }
    });
}

//___________________________ FUNÇÃO GUARDAR ITENS ________________________________//
var valorTotal = 0; 
var itens = [];	
var guardarReferencia = [];
var ref = 0;																						//variavel itens
var aux = 0; 																							//variavel para acessar o array de itens
var adicionado = 0;
function guardarItens(id_produto,nome,marca,id_estabelecimento,
					  nomeEstabelecimento,preco,quantidade,unidade,
					  embalagem,dataAtual,codigoDeBarras,tipoCodigoDeBarras)
{							
	var aChk = document.getElementsByName("produtos"); 													//atribui o checkbox a variavel
	var verificarCheckMarcado = 0; 																		//variavel para zerar o total
	var idProduto = id_produto;
	var precoQuant = (preco * quantidade).toFixed(2);
	var posicao = aux;

	for (var i=0;i<aChk.length;i++){ 
		if(aChk[i].id == idProduto){
			if (aChk[i].checked == true){ 																//se check estiver marcado
				
					document.getElementById("precoProd").placeholder = "R$ "+ (preco*1).toFixed(2);				//modal para editar o preço
					for(var bru=0;bru<itens.length;bru++){
						if(itens[bru].nomeProduto == nome)
						posicao = bru;
					}
					modalEditarPreco(idProduto,posicao);
	
					document.getElementById(aChk[i].id+"prod").className = "produto-escolhido"; 		//style para riscar o nome do produto
					var produtoAdicionado = document.getElementById("preco"+idProduto).title;			//verificar se o produto foi recem adicionado
					
					//verificar se o produto foi cadastrado no checkin
					if(produtoAdicionado == 0)
						var idProduto = 0;
					else
						var idProduto = aChk[i].id
						
						
					for(var gav=0;gav<prodsEditados.length;gav++){
						if(prodsEditados[gav] == idProduto){
							var preco = document.getElementById("preco"+id_produto).innerText;
							var precoFormatado = (preco.substring(3,preco.length) * quantidade).toFixed(2);
							
							for(var tav=0;tav<itens.length;tav++){
								if(itens[tav].id_produto[0] == "-" && itens[tav].id_produto.substring(1,itens[tav].id_produto.length) == idProduto){
									itens[tav] = {"id_produto":"-"+idProduto,"nomeProduto":nome,"marca":marca,"id_estabelecimento":id_estabelecimento,		//criando o objeto item para retornar ao servidor	
												"nomeEstabelecimento":nomeEstabelecimento,"preco":precoFormatado,"quantidade":quantidade,"unidade":unidade,
												"embalagem":embalagem,"dataAtual":dataAtual,"codigoDeBarras":codigoDeBarras,"tipoCodigoDeBarras":tipoCodigoDeBarras}; 
									document.getElementById("precoProd").placeholder = "R$ "+ (preco.substring(3,preco.length)*1).toFixed(2);
									adicionado++;							
									valorTotal += parseFloat(precoFormatado);
									return;
								}	
							}			
							itens[aux++] = {"id_produto":"-"+idProduto,"nomeProduto":nome,"marca":marca,"id_estabelecimento":id_estabelecimento,		//criando o objeto item para retornar ao servidor	
											"nomeEstabelecimento":nomeEstabelecimento,"preco":precoFormatado,"quantidade":quantidade,"unidade":unidade,
											"embalagem":embalagem,"dataAtual":dataAtual,"codigoDeBarras":codigoDeBarras,"tipoCodigoDeBarras":tipoCodigoDeBarras}; 
							
							adicionado++;							
							valorTotal += parseFloat(precoFormatado);
							document.getElementById("precoProd").placeholder = "R$ "+ (preco.substring(3,preco.length)*1).toFixed(2);
							document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2);	
							return;
						}
					}	
					
				
					/*-- adicionar produto no array --*/
					itens[aux++] = {"id_produto":idProduto,"nomeProduto":nome,"marca":marca,"id_estabelecimento":id_estabelecimento,		//criando o objeto item para retornar ao servidor	
								  "nomeEstabelecimento":nomeEstabelecimento,"preco":precoQuant,"quantidade":quantidade,"unidade":unidade,
								  "embalagem":embalagem,"dataAtual":dataAtual,"codigoDeBarras":codigoDeBarras,"tipoCodigoDeBarras":tipoCodigoDeBarras}; 

					valorTotal += parseFloat(precoQuant);												//aumenta o preço do produto do valor total	
					adicionado++;
					document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2);													//atualiza o preço na tela
					console.log(itens);					
			}else{ 																						//se check estiver desmarcado
				document.getElementById(id_produto+"prod").className = "nome-produto-checkin";  		//desriscar o nome do produto
				verificarCheckMarcado++;
				if(verificarCheckMarcado==2 && adicionado>0){
					adicionado--;
					var precoAtual = document.getElementById("preco"+id_produto).innerText;
					var precoFormatadoAtual = precoAtual.substring(3,precoAtual.length);
					if(precoAtual != "-")
					valorTotal -= parseFloat(precoFormatadoAtual*quantidade); 												//retira o preço do produto do valor total
					itens.splice(((aux--)-1),1);         												//retira o objeto do array
					document.getElementById("total_lista").innerHTML = "R$ "+ valorTotal.toFixed(2); 	//atualiza o preço na tela
				}
			}
		}
	}	
}

//___________________ MODAL EDITAR PRODUTOS__________________________//
function modalEditarPreco(idProduto,posicaoProdutoArray){
	//exibir Modal
	$('#confirmar_preco').modal('show');
	window.localStorage.modalAberto = idProduto;
	window.localStorage.posicaoProdutoArray = posicaoProdutoArray;
	console.log(posicaoProdutoArray);
}

//___________________________ EDITAR PRODUTOS ___________________________//
var prodsEditados = [];
var prodAux = 0;
function editarPreco(){
	var preco = $("#precoProd").val();
	var precoAnterior;
	var quantidade;
	if(preco.match(/^-?\d*\.?\d+$/)){
		var posicaoProdutoArray = window.localStorage.posicaoProdutoArray;
		var modalAberto = window.localStorage.modalAberto;
		
		if(itens[posicaoProdutoArray].id_produto[0] == "-")
		itens[posicaoProdutoArray].id_produto = itens[posicaoProdutoArray].id_produto.substring(1,itens[posicaoProdutoArray].id_produto.length);
		itens[posicaoProdutoArray].id_produto = "-"+itens[posicaoProdutoArray].id_produto;
		quantidade = itens[posicaoProdutoArray].quantidade;
		precoAnterior = itens[posicaoProdutoArray].preco;
		itens[posicaoProdutoArray].preco = preco;
		document.getElementById("preco"+modalAberto).innerHTML = "R$ "+ preco;	
		document.getElementById("precoProd").value = "";
		prodsEditados[prodAux++] = document.getElementById("preco"+modalAberto).title;
		
		valorTotal -= precoAnterior;
		valorTotal += parseFloat(preco*quantidade);
		document.getElementById("total_lista").innerHTML = "R$ "+ (valorTotal).toFixed(2);
	}else{
		alert("Coloque um preço em um formato válido!");
		document.getElementById("precoProd").value = "";
	}
}	
/*==============================================
    GENERAL HTML AND STYLES    
    =============================================*/
/*listar estabelecimentos*/	
function htmlListarEstabelecimentos(estabelecimentos,flag){
	if(estabelecimentos != undefined){
		var divPrincipal = document.createElement("div");
		var divRole = document.createElement("div");
		var h4 = document.createElement("h4");
		var a = document.createElement("a");
		var img = document.createElement("img");
		var nomeEstab = document.createElement('a');
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
			
		img.setAttribute("src","assets/img/setaFechada.png");
		img.setAttribute("id","seta"+estabelecimentos.id_estabelecimento);
		img.setAttribute("width","30px");
		img.setAttribute("style","color: #ffb503;");

		/* tag do nome */
		if(flag == "index"){
			nomeEstab.setAttribute("data-toggle","modal");
			nomeEstab.setAttribute("data-target","#escolher_lista");			
			nomeEstab.setAttribute("onclick","escolherListas('"+estabelecimentos.id_estabelecimento+"');");			
			nomeEstab.setAttribute('class',"titulos");
			nomeEstab.innerHTML = estabelecimentos.nome;
		}
		else if(flag == "lista"){
			var listaClick = window.localStorage.idListaClicada;
			nomeEstab.setAttribute('onclick',"localStorageCheckin('"+listaClick+"','"+estabelecimentos.id_estabelecimento+"')");
			nomeEstab.setAttribute("href","checkinProdutos.html");		
			nomeEstab.setAttribute('class',"titulos");
			nomeEstab.innerHTML = estabelecimentos.nome;		
		}
		
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
		h4.appendChild(nomeEstab);
		a.appendChild(img);
		divPrincipal.appendChild(modal);
		modal.appendChild(conteudo);
		}	
	var pai = document.getElementById("nomeEstab");
	pai.appendChild(divPrincipal);
	img.setAttribute("onclick","controleModalCheck("+estabelecimentos.id_estabelecimento+")");
}

//______________________ CONTROLE MODAL ______________________//
var aberto = "nao";
var idAberto = "0";
function controleModalCheck(idModal)
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

/*--Listar listas --*/
function htmlListarListas(lista,idEstabelecimento){
	if(lista != undefined){
		var inp = document.createElement("div");
		var nomeLista = document.createElement('a');

		nomeLista.setAttribute('class','titulos');
		nomeLista.setAttribute('onclick',"localStorageCheckin('"+lista.id_listaDeProdutos+"','"+idEstabelecimento+"')");
		nomeLista.setAttribute("href","checkinProdutos.html");	
		nomeLista.innerHTML = lista.nome;
		
		inp.setAttribute("id",lista.id_listaDeProdutos);
		inp.setAttribute("class", "alert alert-warning");
		inp.setAttribute("name", "listas");
		inp.setAttribute("role", "alert");
		inp.appendChild(nomeLista);
	}							
	var pai = document.getElementById("nomeLista");
	pai.appendChild(inp);
}

function localStorageCheckin(idLista,idEstabelecimento){  						
	window.localStorage.listaClicadaCheckin = idLista;
	window.localStorage.estabelecimentoClicadoCheckin = idEstabelecimento;
}

/*_______ LISTAR PRODUTOS PRO CHECKIN _______*/
function htmlListarProdutos(produtos)
{
	if(produtos != undefined){
		/*-- criando elementos --*/
		var inp = document.createElement("div");
		var nomeProduto = document.createElement('a');
		var checkbox = document.createElement('INPUT');
		var preco = document.createElement('div');
		
		/*-- nome --*/		
		nomeProduto.innerHTML = produtos.nome +" Qtd. "+produtos.quantidade;	
		nomeProduto.setAttribute("class","nome-produto-checkin");
		nomeProduto.setAttribute("id",produtos.id_produto+"prod");
		
		/*--- Controle de proutos pré cadastrados no checkin ---*/
		for(var j=0 ;j<produtosRecemAdicionado.length;j++){													//pecorrer string de idLista e idProdutos 
			var stringListaProduto = produtosRecemAdicionado[j];											//id da lista e do produto
			var idLista = "";																				//variavel id da lista
			var id_produto = "";																			//variavel id do produto
			for(var u=0;u<stringListaProduto.length;u++){													//for para repartir a string
				if(stringListaProduto[u] != "-"){															//enquanto nao encontra a barra(-)
					idLista+= stringListaProduto[u];														//salva o id da lista
				}else{																						//se encontrou a barra(-)
					id_produto = stringListaProduto.substring((u+1),stringListaProduto.length);				//salva o id do produto
					break;
				}
			}
			if(id_produto == produtos.nome && window.localStorage.listaClicadaCheckin == idLista ){			//se for algum produto recem adicionado na lista respectiva
				var idProduto = 0;																			//o id desse produto será 0
				break;
			}else{																							//se nao for
				var idProduto = produtos.id_produto;														//o id do produto será seu id de origem
			}
		}
		
		//--- dados para formar o prouto
		var id_produto = produtos.id_produto;  /**/	var nome = produtos.nome;  /**/	var marca = produtos.marca;
		var id_estabelecimento = produtos.id_estabelecimento;  /**/	var nomeEstabelecimento = produtos.nomeEstabelecimento;	 /**/  var precoProd = produtos.preco;
		var quantidade = produtos.quantidade;  /**/	var unidade = produtos.unidade;	 /**/  var embalagem = produtos.embalagem;
		var dataAtual =produtos.dataAtual;  /**/  var codigoDeBarras = produtos.codigoDeBarras;  /**/	var tipoCodigoDeBarras = produtos.tipoCodigoDeBarras;
		//---- ----//
			
		/*-- checkbox --*/
		checkbox.setAttribute("id",produtos.id_produto);
		checkbox.setAttribute("onclick","guardarItens('"+id_produto+"','"+nome+"','"+marca+"','"+id_estabelecimento+"','"+
														nomeEstabelecimento+"','"+precoProd+"','"+quantidade+"','"+unidade+"','"+
														embalagem+"','"+dataAtual+"','"+codigoDeBarras+"','"+tipoCodigoDeBarras+"')");
		checkbox.setAttribute("value",produtos.nome);
		checkbox.setAttribute("type","checkbox");
		checkbox.setAttribute("name","produtos");
		checkbox.setAttribute("class","checkbox");
		
		/*-- preço --*/
		preco.setAttribute("class","preco-checkin");
		preco.setAttribute("title",idProduto);									//preço recebe o id para ser adicionado ao objeto produto(idOrigem ou 0 ou -idOrigem)
		preco.setAttribute("id","preco"+produtos.id_produto);
		
		if(produtos.preco != 0)													//se o produto tiver nenhum preço
			preco.innerHTML = "R$ "+ produtos.preco.toFixed(2);					//escreve esse preço na tela, formatado com duas casas decimais(to fixed(2))
		else																	//se nao tiver preço
			preco.innerHTML = "-";												//escreve um traço na tela
		
		/*-- definindo tags filhos --*/
		inp.setAttribute("id",produtos.id_produto);
		inp.setAttribute("class", "alert alert-warning");
		inp.setAttribute("name", "produtos");
		inp.setAttribute("role", "alert");
		inp.appendChild(nomeProduto);	
		inp.appendChild(checkbox);	
		nomeProduto.appendChild(preco);
	}						
	var pai = document.getElementById("produtos_checkIn");
	pai.appendChild(inp);

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