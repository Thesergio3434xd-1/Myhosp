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
            });
            
            // Manejar desconexión
            socket.on('disconnect', () => {
                console.log('Socket desconectado');
            });
        });
    }
}

module.exports = SocketService;
