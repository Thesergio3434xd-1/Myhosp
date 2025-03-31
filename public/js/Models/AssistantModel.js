class AssistantModel {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = {
            'inicio': '#inicio',
            'nosotros': '#nosotros',
            'servicios': '#servicios',
            'contacto': '#contacto',
            'iniciar sesion': '.btn'
        };
        this.initializeRecognition();
    }

    initializeRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'es-ES';
        }
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
            this.isListening = true;
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    processCommand(text) {
        const command = text.toLowerCase().trim();
        for (const [key, value] of Object.entries(this.commands)) {
            if (command.includes(key)) {
                return value;
            }
        }
        return null;
    }

    speak(text) {
        const synthesis = window.speechSynthesis;
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            console.log('Iniciando síntesis de voz...');
        };

        utterance.onerror = (event) => {
            console.error('Error en síntesis de voz:', event);
            synthesis.cancel();
        };

        synthesis.speak(utterance);
    }
}

export default AssistantModel; 