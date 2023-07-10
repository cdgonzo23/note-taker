const express = require('express');
const path = require('path');
const PORT = process.env.PORT ?? 3001;
const app = express();
const fs = require('fs')
const uuid = require ('./helper/uuid');

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, '/views/notes.html'))
});

app.get('/api/notes', (req, res) => {
    let notesReference = fs.readFileSync('./db/db.json', 'utf8');
    const parsedNotes = JSON.parse(notesReference);
    res.json(parsedNotes);
    console.info(`${req.method} request recieved to get notes`)
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        }
        let notesReference = fs.readFileSync('./db/db.json', 'utf8');
        const parsedNotes = JSON.parse(notesReference);
        parsedNotes.push(newNote);

        const noteString = JSON.stringify(parsedNotes, null, 4);
      
        fs.writeFileSync('./db/db.json', noteString);
        const response = {
            status: 'Success',
            body: newNote
        }
        console.log(response)
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in creating new note.')
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to remove a note`);
    const { id } = req.params;
    let notesReference = fs.readFileSync('./db/db.json', 'utf8');
    const parsedNotes = JSON.parse(notesReference);
    const deleteNote = (note) => note.id !== id;
    
    const updatedNotes = parsedNotes.filter(deleteNote);
    const noteString = JSON.stringify(updatedNotes, null, 4);
    fs.writeFileSync('./db/db.json', noteString);
    res.status(201).json(updatedNotes);
});

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(PORT, () => {
    console.log(`Application is running at http://localhost:${PORT}`)
});