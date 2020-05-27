const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = 3000;

app.use('/api/authors', require('./routes/authors'));
app.use('/api/books', require('./routes/books'));

app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
});