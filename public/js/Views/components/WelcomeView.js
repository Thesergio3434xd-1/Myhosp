class WelcomeView {
    constructor(parent, navigationViewModel) {
        this.parent = parent;
        this.navigationViewModel = navigationViewModel;
        this.element = null;
    }

    initialize() {
        this.element = document.createElement('div');
        this.element.className = 'welcome-view';
        this.render();
        this.parent.appendChild(this.element);
        
        // Eventos
        this.element.querySelector('.start-button').addEventListener('click', () => {
            this.navigationViewModel.navigateTo('listening');
        });
    }

    render() {
        this.element.innerHTML = `
            <h1>Bienvenido a MyHosp</h1>
            <p>Tu asistente hospitalario por voz</p>
            <button class="start-button">Comenzar</button>
        `;
    }

    show() {
        if (this.element) this.element.style.display = 'block';
    }

    hide() {
        if (this.element) this.element.style.display = 'none';
    }
}

// Eliminar la exportación por defecto
// export default WelcomeView;
