// Espera a que el DOM se cargue
document.addEventListener('DOMContentLoaded', () => {
    const micIcon = document.getElementById('micIcon');
    const nav = document.querySelector('nav ul');
    let isListening = false;
    let socket = null;

    // Inicializar Socket.IO
    try {
        socket = io('http://localhost:3000');
        
        socket.on('connect', () => {
            console.log('Conectado al servidor');
            showWelcomeMessage();
        });

        socket.on('voiceResponse', (response) => {
            speak(response.text);
            if (response.action === 'navigate') {
                window.location.href = response.target;
            }
        });
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }

    // Agregar botón de menú móvil
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').insertBefore(menuButton, nav);

    // Toggle menú móvil
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // Mejorar la interacción del micrófono
    micIcon.addEventListener('click', () => {
        if (!isListening) {
            startAssistant();
            isListening = true;
            micIcon.classList.add('listening');
        } else {
            stopAssistant();
            isListening = false;
            micIcon.classList.remove('listening');
        }
    });
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

    synthesis.speak(utterance);
}

function showWelcomeMessage() {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.innerHTML = `
        <div class="welcome-content">
            <i class="fas fa-microphone-alt"></i>
            <p>¡Bienvenido a MyHosp! ¿En qué puedo ayudarte hoy?</p>
        </div>
    `;
    document.body.appendChild(welcomeMessage);

    // Hablar el mensaje de bienvenida
    speak('¡Bienvenido a MyHosp! ¿En qué puedo ayudarte hoy?');

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
        console.log('Asistente: Escuchando...');
        showListeningAnimation();
        showListeningMessage();
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        console.log('Transcripción:', transcript);
        
        // Enviar el comando al servidor
        if (socket) {
            socket.emit('voiceCommand', transcript);
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
