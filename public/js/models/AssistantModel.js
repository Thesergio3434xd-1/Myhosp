class AssistantModel {
    constructor() {
        this.isListening = false;
        this.lastCommand = null;
        this.responseText = '';
        this.commandHistory = [];
        this.observers = [];
    }

    startListening() {
        this.isListening = true;
        this.notifyObservers();
    }

    stopListening() {
        this.isListening = false;
        this.notifyObservers();
    }

    processCommand(command) {
        this.lastCommand = command;
        this.commandHistory.push({
            command,
            timestamp: new Date()
        });
        this.notifyObservers();
        
        // Aquí se podría enviar el comando al servidor para procesamiento
        return command;
    }

    setResponse(response) {
        this.responseText = response;
        this.notifyObservers();
    }

    // Patrón observador para notificar cambios a los ViewModel
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
