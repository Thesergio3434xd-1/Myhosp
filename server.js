const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar servicios
let SocketService, AuthService;
try {
  SocketService = require('./server/services/SocketService');
  AuthService = require('./server/services/AuthService');
  console.log('Servicios cargados correctamente');
} catch (error) {
  console.error('Error al cargar servicios:', error.message);
  // Definir clases mock simplificadas
  SocketService = class {
    constructor() { }
    initialize() {
      console.log('Mock SocketService inicializado');
    }
  };
  AuthService = class {
    constructor() { }
    initialize() {
      console.log('Mock AuthService inicializado');
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

// Inicializar los servicios
try {
  // Inicializar servicio de sockets
  const socketService = new SocketService(io);
  socketService.initialize();
  console.log('Servicio de sockets inicializado');
  
  // Inicializar servicio de autenticación
  const authService = new AuthService(io);
  authService.initialize();
  console.log('Servicio de autenticación inicializado');
} catch (error) {
  console.error('Error al inicializar servicios:', error);
}

// Rutas principales
app.get('/', (req, res) => {
  res.sendFile(indexPath);
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

// Endpoint de prueba básico
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('voiceCommand', (command) => {
    console.log('Comando recibido:', command);

    // Verificar si es un comando de desactivación COMPLETA (solo con "desactívate"/"desactivate")
    if (command.toLowerCase().match(/desact[ií]vate/i)) {
      console.log('Comando de DESACTIVACIÓN COMPLETA detectado en el servidor');
      socket.emit('voiceResponse', {
        text: 'Entendido, me desactivo completamente.',
        action: 'deactivate_complete'
      });
      return;
    }
    
    // Verificar si es un comando de SUSPENSIÓN TEMPORAL
    if (command.toLowerCase().includes('adios ana') ||
      command.toLowerCase().includes('adiós ana') ||
      command.toLowerCase().includes('apágate') ||
      command.toLowerCase().includes('para ana') ||
      command.toLowerCase().includes('hasta luego ana')) {

      console.log('Comando de SUSPENSIÓN TEMPORAL detectado en el servidor');
      socket.emit('voiceResponse', {
        text: 'Entendido, quedo en espera. Di "Ana" cuando me necesites.',
        action: 'suspend_temporary'
      });
      return;
    }    // Para los demás comandos, usar el procesador normal
    let response = processCommand(command);
    console.log('Respuesta generada:', response);
    
    // Si la acción es skip, no enviamos respuesta al cliente
    if (response && response.action === 'skip') {
      console.log('Omitiendo respuesta para evitar duplicación');
      return;
    }
    
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
  console.log('Procesando comando:', command);  // Lista de secciones directas y palabras relacionadas
  const navigationMap = {
    // Secciones principales y sus sinónimos
    'inicio': {
      section: 'inicio', target: '#inicio',
      aliases: ['principal', 'home', 'empezar', 'comienzo', 'página principal', 'principio']
    },
    'nosotros': {
      section: 'nosotros', target: '#sobre-nosotros',
      aliases: ['sobre nosotros', 'quiénes somos', 'acerca de', 'empresa', 'organización', 'conocenos']
    },
    'funcionalidades': {
      section: 'funcionalidades', target: '#funcionalidades',
      aliases: ['servicios', 'features', 'funciones', 'características', 'qué hacemos', 'capacidades']
    },
    'testimonios': {
      section: 'testimonios', target: '#testimonios',
      aliases: ['opiniones', 'comentarios', 'experiencias', 'clientes', 'reseñas', 'valoraciones']
    },
    'contacto': {
      section: 'contacto', target: '#contacto',
      aliases: ['contáctanos', 'comunicar', 'mensaje', 'email', 'contactar', 'escribir', 'ubicación']
    },
    'beneficios': {
      section: 'beneficios', target: '#beneficios',
      aliases: ['ventajas', 'beneficio', 'ventaja', 'provecho', 'utilidad', 'valor agregado']
    },
    'app móvil': {
      section: 'app móvil', target: '#app-movil',
      aliases: ['aplicación', 'móvil', 'smartphone', 'celular', 'android', 'iphone', 'app', 'aplicación móvil']
    },
    'ingresar': {
      section: 'ingresar', target: 'login.html',
      aliases: ['acceder', 'entrar', 'login', 'iniciar sesión', 'cuenta']
    }
  };

  // Manejar navegación entre páginas
  if (command.includes('login') || command.includes('iniciar sesión') || command.includes('entrar')) {
    return {
      text: 'Te llevo a la página de inicio de sesión',
      action: 'navigatePage',
      target: 'login.html'
    };
  }
  
  if (command.includes('registro') || command.includes('registrar') || command.includes('crear cuenta')) {
    return {
      text: 'Te llevo a la página de registro',
      action: 'navigatePage',
      target: 'registro.html'
    };
  }
  
  if ((command.includes('inicio') || command.includes('home') || command.includes('principal')) && 
     (command.includes('volver') || command.includes('regresar') || command.includes('ir'))) {
    return {
      text: 'Volviendo a la página principal',
      action: 'navigatePage',
      target: 'index.html'
    };
  }
  // Verificar si alguna palabra clave o sus aliases están en el comando
  for (const [key, value] of Object.entries(navigationMap)) {
    if (command.includes(key)) {
      console.log(`Navegación detectada: "${key}" -> ${value.target}`);
      // Si el comando comienza con "navegar:", significa que el cliente ya inició la navegación
      // en ese caso, no enviamos respuesta para evitar duplicar mensajes
      if (command.startsWith('navegar:')) {
        return {
          action: 'skip' // No realizaremos ninguna acción para evitar duplicación
        };
      } else {
        return {
          text: `Te llevo a la sección de ${value.section}`,
          action: 'navigate',
          target: value.target
        };
      }
    }
    // Verificar aliases
    for (const alias of value.aliases) {
      if (command.includes(alias)) {
        console.log(`Navegación detectada (alias): "${alias}" -> ${value.target}`);
        // Si el comando comienza con "navegar:", significa que el cliente ya inició la navegación
        // en ese caso, no enviamos respuesta para evitar duplicar mensajes  
        if (command.startsWith('navegar:')) {
          return {
            action: 'skip' // No realizaremos ninguna acción para evitar duplicación
          };
        } else {
          return {
            text: `Te llevo a la sección de ${value.section}`,
            action: 'navigate',
            target: value.target
          };
        }
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
  }  // Respuestas a preguntas comunes
  if (command.includes('qué puedes hacer') || command.includes('ayuda') || command.includes('cómo funciona')) {
    return {
      text: 'Soy Ana, tu asistente de voz. Puedo ayudarte a navegar diciendo frases como "llévame a inicio", "muéstrame nosotros", "ir a funcionalidades", "quiero ver beneficios", "vamos a app móvil", "muéstrame testimonios", "llévame a contacto" o "quiero ingresar". También puedo leer contenido si dices "lee sección" seguido del nombre. Puedes interrumpirme en cualquier momento simplemente hablando mientras estoy respondiendo, y puedes desactivarme diciendo "para Ana" o "apágate".',
      action: 'speak'
    };
  }else if (command.includes('gracias') || command.includes('thank')) {
    return {
      text: 'De nada, estoy aquí para ayudarte.',
      action: 'speak'
    };
  } else if (command.includes('hola') || command.includes('hey') || command.includes('saludos')) {
    return {
      text: 'Hola, soy Ana. ¿En qué puedo ayudarte? Puedes pedirme que te muestre diferentes secciones del sitio o que te lleve a la página de inicio de sesión o registro.',
      action: 'speak'
    };  } else {
    // Respuesta por defecto mejorada con ejemplos concretos
    return {
      text: 'No entendí tu comando. Prueba con alguno de estos ejemplos: "Llévame a Inicio", "Muéstrame Nosotros", "Ir a Funcionalidades", "Quiero ver Beneficios", "Vamos a App Móvil", "Muéstrame Testimonios", "Llévame a Contacto" o "Quiero Ingresar".',
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
