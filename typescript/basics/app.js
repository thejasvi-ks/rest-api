"use strict";
const num1Element = document.getElementById('num1');
const num1E2ement = document.getElementById('num2');
const buttonElement = document.querySelector('button');
// const numResults: number[] = [];
const numResults = []; // generic Type
const textResults = [];
function add(num1, num2) {
    if (typeof num1 === "number" && typeof num2 === "number") {
        return num1 + num2;
    }
    else if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num1E2ement.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    const stringResult = add(num1, num2);
    textResults.push(stringResult);
    // console.log(result);
    // console.log(stringResult);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => { resolve('It worked.!'); }, 1000);
});
myPromise.then((result) => {
    console.log(result.split('w'));
});
