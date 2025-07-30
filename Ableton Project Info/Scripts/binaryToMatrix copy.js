inlets = 1;
outlets = 2;

setinletassist(0,"A binary value to convert to a matrix");
setoutletassist(0,"A matrix representation of the binary value");
setoutletassist(1,"Size of the binary string");

function generateClave(binary){
    var binaryString = binary.toString(2);
    const array = [];
    for (var i = 0; i < 8; i++) {
        array.push(i);
        array.push(0);
        if (i < binaryString.length) {
            array.push(parseInt(binaryString[i]));
        } 
        else {
            array.push(0);
        } 
    }
    
    outlet(1, 8);
    outlet(0, array);
}