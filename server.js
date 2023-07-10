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

        const noteString = JSON.stringify(parsedNotes, null, 2);
      
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



// read the file, parsed it, used filter to filter out the id that was being deleted, stringified it and wrote it back to the db file

// app.delete('/api/notes/:id', (req, res) => {
//     console.info(`${req.method} request received to add a new note`);
//     fs.readFile('./db/db.json', 'utf8', (err, data) => {
//         if (err) {
//           console.error(err);
//         } else {
//           // Convert string into JSON object
//           const parsedNotes = JSON.stringify(data);
    
//           // Add a new review
//           console.log(parsedNotes.includes('id'));
    
//           // Write updated reviews back to the file
//           fs.writeFile(
//             './db/db.json',
//             JSON.stringify(parsedNotes, null, 4),
//             (writeErr) =>
//               writeErr
//                 ? console.error(writeErr)
//                 : console.info('Successfully deleted note!')
//           );
//         }
//       });
//     console.log(response)
//     res.status(201).json(response);
// });

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(PORT, () => {
    console.log(`Application is running at http://localhost:${PORT}`)
});