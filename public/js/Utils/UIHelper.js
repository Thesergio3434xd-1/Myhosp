const UIHelper = {
    addStyles() {
        console.log('Estilos agregados.');
    },
    updateMicIcon(micIcon, isListening) {
        if (micIcon) {
            micIcon.style.color = isListening ? '#4CAF50' : '#fff';
            micIcon.style.animation = isListening ? 'pulse 1.5s infinite' : 'none';
        }
    },
    showListeningMessage() {
        // No se muestra mensaje extra en pantalla
    },
    hideListeningMessage() {
        // No se requiere acción
    }
};

export default UIHelper;
