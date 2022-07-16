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

type TListOverview = {
    description:string
    favorite_count:number
    id:number
    item_count:number
    iso_639_1:string
    list_type:string
    name:string
    poster_path:string|null
}

type TMovieOverviewInsideAList = {
    adult:boolean
    backdrop_path:string|null
    genre_ids:number[]
    id:number
    media_type:string
    original_language:string
    original_title?:string
    original_name?:string
    overview:string
    popularity: number
    poster_path:string|null
    release_date:string
    title:string
    video:false
    vote_average:number
    vote_count:number
 }

interface IHttpClientGet {
    url:string
    method:string
    body?: Tbody|TbodyPost|TBodyAddMovie|string
}

interface IMovieResponse {
    adult:boolean
    backdrop_path:string|null
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
    poster_path:string|null
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
            avatar_path:string | null
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
    results:TListOverview[]
    total_pages:number
    total_results:number
}

interface IListInside{
    created_by:string
    description:string
    favorite_count:number
    id:string
    items:TMovieOverviewInsideAList[]
    item_count:number,
    iso_639_1:string
    name:string,
    poster_path:string | null
}


export {TGenre, TCompany, TBodyAddMovie, TProductionCountry, TSpokenlanguage, Tbody, TbodyPost,IHttpClientGet,IMovieResponse,IRequestToken, IRequestAccountId, IResponseLists, IListInside, TMovieOverviewInsideAList, TListOverview }