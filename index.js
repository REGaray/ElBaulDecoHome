require('dotenv').config();

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT;

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials/");

// Contenido estático
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/index', function (req, res) {
    res.render('index');
});
app.get('/almohadones', function (req, res) {
    res.render('almohadones');
});
app.get('/dondeEstamos', function (req, res) {
    res.render('dondeEstamos');
});
app.get('/especialNavidad', function (req, res) {
    res.render('especialNavidad');
});
app.get('/espejos', function (req, res) {
    res.render('espejos');
});
app.get('/quienesSomos', function (req, res) {
    res.render('quienesSomos');
});

// Conexion a base de datos
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elbauldecohome'
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Conexion establecida....');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/assets', express.static(__dirname + '/public'));


// Routes
app.get('/productos', (req, res) => {
    let sql = "SELECT * FROM productos";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('productos', {
            results: results
        })
    })
})

// Insertar 
app.post('/save', (req, res) => {
    let data = {
        producto_nombre: req.body.producto_nombre,
        producto_precio: req.body.producto_precio
    };
    let sql = "INSERT INTO productos SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/productos');
    });
});

//UPDATE
app.post('/update', (req, res) => {
    let sql = "UPDATE productos SET producto_nombre='" + req.body.producto_nombre + "', producto_precio='" + req.body.producto_precio + "' WHERE producto_id=" + req.body.id;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/productos');
    });
});

// DELETE
app.post('/delete', (req, res) => {
    let sql = "DELETE FROM productos WHERE producto_id=" + req.body.producto_id + "";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/productos');
    });
});



// server listening
app.listen(port, () => {
    console.log(`Puerto corriendo en http://localhost:${port} `);
});