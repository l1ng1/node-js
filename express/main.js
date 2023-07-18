import express from "express";
import fs from 'fs';
import path from "path";
import qs from "querystring";
const log = console.log;
const __dirname = process.cwd();


const publicPath = path.join(__dirname, 'public');


const app = express();


app.get('/', async (req, res) => {
    try {
        let file = path.join(publicPath, 'index.html');
        res.sendFile(file);
    } catch (error) {
        log(error);
    }
});


app.get('/users', async (req, res) => {
    try {
        const name = req.query.name;
        const jsonData = fs.readFileSync('users.json', 'utf-8');
        const users = JSON.parse(jsonData);
    
        const user = users.users.find(user => user.name === name);
        if (user) {
            const filePath = path.join(publicPath, 'users.html');
            let data = fs.readFileSync(filePath, 'utf8');
            data = data.replace('%name%', name);
            res.status(200).send(data);
        } else {
            console.log('Err,такого пользователя нет!');
        }
    } catch (error) {
        log(error);
    }
});


app.get('/register', async (req, res) => {
    try {
        let file = path.join(publicPath, 'register.html');
        res.sendFile(file);
    } catch (error) {
        log(error);
    }
});


app.get('/feedback', async (req, res) => {
    try {
        let file = path.join(publicPath, 'feedback.html');
        res.sendFile(file);
    } catch (error) {
        log(error);
    }
});

app.get('/favicon.ico', async (req, res) => {
    try {
        let file = path.join(publicPath, 'favicon.ico');
        res.sendFile(file);
    } catch (error) {
        log(error);
    }
});

app.get('/index.css', (req, res) => {
    try {
        res.set('Content-Type', 'text/css');
        res.sendFile(path.join(publicPath, 'index.css'));
    } catch (error) {
        log(error);
    }
});


app.post('/register', async (req, res) => {
    try {
        
        const jsonData = fs.readFileSync('users.json', 'utf-8');
        const users = JSON.parse(jsonData);
        
        
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
    
         
        req.on('end', () => {
            
            const newUser = qs.parse(body);
            log(newUser);
        
            
            let name = newUser.name;

            
            for (let user of users.users) {
                if (user.name === newUser.name && user.password === newUser.password) {
                    name = user.name;
                }
            }
        
            users.users.push(newUser);
            const updatedJsonData = JSON.stringify(users, null, 2);
            fs.writeFileSync('users.json', updatedJsonData, 'utf-8');

            const filePath = path.join(publicPath, 'users.html');
            let data = fs.readFileSync(filePath, 'utf8');
            data = data.replace('%name%', name);

            res.status(200).send(data);
        });
    } catch (error) {
        log(error);
    }
});



app.listen(3000, () => {
    log("server started"); 
});

