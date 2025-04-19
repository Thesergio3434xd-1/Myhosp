class MainView {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.views = {};
        this.currentView = null;
        
        // Inicializar modelos
        this.assistantModel = new AssistantModel();
        this.navigationModel = new NavigationModel();
        
        // Inicializar helpers
        this.speechHelper = new SpeechHelper();
        this.uiHelper = new UIHelper();
        
        // Inicializar viewmodels
        this.assistantViewModel = new AssistantViewModel(this.assistantModel, this.speechHelper);
        this.navigationViewModel = new NavigationViewModel(this.navigationModel);
        
        // Configurar socket
        this.setupSocket();
    }

    initialize() {
        // Crear el contenedor principal
        this.mainContainer = document.createElement('div');
        this.mainContainer.className = 'assistant-container';
        this.appContainer.appendChild(this.mainContainer);
        
        // Inicializar vistas
        this.initializeViews();
        
        // Registrarse como observador de navegación
        this.navigationViewModel.registerView(this);
        
        // Iniciar en la vista bienvenida
        this.render(this.navigationModel);
    }

    initializeViews() {
        // Crear componentes de vista
        this.views.welcome = new WelcomeView(this.mainContainer, this.navigationViewModel);
        this.views.listening = new ListeningView(this.mainContainer, this.assistantViewModel);
        
        // Inicializar cada vista
        Object.values(this.views).forEach(view => {
            view.initialize();
            view.hide();
        });
    }

    render(model) {
        if (!model) return;
        
        // Ocultar vista actual
        if (this.currentView) {
            this.views[this.currentView].hide();
        }
        
        // Mostrar nueva vista
        this.currentView = model.currentView;
        this.views[this.currentView].show();
    }

    setupSocket() {
        window.socket = io();
        
        window.socket.on('connect', () => {
            console.log('Conectado al servidor');
        });
        
        window.socket.on('commandResponse', (data) => {
            this.assistantModel.setResponse(data.response);
            this.assistantViewModel.speak(data.response);
        });
        
        window.socket.on('disconnect', () => {
            console.log('Desconectado del servidor');
        });
    }
}
