const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const path = require('path');
const mongojs = require('mongojs');

const db = mongojs('Tasks', ['tasks']);
const tasksCollection = db.collection('tasks');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));

const tasksOnServer = [];

// Ruta para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/index.html', (req, res) => {
    const taskText = req.body.task;
    tasks.push(taskText);
    console.log('Tarea almacenada en el servidor:', taskText);
    res.send('Tarea almacenada con éxito.');
});


// Ruta para subir una tarea al servidor
app.post('/uploadTask', (req, res) => {

    const taskText = req.body.task;

    tasksCollection.insert({ text: taskText }, (error, result) => {

        if (error) {
            console.error('Error al almacenar tarea en la base de datos:', error);
            res.status(500).send('Error al almacenar tarea en la base de datos.');
        } else {
            console.log('Tarea almacenada en la base de datos:', taskText);
            res.send('Tarea almacenada con éxito.');
        }
})});

// Ruta para recuperar tareas del servidor
app.get('/retrieveTasks', (req, res) => {
    tasksCollection.find({}, { text: 1, _id: 0 }, (error, tasksFromDB) => {
        if (error) {
            console.error('Error al recuperar tareas de la base de datos:', error);
            res.status(500).send('Error al recuperar tareas de la base de datos.');
        } else {
            const tasksTextArray = tasksFromDB.map(task => task.text);
            res.json(tasksTextArray);
        }
    });
});

// Ruta para borrar todas las tareas en el servidor
app.delete('/deleteTasks', (req, res) => {
    tasksOnServer.length = 0; // Borra todas las tareas en el servidor
    res.send('Todas las tareas borradas en el servidor.');
});

// Ruta para borrar todas las tareas en el servidor y en la base de datos
app.delete('/deleteTasksAtDataBase', (req, res) => {
    // Borra todas las tareas en la base de datos
    tasksCollection.remove({}, (error) => {
        if (error) {
            console.error('Error al borrar todas las tareas en la base de datos:', error);
            res.status(500).send('Error al borrar todas las tareas en la base de datos.');
        } else {
            console.log('Todas las tareas borradas en la base de datos.');
            res.send('Todas las tareas borradas en la base de datos.');
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));