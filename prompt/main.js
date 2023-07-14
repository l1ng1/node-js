const log = console.log;

process.stdout.write('?');

process.stdin.on('data', (data) => {
    name1 = data.toString();
    log('вы ответили - ', name1);
    process.stdin.pause(); //Пауза процесса
});


setTimeout(() => {
    process.stdout.write('another?  \n');
    process.stdin.resume()
}, 10000);