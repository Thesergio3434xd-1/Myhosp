class MicrophoneView {
    constructor(parent, assistantViewModel) {
        this.parent = parent;
        this.assistantViewModel = assistantViewModel;
        this.element = null;
        this.isListening = false;
    }

    initialize() {
        this.element = document.createElement('div');
        this.element.className = 'microphone-view';
        this.render();
        this.parent.appendChild(this.element);
        
        // Eventos
        this.element.addEventListener('click', () => {
            if (this.isListening) {
                this.assistantViewModel.stopListening();
            } else {
                this.assistantViewModel.startListening();
            }
        });
        
        // Registrarse para recibir actualizaciones
        this.assistantViewModel.registerView(this);
    }

    render(model) {
        if (model) {
            this.isListening = model.isListening;
            this.element.className = 'microphone-view' + (this.isListening ? ' listening' : '');
        }
        
        this.element.innerHTML = `
            <i class="microphone-icon">🎤</i>
        `;
    }
}
