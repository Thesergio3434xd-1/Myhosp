// Dashboard Mejorado - MyHosp
// Funcionalidades avanzadas para el dashboard

class DashboardManager {
    constructor() {
        this.notifications = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.checkConnectivity();
        this.setupPeriodicUpdates();
        this.initializeWidgets();
    }

    setupEventListeners() {
        // Eventos de conectividad
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));

        // Eventos de teclado para accesibilidad
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Eventos de las cards de estadísticas
        document.querySelectorAll('.stats-card').forEach(card => {
            card.addEventListener('click', this.handleStatsCardClick.bind(this));
        });

        // Evento para el botón de activar ubicación
        const locationBtn = document.querySelector('.btn-warning');
        if (locationBtn && locationBtn.textContent.includes('Activar Ubicación')) {
            locationBtn.addEventListener('click', this.requestLocation.bind(this));
        }
    }

    loadUserPreferences() {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        this.applyLanguage(savedLanguage);
        this.applyTheme(savedTheme);
    }

    checkConnectivity() {
        const statusIndicator = this.createStatusIndicator();
        document.querySelector('.topbar .d-flex').appendChild(statusIndicator);
        this.updateConnectivityStatus();
    }

    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'd-flex align-items-center text-white-50';
        indicator.innerHTML = `
            <span class="status-indicator online me-2"></span>
            <small class="connectivity-status">En línea</small>
        `;
        return indicator;
    }

    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        this.updateConnectivityStatus();
        
        if (isOnline) {
            this.showNotification('Conexión restaurada', 'success');
            this.syncOfflineData();
        } else {
            this.showNotification('Sin conexión a internet', 'warning');
        }
    }

    updateConnectivityStatus() {
        const indicator = document.querySelector('.status-indicator');
        const status = document.querySelector('.connectivity-status');
        
        if (indicator && status) {
            if (this.isOnline) {
                indicator.className = 'status-indicator online me-2';
                status.textContent = 'En línea';
            } else {
                indicator.className = 'status-indicator offline me-2';
                status.textContent = 'Sin conexión';
            }
        }
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + N - Nueva cita
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            window.location.href = 'crear_citas.html';
        }

        // Ctrl/Cmd + H - Ir al inicio
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Escape - Cerrar modales/dropdowns
        if (event.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                bootstrap.Dropdown.getOrCreateInstance(menu.previousElementSibling).hide();
            });
        }
    }

    handleStatsCardClick(event) {
        const card = event.currentTarget;
        const cardText = card.querySelector('h6').textContent;
        
        // Redirigir según el tipo de estadística
        switch (cardText) {
            case 'Citas Completadas':
            case 'Citas Pendientes':
                window.location.href = 'ver_citas.html';
                break;
            case 'Documentos Médicos':
                window.location.href = 'historial_medico.html';
                break;
            case 'Consultas Online':
                window.location.href = 'consultas_online.html';
                break;
        }
    }

    async requestLocation() {
        if (!navigator.geolocation) {
            this.showNotification('La geolocalización no está disponible', 'error');
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });

            const { latitude, longitude } = position.coords;
            localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
            
            this.showNotification('Ubicación activada correctamente', 'success');
            this.updateNearbyLocations(latitude, longitude);
            
        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            this.showNotification('No se pudo obtener la ubicación', 'error');
        }
    }

    updateNearbyLocations(lat, lng) {
        // Simular actualización de ubicaciones cercanas
        const locationContainer = document.querySelector('.location-item').parentElement;
        
        // Agregar indicador de carga
        const loader = document.createElement('div');
        loader.className = 'text-center my-3';
        loader.innerHTML = '<div class="custom-spinner mx-auto"></div>';
        locationContainer.appendChild(loader);

        setTimeout(() => {
            loader.remove();
            this.displayNearbyLocations([
                { name: 'Hospital Metropolitano', distance: '1.2 km', status: 'Abierto 24h', type: 'hospital' },
                { name: 'Centro Médico Norte', distance: '2.8 km', status: 'Cierra 8:00 PM', type: 'clinic' }
            ]);
        }, 2000);
    }

    displayNearbyLocations(locations) {
        const container = document.querySelector('.location-item').parentElement;
        container.innerHTML = ''; // Limpiar ubicaciones anteriores

        locations.forEach(location => {
            const locationElement = document.createElement('div');
            locationElement.className = 'location-item d-flex align-items-center';
            locationElement.innerHTML = `
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                    <i class="bi bi-${location.type === 'hospital' ? 'hospital' : 'building'} text-primary fs-5"></i>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${location.name}</h6>
                    <small class="text-muted d-flex align-items-center">
                        <i class="bi bi-geo-alt me-1"></i>${location.distance} • 
                        <span class="badge bg-success rounded-pill ms-1">${location.status}</span>
                    </small>
                </div>
                <button class="btn btn-sm btn-outline-primary rounded-pill">
                    <i class="bi bi-directions"></i>
                </button>
            `;
            container.appendChild(locationElement);
        });
    }

    setupPeriodicUpdates() {
        // Actualizar notificaciones cada 30 segundos
        setInterval(() => {
            this.updateNotifications();
        }, 30000);

        // Actualizar estadísticas cada 5 minutos
        setInterval(() => {
            this.updateStatistics();
        }, 300000);
    }

    updateNotifications() {
        if (!this.isOnline) return;

        // Simular nuevas notificaciones
        const badge = document.querySelector('.notification-badge');
        if (badge && Math.random() > 0.8) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            
            this.showNotification('Nueva notificación recibida', 'info');
        }
    }

    updateStatistics() {
        if (!this.isOnline) return;

        // Simular actualización de estadísticas
        console.log('Actualizando estadísticas...');
    }

    initializeWidgets() {
        this.initWeatherWidget();
        this.initHealthTips();
    }

    initWeatherWidget() {
        // Widget de clima básico (placeholder)
        const weatherInfo = document.createElement('div');
        weatherInfo.className = 'alert alert-info mt-3';
        weatherInfo.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-sun me-2"></i>
                <div>
                    <small class="fw-bold">Clima actual</small>
                    <div>24°C - Soleado</div>
                </div>
            </div>
        `;
        
        const locationCard = document.querySelector('.col-lg-4 .card-body');
        if (locationCard) {
            locationCard.appendChild(weatherInfo);
        }
    }

    initHealthTips() {
        const tips = [
            "Recuerda tomar al menos 8 vasos de agua al día",
            "Realiza 30 minutos de ejercicio diario",
            "Duerme entre 7-8 horas cada noche",
            "Consume al menos 5 porciones de frutas y verduras",
            "Toma descansos regulares durante el trabajo"
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        const tipAlert = document.createElement('div');
        tipAlert.className = 'alert alert-success fade-in-up mt-4';
        tipAlert.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="bi bi-lightbulb me-2 fs-5"></i>
                <div>
                    <strong>Consejo de salud del día:</strong>
                    <p class="mb-0 mt-1">${randomTip}</p>
                </div>
            </div>
        `;
        
        const mainContainer = document.querySelector('.container-fluid.py-4');
        if (mainContainer) {
            mainContainer.appendChild(tipAlert);
        }
    }

    showNotification(message, type = 'info') {
        // Usar la función showToast existente
        if (typeof showToast === 'function') {
            showToast(message, type);
        }
    }

    applyLanguage(language) {
        // Implementar cambio de idioma
        console.log(`Aplicando idioma: ${language}`);
    }

    applyTheme(theme) {
        // Implementar cambio de tema
        document.body.setAttribute('data-theme', theme);
    }

    syncOfflineData() {
        // Sincronizar datos que se guardaron mientras estaba offline
        console.log('Sincronizando datos offline...');
    }
}

// Inicializar el manager del dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}
