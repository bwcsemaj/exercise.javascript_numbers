function compute(expression) {
    //Handle all multiplication and division first
    //Find multiplication and division, find numbers left and right of
    //the operator, perform operation, replace number, operator, number
    //with value
    console.log("START : " + expression);
    expression = expression.replace("--", "+");
    console.log("REMOVE -- : " + expression);
    expression = convertMinusToPlusMinus(expression);
    console.log("CONVERT - to +- :" + expression);
    expression = substituteMultiplicationAndDivision(expression.split(""));
    console.log("SUB MULTI/DIV : " + expression);
    var sum = sumAll(expression.split("+"));
    console.log("SUM : " + sum);
    return sum;
}

function sumAll(expressionArray){
    var sum = 0;
    for(var index = 0; expressionArray.length > index; index++){
        sum += parseFloat(expressionArray[index], 10)
    }
    return sum;
}


function convertMinusToPlusMinus(expression) {
    var expressionArray = expression.split("");
    expression = expressionArray[0];
    var isPreviousNumber = Number.isInteger(parseInt(expressionArray[0]));
    for (var index = 1; expressionArray.length > index; index++) {
        if (isPreviousNumber && expressionArray[index] === "-") {
            expression += "+-";
            isPreviousNumber = false;
            continue;
        }
        expression += expressionArray[index];
        isPreviousNumber = Number.isInteger(parseInt(expressionArray[0]));
    }
    return expression;
}

function findMultiDiv(expressionArray) {
    for (var index = 0; expressionArray.length > index; index++) {
        var character = expressionArray[index];
        var combineFunction = null;
        if (character === "*" || character === "/") {
            return index;
        }
    }
    return undefined;
}

function substituteMultiplicationAndDivision(expressionArray) {

    var index = findMultiDiv(expressionArray);
    while (index !== undefined) {
        var character = expressionArray[index];
        var combineFunction = character === "*" ? multi : div;


        //Determine left number
        var leftOperatorIndex = findLeftOperatorIndex(expressionArray, index);
        console.log(leftOperatorIndex);
        var leftOperatorCharacter = expressionArray[leftOperatorIndex];
        var leftNumber;
        var leftStart;
        if (leftOperatorCharacter === undefined) {
            leftStart = 0;
            leftNumber =  convertToFloat(expressionArray.slice(leftStart, index));
        } else {
            leftStart = leftOperatorIndex + 1;
            leftNumber =  convertToFloat(expressionArray.slice(leftStart, index));
        }
        console.log("LEFT NUMBER: " + leftNumber);

        //Determine right number
        //Check if negative
        var rightOperatorIndex = findRightOperatorIndex(expressionArray, index);
        console.log("RIGHT INDEX: " + rightOperatorIndex);
        var rightOperatorCharacter = expressionArray[rightOperatorIndex];
        var rightNumber;
        var rightEnd;
        if (rightOperatorIndex === undefined) {
            rightEnd = expressionArray.length - 1;
            var rightSlice = expressionArray.slice(index + 1, rightEnd + 1);
            rightNumber =  convertToFloat(rightSlice);
        } else {
            rightEnd = rightOperatorIndex - 1;
            rightNumber =  convertToFloat(expressionArray.slice(index + 1, rightEnd + 1));
        }
        console.log("RIGHT NUMBER: " + rightNumber);

        // //Combine
        var number = combineFunction(leftNumber, rightNumber);
        var numberArray = ("" + number).split("");
        console.log("COMBINE: " + number);

        //Create new Array
        var newExpressionArray = new Array(expressionArray.length - (rightEnd - leftStart) + numberArray.length);
        var added = 0;
        console.log(expressionArray);
        for (var index = 0; expressionArray.length > index; index++) {
            if (index < leftStart || index > rightEnd) {
                newExpressionArray[added] = expressionArray[index];
                added++;
            } else if (index == leftStart) {
                for (var numberIndex = 0; numberArray.length > numberIndex; numberIndex++) {
                    newExpressionArray[added] = numberArray[numberIndex];
                    added++;
                }
            }
        }
        console.log(newExpressionArray);
        expressionArray = newExpressionArray;
        index = findMultiDiv(expressionArray);
    }
    return expressionArray.join("");
}

function multi(value, value2) {
    return value * value2;
}

function div(value, value2) {
    return value / value2;
}


function findLeftOperatorIndex(expressionArray, end) {
    //Find the position where the first variable starts
    var posOperatorIndex = --end;
    while (posOperatorIndex >= 0) {
        var posOperator = expressionArray[posOperatorIndex];
        if (posOperator === "+") {
            return posOperatorIndex;
        }
        posOperatorIndex--;
    }
    return undefined;
}

function findRightOperatorIndex(expressionArray, start) {
    //Find the position where the first variable starts
    //Check to see if first right is negative symbol (if so skip over it)
    if (expressionArray[start + 1] === "-") {
        start++;
    }

    //Initialize Start
    var posOperatorIndex = ++start;
    while (expressionArray.length > posOperatorIndex) {
        var posOperator = expressionArray[posOperatorIndex];
        if (posOperator === "/" || posOperator === "+" || posOperator === "*") {
            return posOperatorIndex;
        }
        posOperatorIndex++;
    }
    return undefined;
}

function convertToFloat(integerStringArray) {
    return parseFloat(integerStringArray.join(""), 10);
}