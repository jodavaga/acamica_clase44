const express = require('express');
// importamos bodyParser
const bodyParser = require('body-parser');
const app = express();
/*
// Primer Middleware
const logRequest = (req, res, next) => {
    console.log(
        `Estas pasando por un middleware en ${new Date} y accediste al path: ${req.path}`
    );
    next();
}

// Segundo middleware
const interceptor = (req, res, next) => {
    console.log(`Peticion ${req.path} a sido interceptada`);

    // Esperamos dos segundos antes de dejarla seguir
    setTimeout(() => {
        console.warn('La dejamos seguir');
        next();
    }, 2000);
}

// Usamos libreria body-parser
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Accediste al HOME');
});

app.get('/photos', interceptor, (req, res) => {
    res.send('Devolviendo las fotos');
});

// Mi primera peticion POST
app.post('/contact', (req, res) => {

    const {name, lastname} = req.body;

    // Manejo de errores, tipo 400 (Bad Request)
    if (!name || !lastname) {
        res.status(400);
        res.json({error: 'Faltan datos requeridos'});
        return;
    }

    res.json(req.body);
});

// Middleware para manejar errores genericos
app.use((err, req, res, next) => {
    if (!err) return next();
    console.error(`Error, algo salio mal: ${err}`);
    res.status(500).send('Error');
})
*/

// EJERCICIO PRIMER API REST -------------------------------------------

app.use(bodyParser.json());

const todos = [
    {
        id: 1,
        todo: 'Estudiar lodash',
        completed: false
    }
];

// GET
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Middleware evalua si existe ya un ID igual
const evaluaExistente = (req, res, next) => {
    const id = req.body.id;
    // Verifico que no exista ya un item con el mismo id
    // Filter always returs array.
    const todoExiste = todos.find(item => {
        if (item.id === Number(id)) {
            return item;
        } 
    });
    
    if(!todoExiste) {
        next();
    }
    return res.status(400).send(`Item con id: ${id}, ya existe`);
}

// POST
app.post('/todos', evaluaExistente, (req, res) => {

    todos.push(req.body);
    res.json(req.body);

});

// GET by Id
app.get('/todos/:id', (req, res) => {
    const index = req.params.id;
    // Encuentro el item
    const todo = todos.find(elem => elem.id == index);
    if (!todo) {
        return res.status(404).json({error: `Articulo con id: ${index}, no existe`})
    }
    res.json(todo);
});

// PUT by Id
app.put('/todos/:id', (req, res) => {
    const index = req.params.id;
    const {name, completed} = req.body;
    // Encuentro el item
    const todo = todos.find(elem => elem.id == index);
    if (!todo) {
        return res.status(404).json({error: `Articulo con id: ${index}, no existe`})
    }

    todo.name = name;
    todo.completed = completed;

    res.json(todo);
});

// DELETE
app.delete('/todos/:id', (req, res) => {
    const index = req.params.id;

    // Find element by ID
    const toDelete = todos.find((elem) => {
        if (elem.id == index) {
            return elem;
        }
    });
    
    // Find position of that element
    const i = todos.indexOf(toDelete);
    // remove it from Array
    if (i > -1) {
        todos.splice(i, 1);
    }

    res.json(todos);
})

app.listen(4000, () => {
    console.log('Servidor inicializado...')
})