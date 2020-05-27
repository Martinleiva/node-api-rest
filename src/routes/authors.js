const { Router } = require('express');
const router = Router();
const _ = require('lodash');

const books = require('../../books.json');
const authors = require('../../authors.json');

//Get all authors
router.get('/', (req, res) => {
    try {
        res.json(authors);
    } catch (error) {
        console.log(error);
        res.status(500).json({'msg': 'An error has occurred'});
    }
});

//Add an author
router.post('/', (req, res) => {

    const { id, name, lastname } = req.body;

    if(id && name && lastname) {
        const newAuthor = { ...req.body };
        authors.push(newAuthor);
        res.status(200).json({ 'added': 'ok'});
    } else {
        res.status(400).json({ 'statusCode': 'Bad request'});
    }
});

//Modify an author if exist
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, lastname } = req.body;
    let exist = false;

    if(name && lastname) {
        _.each(authors, (author) => {
            if (author.id == id) {
                exist = true;
                author.name = name;
                author.lastname = lastname;
            }
        });

        exist ? res.json({ 'modified': 'ok' }) : res.status(400).json({'msg': `The author doesn't exist`});

    } else {
        res.status(400).json({ 'statusCode': 'Bad request'});
    }
});

//Delete author if exist and all his books associated
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    let exist = false;

    _.remove(authors, (author) => {
        if(author.id == id) {
            _.remove(books, (book) => {
                return book.authorId == id;
            })
            exist = true;
            return id;
        }
    });

    exist ? res.json({ 'deleted': 'ok' }) : res.status(400).json({'msg': `The author doesn't exist`});
    
});

module.exports = router;