// Each function will have their own execution context will be created 
// and they will have their own memory space. 
// Once the function is executed, the local exectution context will 
// be popped out of the stack and destroyed. At the end of the whole code, 
// the global execution contect also will be destroyed.
var x = 1;
a();
b();
console.log(x);

function a(){
    var x = 10;
    console.log(x);
}

function b(){
    var x = 100;
    console.log(x);
}