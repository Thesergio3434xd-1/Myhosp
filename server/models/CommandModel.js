class CommandModel {
    constructor() {
        // Comandos disponibles con sus palabras clave y respuestas
        this.commands = [
            {
                keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches'],
                response: 'Hola, soy el asistente de MyHosp. ¿En qué puedo ayudarte?',
                action: 'greeting'
            },
            {
                keywords: ['ayuda', 'qué puedes hacer', 'opciones'],
                response: 'Puedo ayudarte con información sobre pacientes, citas, medicamentos y navegación por el hospital.',
                action: 'help'
            },
            {
                keywords: ['paciente', 'pacientes', 'información del paciente'],
                response: 'Para consultar información de un paciente, por favor dime su número de identificación.',
                action: 'searchPatient'
            },
            {
                keywords: ['citas', 'agenda', 'programar cita'],
                response: 'Para programar una cita, necesito el nombre del paciente y la especialidad requerida.',
                action: 'scheduleAppointment'
            },
            {
                keywords: ['medicamento', 'medicamentos', 'farmacia'],
                response: 'Puedo proporcionarte información sobre medicamentos y disponibilidad en la farmacia del hospital.',
                action: 'medicineInfo'
            },
            {
                keywords: ['gracias', 'muchas gracias'],
                response: 'De nada, estoy aquí para ayudarte.',
                action: 'thanks'
            },
            {
                keywords: ['adiós', 'hasta luego', 'chao'],
                response: 'Hasta luego, que tengas un buen día.',
                action: 'goodbye'
            }
        ];
    }

    findBestMatch(text) {
        text = text.toLowerCase();
        
        // Buscar coincidencia exacta primero
        for (const cmd of this.commands) {
            if (cmd.keywords.some(keyword => text.includes(keyword))) {
                return cmd;
            }
        }
        
        // Si no hay coincidencia exacta, usar respuesta por defecto
        return {
            response: 'Lo siento, no he entendido ese comando. ¿Puedes repetirlo de otra forma?',
            action: 'unknown'
        };
    }

    // Método para guardar un nuevo comando en la base de datos (simulado)
    saveCommand(command) {
        // Aquí iría la lógica para guardar en una base de datos
        console.log('Comando guardado:', command);
        return true;
    }
}

module.exports = CommandModel;
