const axios = require('axios');
const db = require('./queries');

const fetchCharacters = async (table) => {
    try {
        const res = await axios.get(`http://localhost:3000/${table}`);
        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
}

const addCharacter = async (table, user) => {
    try {
        const res = await axios.post(`http://localhost:3000/${table}`, user);
        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
}

const updateCharacter = async (table, updatedUser, id) => {
    try {
        const res = await axios.put(`http://localhost:3000/${table}/${id}`, updatedUser)
    } catch (err) {
        console.error(err);
    }
}

const deleteCharacter = async (table,id) => {
    try {
        const res = await axios.delete(`http://localhost:3000/${table}/${id}`)
    } catch (err) {
        console.error(err);
    }
}

