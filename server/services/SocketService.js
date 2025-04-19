const CommandController = require('../controllers/CommandController');

class SocketService {
    constructor(io) {
        this.io = io;
        this.commandController = new CommandController();
        this.connectedClients = new Map();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado:', socket.id);
            this.connectedClients.set(socket.id, {
                connected: true,
                lastActivity: new Date()
            });
            
            // Manejar comandos de voz
            socket.on('command', (data) => {
                console.log('Comando recibido:', data.text);
                
                // Procesar el comando
                const result = this.commandController.processCommand(data.text);
                
                // Actualizar última actividad
                this.updateClientActivity(socket.id);
                
                // Enviar respuesta al cliente
                socket.emit('commandResponse', {
                    originalCommand: data.text,
                    response: result.response,
                    action: result.action
                });
            });
            
            // Manejar desconexión
            socket.on('disconnect', () => {
                console.log('Cliente desconectado:', socket.id);
                this.connectedClients.delete(socket.id);
            });
        });
        
        // Configurar limpieza periódica de conexiones inactivas
        setInterval(() => {
            this.cleanInactiveConnections();
        }, 30 * 60 * 1000); // 30 minutos
    }

    updateClientActivity(socketId) {
        const client = this.connectedClients.get(socketId);
        if (client) {
            client.lastActivity = new Date();
            this.connectedClients.set(socketId, client);
        }
    }

    cleanInactiveConnections() {
        const now = new Date();
        const inactivityThreshold = 60 * 60 * 1000; // 1 hora
        
        this.connectedClients.forEach((client, socketId) => {
            const inactiveTime = now - client.lastActivity;
            if (inactiveTime > inactivityThreshold) {
                console.log('Eliminando cliente inactivo:', socketId);
                this.connectedClients.delete(socketId);
            }
        });
    }

    // Método para enviar actualizaciones a todos los clientes
    broadcastUpdate(event, data) {
        this.io.emit(event, data);
    }
}

module.exports = SocketService;
