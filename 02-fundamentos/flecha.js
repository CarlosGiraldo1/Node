function sumar(a,b=10){
    return a+b;
}

console.log(sumar(5,5));
console.log(sumar(5));

const sumar1 = (a,b=10) =>{
    return a+b;
}
console.log(sumar1(5,5));
console.log(sumar1(5));

const sumar2 = (a,b=10) => a+b
console.log(sumar2(5,5));
console.log(sumar2(5));