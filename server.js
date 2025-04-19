const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Verificar si los módulos existen antes de importarlos
let CommandController, SocketService;
try {
  CommandController = require('./server/controllers/CommandController');
  SocketService = require('./server/services/SocketService');
  console.log('Módulos cargados correctamente');
} catch (error) {
  console.error('Error al cargar módulos:', error.message);
  // Definir clases mock para evitar errores
  CommandController = class {};
  SocketService = class {
    constructor() {}
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
  res.sendFile(indexPath);
  console.log('Solicitud a la ruta principal recibida');
});

// Agregar una ruta de prueba
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Endpoint para verificar estructura de directorios (solo para pruebas)
app.get('/test/dirstructure', (req, res) => {
  try {
    const publicDirPath = path.join(__dirname, 'public');
    
    // Función para leer estructura de directorio de forma recursiva
    function readDirRecursive(dir, baseDir) {
      const result = {};
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        const relativePath = path.relative(baseDir, itemPath);
        
        if (stat.isDirectory()) {
          result[relativePath] = readDirRecursive(itemPath, baseDir);
        } else {
          result[relativePath] = {
            size: stat.size,
            type: 'file'
          };
        }
      });
      
      return result;
    }
    
    // Leer estructura limitada a los directorios principales
    const dirs = fs.readdirSync(publicDirPath)
      .filter(item => {
        const itemPath = path.join(publicDirPath, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .map(dir => ({ 
        name: dir, 
        path: dir,
        files: fs.readdirSync(path.join(publicDirPath, dir)).slice(0, 10) // Limitar a 10 archivos por directorio
      }));
    
    res.json({
      publicDirExists: true,
      directories: dirs
    });
  } catch (error) {
    res.json({
      error: error.message,
      publicDirExists: fs.existsSync(path.join(__dirname, 'public'))
    });
  }
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
    
    // Comandos para apagar el asistente - esta parte ya está manejada en el evento
    if (command.includes('para ana') || command.includes('apágate') || 
        command.includes('adiós ana') || command.includes('adios ana') || 
        command.includes('hasta luego ana')) {
        return {
            text: 'Hasta pronto. Me apago.',
            action: 'speak'
        };
    }
    
    // Para los comandos de lectura, ya no los procesamos en el servidor
    // pues ahora se manejan completamente en el cliente
    if (command.startsWith('leer:')) {
        // Este código ya no se usará, pero lo mantenemos por compatibilidad
        return {
            text: "Procesando lectura...",
            action: 'speak'
        };
    }
    
    // Lista de secciones directas y palabras relacionadas
    const navigationMap = {
        // Exactamente como aparecen en los IDs del HTML
        'inicio': { section: 'inicio', target: '#inicio' },
        'funcionalidades': { section: 'funcionalidades', target: '#funcionalidades' },
        'testimonios': { section: 'testimonios', target: '#testimonios' },
        'contacto': { section: 'contacto', target: '#contacto' },
        'beneficios': { section: 'beneficios', target: '#beneficios' },
        
        // Sinónimos comunes y palabras relacionadas
        'principal': { section: 'inicio', target: '#inicio' },
        'home': { section: 'inicio', target: '#inicio' },
        'empezar': { section: 'inicio', target: '#inicio' },
        'comienzo': { section: 'inicio', target: '#inicio' },
        
        'servicios': { section: 'funcionalidades', target: '#funcionalidades' },
        'features': { section: 'funcionalidades', target: '#funcionalidades' },
        'funciones': { section: 'funcionalidades', target: '#funcionalidades' },
        'características': { section: 'funcionalidades', target: '#funcionalidades' },
        
        'opiniones': { section: 'testimonios', target: '#testimonios' },
        'comentarios': { section: 'testimonios', target: '#testimonios' },
        'experiencias': { section: 'testimonios', target: '#testimonios' },
        'clientes': { section: 'testimonios', target: '#testimonios' },
        
        'contáctanos': { section: 'contacto', target: '#contacto' },
        'comunicar': { section: 'contacto', target: '#contacto' },
        'mensaje': { section: 'contacto', target: '#contacto' },
        'email': { section: 'contacto', target: '#contacto' },
        
        'ventajas': { section: 'beneficios', target: '#beneficios' },
        'beneficio': { section: 'beneficios', target: '#beneficios' }
    };
    
    // Verificar si alguna palabra clave está en el comando
    for (const keyword in navigationMap) {
        // Verificamos si el comando incluye exactamente la palabra clave
        if (command.includes(keyword)) {
            const section = navigationMap[keyword].section;
            const target = navigationMap[keyword].target;
            
            console.log(`Navegación detectada: "${keyword}" -> ${target}`);
            
            // Devolver respuesta de navegación
            return {
                text: `Te llevo a la sección de ${section}`,
                action: 'navigate',
                target: target
            };
        }
    }
    
    // Verificar comandos de navegación específicos
    if (command.includes('llévame a') || command.includes('ir a') || 
        command.includes('navegar a') || command.includes('mostrar') || 
        command.includes('ver') || command.includes('muéstrame')) {
        
        // Revisamos nuevamente las palabras clave en este contexto
        for (const keyword in navigationMap) {
            if (command.includes(keyword)) {
                const section = navigationMap[keyword].section;
                const target = navigationMap[keyword].target;
                
                console.log(`Navegación indirecta: "${command}" -> ${target}`);
                
                return {
                    text: `Te llevo a la sección de ${section}`,
                    action: 'navigate',
                    target: target
                };
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

// Función para manejar el error EADDRINUSE
function handlePortInUseError(server, port) {
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`El puerto ${port} está en uso. Intentando con otro puerto...`);
      const newPort = port + 1; // Intentar con el siguiente puerto
      server.listen(newPort, () => {
        console.log(`Servidor ejecutándose en el puerto alternativo ${newPort}`);
        console.log(`Accede a la aplicación en: http://localhost:${newPort}`);
      });
    } else {
      console.error('Error en el servidor:', error);
    }
  });
}

// Iniciar el servidor y manejar errores
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`Accede a la aplicación en: http://localhost:${PORT}`);
});
handlePortInUseError(server, PORT);
