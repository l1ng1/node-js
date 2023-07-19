import { Database } from 'sqlite-async';
const log = console.log;

export class DataStorage {
    db = null;

    constructor(config) {
        this.config = config;
    }

    async start() {
        try {
            this.db = await Database.open(this.config.file);
            await this.createUsers();
        } catch (error) {
            console.error("Ошибка при запуске базы данных:", error);
        }
    }

    async stop() {
        try {
            await this.db.close();
        } catch (error) {
            console.error("Ошибка при остановке базы данных:", error);
        }
    }

    async createUsers() {
        let query = `CREATE TABLE IF NOT EXISTS Users (
            id              integer primary key autoincrement,
            login           text not null,
            password        text not null,
            email           text
        )`;
        try {
            await this.db.exec(query);
        } catch (error) {
            console.error("Ошибка при создании таблицы Users:", error);
        }
    }

    addUser = async (login, password, email='') => {
        let query = `INSERT INTO Users (login, password, email) VALUES (
            ?, ?, ?)`;
        try {
            const result = await this.db.run(query, login, password, email);
            const userId = result.lastID; 
            return userId;
        } catch (error) {
            console.error("Ошибка при добавлении пользователя:", error);
            throw error;
        }
    }

    getUser = async (id) =>{
        let query = `SELECT * FROM Users WHERE id=?`;
        try {
            return await this.db.get(query, id);
        } catch (error) {
            console.error("Ошибка при получении пользователя:", error);
            return false;
        }
    }

    getUserId = async (login, password) =>{
        let query = `SELECT * FROM Users WHERE login=? AND password=?`;
        try {
            const data = await this.db.get(query, login, password);
            return data.id;
        } catch (error) {
            console.error("Ошибка при получении пользователя:", error);
            return false;
        }
    }
}
