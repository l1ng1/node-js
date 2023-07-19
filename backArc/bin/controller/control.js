import path from 'path';
import fs from 'fs';
const log = console.log;

export class Controller {
    sidAge = 120;

    constructor(service) {
        this.service = service;
        this.dir = process.cwd();
    }

    mainUserPage = async (req, res, next) => {
        let sid = this.getSid(req);
        if (sid && this.service.isLogged(sid)) {
            const userData = await this.service.getUserData(sid);
            const fname = path.join(this.dir, 'public', 'resources', 'user.html');
            fs.readFile(fname, 'utf-8', (err, data) => {
                if (data) {
                    const html = data.replace('%userName%', userData.login);
                    res.status(200).send(html);
                } else {
                    res.status(404).send("<h2>Page not found :(</h2>");
                }
            });
        } else {
            next();
        }
    }

    getSid = (req) => {
        const cookies = getCookies(req.header("Cookie"));
        return cookies.sid;
    }

    checkSid = (req, res, step) => {
        let sid = this.getSid(req);
        if (!sid) {
            sid = this.service.newSid(this.sidAge);
            res.setHeader('Set-Cookie', `sid=${sid}; Max-Age=${this.sidAge}; HttpOnly`);
        }
        this.service.updateSession(sid, step);
    }

    mainGeneralPage = (req, res) => {
        this.checkSid(req, res, 'index');
        const fname = path.join(this.dir, 'public', 'resources', 'index.html');
        res.sendFile(fname);
    }

    registrationPage = async (req, res) => {
        this.checkSid(req, res, 'registration');
        const sid = this.getSid(req);
        const captcha = await this.service.newCaptcha(sid);
        const fname = path.join(this.dir, 'public', 'resources', 'register.html');
        fs.readFile(fname, 'utf-8', (err, data) => {
            if (data) {
                const html = data.replace('%src%', captcha);
                res.status(200).send(html);
            } else {
                res.status(404).send("<h2>Page not found :(</h2>");
            }
        });
    }

    loginPage = (req, res) => {
        this.checkSid(req, res, 'login');
        const fname = path.join(this.dir, 'public', 'resources', 'login.html');
        res.sendFile(fname);
    }

    checkloginData = async (req, res, next) => {
        const sid = this.getSid(req);
        const login = req.body['login'];  
        const passw = req.body['passw'];
        let isOk = await this.service.loginUser(sid ,login, passw);
        if (isOk) {
            next();
        } else {
            res.status(400).send('Bad registration data');
        }
    }

    logOutUser = (req, res, next) => {
        const sid = this.getSid(req);
        this.service.logOut(sid);
        next();
    }

    confirmPage = (req, res) => {
        const sid = this.getSid(req);
        this.checkSid(req, res, 'confirm');
        this.service.sendConfirmCode(sid);
        const fname = path.join(this.dir, 'public', 'resources', 'confirm.html');
        res.sendFile(fname);
    }

    redirToUserPage = (req, res) => {
        this.checkSid(req, res, 'logged');
        const fname = path.join(this.dir, 'public', 'resources', 'redirToUser.html');
        res.sendFile(fname);
    }

    redirToGeneralPage = (req, res) => {
        this.checkSid(req, res, 'index');
        const fname = path.join(this.dir, 'public', 'resources', 'redirToMain.html');
        res.sendFile(fname);
    }

    checkCaptcha = async (req, res, next) => {
        const sid = this.getSid(req);
        const login = req.body['login'];  // input name='login' в форме регистрации
        const passw = req.body['passw'];
        const email = req.body['email'];
        const captcha = req.body['captcha'];
        const isOk = await this.service.checkCaptcha(sid, login, passw, email, captcha);
        if (isOk) {
            next();
        } else {
            res.status(400).send('Bad registration data');
        }
    }

    checkConfirmCode = (req, res, next) => {
        const sid = this.getSid(req);
        const code = req.body['confirmCode'];
        const isOk = this.service.checkConfirmCode(sid, code);
        if (isOk) {
            next();
        } else {
            res.status(400).send('Bad confirm code');
        }
    }
}

function getCookies(cookieString) {
    let cookies = {};
    if(cookieString) {
        const cookieArray = cookieString.split(';');
        for (let x of cookieArray) {
            const [key, value] = x.trim().split('=');
            cookies[key] = value; 
        }
    }
    return cookies;
}