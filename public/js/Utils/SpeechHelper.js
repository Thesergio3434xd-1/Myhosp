class SpeechHelper {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.onStartCallback = null;
        this.onResultCallback = null;
        this.onEndCallback = null;
        this.onErrorCallback = null;
        
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Reconocimiento de voz no soportado en este navegador');
            return;
        }
        
        // Usar la API estándar o la versión webkit
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configurar reconocimiento
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        // Configurar eventos
        this.recognition.onstart = () => {
            if (this.onStartCallback) this.onStartCallback();
        };
        
        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim();
            
            if (this.onResultCallback) this.onResultCallback(command);
        };
        
        this.recognition.onend = () => {
            if (this.onEndCallback) this.onEndCallback();
        };
        
        this.recognition.onerror = (event) => {
            if (this.onErrorCallback) this.onErrorCallback(event.error);
        };
    }

    start() {
        if (this.recognition) {
            this.recognition.start();
        }
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    speak(text) {
        if (!this.synthesis) {
            console.error('Síntesis de voz no soportada en este navegador');
            return;
        }
        
        // Detener cualquier voz anterior
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        
        this.synthesis.speak(utterance);
    }

    // Métodos para registrar callbacks
    onStart(callback) {
        this.onStartCallback = callback;
    }

    onResult(callback) {
        this.onResultCallback = callback;
    }

    onEnd(callback) {
        this.onEndCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }
}
