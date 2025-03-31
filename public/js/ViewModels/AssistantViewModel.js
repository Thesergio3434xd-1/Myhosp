import AssistantModel from '../Models/AssistantModel.js';
import WelcomeView from '../Views/components/WelcomeView.js';
import ListeningView from '../Views/components/ListeningView.js';

class AssistantViewModel {
    constructor() {
        this.model = new AssistantModel();
        this.micIcon = document.getElementById('micIcon');
        this.isActive = false;
        this.welcomeView = new WelcomeView();
        this.listeningView = new ListeningView();
        this.setupEventListeners();
        this.showWelcome();
    }

    setupEventListeners() {
        this.micIcon.addEventListener('click', () => this.toggleListening());
        
        if (this.model.recognition) {
            this.model.recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                this.handleCommand(text);
            };

            this.model.recognition.onstart = () => {
                this.listeningView.show();
                this.listeningView.updateMicIcon(this.micIcon, true);
            };

            this.model.recognition.onend = () => {
                this.listeningView.hide();
                this.listeningView.updateMicIcon(this.micIcon, false);
            };

            this.model.recognition.onerror = (event) => {
                console.error('Error de reconocimiento:', event.error);
                this.model.speak('Lo siento, hubo un error al reconocer tu voz. ¿Podrías repetirlo?');
            };
        }
    }

    showWelcome() {
        this.welcomeView.create();
        this.welcomeView.show();
        this.model.speak('¡Bienvenido a MyHosp! Soy Ana, tu asistente virtual. Dime Ana para activarme y luego podrás decir: inicio, nosotros, servicios o contacto');
        
        setTimeout(() => {
            this.welcomeView.hide();
        }, 5000);
    }

    toggleListening() {
        if (this.model.isListening) {
            this.model.stopListening();
            this.isActive = false;
            this.model.speak('Hasta luego, Ana se despide');
        } else {
            this.model.startListening();
        }
    }

    handleCommand(text) {
        const command = text.toLowerCase().trim();
        
        if (command.includes('ana')) {
            this.isActive = true;
            this.model.speak('¿En qué puedo ayudarte?');
            return;
        }

        if (!this.isActive) {
            return;
        }

        const selector = this.model.processCommand(command);
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                if (selector === '.btn') {
                    element.click();
                }
            }
        }
    }
}

export default AssistantViewModel; 