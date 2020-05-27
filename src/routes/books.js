const { Router } = require('express');
const router = Router();
const _ = require('lodash');

const books = require('../../books.json');
const authors = require('../../authors.json');

//Get all books with the author
router.get('/', (req, res) => {

    let allBooks = []

    try {
        books.map(book => {
            authors.map(author => {
                if (book.authorId == author.id) {
                    const bookAuthor = {
                        id: book.id,
                        name: book.name,
                        author: `${author.name} ${author.lastname}`
                    }
                    allBooks.push(bookAuthor);
                }
            })
        });
        res.json(allBooks);
    } catch (error) {
        console.log(error);
        res.status(500).json({'msg': 'An error has occurred'});
    }
});

//Add a book if the author exist
router.post('/', (req, res) => {

    const { id, name, authorId } = req.body;
    let exist = false;

    if(id && name && authorId) {
        
        authors.map(author => {
            if (author.id == authorId) {
                exist = true;
                const newBook = { ...req.body };
                books.push(newBook);
            }
        });

        exist ? res.status(200).json({ 'added' : 'ok'}) : res.status(400).json({ 'msg': `The author doesn't exist`});
        
    } else {
        res.status(400).json({ 'statusCode': 'Bad request'});
    }
});

//Modify a book if exist
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, authorId } = req.body;
    let exist = false;

    if(name && authorId) {
        _.each(books, (book) => {
            if (book.id == id) {
                exist = true;
                book.name = name;
                book.authorId = authorId;
            }

            exist ? res.json({ 'modified': 'ok' }) : res.status(400).json({'msg': `The book doesn't exist`});
        });
    } else {
        res.status(400).json({ 'statusCode': 'Bad request'});
    }
;
});

//Delete a book if exist
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    let exist = false;

    _.remove(books, (book) => {
        if(book.id == id) {
            exist = true;
            return id;
        }
    });

    exist ? res.json({ 'deleted': 'ok' }) : res.status(400).json({ 'msg': `The book doesn't exist`});
    
});

module.exports = router;