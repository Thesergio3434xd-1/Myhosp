class ListeningView {
    constructor(parent, assistantViewModel) {
        this.parent = parent;
        this.assistantViewModel = assistantViewModel;
        this.element = null;
        this.microphoneView = null;
    }

    initialize() {
        this.element = document.createElement('div');
        this.element.className = 'listening-view';
        this.render();
        this.parent.appendChild(this.element);
        
        // Crear y agregar el componente de micrófono
        const micContainer = this.element.querySelector('.microphone-container');
        this.microphoneView = new MicrophoneView(micContainer, this.assistantViewModel);
        this.microphoneView.initialize();
        
        // Registrarse para recibir actualizaciones
        this.assistantViewModel.registerView(this);
    }

    render(model) {
        const isListening = model ? model.isListening : false;
        const lastCommand = model ? model.lastCommand : null;
        const responseText = model ? model.responseText : '';
        
        this.element.innerHTML = `
            <h2>Asistente escuchando</h2>
            <div class="status-indicator">${isListening ? 'Escuchando...' : 'Listo para escuchar'}</div>
            <div class="microphone-container"></div>
            ${lastCommand ? `<div class="last-command">Comando reconocido: "${lastCommand}"</div>` : ''}
            ${responseText ? `<div class="response-text">Respuesta: "${responseText}"</div>` : ''}
        `;
        
        // Volver a agregar el micrófono si ya está inicializado
        if (this.microphoneView) {
            const newMicContainer = this.element.querySelector('.microphone-container');
            this.microphoneView.parent = newMicContainer;
            this.microphoneView.initialize();
        }
    }

    show() {
        if (this.element) this.element.style.display = 'block';
    }

    hide() {
        if (this.element) this.element.style.display = 'none';
    }
}
