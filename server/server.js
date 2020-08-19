const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hearing you clearly sir');
})

app.listen(8000, () => {
    console.log("Listening on port 8000");
})