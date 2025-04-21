class SocketService {
    constructor(io) {
        this.io = io;
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Socket conectado');

            // Manejar comandos de voz
            socket.on('voiceCommand', (command) => {
                console.log('Comando recibido:', command);

                // Procesar comandos específicos para beneficios
                if (command.toLowerCase().includes('beneficios')) {
                    socket.emit('voiceResponse', {
                        text: 'Te llevo a la sección de beneficios',
                        action: 'navigate',
                        target: '#beneficios'
                    });
                }

                // Comandos para páginas de autenticación
                else if (command.toLowerCase().includes('iniciar sesión') ||
                    command.toLowerCase().includes('login') ||
                    command.toLowerCase().includes('ingresar')) {
                    socket.emit('voiceResponse', {
                        text: 'Te llevo a la página de inicio de sesión',
                        action: 'navigatePage',
                        target: 'login.html'
                    });
                }
                else if (command.toLowerCase().includes('registrar') ||
                    command.toLowerCase().includes('crear cuenta') ||
                    command.toLowerCase().includes('registro')) {
                    socket.emit('voiceResponse', {
                        text: 'Te llevo a la página de registro',
                        action: 'navigatePage',
                        target: 'registro.html'
                    });
                }
                else if (command.toLowerCase().includes('inicio') ||
                    command.toLowerCase().includes('regresar inicio') ||
                    command.toLowerCase().includes('volver') ||
                    command.toLowerCase().includes('página principal')) {
                    socket.emit('voiceResponse', {
                        text: 'Volviendo a la página principal',
                        action: 'navigatePage',
                        target: 'index.html'
                    });
                }
            });

            // Manejar desconexión
            socket.on('disconnect', () => {
                console.log('Socket desconectado');
            });
        });
    }
}

module.exports = SocketService;
