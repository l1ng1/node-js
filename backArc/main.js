import {Application} from "./bin/app.js";

const config = {
    database: {
        file: './data.sql3'
    },
    server: {
        port: 3000
    }
}
// Вместо явного указания конфига можем читать его из файла: ini, json, yaml, xml или других форматов

const app = new Application(config);
app.start();

