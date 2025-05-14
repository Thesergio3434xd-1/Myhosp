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
                
                // Comandos para las nuevas secciones
                else if (command.toLowerCase().includes('nosotros') ||
                    command.toLowerCase().includes('sobre nosotros') ||
                    command.toLowerCase().includes('quiénes somos')) {
                    socket.emit('voiceResponse', {
                        text: 'Te llevo a la sección de información sobre nosotros',
                        action: 'navigate',
                        target: '#sobre-nosotros'
                    });
                }
                
                else if (command.toLowerCase().includes('app') ||
                    command.toLowerCase().includes('aplicación') ||
                    command.toLowerCase().includes('móvil')) {
                    socket.emit('voiceResponse', {
                        text: 'Te llevo a la sección de nuestra aplicación móvil',
                        action: 'navigate',
                        target: '#app-movil'
                    });
                }
                
                // Comandos para informar sobre la app móvil
                else if (command.toLowerCase().includes('explica la app') ||
                    command.toLowerCase().includes('cómo es la aplicación') ||
                    command.toLowerCase().includes('funciones de la app')) {
                    socket.emit('voiceResponse', {
                        text: 'La aplicación móvil de MyHosp te permite gestionar citas con un solo clic, acceder a chat médico 24/7, recibir recetas digitales y dar seguimiento a tu salud con integración de dispositivos wearables. Está disponible para iOS en App Store y para Android en Google Play.',
                        action: 'speak'
                    });
                }
                
                // Comandos para información sobre la empresa
                else if (command.toLowerCase().includes('información de la empresa') ||
                    command.toLowerCase().includes('quién es myhosp') ||
                    command.toLowerCase().includes('háblame de myhosp')) {
                    socket.emit('voiceResponse', {
                        text: 'MyHosp nació con la misión de hacer más accesible el sistema de salud colombiano mediante tecnología intuitiva y centrada en las personas. Contamos con más de 30,000 usuarios activos, 12 hospitales asociados y 450 médicos en nuestra plataforma.',
                        action: 'speak'
                    });
                }
                
                // Comandos para obtener estadísticas
                else if (command.toLowerCase().includes('estadísticas') ||
                    command.toLowerCase().includes('datos') ||
                    command.toLowerCase().includes('números de myhosp')) {
                    socket.emit('voiceResponse', {
                        text: 'MyHosp cuenta actualmente con más de 30 mil usuarios activos, colaboración con 12 hospitales en todo el país y más de 450 médicos especialistas disponibles en la plataforma. Nuestros usuarios reportan un 93% de satisfacción y han reducido en un 80% el tiempo dedicado a trámites médicos.',
                        action: 'speak'
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
