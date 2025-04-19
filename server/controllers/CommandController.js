const CommandModel = require('../models/CommandModel');

class CommandController {
    constructor() {
        this.commandModel = new CommandModel();
    }

    processCommand(command) {
        // Limpiar y normalizar el comando
        const normalizedCommand = this.normalizeCommand(command);
        
        // Buscar la mejor coincidencia
        const bestMatch = this.commandModel.findBestMatch(normalizedCommand);
        
        // Registrar el comando para análisis (opcional)
        this.logCommand(normalizedCommand, bestMatch.action);
        
        // Procesar acción específica si es necesario
        this.performAction(bestMatch.action, normalizedCommand);
        
        return {
            originalCommand: command,
            normalizedCommand,
            response: bestMatch.response,
            action: bestMatch.action
        };
    }

    normalizeCommand(command) {
        // Limpieza básica: minúsculas, quitar espacios adicionales
        return command.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    logCommand(command, action) {
        const now = new Date();
        const logEntry = {
            timestamp: now.toISOString(),
            command,
            action
        };
        
        // Aquí se guardaría en un log o base de datos
        console.log('Comando registrado:', logEntry);
    }

    performAction(action, command) {
        // Implementar acciones específicas basadas en el comando
        switch (action) {
            case 'searchPatient':
                // Buscar información del paciente
                // Por ejemplo: extractPatientId(command)
                break;
                
            case 'scheduleAppointment':
                // Programar cita
                // Por ejemplo: extractAppointmentDetails(command)
                break;
                
            case 'medicineInfo':
                // Buscar información de medicamentos
                // Por ejemplo: extractMedicineName(command)
                break;
                
            // Más casos según sea necesario
        }
    }
}

module.exports = CommandController;
