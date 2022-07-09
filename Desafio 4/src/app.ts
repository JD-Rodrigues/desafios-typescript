

console.log('Arquivo de testes. Pode mexer nele como quiser.')

import { IHttpClientGet,IRequestToken } from "./types";

var apiKey:string;
let requestToken:string;
let username:string;
let password:string;
let sessionId:string;
let listId = '7101979';

let loginButton = document.getElementById('login-button')! as HTMLButtonElement;
let logoutButton = document.getElementById('logout-btn')! as HTMLButtonElement;
let searchButton = document.getElementById('search-button')!;
let searchContainer = document.getElementById('search-container')!;
let ul = searchContainer.querySelector('ul')





loginButton.addEventListener('click', async () => {
  loginButton.disabled=true
  await criarRequestToken();
  console.log(requestToken)
  await logar();
  console.log([username,password])
  await criarSessao();
  console.log(sessionId)
  showHideLogin()   
})

searchButton.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let search = document.getElementById('search') as HTMLInputElement;
  let query = search.value
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
  }
  
  searchContainer.appendChild(ul);
})

logoutButton.addEventListener('click', ()=>{  
  showHideLogin()
})


function preencherSenha() {
    const pass = document.getElementById('senha') as HTMLInputElement
    if (pass !== null){
        password = pass.value;
        validateLoginButton();
    }
  
}

function preencherLogin() {
    const user = document.getElementById('login') as HTMLInputElement
    if(user!==null){
        username =user.value;
        validateLoginButton();
    }
}

function preencherApi() {
    const api = document.getElementById('api-key') as HTMLInputElement
    if(api !== null){
        apiKey = api.value;
        validateLoginButton();
    }
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

class HttpClient {
  static async get({url, method, body}:IHttpClientGet) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query:string) {
  let encodedQuery:string = encodeURI(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}`,
    method: "GET"
  }) as IRequestToken
  console.log(result)
  return result
}

async function adicionarFilme(filmeId:number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as IRequestToken
  
  requestToken = result.request_token 
  
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }) as IRequestToken

  if(result.session_id !== undefined){
    sessionId = result.session_id;
  } 
}

function showHideLogin(){
  const loginScreen = document.querySelector('.login-background')! as HTMLDivElement  
  const api = document.getElementById('api-key') as HTMLInputElement

  api.value = ''
  
  if(loginScreen.style.display!=='none'){
    loginScreen.style.opacity = '0'
    setTimeout(()=>{
      loginScreen.style.display = 'none'
    }, 1000)
  }else{
    loginScreen.style.display = 'flex'
    setTimeout(()=>{
      loginScreen.style.opacity = '1'
      cleanFields()
    }, 1000)
  }
  
}

function cleanFields(){
  let search = document.getElementById('search')!as HTMLInputElement
  let list = searchContainer.lastElementChild
  apiKey = ''
  search.value=''
  
  if(list!==null){
    list.innerHTML=''
  }  
}

async function criarLista(nomeDaLista:string, descricao:string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
}

async function adicionarFilmeNaLista(filmeId:number, listaId:number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
}
