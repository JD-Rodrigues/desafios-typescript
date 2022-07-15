

console.log('Arquivo de testes. Pode mexer nele como quiser.')

import { IHttpClientGet,IRequestToken, IRequestAccountId, IResponseLists,IMovieResponse } from "./types";

var apiKey:string;
let requestToken:string;
let username:string;
let password:string;
let sessionId:string;
let accountId:number;
let listId = '7101979';
let responseLists:IResponseLists
let newListName:string;
let newListDesc:string;

let loginButton = document.getElementById('login-button')! as HTMLButtonElement;
let logoutButton = document.getElementById('logout-btn')! as HTMLButtonElement;
let searchButton = document.getElementById('search-button')!;
let searchContainer = document.getElementById('search-container')!;
let myListsButton = document.getElementById('my-lists-btn')!as HTMLButtonElement;
let createListButton = document.getElementById('create-list')! as HTMLButtonElement;
let submitNewListButton = document.getElementById('submit-new-list-button')! as HTMLButtonElement;
let closeNewListWindowButton = document.getElementById('create-list-back-button') as HTMLButtonElement;


loginButton.addEventListener('click', async () => {
  loginButton.disabled=true
  await criarRequestToken();
  console.log(requestToken)
  await logar();
  console.log([username,password])
  await criarSessao();
  console.log(sessionId)
  showHideLogin()  
  console.log(movieItem())
  console.log(addToListModal())
})

logoutButton.addEventListener('click', ()=>{  
  showHideLogin()
  cleanLoginFields()
})

searchButton.addEventListener('click', async () => {
  searchContainer.innerHTML=''
  let search = document.getElementById('search') as HTMLInputElement;
  let query = search.value
  let responseJson = await procurarFilme(query);
  let listaDeFilmes = responseJson.results
  console.log(listaDeFilmes[0].poster_path)
  mostrarFilmes(listaDeFilmes)  
})

myListsButton.addEventListener('click', ()=>{
  pegandoAccountId()
  listarListas()
  showHideMyListsArea()
})

createListButton.addEventListener('click', ()=>{
  showHideCreateNewList()
  
  closeNewListWindowButton.addEventListener('click', ()=>{
  showHideCreateNewList()
  })
})

