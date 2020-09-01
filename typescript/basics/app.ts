const num1Element = document.getElementById('num1') as HTMLInputElement;
const num1E2ement = document.getElementById('num2') as HTMLInputElement;

const buttonElement = document.querySelector('button')!;

// const numResults: number[] = [];
const numResults: Array<number> = []; // generic Type
const textResults: string[] = [];

type NumOrString = number | string; //alisases.
type Result = { val: number; timestamp: Date }; // aliases

interface ResultObj { // interfaces types helps in forcing executing some functions .
  val: number;
  timestamp: Date;
}

function add(num1: NumOrString, num2: NumOrString) {    // Union Types
    if (typeof num1 === "number" && typeof num2 === "number") {
      return num1 + num2;
    } else if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}

function printResult(resultObj: ResultObj){
    console.log(resultObj.val);
}
    
buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num1E2ement.value;
    const result = add(+num1, +num2);
    numResults.push(result as number);
    const stringResult = add(num1, num2);
    textResults.push(stringResult as string);
    // console.log(result);
    // console.log(stringResult);
    printResult({ val: result as number, timestamp: new Date() })
    console.log(numResults, textResults);
});

const myPromise = new Promise<string> ((resolve, reject) => { // generic promise. Here promise is core type and string it resolves after some time is generic type.
    setTimeout(() => { resolve('It worked.!'); }, 1000);
}); 


myPromise.then((result) => {
    console.log(result.split('w'));
});