onload = ()=>{
  let user = localStorage.getItem('username')
  let pass = localStorage.getItem('password')
  let key = localStorage.getItem('apiKey')
  let token = localStorage.getItem('requestToken')
  let id = localStorage.getItem('sessionId')

  if(user !== null){
    username = user
  }else{
    loginArea.style.display='flex'
  }

  if(pass !== null){
    password = pass
  }

  if(key !== null){
    apiKey = key
  }

  if(token !== null){
    requestToken = token
  }

  if(id !== null){
    sessionId = id
  }

  updateAndShowLatestMovies()  
}

import { IHttpClientGet,IRequestToken, IRequestAccountId, IResponseLists,IMovieResponse, TMovieOverviewInsideAList, IListInside, TListOverview } from "./types";

var apiKey:string;
let requestToken:string;
let username:string;
let password:string;
let sessionId:string;
let accountId:number;
let newListName:string;
let newListDesc:string;

let loginArea = document.querySelector('.login-background')! as HTMLDivElement
let loginButton = document.getElementById('login-button')! as HTMLButtonElement;
let logoutButton = document.getElementById('logout-btn')! as HTMLButtonElement;
let searchButton = document.getElementById('search-button')!;
let searchContainer = document.getElementById('search-container')!;
let listWrapper = document.querySelector('.list-wrapper')! as HTMLDivElement
let linkToHomePage = document.querySelector('#home-btn')! as HTMLSpanElement
let linkToPopularMovies = document.querySelector('#popular-btn')! as HTMLSpanElement
let linkToupcomingMovies = document.querySelector('#upcoming-btn')! as HTMLSpanElement
let myListsButton = document.getElementById('my-lists-btn')! as HTMLButtonElement;
let closeMyListsAreaButton = document.querySelector('#close-my-lists-area')! as HTMLButtonElement
let createListButton = document.getElementById('create-list')! as HTMLButtonElement;
let submitNewListButton = document.getElementById('submit-new-list-button')! as HTMLButtonElement;
let closeNewListWindowButton = document.getElementById('create-list-back-button') as HTMLButtonElement;


loginButton.addEventListener('click', async () => {
  loginButton.disabled=true
  await criarRequestToken();
  await logar();
  await criarSessao();
  showHideLogin()
  updateAndShowLatestMovies()  
  storeLoginData()
})

logoutButton.addEventListener('click', ()=>{  
  hideList()
  hideMyListsArea()
  showHideLogin()
  cleanSearchFields()
  searchContainer.innerHTML=''
  localStorage.clear()
})

