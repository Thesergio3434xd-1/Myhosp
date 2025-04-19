const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar solo el servicio de Socket que realmente se utiliza
let SocketService;
try {
  SocketService = require('./server/services/SocketService');
  console.log('Servicio de Socket cargado correctamente');
} catch (error) {
  console.error('Error al cargar el servicio de Socket:', error.message);
  // Definir clase mock simplificada
  SocketService = class {
    constructor() { }
    initialize() {
      console.log('Mock SocketService inicializado');
    }
  };
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, 'public')));
console.log('Sirviendo archivos estáticos desde:', path.join(__dirname, 'public'));

// Middleware
app.use(cors());
app.use(express.json());

// Verificar si existe el archivo index.html
const indexPath = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('Archivo index.html encontrado');
} else {
  console.error('Archivo index.html no encontrado en:', indexPath);
}

// Inicializar el servicio de sockets
try {
  const socketService = new SocketService(io);
  socketService.initialize();
  console.log('Servicio de sockets inicializado');
} catch (error) {
  console.error('Error al inicializar el servicio de sockets:', error);
}

// Ruta principal
app.get('/', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    console.log('Solicitud a la ruta principal recibida');
  } else {
    res.status(404).send('Archivo index.html no encontrado');
  }
});

// Endpoint de prueba básico (mantenido por ser útil para verificación rápida)
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('voiceCommand', (command) => {
    console.log('Comando recibido:', command);

    // Si recibimos un comando de desactivación, respondemos inmediatamente
    if (command.toLowerCase().includes('adios ana') ||
      command.toLowerCase().includes('adiós ana') ||
      command.toLowerCase().includes('apágate') ||
      command.toLowerCase().includes('para ana') ||
      command.toLowerCase().includes('hasta luego ana') ||
      command.toLowerCase().includes('desactivate')) {

      console.log('Comando de apagado detectado en el servidor');
      socket.emit('voiceResponse', {
        text: 'Hasta pronto. Me apago.',
        action: 'speak'
      });
      return;
    }

    // Para los demás comandos, usar el procesador normal
    let response = processCommand(command);
    console.log('Respuesta generada:', response);
    socket.emit('voiceResponse', response);
  });

  socket.on('assistantState', (state) => {
    console.log('Estado del asistente:', state);
    socket.emit('assistantStateUpdate', state);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Procesar comandos de voz para navegación y lectura
function processCommand(command) {
  command = command.toLowerCase().trim();
  console.log('Procesando comando:', command);

  // Lista de secciones directas y palabras relacionadas
  const navigationMap = {
    // Secciones principales y sus sinónimos
    'inicio': {
      section: 'inicio', target: '#inicio',
      aliases: ['principal', 'home', 'empezar', 'comienzo']
    },
    'funcionalidades': {
      section: 'funcionalidades', target: '#funcionalidades',
      aliases: ['servicios', 'features', 'funciones', 'características']
    },
    'testimonios': {
      section: 'testimonios', target: '#testimonios',
      aliases: ['opiniones', 'comentarios', 'experiencias', 'clientes']
    },
    'contacto': {
      section: 'contacto', target: '#contacto',
      aliases: ['contáctanos', 'comunicar', 'mensaje', 'email']
    },
    'beneficios': {
      section: 'beneficios', target: '#beneficios',
      aliases: ['ventajas', 'beneficio']
    }
  };

  // Verificar si alguna palabra clave o sus aliases están en el comando
  for (const [key, value] of Object.entries(navigationMap)) {
    if (command.includes(key)) {
      console.log(`Navegación detectada: "${key}" -> ${value.target}`);
      return {
        text: `Te llevo a la sección de ${value.section}`,
        action: 'navigate',
        target: value.target
      };
    }

    // Verificar aliases
    for (const alias of value.aliases) {
      if (command.includes(alias)) {
        console.log(`Navegación detectada (alias): "${alias}" -> ${value.target}`);
        return {
          text: `Te llevo a la sección de ${value.section}`,
          action: 'navigate',
          target: value.target
        };
      }
    }
  }

  // Verificar comandos de navegación específicos
  if (command.includes('llévame a') || command.includes('ir a') ||
    command.includes('navegar a') || command.includes('mostrar') ||
    command.includes('ver') || command.includes('muéstrame')) {

    // Revisamos nuevamente usando los alias
    for (const [key, value] of Object.entries(navigationMap)) {
      if (command.includes(key)) {
        return {
          text: `Te llevo a la sección de ${value.section}`,
          action: 'navigate',
          target: value.target
        };
      }

      for (const alias of value.aliases) {
        if (command.includes(alias)) {
          return {
            text: `Te llevo a la sección de ${value.section}`,
            action: 'navigate',
            target: value.target
          };
        }
      }
    }
  }

  // Respuestas a preguntas comunes
  if (command.includes('qué puedes hacer') || command.includes('ayuda') || command.includes('cómo funciona')) {
    return {
      text: 'Puedo ayudarte a navegar por el sitio. Di por ejemplo "ir a inicio", "funcionalidades", "muéstrame los testimonios", "contáctanos" o "beneficios".',
      action: 'speak'
    };
  } else if (command.includes('gracias') || command.includes('thank')) {
    return {
      text: 'De nada, estoy aquí para ayudarte.',
      action: 'speak'
    };
  } else if (command.includes('hola') || command.includes('hey') || command.includes('saludos')) {
    return {
      text: 'Hola, soy Ana. ¿En qué puedo ayudarte? Puedes pedirme que te muestre diferentes secciones del sitio.',
      action: 'speak'
    };
  } else {
    // Respuesta por defecto
    return {
      text: 'No entendí tu comando. Puedo ayudarte a navegar si dices "inicio", "funcionalidades", "testimonios", "contacto" o "beneficios".',
      action: 'speak'
    };
  }
}

const PORT = process.env.PORT || 3000;

// Iniciar el servidor con mejor manejo de errores
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} está en uso. Por favor cierre la aplicación que lo está usando e intente nuevamente.`);
    process.exit(1);
  } else {
    console.error('Error en el servidor:', error);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`Accede a la aplicación en: http://localhost:${PORT}`);
});
