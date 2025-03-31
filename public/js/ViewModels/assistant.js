// Espera a que el DOM se cargue
document.addEventListener('DOMContentLoaded', () => {
    const micIcon = document.getElementById('micIcon');

    micIcon.addEventListener('click', () => {
        startAssistant();
    });
});

function startAssistant() {
    // Verificar compatibilidad con SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Lo siento, tu navegador no soporta el reconocimiento de voz.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Configura el idioma a español

    // Inicia el reconocimiento
    recognition.start();

    recognition.onstart = () => {
        console.log('Asistente: Escuchando...');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcripción:', transcript);
        // Aquí puedes procesar el comando de voz y activar la función de tu asistente
        alert("Comando recibido: " + transcript);
    };

    recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        alert("Error al reconocer voz: " + event.error);
    };

    recognition.onend = () => {
        console.log('Reconocimiento finalizado.');
    };
}
