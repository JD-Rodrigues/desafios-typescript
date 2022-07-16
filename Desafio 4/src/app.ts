

import { IHttpClientGet,IRequestToken, IRequestAccountId, IResponseLists,IMovieResponse, TMovieOverviewInsideAList, IListInside, TListOverview } from "./types";

var apiKey:string;
let requestToken:string;
let username:string;
let password:string;
let sessionId:string;
let accountId:number;
let newListName:string;
let newListDesc:string;

let loginButton = document.getElementById('login-button')! as HTMLButtonElement;
let logoutButton = document.getElementById('logout-btn')! as HTMLButtonElement;
let searchButton = document.getElementById('search-button')!;
let searchContainer = document.getElementById('search-container')!;
let listWrapper = document.querySelector('.list-wrapper')! as HTMLDivElement
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
})

logoutButton.addEventListener('click', ()=>{  
  hideList()
  hideMyListsArea()
  showHideLogin()
  cleanSearchFields()
})

searchButton.addEventListener('click', async () => {
  hideList()
  hideMyListsArea()
  let search = document.getElementById('search') as HTMLInputElement;
  let query = search.value
  let responseJson = await procurarFilme(query);
  let listaDeFilmes = responseJson.results

  mostrarFilmesBuscados(listaDeFilmes)  
  search.value=''
})

myListsButton.addEventListener('click', ()=>{
  const myLists = document.querySelector('#my-lists')! as HTMLDivElement 
  hideList()
  pegandoAccountId()
  listarListas()
  myLists.style.height==='100%'?hideMyListsArea():showMyListsArea()
})

createListButton.addEventListener('click', ()=>{
  showHideCreateNewList()
  
  closeNewListWindowButton.addEventListener('click', ()=>{
  showHideCreateNewList()
  })
})

