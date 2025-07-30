// Initialisation of inlets and outlets
inlets = 1;
outlets = 3;

setinletassist(0, "X and Y coordinates");
setoutletassist(0, "A parameter");
setoutletassist(1, "B parameter");
setoutletassist(2, "C parameter");

var xValues = [];
var yValues = [];

function addDataPoint(x, y){
    xValues.push(x);
    yValues.push(y);
    
    // Perform quadratic regression if there are enough points
    if (xValues.length > 2) {
        performQuadraticRegression(xValues, yValues);
    }
}

function performQuadraticRegression(xValues, yValues){
    var numPoints = xValues.length;
    
    if (numPoints < 3) {
        // Not enough points to perform regression
        post("Need at least 3 points for quadratic regression\n");
        return;
    }

    // Calculate sums for the normal equations
    var sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    var sumY = 0, sumXY = 0, sumX2Y = 0;

    for (var i = 0; i < numPoints; i++) {
        var x = xValues[i];
        var y = yValues[i];
        var x2 = x * x;
        var x3 = x2 * x;
        var x4 = x2 * x2;

        sumX += x;
        sumX2 += x2;
        sumX3 += x3;
        sumX4 += x4;
        sumY += y;
        sumXY += x * y;
        sumX2Y += x2 * y;
    }

    // Construct the normal equations matrix
    var A = [[sumX4, sumX3, sumX2],
             [sumX3, sumX2, sumX],
             [sumX2, sumX, numPoints]];
    var B = [sumX2Y, sumXY, sumY];

    // Solve the linear system to get coefficients
    var coefficients = solveLinearSystem(A, B);
    var A = coefficients[0];
    var B = coefficients[1];
    var C = coefficients[2];
    
    // Output the coefficients
    outlet(0, A);
    outlet(1, B);
    outlet(2, C);
}

// Solve a linear system of equations using Gaussian elimination
function solveLinearSystem(A, B) {
    var n = B.length;
    var x = new Array(n);

    for (var i = 0; i < n; i++) {
        for (var k = i + 1; k < n; k++) {
            if (Math.abs(A[i][i]) < Math.abs(A[k][i])) {
                for (var j = 0; j < n; j++) {
                    var temp = A[i][j];
                    A[i][j] = A[k][j];
                    A[k][j] = temp;
                }
                var temp = B[i];
                B[i] = B[k];
                B[k] = temp;
            }
        }

        for (var k = i + 1; k < n; k++) {
            var factor = A[k][i] / A[i][i];
            for (var j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
            B[k] -= factor * B[i];
        }
    }

    for (var i = n - 1; i >= 0; i--) {
        x[i] = B[i];
        for (var j = i + 1; j < n; j++) {
            x[i] -= A[i][j] * x[j];
        }
        x[i] /= A[i][i];
    }

    return x;
}

	
function msg_int(x, y){
	addDataPoint(x, y);
}






