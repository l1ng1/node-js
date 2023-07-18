import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import qs from "querystring";
const log = console.log;
const __dirname = process.cwd();


function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
  
    switch (extname) {
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
    }
  
    return contentType;
}


function handleGetRequest( req ,res) {
    const currentUrl = url.parse(req.url);
    const params = new URLSearchParams(currentUrl.search);
    let data;

    const filePath = path.join(__dirname, 'public', req.url);
    const contentType = getContentType(filePath);

    switch(currentUrl.pathname){
        case "/":
            data = fs.readFileSync('./public/index.html', "utf8");
            res.statusCode = 200;
            res.setHeader("Content-Type", contentType);
            res.write(data);
            break;

        case "/users":
            let name = params.get("name");
            
            const jsonData = fs.readFileSync('users.json', 'utf-8');
            const users = JSON.parse(jsonData);
            let count = 0;
            for(let user of users.users){
                if (user.name === name) {
                    data = fs.readFileSync('./public/users.html', "utf8");
                    data = data.replace("%name%", name);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", contentType);
                    res.write(data);
                }else {
                    count += 1;
                }
            }
            if(count === users.users.length){
                handleError(new Error('Такого пользователя нет!'), res);
            }
            break;

        case "/register":
            data = fs.readFileSync("./public/register.html", "utf-8");
            res.statusCode = 200;
            res.setHeader("Content-Type", contentType);
            res.write(data);
            break;

        case "/feedback":
            data = fs.readFileSync('./public/feedback.html', "utf8");
            res.statusCode = 200;
            res.setHeader("Content-Type", contentType);
            res.write(data);
            break;
        case "/favicon.ico":
            data = fs.readFileSync("./public/favicon.ico");
            res.statusCode = 200;
        
            res.setHeader("Content-Type", "image/x-icon");
            res.write(data);
            break;
        
        default: 
        res.statusCode = 404;
        res.statusMessage = "Not Found";
    }
    res.end();
} 


function handlePostRequest(req, res) {
    const jsonData = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(jsonData);
    let body = "";
  
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        const newUser = qs.parse(body);
        log(newUser);

        for (let user of users.users) {
            if (user.name === newUser.name && user.password === newUser.password) {
                handleError(new Error('Такой пользователь уже есть! Поменяйте пароль'), res);
                return;
            }
        }

        users.users.push(newUser);
        const updatedJsonData = JSON.stringify(users, null, 2);
        fs.writeFileSync('users.json', updatedJsonData, 'utf-8');

        let name = newUser.name;

        const filePath = path.join(__dirname, 'public', 'users.html');
        const contentType = getContentType(filePath);
        let data = fs.readFileSync(filePath, "utf8");
        data = data.replace("%name%", name);

        res.statusCode = 200;
        res.setHeader("Content-Type", contentType);
        res.write(data);
        res.end();
    });
}

function handleError(err, response) {
    response.writeHead(500, { "Content-Type": "text/html; charset=utf-8"});
    response.write(`<h1>Error: ${err.message}</h1>`, "utf-8");
    response.end();
}

function worker(request, response) {
    if (request.method === "GET") {
        handleGetRequest(request, response);
    } else if(request.method === "POST") {
        handlePostRequest(request, response);
    }
}

const server = http.createServer(worker);
server.listen(3000, () => { 
    console.log("server is runnning port 3000"); 
})

