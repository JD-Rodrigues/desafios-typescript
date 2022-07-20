// Como podemos rodar isso em um arquivo .ts sem causar erros? 

interface Iemployee{
    code:number
    name:string
}

let employee = {} as Iemployee;
employee.code = 10;
employee.name = "John";

