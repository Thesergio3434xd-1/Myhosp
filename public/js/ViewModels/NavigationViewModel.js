class NavigationViewModel {
    constructor(navigationModel) {
        this.model = navigationModel;
        this.views = [];
        
        // Registrarse como observador
        this.model.addObserver(this);
    }

    navigateTo(view) {
        this.model.navigateTo(view);
    }

    goBack() {
        return this.model.goBack();
    }

    // Método llamado cuando el modelo cambia
    update(model) {
        this.views.forEach(view => view.render(model));
    }

    // Registrar vistas para actualización
    registerView(view) {
        this.views.push(view);
    }
}