submitNewListButton.addEventListener('click', async()=>{
  submitNewListButton.disabled=true
  await criarLista(newListName, newListDesc)
  let lists = await listarListas()
  let addedListId = lists[0].id
  showHideCreateNewList() 
  mostrarFilmesDaLista(await pegarLista(addedListId))
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

async function movieItem(){
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
  addRemoveMovie.addEventListener('click', ()=>{
    let addToListWindow = document.querySelector('.searched-movie-list .movie .cover .add-to-list-window')! as HTMLDivElement

    if(addToListWindow.style.display==='none'){
      addToListWindow.style.display='flex'
    }else{
      addToListWindow.style.display='none'
    }
  })

  const iconAddRemoveMovie = document.createElement('img')

  addRemoveMovie.appendChild(iconAddRemoveMovie)
  cover.appendChild(rate)
  cover.appendChild(addRemoveMovie)
  const addToList = await addToListModal()
  cover.appendChild(addToList)

  const movieTitle = document.createElement('div')!
  movieTitle.classList.add('title')

  const titleText = document.createElement('div')
  titleText.classList.add('title-text')

  movieTitle.appendChild(titleText)
  movie.appendChild(cover)
  movie.appendChild(movieTitle)

  return movie
}

async function addToListModal(){
  const addToListWindow = document.createElement('div') as HTMLDivElement
  addToListWindow.classList.add('add-to-list-window')
  
  const addToNewList = document.createElement('div')
  addToNewList.classList.add('add-to-new-list')

  const addToNewListTitle = document.createElement('span')
  addToNewListTitle.classList.add('add-to-new-list-title')
  addToNewListTitle.innerHTML='Nova lista'

  addToNewList.appendChild(addToNewListTitle)

  const listsToAddMovieIn = document.createElement('ul')
  listsToAddMovieIn.classList.add('lists-to-add-movie-in')

  const lists = await listarListas()  

  lists.forEach(list=>{
    let li = document.createElement('li')! as HTMLLIElement
    let done = document.createElement('div')! as HTMLDivElement
    done.classList.add('done')

    let span = document.createElement('span')! as HTMLSpanElement
    span.innerHTML=`${list.name}`

    li.appendChild(done)
    li.appendChild(span)

    listsToAddMovieIn.appendChild(li)
  })

  

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
      cleanSearchFields()
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

function cleanSearchFields(){
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

async function adicionarFilmeNaLista(filmeId:number, listId:number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
}

async function deletarLista(listId:string){
  try {
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&session_id=${sessionId}`,
      method: "DELETE",
    })  
  } catch (error) {
    listarListas()
  }  
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
    let id:number = list.id
    li.innerHTML=list.name
    li.setAttribute('data-key', `${id}`)
    li.addEventListener('click', ()=>setListButton(id))
    areaLists.appendChild(li)
  })
  return response.results as TListOverview[]
}

async function setListButton(id:number){
  let listClickedAllInfo = await pegarLista(id)
  mostrarFilmesDaLista(listClickedAllInfo)
}

function showMyListsArea(){
  const myLists = document.querySelector('#my-lists')! as HTMLDivElement  
  myLists.style.padding='30px'
  myLists.style.height='100%'  
}

function hideMyListsArea(){
  const myLists = document.querySelector('#my-lists')! as HTMLDivElement 
  myLists.style.padding='0px'
  myLists.style.height='0px'
}

function showList(){
  listWrapper.style.display='flex'
}

function hideList(){
  listWrapper.style.display='none'
}

async function pegarLista(listId:number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  }) as IListInside
  return result
}

async function mostrarFilmesBuscados(ListaParaIterar:IMovieResponse[] ){
  let ul = document.createElement('ul');
  ul.classList.add('searched-movie-list')
  for (const item of ListaParaIterar) {
    let movie = await movieItem();

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

async function mostrarFilmesDaLista(allListInfo:IListInside)/* ver a possibilidade de eliminar um parâmetro */{
  searchContainer.innerHTML=''
  listWrapper.innerHTML=''
  let header = document.createElement('header')

  let back = document.createElement('div')
  back.classList.add('back')
  back.innerHTML='Voltar'
  back.addEventListener('click', hideList)

  let remove = document.createElement('div')
  remove.classList.add('remove-list')
  remove.addEventListener('click', async()=>{
    await deletarLista(allListInfo.id)
    hideList()
  })
  remove.innerHTML='Deletar Lista'

  header.appendChild(back)
  header.appendChild(remove)

  let listInfo = document.createElement('div')
  listInfo.classList.add('list-info')

  let title = document.createElement('div')
  title.classList.add('title')
  title.innerHTML=`${allListInfo.name}`

  let description = document.createElement('description')
  description.classList.add('description')
  description.innerHTML=`${allListInfo.description}`

  listInfo.appendChild(title)
  listInfo.appendChild(description) 

  listWrapper.appendChild(header)
  listWrapper.appendChild(listInfo)

  let ul = document.createElement('ul');
  ul.classList.add('list')
  for (const item of allListInfo.items) {
    let movie = await movieItem();

    let cover = movie.querySelector('.movie .cover')! as HTMLDivElement
    cover.style.backgroundImage=`url(https://www.themoviedb.org/t/p/w220_and_h330_face${item.poster_path})`

    let rate = movie.querySelector('.rate-value ')! as HTMLDivElement
    rate.innerHTML=`${item.vote_average.toFixed(1)}`

    let addMovieToListButtonImg = movie.querySelector('.add-remove-movie img')! as HTMLImageElement
    addMovieToListButtonImg.src="./src/assets/images/remove-item.jpg"
    addMovieToListButtonImg.alt='Remover da lista'
    addMovieToListButtonImg.title='Remover da lista'

    let title = movie.querySelector('.title')! as HTMLDivElement
    title.innerHTML=`${item.original_title===undefined?item.original_name:item.original_title}`

    ul.appendChild(movie)

  }
  
  listWrapper.appendChild(ul);
  showList()
}

