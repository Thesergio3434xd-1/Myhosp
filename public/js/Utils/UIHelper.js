class UIHelper {
    static showWelcomeMessage() {
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

        setTimeout(() => {
            welcomeMessage.classList.add('fade-out');
            setTimeout(() => welcomeMessage.remove(), 500);
        }, 5000);
    }

    static showListeningMessage() {
        const listeningMessage = document.createElement('div');
        listeningMessage.className = 'listening-message';
        listeningMessage.innerHTML = '<i class="fas fa-microphone-alt"></i> Escuchando...';
        document.body.appendChild(listeningMessage);
    }

    static hideListeningMessage() {
        const listeningMessage = document.querySelector('.listening-message');
        if (listeningMessage) {
            listeningMessage.remove();
        }
    }

    static updateMicIcon(micIcon, isListening) {
        micIcon.style.color = isListening ? '#4CAF50' : '#333';
        micIcon.style.animation = isListening ? 'pulse 1.5s infinite' : 'none';
    }

    static addStyles() {
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
    }
}

export default UIHelper; 