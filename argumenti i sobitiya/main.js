const log = console.log;
import Event from "events";
const EventEmitter = Event.EventEmitter;

class UserInputEmitter extends EventEmitter {
    constructor(){
      super();
    }
    start() {
        process.stdin.on('data', (data) => {
            const input = data.trim();
  
            if (input === 'exit') {
                this.emit('exit');
            } else if (input.startsWith('solve')) {
                this.emit('solve', input.substr('solve'.length));
            } else {
                this.emit('input', input);
            }
        });
    }
    stop() {
        process.stdin.removeAllListeners('data');
    }
}

const userInput = new UserInputEmitter();

userInput.on("input", (string) => {
    log(string);
});

userInput.on("solve", (string) => {
    const action = '+-*/';

    let numberOne, numberTwo;
    let currentAction = '';
    for(let x of string){
        for(let z of action){
            if(x === z){
                let arrayOfNumbers = string.split(x);
                numberOne = +(arrayOfNumbers[0].trim());
                numberTwo = +(arrayOfNumbers[1].trim());
                currentAction = x;
            }
        }
    }


    if(currentAction=='+'){return log(numberOne + numberTwo);}

    if(currentAction=='-'){return log(numberOne - numberTwo);}

    if(currentAction=='*'){return log(numberOne * numberTwo);}

    if(currentAction=='/'){return log(numberOne / numberTwo);}

    else{log('ошибка!');}
});
// Создаю событие exit
userInput.on("exit", () => {
    userInput.stop();
    process.exit();
});

userInput.start();