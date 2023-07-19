export class SessionService {
    constructor(expired) {
        this.step = 'index';
        this.userId = null;
        this.captcha = {value: null, file: null};
        this.confirmCode = null;
        this.expired = new Date();
        this.expired.setSeconds( this.expired.getSeconds() + expired );
    }

    newSid = (sessionsTotal) => {
        let time = new Date().getTime();
        let salt = Math.trunc(Math.random() * 1000000000);
        return salt.toString(16) + sessionsTotal.toString(16) + time.toString(16);
    }
}