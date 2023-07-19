// Виталий, попробуйте залогиниться и выйти из учетки))))))))))
// Все работает))))))))))


import { SessionService } from './session.js';
import { CaptchaService  } from './captcha.js';
import path from "path";
const log = console.log;

export class Service {
    sessions = {};

    constructor(dataStorage) {
        this.dataStorage = dataStorage;
        this.captcha = new CaptchaService(this.session);
        // this.confirm = new ConfirmService(this.session);
    }

    isLogged = (sid) => {
        let session = this.sessions[sid];
        return session?.step === 'logged';
    }

    getUserData = async (sid) => {
        let session = this.sessions[sid];
        let data = await this.dataStorage.getUser(session.userId);
        return data;
    }

    newSid = (expireSeconds) => {
        let session = new SessionService(expireSeconds);
        let sid = session.newSid(Object.keys(this.sessions).length);
        this.sessions[sid] = session;
        return sid;
    }

    updateSession = (sid, step) => {
        let expireSeconds = 120;
        let session = this.sessions[sid];
        if(!session){
            session = new SessionService(expireSeconds);
            this.sessions[sid] = session;
        }
        this.sessions[sid].step = step;
    }

    newCaptcha = async (sid) => {
        let session =this.sessions[sid];
        let captchaUrl = `tmp/captcha/${sid}.png`;
        session.captcha.file = path.join(process.cwd(), 'public','tmp', 'captcha', `${sid}.png`);
        session.captcha.value = await this.captcha.create(captchaUrl);
        return captchaUrl;
    }

    checkCaptcha = async (sid, login, passw, email, captcha) => {
        let session = this.sessions[sid]
        if (session.captcha.value === captcha) {
            session.userId = await this.dataStorage.addUser(login, passw, email);
            this.captcha.remove(session.captcha.file);
            session.captcha.value = null;
            return true;
        }
        return false;
    }

    sendConfirmCode(sid) {
        let session = this.sessions[sid];
        session.confirmCode = getRandomInt();
        log(`Код для подтверждения регистрации: ${session.confirmCode}`);
    }

    checkConfirmCode(sid, code) {
        let session = this.sessions[sid];
        if(session.confirmCode == code){
            session.confirmCode = null;
            return true;
        } 
        return false;
    }

    loginUser = async (sid ,login, passw) => {
        let session = this.sessions[sid];
        session.userId = await this.dataStorage.getUserId(login, passw);
        if(session.userId) return true;
        return false;
    }

    logOut(sid) {
        let session = this.sessions[sid];
        session.userId = null;
    }
}

function getRandomInt() {
    return Math.floor(Math.random() * 1000000);
}