/*
This is a solution for Problem C taken from (GCPC 2013).
Author - Abdelmajid Abdellatif
*/

//Dependencies 
const readline = require('readline');

//Horizontal axis characters
const xChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
//Vertical axis numbers
const yNums = ['1', '2', '3', '4', '5', '6', '7', '8'];
//Chess array
const chess = [];
//Black or white boolean
let boolean = false;
//Field number
let count = 1; 

/* 
reading lines and prompt data 
*/

//Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//readline variables
let num = 0;
let counter = 0;
let resArray = [];
/*
    reading lines and log results:
    the first line entered would be the number of try cases,
    so if it is greater than 0, the other lines would be for the cases to test.
*/
rl.on('line', line => {
    let strlen = line.trim().length;
    //if the number of try cases entered correctly
    if(strlen > 0){
        let strArr = line.trim().toUpperCase().split(' ');
        if(strArr.length == 1){
            //if number of try cases is correctly entered, prevent to be entered again
            if(counter == 0){
                let numArr = line.trim().split('');
                numArr.forEach(el => {
                    //check if it is a true number if not exit process
                    if(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(el) == -1){
                        process.exit();
                    }
                });
                //set number of try cases
                num = parseInt(line.trim());
                counter = 1;
                console.log('you will try ' + num + ' times');
                if(num == 0){
                    //if number iz 0 exit the process
                    process.exit();
                }
            }else{
                process.exit();
            }
        }else{
            //if number is set
            if(num > 0){
                //if try cases still less than number of try cases
                if(counter <= num){
                    if(strArr.length == 4){
                        //solve the problem
                        chessSolution([strArr[0], strArr[1]], [strArr[2], strArr[3]], function(err, result){
                            //if name of fields entered correctly
                            if(!err && result){
                                resArray.push(result);
                                counter ++;
                                //if try cases are more than number of try cases
                                if(counter > num){
                                    //log the solution
                                    resArray.forEach(res => {
                                        if(res.imposiible){
                                            console.log(res.imposiible);
                                        }else{
                                            console.log(res.moves + ' ' + res.feilds);
                                        }
                                    })
                                    process.exit();
                                }
                            }else{
                                process.exit();
                            }
                        });
                    }else{
                        process.exit();
                    }
                }else{
                    process.exit();
                }
            }else{
                process.exit();
            }
        }
    }else{
        process.exit();
    }
});

//Create chess array
xChars.forEach( (char) => {
    yNums.forEach( (num) => {
        let feild = {};
        feild.name = char + num,
        feild.color = boolean;
        feild.position = count;
        chess.push(feild);

        count += 1;
        boolean = !boolean;
    });
    boolean = !boolean;
});

//Possible solutions function
const chessSolution = (f1, f2, callback) => {
    const feild1 = f1[0] + f1[1];
    const feild2 = f2[0] + f2[1];
    let currentFeild = {};
    let targetFeild = {};
    const result = {};
    //Set the current position of the bishop
    chess.forEach(feild => {
        if(feild1 == feild.name){
            currentFeild = feild;
        }
    });
    //Set the target position of the bishop
    chess.forEach(feild => {
        if(feild2 == feild.name){
            targetFeild = feild;
        }
    });
    //id feild name exists in chess array
    if(chess.indexOf(currentFeild) > -1 && chess.indexOf(targetFeild) > -1){
        //possible solutions:
        if(currentFeild.color == targetFeild.color){
            const diff = targetFeild.position - currentFeild.position;
            let moves = 0;
            if(Math.abs(diff) % 9 == 0){
                const n = diff / 9;
                //If the target is the current position
                if(n == 0){
                    result.moves = moves;
                    result.feilds = splitName(targetFeild.name);
                    callback(false, result);
                } else{
                    //If the target and the current position are on the same axis
                    moves += 1;
                    const movedPosition = currentFeild.position + (n * 9);
                    if(movedPosition == targetFeild.position){
                        result.moves = moves;
                        result.feilds = splitName(currentFeild.name) + ' ' + splitName(targetFeild.name);
                        callback(false, result);
                    }
                }
            }else
            if(Math.abs(diff) % 7 == 0){
                const n = diff / 7;
                //If the target is the current position
                if(n == 0){
                    result.moves = moves;
                    result.feilds = splitName(targetFeild.name);
                    callback(false, result);
                } else{
                    //If the target and the current position are on the same axis
                    moves += 1;
                    const movedPosition = currentFeild.position + (n * 7);
                    if(movedPosition == targetFeild.position){
                        result.moves = moves;
                        result.feilds = splitName(currentFeild.name) + ' ' + splitName(targetFeild.name);
                        callback(false, result);
                    }
                }
            }else{
                //If the target and the current position are not on the same position neither on the same axis
                const plusArray = [{plus: '+9', position: currentFeild.position + 9}, {plus: '-9', position: currentFeild.position - 9}, {plus: '+7', position: currentFeild.position + 7}, {plus: '-7', position: currentFeild.position - 7}];
                const nextFeilds = getNextFields(plusArray, currentFeild);
                let firstMove = 0;
                let movedPosition = 0;
                nextFeilds.forEach(nf => {
                    for(let i=0; i<7; i++){
                        moves = 0;
                        let diff = targetFeild.position - nf.position;
                        if (Math.abs(diff) % 9 == 0){
                            firstMove = nf.position;
                            moves += 1;
                            const n = diff / 9;
                            movedPosition = firstMove + (n * 9);
                            moves += 1;
                            break;
                        }else
                        if(Math.abs(diff) % 7 == 0){
                            firstMove = nf.position;
                            moves += 1;
                            const n = diff / 7;
                            const movedPosition = firstMove + (n * 7);
                            moves += 1;
                            break;
                        }
                        else{
                            if(nf.plus == '+9'){
                                nf.position += 9;
                            }
                            if(nf.plus == '-9'){
                                nf.position -= 9;
                            }
                            if(nf.plus == '+7'){
                                nf.position += 7;
                            }
                            if(nf.plus == '-7'){
                                nf.position -= 7;
                            }
                        }
    
                    }
                });
                if(movedPosition == targetFeild.position){
                    result.moves = moves;
                    result.feilds = splitName(currentFeild.name) + ' ' + splitName(getFeildByPosition(firstMove)) + ' ' + splitName(targetFeild.name);
                    callback(false, result);
                }
            }
        }else{
            result.imposiible = 'Impossible';
            callback(false, result);
        }
    }else{
        callback(true);
    }
}

//Split name function
const splitName = (name) => {
    const nameArr = name.split('');
    return nameArr[0] + ' ' + nameArr[1];
}

//Function to get the a the feild object from a position
const getFeildByPosition = (p) => {
    let fByPosition = {};
    chess.forEach(f => {
        if(f.position == p){
            fByPosition = f;
        }
    });
    return fByPosition.name;
}


//Function to get the 4 adjecent feilds
const getNextFields = (arr, cf) => {
    const nextArr = [];
    arr.forEach(p=>{
        chess.forEach(f=>{
            let newFeild = Object.assign({}, f);
            if(newFeild.position == p.position){
                newFeild.plus = p.plus;
                nextArr.push(newFeild);
            }
        });
    });
    return nextArr.filter(f => {
        return f.color == cf.color;
    });
}
