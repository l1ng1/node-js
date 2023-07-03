import fs from 'fs';

let name =undefined;
let lastName =undefined;
let DOB = undefined;
let fileWay = undefined;



process.stdout.write('Напишите через пробел ваше имя,фамилию ,дату рождения и путь к файлу ,в котором вы хотите записать эти данные'+'\n');
process.stdin.on('data',data =>{
    let arr = data.toString().split(' ');
    name =arr[0];
    lastName =[1];
    DOB =arr[2];
    fileWay = arr[3];
    fileWay = fileWay.replace('\r\n');
    fs.writeFileSync(fileWay,`
    Имя : ${name}
    Фамилия :${lastName}
    Дата рождения :${DOB}
    `);
    console.log("Информация записана");
});














