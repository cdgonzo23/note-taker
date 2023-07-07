const express = require('express');
const path = require('path');
const PORT = process.env.PORT ?? 3001;
const app = express();
const fs = require('fs')
const notesData = require('./db/db.json')
const uuid = require ('./helper/uuid');

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(notesData);
    console.info(`${req.method} request recieved to get notes`)
});

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '/public/index.html'));
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
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              // Convert string into JSON object
              const parsedNotes = JSON.parse(data);
      
              // Add a new review
              parsedNotes.push(newNote);
      
              // Write updated reviews back to the file
              fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
              );
            }
          });
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
    console.info(`${req.method} request received to add a new note`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.stringify(data);
    
          // Add a new review
          console.log(parsedNotes.includes('id'));
    
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully deleted note!')
          );
        }
      });
    console.log(response)
    res.status(201).json(response);
});


app.listen(PORT, () => {
    console.log(`Application is running at http://localhost:${PORT}`)
});