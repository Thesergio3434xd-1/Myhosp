class ListeningView {
    constructor() {
        this.element = null;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'listening-message';
        this.element.innerHTML = '<i class="fas fa-microphone-alt"></i> Escuchando...';
        return this.element;
    }

    show() {
        document.body.appendChild(this.create());
    }

    hide() {
        if (this.element) {
            this.element.remove();
        }
    }

    updateMicIcon(micIcon, isListening) {
        if (micIcon) {
            micIcon.style.color = isListening ? '#4CAF50' : '#fff';
            micIcon.style.animation = isListening ? 'pulse 1.5s infinite' : 'none';
        }
    }
}

export default ListeningView;
