var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
onload = function () {
    var user = localStorage.getItem('username');
    var pass = localStorage.getItem('password');
    var key = localStorage.getItem('apiKey');
    var token = localStorage.getItem('requestToken');
    var id = localStorage.getItem('sessionId');
    if (user !== null) {
        username = user;
    }
    else {
        loginArea.style.display = 'flex';
    }
    if (pass !== null) {
        password = pass;
    }
    if (key !== null) {
        apiKey = key;
    }
    if (token !== null) {
        requestToken = token;
    }
    if (id !== null) {
        sessionId = id;
    }
    updateAndShowLatestMovies();
};
var apiKey;
var requestToken;
var username;
var password;
var sessionId;
var accountId;
var newListName;
var newListDesc;
var loginArea = document.querySelector('.login-background');
var loginButton = document.getElementById('login-button');
var logoutButton = document.getElementById('logout-btn');
var searchButton = document.getElementById('search-button');
var searchContainer = document.getElementById('search-container');
var listWrapper = document.querySelector('.list-wrapper');
var linkToHomePage = document.querySelector('#home-btn');
var linkToPopularMovies = document.querySelector('#popular-btn');
var linkToupcomingMovies = document.querySelector('#upcoming-btn');
var myListsButton = document.getElementById('my-lists-btn');
var closeMyListsAreaButton = document.querySelector('#close-my-lists-area');
var submitNewListButton = document.getElementById('submit-new-list-button');
var closeNewListWindowButton = document.getElementById('create-list-back-button');
loginButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginButton.disabled = true;
                return [4 /*yield*/, criarRequestToken()];
            case 1:
                _a.sent();
                return [4 /*yield*/, logar()];
            case 2:
                _a.sent();
                return [4 /*yield*/, criarSessao()];
            case 3:
                _a.sent();
                showHideLogin();
                updateAndShowLatestMovies();
                storeLoginData();
                return [2 /*return*/];
        }
    });
}); });
logoutButton.addEventListener('click', function () {
    hideList();
    hideMyListsArea();
    showHideLogin();
    cleanSearchFields();
    searchContainer.innerHTML = '';
    localStorage.clear();
});
searchButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var search, query, responseJson, listaDeFilmes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchContainer.innerHTML = '';
                hideList();
                hideMyListsArea();
                loading();
                search = document.getElementById('search');
                query = search.value;
                return [4 /*yield*/, procurarFilme(query)];
            case 1:
                responseJson = _a.sent();
                listaDeFilmes = responseJson.results;
                mostrarFilmesBuscados(listaDeFilmes, "Resultados para " + query);
                search.value = '';
                return [2 /*return*/];
        }
    });
}); });
myListsButton.addEventListener('click', function () {
    var myLists = document.querySelector('#my-lists');
    hideList();
    pegandoAccountId();
    listarListas();
    myLists.style.height === '100%' ? hideMyListsArea() : showMyListsArea();
});
linkToHomePage.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        updateAndShowLatestMovies();
        hideList();
        hideMyListsArea();
        return [2 /*return*/];
    });
}); });
linkToPopularMovies.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var responseJson, listaDeFilmes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hideList();
                hideMyListsArea();
                loading();
                return [4 /*yield*/, loadPopularMovies()];
            case 1:
                responseJson = _a.sent();
                listaDeFilmes = responseJson.results;
                mostrarFilmesBuscados(listaDeFilmes, "Os mais populares");
                return [2 /*return*/];
        }
    });
}); });
linkToupcomingMovies.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var responseJson, listaDeFilmes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hideList();
                hideMyListsArea();
                loading();
                return [4 /*yield*/, loadUpcomingMovies()];
            case 1:
                responseJson = _a.sent();
                listaDeFilmes = responseJson.results;
                mostrarFilmesBuscados(listaDeFilmes, "Em breve");
                return [2 /*return*/];
        }
    });
}); });
closeMyListsAreaButton.addEventListener('click', function () {
    hideMyListsArea();
});
submitNewListButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dataKey, lists, addedListId, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                dataKey = submitNewListButton.getAttribute('data-key');
                submitNewListButton.disabled = true;
                return [4 /*yield*/, criarLista(newListName, newListDesc)];
            case 1:
                _b.sent();
                return [4 /*yield*/, listarListas()];
            case 2:
                lists = _b.sent();
                addedListId = lists[0].id;
                return [4 /*yield*/, adicionarFilmeNaLista(Number(dataKey), addedListId)];
            case 3:
                _b.sent();
                showHideCreateNewList();
                _a = mostrarFilmesDaLista;
                return [4 /*yield*/, pegarLista(addedListId)];
            case 4:
                _a.apply(void 0, [_b.sent()]);
                updateAndShowLatestMovies();
                submitNewListButton.removeAttribute('data-key');
                return [2 /*return*/];
        }
    });
}); });
function preencherSenha() {
    var pass = document.getElementById('senha');
    if (pass !== null) {
        password = pass.value;
        validateLoginButton();
    }
}
function preencherLogin() {
    var user = document.getElementById('login');
    if (user !== null) {
        username = user.value;
        validateLoginButton();
    }
}
function preencherApi() {
    var api = document.getElementById('api-key');
    if (api !== null) {
        apiKey = api.value;
        validateLoginButton();
    }
}
function preencherTituloNovaLista() {
    var tituloInput = document.getElementById('list-title-input');
    if (tituloInput !== null) {
        newListName = tituloInput.value;
        validateSubmiteNewListButton();
    }
}
function preencherDescNovaLista() {
    var descInput = document.getElementById('list-desc-input');
    if (descInput !== null) {
        newListDesc = descInput.value;
        validateSubmiteNewListButton();
    }
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
function validateSubmiteNewListButton() {
    if (newListName && newListDesc) {
        submitNewListButton.disabled = false;
    }
    else {
        submitNewListButton.disabled = true;
    }
}
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.get = function (_a) {
        var url = _a.url, method = _a.method, body = _a.body;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = new XMLHttpRequest();
                        request.open(method, url, true);
                        request.onload = function () {
                            if (request.status >= 200 && request.status < 300) {
                                resolve(JSON.parse(request.responseText));
                            }
                            else {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                });
                            }
                        };
                        request.onerror = function () {
                            reject({
                                status: request.status,
                                statusText: request.statusText
                            });
                        };
                        if (body) {
                            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            body = JSON.stringify(body);
                        }
                        request.send(body);
                    })];
            });
        });
    };
    return HttpClient;
}());
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function () {
        var encodedQuery, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encodedQuery = encodeURI(query);
                    return [4 /*yield*/, HttpClient.get({
                            url: "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + encodedQuery,
                            method: "GET"
                        })];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function loadLatestMovies() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/movie/now_playing?api_key=" + apiKey,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function loadPopularMovies() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function loadUpcomingMovies() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/movie/upcoming?api_key=" + apiKey,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function movieItem(movieId) {
    return __awaiter(this, void 0, void 0, function () {
        var movie, cover, rate, rateValue, addRemoveMovie, iconAddRemoveMovie, addToList, movieTitle, titleText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    movie = document.createElement('li');
                    movie.classList.add('movie');
                    movie.setAttribute('data-key', "" + movieId);
                    cover = document.createElement('div');
                    cover.classList.add('cover');
                    rate = document.createElement('div');
                    rate.classList.add('rate');
                    rateValue = document.createElement('div');
                    rateValue.classList.add('rate-value');
                    rate.appendChild(rateValue);
                    addRemoveMovie = document.createElement('div');
                    addRemoveMovie.classList.add('add-remove-movie');
                    addRemoveMovie.setAttribute('data-key', "" + movieId);
                    iconAddRemoveMovie = document.createElement('img');
                    addRemoveMovie.appendChild(iconAddRemoveMovie);
                    cover.appendChild(rate);
                    cover.appendChild(addRemoveMovie);
                    return [4 /*yield*/, addToListModal(movieId)];
                case 1:
                    addToList = _a.sent();
                    cover.appendChild(addToList);
                    addToList.classList.toggle('none');
                    addRemoveMovie.addEventListener('click', function () {
                        setTimeout(function () {
                            addToList.classList.toggle('none');
                            movieId !== undefined && hideNotSelectedAddToListModals(movieId);
                        }, 200);
                    });
                    addToList.addEventListener('mouseleave', function () {
                        setTimeout(function () {
                            addToList.classList.add('none');
                        }, 200);
                    });
                    movieTitle = document.createElement('div');
                    movieTitle.classList.add('title');
                    titleText = document.createElement('div');
                    titleText.classList.add('title-text');
                    movieTitle.appendChild(titleText);
                    movie.appendChild(cover);
                    movie.appendChild(movieTitle);
                    return [2 /*return*/, movie];
            }
        });
    });
}
function movieItemInsideList(movieId, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var movie, cover, rate, rateValue, addRemoveMovie, iconAddRemoveMovie, movieTitle, titleText;
        var _this = this;
        return __generator(this, function (_a) {
            movie = document.createElement('li');
            movie.classList.add('movie');
            movie.setAttribute('data-key', "" + movieId);
            cover = document.createElement('div');
            cover.classList.add('cover');
            rate = document.createElement('div');
            rate.classList.add('rate');
            rateValue = document.createElement('div');
            rateValue.classList.add('rate-value');
            rate.appendChild(rateValue);
            addRemoveMovie = document.createElement('div');
            addRemoveMovie.classList.add('add-remove-movie');
            addRemoveMovie.setAttribute('data-key', "" + movieId);
            iconAddRemoveMovie = document.createElement('img');
            addRemoveMovie.appendChild(iconAddRemoveMovie);
            cover.appendChild(rate);
            cover.appendChild(addRemoveMovie);
            addRemoveMovie.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var allInfoOfThisList;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, removeMovieFromList(movieId, listId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, pegarLista(listId)];
                        case 2:
                            allInfoOfThisList = _a.sent();
                            document.querySelector('.list').innerHTML = '';
                            mostrarFilmesDaLista(allInfoOfThisList);
                            return [2 /*return*/];
                    }
                });
            }); });
            movieTitle = document.createElement('div');
            movieTitle.classList.add('title');
            titleText = document.createElement('div');
            titleText.classList.add('title-text');
            movieTitle.appendChild(titleText);
            movie.appendChild(cover);
            movie.appendChild(movieTitle);
            return [2 /*return*/, movie];
        });
    });
}
function addToListModal(movieId) {
    return __awaiter(this, void 0, void 0, function () {
        var addToListWindow, addToNewList, addToNewListTitle, listsToAddMovieIn, lists;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addToListWindow = document.createElement('div');
                    addToListWindow.classList.add('add-to-list-window');
                    addToNewList = document.createElement('div');
                    addToNewList.classList.add('add-to-new-list');
                    addToNewList.addEventListener('click', function () {
                        showHideCreateNewList(movieId);
                    });
                    addToNewListTitle = document.createElement('span');
                    addToNewListTitle.classList.add('add-to-new-list-title');
                    addToNewListTitle.innerHTML = 'Nova lista';
                    addToNewList.appendChild(addToNewListTitle);
                    listsToAddMovieIn = document.createElement('ul');
                    listsToAddMovieIn.classList.add('lists-to-add-movie-in');
                    return [4 /*yield*/, listarListas()];
                case 1:
                    lists = _a.sent();
                    lists.forEach(function (list) { return __awaiter(_this, void 0, void 0, function () {
                        var thisListInside, moviesOfThisList, li, done, span;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, pegarLista(list.id)];
                                case 1:
                                    thisListInside = _a.sent();
                                    moviesOfThisList = thisListInside.items;
                                    li = document.createElement('li');
                                    li.dataset.listId = "" + list.id;
                                    li.dataset.movieId = "" + movieId;
                                    li.addEventListener('click', function () {
                                        var movieIndexInTheList = moviesOfThisList.findIndex(function (movie) { return movie.id === movieId; });
                                        if (movieIndexInTheList === -1) {
                                            adicionarFilmeNaLista(Number(li.dataset.movieId), Number(li.dataset.listId));
                                        }
                                        else {
                                            removeMovieFromList(movieId, Number(thisListInside.id));
                                        }
                                        done.classList.toggle('check-done');
                                    });
                                    done = document.createElement('div');
                                    done.classList.add('done');
                                    moviesOfThisList.map(function (movie) {
                                        if (movie.id === movieId) {
                                            done.classList.add('check-done');
                                        }
                                    });
                                    span = document.createElement('span');
                                    span.innerHTML = "" + list.name;
                                    li.appendChild(done);
                                    li.appendChild(span);
                                    listsToAddMovieIn.appendChild(li);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    addToListWindow.appendChild(addToNewList);
                    addToListWindow.appendChild(listsToAddMovieIn);
                    return [2 /*return*/, addToListWindow];
            }
        });
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/movie/" + filmeId + "?api_key=" + apiKey + "&language=en-US",
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/authentication/token/new?api_key=" + apiKey,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    requestToken = result.request_token;
                    return [2 /*return*/];
            }
        });
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=" + apiKey,
                        method: "POST",
                        body: {
                            username: "" + username,
                            password: "" + password,
                            request_token: "" + requestToken
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/authentication/session/new?api_key=" + apiKey + "&request_token=" + requestToken,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    if (result.session_id !== undefined) {
                        sessionId = result.session_id;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function storeLoginData() {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("requestToken", requestToken);
    localStorage.setItem("sessionId", sessionId);
}
function showHideLogin() {
    var api = document.getElementById('api-key');
    if (loginArea.style.display === 'none') {
        loginArea.style.display = 'flex';
        api.value = '';
        setTimeout(function () {
            loginArea.style.opacity = '1';
        }, 1000);
    }
    else {
        loginArea.style.opacity = '0';
        setTimeout(function () {
            loginArea.style.display = 'none';
        }, 1000);
    }
}
function showHideCreateNewList(movieId) {
    var createNewList = document.querySelector('.create-list-background');
    var submitNewList = document.querySelector('#submit-new-list-button');
    if (createNewList.style.display === "flex") {
        createNewList.style.opacity = "0";
        cleanNewListFields();
        setTimeout(function () {
            createNewList.style.display = 'none';
            return null;
        }, 1000);
    }
    else {
        createNewList.style.display = 'flex';
        submitNewListButton.setAttribute('data-key', "" + movieId);
        setTimeout(function () {
            createNewList.style.opacity = "1";
        }, 200);
    }
}
function cleanSearchFields() {
    var search = document.getElementById('search');
    search.value = '';
}
function cleanNewListFields() {
    var tituloInput = document.getElementById('list-title-input');
    var descInput = document.getElementById('list-desc-input');
    tituloInput.value = '';
    descInput.value = '';
}
function loading() {
    searchContainer.innerHTML = '';
    var spinner = document.createElement('div');
    spinner.classList.add('spinner');
    searchContainer.appendChild(spinner);
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/list?api_key=" + apiKey + "&session_id=" + sessionId,
                        method: "POST",
                        body: {
                            name: nomeDaLista,
                            description: descricao,
                            language: "pt-br"
                        }
                    })];
                case 1:
                    result = _a.sent();
                    listarListas();
                    return [2 /*return*/];
            }
        });
    });
}
function adicionarFilmeNaLista(filmeId, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/list/" + listId + "/add_item?api_key=" + apiKey + "&session_id=" + sessionId,
                        method: "POST",
                        body: {
                            media_id: filmeId
                        }
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function removeMovieFromList(filmeId, listId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/list/" + listId + "/remove_item?api_key=" + apiKey + "&session_id=" + sessionId,
                        method: "POST",
                        body: {
                            media_id: filmeId
                        }
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deletarLista(listId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, HttpClient.get({
                            url: "https://api.themoviedb.org/3/list/" + listId + "?api_key=" + apiKey + "&session_id=" + sessionId,
                            method: "DELETE",
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    listarListas();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function pegandoAccountId() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/account?api_key=" + apiKey + "&session_id=" + sessionId,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    accountId = result.id;
                    return [2 /*return*/];
            }
        });
    });
}
function listarListas() {
    return __awaiter(this, void 0, void 0, function () {
        var response, areaLists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/account/" + accountId + "/lists?api_key=" + apiKey + "&session_id=" + sessionId,
                        method: "GET"
                    })];
                case 1:
                    response = _a.sent();
                    areaLists = document.querySelector('#my-lists #list-of-lists');
                    areaLists.innerHTML = '';
                    response.results.map(function (list) {
                        var li = document.createElement('li');
                        var id = list.id;
                        li.innerHTML = list.name;
                        li.setAttribute('data-key', "" + id);
                        li.addEventListener('click', function () { return setListButton(id); });
                        areaLists.appendChild(li);
                    });
                    return [2 /*return*/, response.results];
            }
        });
    });
}
function setListButton(id) {
    return __awaiter(this, void 0, void 0, function () {
        var listClickedAllInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pegarLista(id)];
                case 1:
                    listClickedAllInfo = _a.sent();
                    mostrarFilmesDaLista(listClickedAllInfo);
                    return [2 /*return*/];
            }
        });
    });
}
function showMyListsArea() {
    var myLists = document.querySelector('#my-lists');
    myLists.style.padding = '30px';
    myLists.style.height = '100%';
}
function hideMyListsArea() {
    var myLists = document.querySelector('#my-lists');
    myLists.style.padding = '0px';
    myLists.style.height = '0px';
}
function showList() {
    listWrapper.style.display = 'flex';
}
function hideList() {
    listWrapper.style.display = 'none';
}
function hideNotSelectedAddToListModals(e) {
    var searchedMovies = document.querySelectorAll('.searched-movie-list .movie');
    searchedMovies.forEach(function (movie) {
        var dataKey = Number(movie.getAttribute('data-key'));
        dataKey !== e && movie.querySelector('.cover .add-to-list-window').classList.add('none');
    });
}
function pegarLista(listId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "https://api.themoviedb.org/3/list/" + listId + "?api_key=" + apiKey,
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function mostrarFilmesBuscados(ListaParaIterar, showTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var ul, title, _i, ListaParaIterar_1, item, movie, cover, rate, addMovieToListButtonImg, title_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ul = document.createElement('ul');
                    ul.classList.add('searched-movie-list');
                    title = document.createElement('h1');
                    title.innerHTML = "<div><h1>" + showTitle + "</h1></div>";
                    _i = 0, ListaParaIterar_1 = ListaParaIterar;
                    _a.label = 1;
                case 1:
                    if (!(_i < ListaParaIterar_1.length)) return [3 /*break*/, 4];
                    item = ListaParaIterar_1[_i];
                    return [4 /*yield*/, movieItem(item.id)];
                case 2:
                    movie = _a.sent();
                    cover = movie.querySelector('.movie .cover');
                    cover.style.backgroundImage = "url(https://www.themoviedb.org/t/p/w220_and_h330_face" + item.poster_path + ")";
                    rate = movie.querySelector('.rate-value ');
                    rate.innerHTML = "" + item.vote_average.toFixed(1);
                    addMovieToListButtonImg = movie.querySelector('.add-remove-movie img');
                    addMovieToListButtonImg.src = "./src/assets/images/list-plus.png";
                    addMovieToListButtonImg.alt = 'Adicionar a lista';
                    addMovieToListButtonImg.title = 'Adicionar a lista';
                    title_1 = movie.querySelector('.title');
                    title_1.innerHTML = "" + item.original_title;
                    ul.appendChild(movie);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    searchContainer.innerHTML = '';
                    searchContainer.appendChild(title);
                    searchContainer.appendChild(ul);
                    return [2 /*return*/];
            }
        });
    });
}
function updateAndShowLatestMovies() {
    return __awaiter(this, void 0, void 0, function () {
        var responseJson, listaDeFilmes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading();
                    return [4 /*yield*/, loadLatestMovies()];
                case 1:
                    responseJson = _a.sent();
                    listaDeFilmes = responseJson.results;
                    mostrarFilmesBuscados(listaDeFilmes, "Nos cinemas");
                    return [2 /*return*/];
            }
        });
    });
}
function mostrarFilmesDaLista(allListInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var header, back, remove, listInfo, title, description, ul, _i, _a, item, movie, cover, rate, addMovieToListButtonImg, title_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    listWrapper.innerHTML = '';
                    header = document.createElement('header');
                    back = document.createElement('div');
                    back.classList.add('back');
                    back.innerHTML = 'Voltar';
                    back.addEventListener('click', hideList);
                    remove = document.createElement('div');
                    remove.classList.add('remove-list');
                    remove.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, deletarLista(allListInfo.id)];
                                case 1:
                                    _a.sent();
                                    updateAndShowLatestMovies();
                                    hideList();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    remove.innerHTML = 'Deletar Lista';
                    header.appendChild(back);
                    header.appendChild(remove);
                    listInfo = document.createElement('div');
                    listInfo.classList.add('list-info');
                    title = document.createElement('div');
                    title.classList.add('title');
                    title.innerHTML = "" + allListInfo.name;
                    description = document.createElement('description');
                    description.classList.add('description');
                    description.innerHTML = "" + allListInfo.description;
                    listInfo.appendChild(title);
                    listInfo.appendChild(description);
                    listWrapper.appendChild(header);
                    listWrapper.appendChild(listInfo);
                    ul = document.createElement('ul');
                    ul.classList.add('list');
                    _i = 0, _a = allListInfo.items;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    item = _a[_i];
                    return [4 /*yield*/, movieItemInsideList(item.id, Number(allListInfo.id))];
                case 2:
                    movie = _b.sent();
                    cover = movie.querySelector('.movie .cover');
                    cover.style.backgroundImage = "url(https://www.themoviedb.org/t/p/w220_and_h330_face" + item.poster_path + ")";
                    rate = movie.querySelector('.rate-value ');
                    rate.innerHTML = "" + item.vote_average.toFixed(1);
                    addMovieToListButtonImg = movie.querySelector('.add-remove-movie img');
                    addMovieToListButtonImg.src = "./src/assets/images/remove-item.jpg";
                    addMovieToListButtonImg.alt = 'Remover da lista';
                    addMovieToListButtonImg.title = 'Remover da lista';
                    title_2 = movie.querySelector('.title');
                    title_2.innerHTML = "" + (item.original_title === undefined ? item.original_name : item.original_title);
                    ul.appendChild(movie);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    listWrapper.appendChild(ul);
                    showList();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=app.js.map