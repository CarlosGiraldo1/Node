const deadpool = {
    nombre: 'Wade',
    apellido: 'Winston',
    poder: 'Regeneracion',
    edad: 50,
    getNombre: function () {
        return `${this.nombre} ${this.apellido}`
    },
    getNombre2(){
        return `${this.nombre} ${this.apellido}`
    }
}


console.log(deadpool.getNombre());
console.log(deadpool.getNombre2());

const {nombre, apellido, poder, edad = 0} = deadpool;
console.log(nombre, apellido, poder, edad);

function imprimeHeroe(heroe){
    const {nombre, apellido, poder, edad = 0}=heroe;
    console.log(nombre, apellido, poder, edad);
}
imprimeHeroe(deadpool);

function imprimeHeroe2({nombre, apellido, poder, edad = 0}){
    console.log(nombre, apellido, poder, edad);
}
imprimeHeroe2(deadpool);


const heroes = ['Deadpool', 'Superman','Batman'];

//const h1 = heroes[0];
//const h2 = heroes[2];
//const h3 = heroes[3];

//console.log(h1,h2,h3);

const[h1,h2,h3] = heroes;
console.log(h1,h2,h3);

const[,,h4] = heroes;
console.log(h4);