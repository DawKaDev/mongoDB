const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');
const dbURI = process.env.NODE_ENV === 'production' ? 'url to remote db' : 'mongodb://localhost:27017/companyDB';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', employeesRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', productsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
})

db.once('open', () => {
  //console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

const server = app.listen('8000', () => {
  //console.log('Server is running on port: 8000');
});

module.exports = server;