class NavigationModel {
    constructor() {
        this.currentView = 'welcome'; // Posibles valores: welcome, listening, processing
        this.navigationHistory = [];
        this.observers = [];
    }

    navigateTo(view) {
        this.navigationHistory.push(this.currentView);
        this.currentView = view;
        this.notifyObservers();
    }

    goBack() {
        if (this.navigationHistory.length > 0) {
            this.currentView = this.navigationHistory.pop();
            this.notifyObservers();
            return true;
        }
        return false;
    }

    // Patrón observador
    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this));
    }
}
