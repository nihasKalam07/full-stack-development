
// Hoisting. 
// Can declare javascript functions and variables in any order 
// since they have been created in the memory creation phase of the execution context 
// before the code execution happens. SO when the code execution starts, all the variables and
// function will be already available inside the memory of the corresponding 
// excetion context.
getName2();
var a = 7;

function getName1() {
    console.log("Hello 1");
}

function getName2() {
    console.log("Hello 2");
    console.log(a.toString);
}


console.log("End");