import UIHelper from '../Utils/UIHelper.js';
import WelcomeView from '../Views/components/WelcomeView.js';

// Variables globales
let recognition = null;
let synthesis = window.speechSynthesis;
let socket = null;

// Función para hablar
function speak(text) {
    if (!('speechSynthesis' in window)) {
        console.error('La síntesis de voz no está disponible');
        return;
    }

    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Esperar a que las voces estén disponibles
    const loadVoices = () => {
        const voices = synthesis.getVoices();
        const spanishVoice = voices.find(voice => voice.lang.includes('es'));
        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }
    };

    if (synthesis.getVoices().length > 0) {
        loadVoices();
    } else {
        synthesis.onvoiceschanged = loadVoices;
    }

    synthesis.speak(utterance);
}

// Función para iniciar el asistente
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

    recognition.onstart = () => {
        console.log('Ana: Escuchando...');
        UIHelper.updateMicIcon(document.getElementById('micIcon'), true);
        UIHelper.showListeningMessage();
        speak('Escuchando...');
        socket.emit('assistantState', { listening: true });
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        console.log('Transcripción:', transcript);
            socket.emit('voiceCommand', transcript);
    };

    recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        speak('Lo siento, hubo un error al reconocer tu voz. ¿Podrías repetirlo?');
        socket.emit('assistantState', { error: event.error });
    };

    recognition.onend = () => {
        console.log('Reconocimiento finalizado.');
        UIHelper.updateMicIcon(document.getElementById('micIcon'), false);
        UIHelper.hideListeningMessage();
        socket.emit('assistantState', { listening: false });
    };

    try {
        recognition.start();
    } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
        speak('Lo siento, hubo un error al iniciar el reconocimiento de voz.');
    }
}

// Función para detener el asistente
function stopAssistant() {
    if (recognition) {
        recognition.stop();
        UIHelper.updateMicIcon(document.getElementById('micIcon'), false);
        UIHelper.hideListeningMessage();
        speak('Hasta luego, Ana se despide');
        socket.emit('assistantState', { listening: false });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Agregar estilos
    UIHelper.addStyles();

    // Inicializar Socket.IO
    socket = io();

    // Manejar respuestas del servidor
    socket.on('voiceResponse', (response) => {
        console.log('Respuesta del servidor:', response);
        
        if (response.action === 'speak') {
            speak(response.text);
        } else if (response.action === 'navigate') {
            const element = document.querySelector(response.target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                speak(response.text);
            }
        } else if (response.action === 'click') {
            const element = document.querySelector(response.target);
            if (element) {
                element.click();
                speak(response.text);
            }
        }
    });

    // Configurar el micrófono
    const micIcon = document.getElementById('micIcon');
    if (micIcon) {
        micIcon.addEventListener('click', () => {
            if (!recognition) {
                startAssistant();
            } else {
                stopAssistant();
            }
        });
    }

    // Mostrar mensaje de bienvenida
    const welcomeView = new WelcomeView();
    welcomeView.show();
    speak('¡Hola! Soy Ana, tu asistente virtual de MyHosp. Dime Ana para activarme y luego podrás decir: inicio, nosotros, servicios o contacto');
});
