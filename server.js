const express = require('express');
const path = require('path');
const PORT = process.env.PORT ?? 3001;
const app = express();
const fs = require('fs')
const notes = require('./db/db.json');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request recieved to get notes`);
    console.info(`${req.method} request recieved to get notes`)
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text
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
                    : console.info('Successfully updated reviews!')
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


app.listen(PORT, () => {
    console.log(`Application is running at http://localhost:${PORT}`)
});