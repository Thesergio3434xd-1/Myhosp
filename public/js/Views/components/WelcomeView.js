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
                <h2>¡Bienvenido a MyHosp!</h2>
                <p>Soy Ana, tu asistente virtual</p>
                <p class="welcome-commands">Dime "Ana" para activarme y luego podrás decir:</p>
                <ul class="commands-list">
                    <li>"inicio" - Para ir al inicio</li>
                    <li>"nosotros" - Para conocer nuestra historia</li>
                    <li>"servicios" - Para ver nuestros servicios</li>
                    <li>"contacto" - Para ir al contacto</li>
                </ul>
                <p class="welcome-tip">También puedes hacer clic en el micrófono para activarme</p>
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