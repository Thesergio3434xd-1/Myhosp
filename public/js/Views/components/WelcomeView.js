class WelcomeView {
    constructor() {
        this.element = null;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'welcome-message';
        this.element.innerHTML = `
            <div class="welcome-content">
                <i class="fas fa-microphone-alt"></i>
                <p>¡Bienvenido a MyHosp!</p>
                <p>Soy Ana, tu asistente virtual</p>
                <p class="welcome-commands">Dime "Ana" para activarme y luego podrás decir: "inicio", "nosotros", "servicios" o "contacto"</p>
            </div>
        `;
        return this.element;
    }

    show() {
        document.body.appendChild(this.element);
    }

    hide() {
        if (this.element) {
            this.element.classList.add('fade-out');
            setTimeout(() => {
                this.element.remove();
            }, 500);
        }
    }
}

export default WelcomeView; 