submitNewListButton.addEventListener('click', ()=>{
  submitNewListButton.disabled=true
  criarLista(newListName, newListDesc)
  showHideCreateNewList() 
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

function preencherTituloNovaLista() {
  const tituloInput = document.getElementById('list-title-input') as HTMLInputElement
  if(tituloInput !== null){
      newListName = tituloInput.value;
      validateSubmiteNewListButton() ;
  }
}

function preencherDescNovaLista() {
  const descInput = document.getElementById('list-desc-input') as HTMLInputElement
  if(descInput !== null){
      newListDesc = descInput.value;
      validateSubmiteNewListButton() ;
  }
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

function validateSubmiteNewListButton() {
  if (newListName && newListDesc) {
    submitNewListButton.disabled = false;
  } else {
    submitNewListButton.disabled = true;
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

function movieItem(){
  const movie = document.createElement('li')
  movie.classList.add('movie')

  const cover = document.createElement('div')
  cover.classList.add('cover')

  const rate = document.createElement('div')
  rate.classList.add('rate')

  const rateValue = document.createElement('div')
  rateValue.classList.add('rate-value')

  rate.appendChild(rateValue)


  const addRemoveMovie = document.createElement('div')
  addRemoveMovie.classList.add('add-remove-movie')

  const iconAddRemoveMovie = document.createElement('img')

  addRemoveMovie.appendChild(iconAddRemoveMovie)
  cover.appendChild(rate)
  cover.appendChild(addRemoveMovie)

  const movieTitle = document.createElement('div')!
  movieTitle.classList.add('title')

  const titleText = document.createElement('div')
  titleText.classList.add('title-text')

  movieTitle.appendChild(titleText)
  movie.appendChild(cover)
  movie.appendChild(movieTitle)

  return movie
}

function addToListModal(){
  const addToListWindow = document.createElement('div')
  addToListWindow.classList.add('add-to-list-window')
  
  const addToNewList = document.createElement('div')
  addToNewList.classList.add('add-to-new-list')

  const addToNewListTitle = document.createElement('span')
  addToNewListTitle.classList.add('add-to-new-list-title')
  addToNewListTitle.innerHTML='Nova lista'

  addToNewList.appendChild(addToNewListTitle)

  const listsToAddMovieIn = document.createElement('ul')
  listsToAddMovieIn.classList.add('lists-to-add-movie-in')

  addToListWindow.appendChild(addToNewList)
  addToListWindow.appendChild(listsToAddMovieIn)

  return addToListWindow
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
  
  if(loginScreen.style.display==='none'){
    loginScreen.style.display = 'flex'
    api.value = ''
    setTimeout(()=>{
      loginScreen.style.opacity = '1'
    }, 1000)
  }else{
    loginScreen.style.opacity = '0'
    setTimeout(()=>{
      loginScreen.style.display = 'none'
      cleanLoginFields()
    }, 1000)
  }
  
}

function showHideCreateNewList(){
  const createNewList = document.querySelector('.create-list-background') as HTMLDivElement  
  
  if (createNewList.style.display === "flex"){
    createNewList.style.opacity = "0"   
    cleanNewListFields() 
    setTimeout(()=>{
      createNewList.style.display='none'       
      return null
    }, 1000) 
  } else{    
    createNewList.style.display = 'flex'     
    setTimeout(()=>{
      createNewList.style.opacity = "1" 
    }, 200)   
  }

   
  
  
}

function cleanLoginFields(){
  let search = document.getElementById('search')!as HTMLInputElement
  search.value=''
  
  searchContainer.innerHTML=''
}

function cleanNewListFields(){
  const tituloInput = document.getElementById('list-title-input') as HTMLInputElement
  const descInput = document.getElementById('list-desc-input') as HTMLInputElement
  tituloInput.value = ''
  descInput.value = ''
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
  listarListas()
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

async function pegandoAccountId() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
    method: "GET"
  }) as IRequestAccountId
  accountId = result.id
}

async function listarListas() {
  let response = await HttpClient.get({
    url: `https://api.themoviedb.org/3/account/${accountId}/lists?api_key=${apiKey}&session_id=${sessionId}`,
    method: "GET"
  }) as IResponseLists
  
  const areaLists = document.querySelector('#my-lists #list-of-lists')!
  areaLists.innerHTML=''
  response.results.map(list=>{    
    const li = document.createElement('li')
    li.innerHTML=list.name
    li.setAttribute('data-key', `${list.id}`)
    areaLists.appendChild(li)
  })
  
}

function showHideMyListsArea(){
  const myLists = document.querySelector('#my-lists')! as HTMLDivElement  

  if(myLists.style.height==='100%'){
    myLists.style.padding='0px'
    myLists.style.height='0px'
  }else{
    myLists.style.padding='30px'
    myLists.style.height='100%'
  }
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
}

function mostrarFilmes(ListaParaIterar:IMovieResponse[] ){
  let ul = document.createElement('ul');
  ul.classList.add('searched-movie-list')
  for (const item of ListaParaIterar) {
    let movie = movieItem();

    let cover = movie.querySelector('.movie .cover')! as HTMLDivElement
    cover.style.backgroundImage=`url(https://www.themoviedb.org/t/p/w220_and_h330_face${item.poster_path})`

    let rate = movie.querySelector('.rate-value ')! as HTMLDivElement
    rate.innerHTML=`${item.vote_average.toFixed(1)}`

    let addMovieToListButtonImg = movie.querySelector('.add-remove-movie img')! as HTMLImageElement
    addMovieToListButtonImg.src="./src/assets/images/list-plus.png"
    addMovieToListButtonImg.alt='Adicionar a lista'
    addMovieToListButtonImg.title='Adicionar a lista'

    let title = movie.querySelector('.title')! as HTMLDivElement
    title.innerHTML=`${item.original_title}`

    ul.appendChild(movie)

  }
  
  searchContainer.appendChild(ul);
}


