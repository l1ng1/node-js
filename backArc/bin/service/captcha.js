import Captcha from 'captcha-generator-alphanumeric';
import path from 'path';
import fs from 'fs';

export class CaptchaService {
    create = async (filename) =>{
        let captcha = new Captcha.default(); // Создание экземпляра CAPTCHA
        let captchaFile = path.join(process.cwd(), 'public', filename); // Путь к файлу CAPTCHA
        let captchaOut = fs.createWriteStream(captchaFile);
        captcha.PNGStream.pipe(captchaOut); // Перенаправление потока CAPTCHA в файл
        let captchaFinished = new Promise( (good, bad) => {
            captchaOut.on('finish', () => {
                good(captcha.value);
            });
            captchaOut.on('error', (err) => {
                console.log('Ошибка Капчи:' + err);
                bad();
            });
        })
        
        return  await captchaFinished;
    }
    
    remove = (captchaFile) => {
        // Метод для проверки есть ли такой файл        
        if (fs.existsSync(captchaFile)) {
            // метод unlink для удаления файла
            fs.unlinkSync(captchaFile);
            return true;
        }
        return false;
    }
}