const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Manejar comandos de voz
    socket.on('voiceCommand', (command) => {
        console.log('Comando recibido:', command);
        
        // Procesar el comando y enviar respuesta
        let response = processCommand(command);
        socket.emit('voiceResponse', response);
    });

    // Manejar estado del asistente
    socket.on('assistantState', (state) => {
        console.log('Estado del asistente:', state);
        socket.emit('assistantStateUpdate', state);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Procesar comandos de voz
function processCommand(command) {
    command = command.toLowerCase().trim();
    
    if (command.includes('ana')) {
        return {
            text: '¿En qué puedo ayudarte?',
            action: 'speak'
        };
    } else if (command.includes('inicio')) {
        return {
            text: 'Te llevo a la sección de inicio',
            action: 'navigate',
            target: '#inicio'
        };
    } else if (command.includes('nosotros')) {
        return {
            text: 'Te llevo a la sección sobre nosotros',
            action: 'navigate',
            target: '#nosotros'
        };
    } else if (command.includes('servicios')) {
        return {
            text: 'Te llevo a la sección de servicios',
            action: 'navigate',
            target: '#servicios'
        };
    } else if (command.includes('contacto')) {
        return {
            text: 'Te llevo a la sección de contacto',
            action: 'navigate',
            target: '#contacto'
        };
    } else if (command.includes('iniciar sesion')) {
        return {
            text: 'Te llevo al inicio de sesión',
            action: 'click',
            target: '.btn'
        };
    } else {
        return {
            text: 'No entendí ese comando. ¿Podrías repetirlo?',
            action: 'speak'
        };
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 