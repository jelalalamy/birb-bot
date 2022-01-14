const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (request, response) => {
    response.json({info: 'mudaepi: The Mudae API'});
});

app.get('/tables', db.getTables);

app.get('/users', db.getCharacters);
app.get('/users/:id', db.getCharacterById);
app.get('/users/tables', db.getTables);
app.post('/users', db.createCharacter);
app.put('/users/:id', db.updateCharacter);
app.delete('/users/:id', db.deleteCharacter);


app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});