type TGenre = {
    id:number
    name:string
}

type TCompany = {
    id:number
    logo_path:string
    name:string
    origin_country:string    
}

type TProductionCountry ={
    iso_3166_1:string
    name:string
}

type TSpokenlanguage ={
    english_name:string
    iso_639_1:string
    name:string
}

type Tbody = {
    username:string
    password:string
    request_token:string
}

type TbodyPost = {
    name:string
    description:string
    language:string
}

type TBodyAddMovie = {
    media_id:number
}

type TMovieList = {
    description:string
    favorite_count:number
    id:number
    item_count:number
    iso_639_1:string
    list_type:string
    name:string
    poster_path:string|null
}

interface IHttpClientGet {
    url:string
    method:string
    body?: Tbody|TbodyPost|TBodyAddMovie|string
}

interface IMovieResponse {
    adult:boolean
    backdrop_path:string
    belongs_to_collection:string|null
    budget:number
    genres:TGenre[]
    homepage:string
    id:number
    imdb_id:string
    original_language:string
    original_title:string
    overview:string
    popularity:number
    poster_path:string
    production_companies:TCompany[]
    production_countries:TProductionCountry[]
    release_date:string
    revenue:number
    runtime:number
    spoken_languages:TSpokenlanguage[]
    status:string
    tagline:string
    title:string
    video:boolean
    vote_average:number
    vote_count:number
}

interface IRequestToken{
    success:boolean
    expires_at:string
    request_token:string
    session_id?:string
    results:IMovieResponse[]
}

interface IRequestAccountId {
    avatar:{
        gravatar:{
            hash:string
        },
        tmdb:{
            avatar_path:null
        }
    },
    id:number
    iso_639_1:string
    iso_3166_1:string
    name:string
    include_adult:boolean
    username:string
}

interface IResponseLists {
    page:number
    results:TMovieList[]
    total_pages:number
    total_results:number
}


export {TGenre, TCompany, TBodyAddMovie, TProductionCountry, TSpokenlanguage, Tbody, TbodyPost,IHttpClientGet,IMovieResponse,IRequestToken, IRequestAccountId, IResponseLists }