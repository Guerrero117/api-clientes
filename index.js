const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://guerrero:guerrero123@octavioguerrero.ox7wdea.mongodb.net/AppOcta');

// Schema de usuarios
const usuarioSchema = new mongoose.Schema({
    usuario: String,
    contrasena: String
});
const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

// Schema de clientes
const clienteSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: String,
    edad: Number,
    fecha_nacimiento: Date
});
const Cliente = mongoose.model('Cliente', clienteSchema, 'clientes');

// POST login
app.post('/api/login', async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        const encontrado = await Usuario.findOne({ usuario, contrasena });
        if (encontrado) {
            res.json({ success: true });
        } else {
            res.json({ success: false, mensaje: 'Usuario o contraseña incorrectos' });
        }
    } catch (e) {
        res.status(500).json({ success: false, mensaje: e.message });
    }
});

// GET todos los clientes
app.get('/api/clientes', async (req, res) => {
    const clientes = await Cliente.find();
    res.json(clientes);
});

// GET cliente por clave
app.get('/api/clientes/:clave', async (req, res) => {
    const cliente = await Cliente.findOne({ clave: req.params.clave });
    if (cliente) {
        res.json({ existe: true, cliente });
    } else {
        res.json({ existe: false });
    }
});

// POST nuevo cliente
app.post('/api/clientes', async (req, res) => {
    try {
        const nuevo = new Cliente(req.body);
        await nuevo.save();
        res.json({ mensaje: 'Cliente guardado correctamente' });
    } catch (e) {
        res.status(400).json({ mensaje: 'Error: ' + e.message });
    }
});

// PUT actualizar cliente
app.put('/api/clientes/:clave', async (req, res) => {
    await Cliente.updateOne({ clave: req.params.clave }, req.body);
    res.json({ mensaje: 'Cliente actualizado correctamente' });
});

// DELETE eliminar cliente
app.delete('/api/clientes/:clave', async (req, res) => {
    await Cliente.deleteOne({ clave: req.params.clave });
    res.json({ mensaje: 'Cliente eliminado correctamente' });
});

app.listen(3000, () => console.log('API corriendo en puerto 3000'));