import AssistantViewModel from './AssistantViewModel.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el ViewModel
    const assistant = new AssistantViewModel();

    // Asegurar que la síntesis de voz esté disponible
    if ('speechSynthesis' in window) {
        // Cancelar cualquier síntesis en curso
        window.speechSynthesis.cancel();

        // Configurar el idioma por defecto
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => voice.lang.includes('es'));
        
        if (spanishVoice) {
            window.speechSynthesis.defaultVoice = spanishVoice;
        }
    } else {
        console.error('La síntesis de voz no está disponible en este navegador');
    }
});

let recognition = null;
let synthesis = window.speechSynthesis;

function speak(text) {
    // Detener cualquier síntesis en curso
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Asegurar que el audio se reproduzca
    utterance.onstart = () => {
        console.log('Iniciando síntesis de voz...');
    };

    utterance.onerror = (event) => {
        console.error('Error en síntesis de voz:', event);
        synthesis.cancel();
    };

    synthesis.speak(utterance);
}

function showWelcomeMessage() {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.innerHTML = `
        <div class="welcome-content">
            <i class="fas fa-microphone-alt"></i>
            <p>¡Hola! Soy Ana, tu asistente virtual de MyHosp</p>
            <p class="welcome-commands">Dime "Ana" para activarme y luego podrás decir: "inicio", "nosotros", "servicios" o "contacto"</p>
        </div>
    `;
    document.body.appendChild(welcomeMessage);

    // Hablar el mensaje de bienvenida
    speak('¡Hola! Soy Ana, tu asistente virtual de MyHosp. Dime Ana para activarme y luego podrás decir: inicio, nosotros, servicios o contacto');

    // Desaparecer el mensaje después de 5 segundos
    setTimeout(() => {
        welcomeMessage.classList.add('fade-out');
        setTimeout(() => welcomeMessage.remove(), 500);
    }, 5000);
}

function startAssistant() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Lo siento, tu navegador no soporta el reconocimiento de voz.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.start();

    recognition.onstart = () => {
        console.log('Ana: Escuchando...');
        showListeningAnimation();
        showListeningMessage();
        speak('Escuchando...');
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        console.log('Transcripción:', transcript);
        
        // Procesar el comando
        if (transcript.toLowerCase().includes('ana')) {
            speak('¿En qué puedo ayudarte?');
            return;
        }

        // Procesar comandos de navegación
        if (transcript.toLowerCase().includes('inicio')) {
            speak('Te llevo a la sección de inicio');
            document.querySelector('#inicio').scrollIntoView({ behavior: 'smooth' });
        } else if (transcript.toLowerCase().includes('nosotros')) {
            speak('Te llevo a la sección sobre nosotros');
            document.querySelector('#nosotros').scrollIntoView({ behavior: 'smooth' });
        } else if (transcript.toLowerCase().includes('servicios')) {
            speak('Te llevo a la sección de servicios');
            document.querySelector('#servicios').scrollIntoView({ behavior: 'smooth' });
        } else if (transcript.toLowerCase().includes('contacto')) {
            speak('Te llevo a la sección de contacto');
            document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' });
        } else if (transcript.toLowerCase().includes('iniciar sesion')) {
            speak('Te llevo al inicio de sesión');
            document.querySelector('.btn').click();
        }
    };

    recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        speak('Lo siento, hubo un error al reconocer tu voz. ¿Podrías repetirlo?');
    };

    recognition.onend = () => {
        console.log('Reconocimiento finalizado.');
        hideListeningAnimation();
        hideListeningMessage();
    };
}

function stopAssistant() {
    if (recognition) {
        recognition.stop();
        hideListeningAnimation();
        hideListeningMessage();
        speak('Hasta luego, Ana se despide');
    }
}

function showListeningAnimation() {
    const micIcon = document.getElementById('micIcon');
    micIcon.style.animation = 'pulse 1.5s infinite';
}

function hideListeningAnimation() {
    const micIcon = document.getElementById('micIcon');
    micIcon.style.animation = 'none';
}

function showListeningMessage() {
    const listeningMessage = document.createElement('div');
    listeningMessage.className = 'listening-message';
    listeningMessage.innerHTML = '<i class="fas fa-microphone-alt"></i> Escuchando...';
    document.body.appendChild(listeningMessage);
}

function hideListeningMessage() {
    const listeningMessage = document.querySelector('.listening-message');
    if (listeningMessage) {
        listeningMessage.remove();
    }
}

// Agregar estilos dinámicos para la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .listening {
        color: var(--primary-30) !important;
    }

    .welcome-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-90);
        color: var(--white);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        text-align: center;
        animation: fadeIn 0.5s ease;
        z-index: 1000;
        max-width: 90%;
        width: 400px;
    }

    .welcome-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .welcome-content i {
        font-size: 3rem;
        color: var(--primary-30);
    }

    .welcome-content p {
        font-size: 1.2rem;
        margin: 0;
    }

    .welcome-commands {
        font-size: 1rem !important;
        color: var(--primary-30);
        margin-top: 1rem;
    }

    .listening-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-90);
        color: var(--white);
        padding: 1rem 2rem;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .listening-message i {
        color: var(--primary-30);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    .fade-out {
        animation: fadeOut 0.5s ease forwards;
    }
`;
document.head.appendChild(style);
