// Ahora WelcomeView no muestra nada, ya que se ha eliminado el mensaje en pantalla
class WelcomeView {
    constructor() {
        this.element = null;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'welcome-message';
        this.element.innerHTML = ``;
        return this.element;
    }

    show() {
        document.body.appendChild(this.create());
        setTimeout(() => { this.hide(); }, 1000);
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
