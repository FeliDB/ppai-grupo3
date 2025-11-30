const http = require('http');
const fs = require('fs');
const path = require('path');
const PantRegResEventoSismico = require('./models/PantRegResEventoSismico');

const pantalla = new PantRegResEventoSismico();

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'public', 'index.html')));
    } 
    else if (req.method === 'GET' && req.url === '/api/eventos') {
        try {
            const eventos = await pantalla.opcRegResultadoRevisionManual();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(eventos));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    else if (req.method === 'POST' && req.url.startsWith('/api/seleccionar/')) {
        const eventoId = req.url.split('/')[3];
        console.log(`Seleccionando evento ID: ${eventoId}`);
        try {
            const datos = await pantalla.tomarSeleccionEventoSismico(parseInt(eventoId));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(datos));
        } catch (error) {
            console.error('Error en /api/seleccionar:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message, stack: error.stack }));
        }
    }
    else if (req.method === 'POST' && req.url === '/api/rechazar') {
        try {
            const resultado = await pantalla.tomarSeleccionRechazo();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ rechazado: resultado }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});