searchButton.addEventListener('click', async () => {
  searchContainer.innerHTML=''
  hideList()
  hideMyListsArea()
  loading()
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

linkToHomePage.addEventListener('click', async()=>{
  updateAndShowLatestMovies()
  hideList()
  hideMyListsArea()
})

linkToPopularMovies.addEventListener('click', async()=>{
  hideList()
  hideMyListsArea()
  loading()
  let responseJson = await loadPopularMovies();
  let listaDeFilmes = responseJson.results
  mostrarFilmesBuscados(listaDeFilmes) 
})

linkToupcomingMovies.addEventListener('click', async()=>{
  hideList()
  hideMyListsArea()
  loading()
  let responseJson = await loadUpcomingMovies();
  let listaDeFilmes = responseJson.results
  mostrarFilmesBuscados(listaDeFilmes) 
})

closeMyListsAreaButton.addEventListener('click', ()=>{
  hideMyListsArea()
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
  updateAndShowLatestMovies()  
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

async function loadLatestMovies() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`,
    method: "GET"
  }) as IRequestToken
  console.log(result)
  return result
}

async function loadPopularMovies() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
    method: "GET"
  }) as IRequestToken
  console.log(result)
  return result
}

async function loadUpcomingMovies() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`,
    method: "GET"
  }) as IRequestToken
  console.log(result)
  return result
}



async function movieItem(movieId:number){
  const movie = document.createElement('li')
  movie.classList.add('movie')
  movie.setAttribute('data-key',`${movieId}`)

  const cover = document.createElement('div')
  cover.classList.add('cover')

  const rate = document.createElement('div')
  rate.classList.add('rate')

  const rateValue = document.createElement('div')
  rateValue.classList.add('rate-value')

  rate.appendChild(rateValue)

  const addRemoveMovie = document.createElement('div')
  addRemoveMovie.classList.add('add-remove-movie')
  addRemoveMovie.setAttribute('data-key',`${movieId}`)

  const iconAddRemoveMovie = document.createElement('img')

  addRemoveMovie.appendChild(iconAddRemoveMovie)
  cover.appendChild(rate)
  cover.appendChild(addRemoveMovie)
  const addToList = await addToListModal(movieId)
  cover.appendChild(addToList)

  addToList.classList.toggle('none')

  addRemoveMovie.addEventListener('click', ()=>{
    setTimeout(()=>{
      addToList.classList.toggle('none')
      movieId!==undefined && hideNotSelectedAddToListModals(movieId)
    },200)
  })  

  addToList.addEventListener('mouseleave',()=>{
    setTimeout(()=>{
      addToList.classList.add('none')
    },200)    
  })

  const movieTitle = document.createElement('div')!
  movieTitle.classList.add('title')

  const titleText = document.createElement('div')
  titleText.classList.add('title-text')

  movieTitle.appendChild(titleText)
  movie.appendChild(cover)
  movie.appendChild(movieTitle)

  return movie
}

async function movieItemInsideList(movieId:number, listId:number){
  const movie = document.createElement('li')
  movie.classList.add('movie')
  movie.setAttribute('data-key',`${movieId}`)

  const cover = document.createElement('div')
  cover.classList.add('cover')

  const rate = document.createElement('div')
  rate.classList.add('rate')

  const rateValue = document.createElement('div')
  rateValue.classList.add('rate-value')

  rate.appendChild(rateValue)

  const addRemoveMovie = document.createElement('div')
  addRemoveMovie.classList.add('add-remove-movie')
  addRemoveMovie.setAttribute('data-key',`${movieId}`)

  const iconAddRemoveMovie = document.createElement('img')

  addRemoveMovie.appendChild(iconAddRemoveMovie)
  cover.appendChild(rate)
  cover.appendChild(addRemoveMovie)

  addRemoveMovie.addEventListener('click', async()=>{
    await removeMovieFromList(movieId,listId)    
    let allInfoOfThisList = await pegarLista(listId)
    document.querySelector('.list')!.innerHTML=''
    mostrarFilmesDaLista(allInfoOfThisList)
  })  

  const movieTitle = document.createElement('div')!
  movieTitle.classList.add('title')

  const titleText = document.createElement('div')
  titleText.classList.add('title-text')

  movieTitle.appendChild(titleText)
  movie.appendChild(cover)
  movie.appendChild(movieTitle)

  return movie
}

async function addToListModal(movieId:number){
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

  lists.forEach(async(list)=>{
    const thisListInside = await pegarLista(list.id)
    const moviesOfThisList = thisListInside.items
    let li = document.createElement('li')! as HTMLLIElement
    li.dataset.listId=`${list.id}`
    li.dataset.movieId=`${movieId}`
    li.addEventListener('click', ()=>{
      const movieIndexInTheList = moviesOfThisList.findIndex(movie=>movie.id===movieId)

      if(movieIndexInTheList===-1){
        adicionarFilmeNaLista(Number(li.dataset.movieId), Number(li.dataset.listId))
      }else{
        removeMovieFromList(movieId, Number(thisListInside.id))
      }
     
      done.classList.toggle('check-done')
    })

    let done = document.createElement('div')! as HTMLDivElement
    done.classList.add('done')    

    moviesOfThisList.map(movie=>{
      if(movie.id === movieId){
        done.classList.add('check-done')
      }
    })

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

function storeLoginData(){
    localStorage.setItem("username", username)  
    localStorage.setItem("password", password)  
    localStorage.setItem("apiKey", apiKey)  
    localStorage.setItem("requestToken", requestToken)  
    localStorage.setItem("sessionId", sessionId)  
}

function showHideLogin(){ 
  const api = document.getElementById('api-key') as HTMLInputElement
  
  if(loginArea.style.display==='none'){
    loginArea.style.display = 'flex'
    api.value = ''
    setTimeout(()=>{
      loginArea.style.opacity = '1'
    }, 1000)
  }else{
    loginArea.style.opacity = '0'
    setTimeout(()=>{
      loginArea.style.display = 'none'
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
}

function cleanNewListFields(){
  const tituloInput = document.getElementById('list-title-input') as HTMLInputElement
  const descInput = document.getElementById('list-desc-input') as HTMLInputElement
  tituloInput.value = ''
  descInput.value = ''
}

function loading(){
  searchContainer.innerHTML=''
  const spinner = document.createElement('div')! as HTMLDivElement
  spinner.classList.add('spinner')
  searchContainer.appendChild(spinner)
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

async function removeMovieFromList(filmeId:number, listId:number){
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}/remove_item?api_key=${apiKey}&session_id=${sessionId}`,
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

function hideNotSelectedAddToListModals(e:number){
  let searchedMovies = document.querySelectorAll('.searched-movie-list .movie')
  searchedMovies.forEach(movie=>{
    let dataKey = Number(movie.getAttribute('data-key'))
    dataKey!==e && movie.querySelector('.cover .add-to-list-window')!.classList.add('none')
  })
}
async function pegarLista(listId:number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  }) as IListInside
  return result
}

async function mostrarFilmesBuscados(ListaParaIterar:IMovieResponse[]){  
  let ul = document.createElement('ul');
  ul.classList.add('searched-movie-list')
  for (const item of ListaParaIterar) {
    let movie = await movieItem(item.id);

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
  searchContainer.innerHTML=''
  searchContainer.appendChild(ul);
  
}

async function updateAndShowLatestMovies(){
  loading()
  let responseJson = await loadLatestMovies();
  let listaDeFilmes = responseJson.results     
  mostrarFilmesBuscados(listaDeFilmes)    
}

async function mostrarFilmesDaLista(allListInfo:IListInside)/* ver a possibilidade de eliminar um parâmetro */{
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
    let movie = await movieItemInsideList(item.id,Number(allListInfo.id))    

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

