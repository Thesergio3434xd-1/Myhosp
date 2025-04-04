import UIHelper from '../Utils/UIHelper.js';

// Variables globales
let recognition = null;
let synthesis = window.speechSynthesis;
let socket = null;
// El asistente inicia activo y se desactivará al procesar un comando (excepto "ana" para reactivarlo)
let assistantActive = true;
const COOLDOWN = 3000; // 3 segundos para evitar repeticiones
let lastCommandTime = 0;

function speak(text) {
    if (!('speechSynthesis' in window)) {
        console.error("La síntesis de voz no está disponible");
        return;
    }
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const loadVoices = () => {
        const voices = synthesis.getVoices();
        const femaleVoice = voices.find(v => v.name.toLowerCase().includes("google español")) ||
            voices.find(v => v.lang === "es-ES");
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
    };
    if (synthesis.getVoices().length > 0) {
        loadVoices();
    } else {
        synthesis.onvoiceschanged = loadVoices;
    }
    synthesis.speak(utterance);
}

function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Lo siento, tu navegador no soporta el reconocimiento de voz.");
        return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log("Ana: Escuchando...");
        UIHelper.updateMicIcon(document.getElementById("micIcon"), true);
        socket.emit("assistantState", { listening: true });
    };

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript + " ";
            }
        }
        transcript = transcript.trim().toLowerCase();
        if (!transcript) return;
        console.log("Transcripción final:", transcript);

        const now = Date.now();
        if (now - lastCommandTime < COOLDOWN) return;
        lastCommandTime = now;

        // Si el asistente está inactivo, solo se reactiva con "ana"
        if (!assistantActive) {
            if (transcript.includes("ana")) {
                assistantActive = true;
                speak("Asistente activada");
                UIHelper.updateMicIcon(document.getElementById("micIcon"), true);
            }
            return;
        }

        // Procesar comandos de navegación o de apagado
        if (transcript.includes("adios")) {
            speak("Hasta luego");
            assistantActive = false;
            UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
        } else if (transcript.includes("inicio")) {
            socket.emit("voiceCommand", "inicio");
            speak("Navegando a inicio");
            assistantActive = false;
            UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
        } else if (transcript.includes("nosotros")) {
            socket.emit("voiceCommand", "nosotros");
            speak("Navegando a nosotros");
            assistantActive = false;
            UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
        } else if (transcript.includes("servicios")) {
            socket.emit("voiceCommand", "servicios");
            speak("Navegando a servicios");
            assistantActive = false;
            UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
        } else if (transcript.includes("contacto")) {
            socket.emit("voiceCommand", "contacto");
            speak("Navegando a contacto");
            assistantActive = false;
            UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
        }
    };

    recognition.onerror = (event) => {
        console.error("Error de reconocimiento:", event.error);
        speak("Error en el reconocimiento de voz");
        socket.emit("assistantState", { error: event.error });
    };

    recognition.onend = () => {
        console.log("Reconocimiento finalizado, reiniciando...");
        UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
        socket.emit("assistantState", { listening: false });
        recognition = null;
        setTimeout(() => startRecognition(), 1000);
    };

    try {
        recognition.start();
    } catch (error) {
        console.error("Error al iniciar el reconocimiento:", error);
        speak("Error al iniciar el reconocimiento de voz");
    }
}

function toggleAssistant() {
    assistantActive = !assistantActive;
    if (assistantActive) {
        speak("Asistente activada");
        UIHelper.updateMicIcon(document.getElementById("micIcon"), true);
    } else {
        speak("Asistente desactivada");
        UIHelper.updateMicIcon(document.getElementById("micIcon"), false);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    UIHelper.addStyles();
    socket = io();

    socket.on("voiceResponse", (response) => {
        console.log("Respuesta del servidor:", response);
        if (response.action === "speak") {
            speak(response.text);
        } else if (response.action === "navigate") {
            const element = document.querySelector(response.target);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                speak(response.text);
            }
        } else if (response.action === "click") {
            const element = document.querySelector(response.target);
            if (element) {
                element.click();
                speak(response.text);
            }
        }
    });

    const micIcon = document.getElementById("micIcon");
    if (micIcon) {
        micIcon.addEventListener("click", toggleAssistant);
    }

    // Saludo de bienvenida
    speak("¡Hola! Soy Ana, tu asistente virtual de MyHosp. ¿En qué puedo ayudarte?");
    startRecognition();
});

export { speak, startRecognition };
