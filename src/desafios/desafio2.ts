// Como podemos melhorar o esse código usando TS? 

// let pessoa1 = {};
// pessoa1.nome = "maria";
// pessoa1.idade = 29;
// pessoa1.profissao = "atriz"

// let pessoa2 = {}
// pessoa2.nome = "roberto";
// pessoa2.idade = 19;
// pessoa2.profissao = "Padeiro";

// let pessoa3 = {
//     nome: "laura",
//     idade: "32",
//     profissao: "Atriz"
// };

// let pessoa4 = {
//     nome: "carlos",
//     idade:19,
//     profissao: "padeiro"
// }

class Profissional{
    constructor(nome:string, idade:number, profissao:string){
        this.nome = nome
        this.idade = idade
        this.profissao = profissao
    }

    nome:string;
    idade:number;
    profissao:string;
}

let pessoa1 = new Profissional('maria', 29, 'atriz');

let pessoa2 = new Profissional('roberto', 19, 'Padeiro')

let pessoa3 = new Profissional('laura', 32, 'Atriz')

let pessoa4 = new Profissional('carlos', 19, 'padeiro')