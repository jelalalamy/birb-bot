const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'mudae',
    host: 'localhost',
    database: 'mudaepi',
    password: 'mudae',
    port: 5432
});

const createTable = (table) => {
    pool.query(`CREATE TABLE ${table} (ID SERIAL PRIMARY KEY, name VARCHAR(30), kakera INT)`, (error, results) => {
        if (error) {throw error};
    })
};

const getCharacters = (request, response) => {
    const table = parseInt(request.params.table);
    pool.query(`SELECT * FROM ${table} ORDER BY id ASC`, (error, results) => {
        if (error) {throw error};
        response.status(200).json(results.rows);
    })
};

const getTables = (request, response) => {
    pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`, (error, results) => {
        if (error) {throw error};
        response.status(200).json(results.rows);
    })
};

const getCharacterById = (request, response) => {
    const table = parseInt(request.params.table);
    const id = parseInt(request.params.id);
    pool.query(`SELECT * FROM ${table} WHERE id = ${id}`, (error, results) => {
        if (error) {throw error};
        response.status(200).json(results.rows);
    })
};

const createCharacter = (request, response) => {
    const {name, kakera} = request.body;
    const table = parseInt(request.params.table);
    pool.query(`INSERT INTO ${table} (name, kakera) VALUES ('${name}', '${kakera}')`, (error, results) => {
        if (error) {throw error};
        response.status(201).send(`Character added with ID: ${results.insertId}`);
    })
};

const updateCharacter = (request, response) => {
    const id = parseInt(request.params.id);
    const table = parseInt(request.params.table);
    const {name, kakera} = request.body;
    pool.query(`UPDATE ${table} SET name = '${name}', kakera = '${kakera}' WHERE id = '${id}'`, (error, results) => {
        if (error) {throw error}
        response.status(200).send(`Character modified with ID: ${id}`);
    })
};

const deleteCharacter = (request, response) => {
    const id = parseInt(request.params.id);
    const table = parseInt(request.params.table);
    pool.query(`DELETE FROM ${table} WHERE id = ${id}`, (error, results) => {
        if (error) {throw error};
        response.status(200).send(`Character deleted with ID: ${id}`)
    })
};

module.exports = {
    getCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getTables,
    createTable
}