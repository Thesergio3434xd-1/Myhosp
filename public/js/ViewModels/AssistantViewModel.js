class AssistantViewModel {
    constructor(assistantModel, speechHelper) {
        this.model = assistantModel;
        this.speechHelper = speechHelper;
        this.views = [];
        
        // Registrarse como observador del modelo
        this.model.addObserver(this);
        
        // Configurar handlers para eventos de reconocimiento de voz
        this.setupSpeechRecognition();
    }

    setupSpeechRecognition() {
        this.speechHelper.onStart(() => {
            this.model.startListening();
        });

        this.speechHelper.onResult((command) => {
            this.model.processCommand(command);
            
            // Enviar comando al servidor vía socket
            if (window.socket) {
                window.socket.emit('command', { text: command });
            }
        });

        this.speechHelper.onEnd(() => {
            this.model.stopListening();
        });

        this.speechHelper.onError((error) => {
            console.error('Error de reconocimiento:', error);
            this.model.stopListening();
        });
    }

    startListening() {
        this.speechHelper.start();
    }

    stopListening() {
        this.speechHelper.stop();
    }

    speak(text) {
        this.speechHelper.speak(text);
    }

    // Se llama cuando el modelo cambia
    update(model) {
        // Actualizar todas las vistas registradas
        this.views.forEach(view => view.render(model));
    }

    // Registrar vistas para actualización
    registerView(view) {
        this.views.push(view);
    }
}
