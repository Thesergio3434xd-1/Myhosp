/**
 * ANA Help Manager - Versión Avanzada
 * Sistema de ayuda mejorado para el asistente de voz ANA
 * Incluye analíticas, seguimiento de sesión, y diseño multi-tab
 */

class AdvancedAnaHelpManager {
    constructor() {
        this.isInitialized = false;
        this.analytics = {
            sessionId: this.generateSessionId(),
            viewCount: 0,
            interactionEvents: [],
            startTime: Date.now()
        };
        this.config = {
            modalId: 'anaAdvancedHelpModal',
            enableAnalytics: true,
            enableSessionTracking: true,
            autoShowWelcome: false,
            debugMode: false
        };
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        if (this.isInitialized) return;
        
        this.createAdvancedModal();
        this.attachEventListeners();
        this.loadSessionData();
        this.isInitialized = true;
        
        if (this.config.debugMode) {
            console.log('Advanced ANA Help Manager initialized');
        }
    }

    createAdvancedModal() {
        const modalHTML = `
        <div class="modal fade" id="${this.config.modalId}" tabindex="-1" role="dialog" aria-labelledby="anaAdvancedHelpModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h4 class="modal-title" id="anaAdvancedHelpModalLabel">
                            <i class="fas fa-robot me-2"></i>
                            Guía Completa del Asistente ANA
                            <small class="ms-2 opacity-75">v2.0</small>
                        </h4>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Nav tabs -->
                        <ul class="nav nav-pills nav-fill mb-4" id="anaHelpTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="quick-start-tab" data-bs-toggle="pill" data-bs-target="#quick-start" type="button" role="tab">
                                    <i class="fas fa-rocket me-1"></i>Inicio Rápido
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="features-tab" data-bs-toggle="pill" data-bs-target="#features" type="button" role="tab">
                                    <i class="fas fa-cogs me-1"></i>Características
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="examples-tab" data-bs-toggle="pill" data-bs-target="#examples" type="button" role="tab">
                                    <i class="fas fa-lightbulb me-1"></i>Ejemplos
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="troubleshooting-tab" data-bs-toggle="pill" data-bs-target="#troubleshooting" type="button" role="tab">
                                    <i class="fas fa-tools me-1"></i>Solución de Problemas
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="settings-tab" data-bs-toggle="pill" data-bs-target="#settings" type="button" role="tab">
                                    <i class="fas fa-sliders-h me-1"></i>Configuración
                                </button>
                            </li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content" id="anaHelpTabContent">
                            <!-- Inicio Rápido -->
                            <div class="tab-pane fade show active" id="quick-start" role="tabpanel">
                                <div class="row">
                                    <div class="col-md-8">
                                        <h5><i class="fas fa-play-circle text-success me-2"></i>¿Cómo activar a ANA?</h5>
                                        <div class="alert alert-info">
                                            <strong>3 formas fáciles de activar el asistente:</strong>
                                        </div>
                                        <div class="row mb-4">
                                            <div class="col-md-4 text-center mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <i class="fas fa-bell fa-2x text-primary mb-2"></i>
                                                        <h6>Notificación Principal</h6>
                                                        <p class="small">Haz clic en la notificación que aparece al cargar la página</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 text-center mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <i class="fas fa-question-circle fa-2x text-success mb-2"></i>
                                                        <h6>Botón de Ayuda</h6>
                                                        <p class="small">Presiona el botón de ayuda en cualquier momento</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 text-center mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <i class="fas fa-microphone fa-2x text-warning mb-2"></i>
                                                        <h6>Comando de Voz</h6>
                                                        <p class="small">Di "Hola ANA" para activar por voz</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card bg-light">
                                            <div class="card-header">
                                                <i class="fas fa-info-circle me-1"></i>Consejos Rápidos
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Habla claro y pausado</li>
                                                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Permite acceso al micrófono</li>
                                                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Usa comandos específicos</li>
                                                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Espera la respuesta completa</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Características -->
                            <div class="tab-pane fade" id="features" role="tabpanel">
                                <h5><i class="fas fa-star text-warning me-2"></i>Capacidades de ANA</h5>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <div class="card border-primary">
                                            <div class="card-header bg-primary text-white">
                                                <i class="fas fa-hospital me-2"></i>Información Hospitalaria
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    <li><i class="fas fa-dot-circle text-primary me-2"></i>Servicios disponibles</li>
                                                    <li><i class="fas fa-dot-circle text-primary me-2"></i>Ubicación de departamentos</li>
                                                    <li><i class="fas fa-dot-circle text-primary me-2"></i>Horarios de atención</li>
                                                    <li><i class="fas fa-dot-circle text-primary me-2"></i>Procedimientos médicos</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <div class="card border-success">
                                            <div class="card-header bg-success text-white">
                                                <i class="fas fa-calendar-check me-2"></i>Gestión de Citas
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    <li><i class="fas fa-dot-circle text-success me-2"></i>Agendar citas médicas</li>
                                                    <li><i class="fas fa-dot-circle text-success me-2"></i>Consultar disponibilidad</li>
                                                    <li><i class="fas fa-dot-circle text-success me-2"></i>Recordatorios de citas</li>
                                                    <li><i class="fas fa-dot-circle text-success me-2"></i>Cancelar o reprogramar</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <div class="card border-info">
                                            <div class="card-header bg-info text-white">
                                                <i class="fas fa-user-md me-2"></i>Información Médica
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    <li><i class="fas fa-dot-circle text-info me-2"></i>Consultas sobre síntomas</li>
                                                    <li><i class="fas fa-dot-circle text-info me-2"></i>Información de especialistas</li>
                                                    <li><i class="fas fa-dot-circle text-info me-2"></i>Preparación para exámenes</li>
                                                    <li><i class="fas fa-dot-circle text-info me-2"></i>Cuidados post-operatorios</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <div class="card border-warning">
                                            <div class="card-header bg-warning text-dark">
                                                <i class="fas fa-phone me-2"></i>Contacto y Emergencias
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-unstyled">
                                                    <li><i class="fas fa-dot-circle text-warning me-2"></i>Números de emergencia</li>
                                                    <li><i class="fas fa-dot-circle text-warning me-2"></i>Contacto directo</li>
                                                    <li><i class="fas fa-dot-circle text-warning me-2"></i>Ubicación del hospital</li>
                                                    <li><i class="fas fa-dot-circle text-warning me-2"></i>Transporte y acceso</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Ejemplos -->
                            <div class="tab-pane fade" id="examples" role="tabpanel">
                                <h5><i class="fas fa-comments text-primary me-2"></i>Ejemplos de Comandos</h5>
                                <div class="accordion" id="examplesAccordion">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="basicCommands">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBasic">
                                                <i class="fas fa-volume-up me-2"></i>Comandos Básicos
                                            </button>
                                        </h2>
                                        <div id="collapseBasic" class="accordion-collapse collapse show" data-bs-parent="#examplesAccordion">
                                            <div class="accordion-body">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <h6 class="text-success">Ejemplos correctos:</h6>
                                                        <ul class="list-group list-group-flush">
                                                            <li class="list-group-item">"¿Dónde está el servicio de cardiología?"</li>
                                                            <li class="list-group-item">"Quiero agendar una cita"</li>
                                                            <li class="list-group-item">"¿Cuáles son los horarios de visita?"</li>
                                                            <li class="list-group-item">"¿Hay especialistas en neurología?"</li>
                                                        </ul>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <h6 class="text-danger">Evita decir:</h6>
                                                        <ul class="list-group list-group-flush">
                                                            <li class="list-group-item text-muted">"Eh... ¿dónde está...?"</li>
                                                            <li class="list-group-item text-muted">"Necesito algo para..."</li>
                                                            <li class="list-group-item text-muted">"¿Tienen esa cosa de...?"</li>
                                                            <li class="list-group-item text-muted">"No sé qué quiero"</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="appointmentCommands">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAppointments">
                                                <i class="fas fa-calendar-plus me-2"></i>Comandos para Citas
                                            </button>
                                        </h2>
                                        <div id="collapseAppointments" class="accordion-collapse collapse" data-bs-parent="#examplesAccordion">
                                            <div class="accordion-body">
                                                <div class="alert alert-info">
                                                    <strong>Proceso paso a paso para agendar citas:</strong>
                                                </div>
                                                <ol class="list-group list-group-numbered">
                                                    <li class="list-group-item">"Quiero agendar una cita con cardiología"</li>
                                                    <li class="list-group-item">"Necesito una cita para la próxima semana"</li>
                                                    <li class="list-group-item">"¿Qué especialistas tienen disponibilidad?"</li>
                                                    <li class="list-group-item">"Confirma mi cita para el viernes"</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Solución de Problemas -->
                            <div class="tab-pane fade" id="troubleshooting" role="tabpanel">
                                <h5><i class="fas fa-wrench text-danger me-2"></i>Solución de Problemas</h5>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="accordion" id="troubleshootingAccordion">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="microphoneIssues">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMicrophone">
                                                        <i class="fas fa-microphone-slash text-danger me-2"></i>Problemas con el Micrófono
                                                    </button>
                                                </h2>
                                                <div id="collapseMicrophone" class="accordion-collapse collapse show" data-bs-parent="#troubleshootingAccordion">
                                                    <div class="accordion-body">
                                                        <div class="alert alert-warning">
                                                            <strong>Si ANA no escucha tu voz:</strong>
                                                        </div>
                                                        <ol class="list-group list-group-numbered">
                                                            <li class="list-group-item">
                                                                <strong>Verifica permisos:</strong>
                                                                <ul class="mt-2">
                                                                    <li>Busca el ícono del micrófono en la barra de direcciones</li>
                                                                    <li>Haz clic y selecciona "Permitir"</li>
                                                                    <li>Recarga la página después de dar permisos</li>
                                                                </ul>
                                                            </li>
                                                            <li class="list-group-item">
                                                                <strong>Revisa tu navegador:</strong>
                                                                <ul class="mt-2">
                                                                    <li>Chrome/Edge: Configuración > Privacidad > Configuración de sitio</li>
                                                                    <li>Firefox: Herramientas > Opciones > Privacidad y seguridad</li>
                                                                </ul>
                                                            </li>
                                                            <li class="list-group-item">
                                                                <strong>Prueba tu micrófono:</strong>
                                                                <p class="mt-2 mb-0">Usa la grabadora de Windows o una aplicación de prueba para verificar que funciona correctamente</p>
                                                            </li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="recognitionIssues">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRecognition">
                                                        <i class="fas fa-volume-mute text-warning me-2"></i>ANA no entiende lo que digo
                                                    </button>
                                                </h2>
                                                <div id="collapseRecognition" class="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                                                    <div class="accordion-body">
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <h6 class="text-success">Mejores prácticas:</h6>
                                                                <ul class="list-group list-group-flush">
                                                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i>Habla despacio y claro</li>
                                                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i>Usa frases completas</li>
                                                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i>Evita ruido de fondo</li>
                                                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i>Mantén distancia adecuada del micrófono</li>
                                                                </ul>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <div class="alert alert-info">
                                                                    <h6><i class="fas fa-lightbulb me-2"></i>Consejo</h6>
                                                                    <p class="mb-0">Si ANA no entiende, intenta reformular tu pregunta usando palabras más simples y directas.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="compatibilityIssues">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCompatibility">
                                                        <i class="fas fa-browser text-info me-2"></i>Problemas de Compatibilidad
                                                    </button>
                                                </h2>
                                                <div id="collapseCompatibility" class="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                                                    <div class="accordion-body">
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <h6 class="text-success">Navegadores Compatibles:</h6>
                                                                <ul class="list-group">
                                                                    <li class="list-group-item list-group-item-success">
                                                                        <i class="fab fa-chrome me-2"></i>Google Chrome (recomendado)
                                                                    </li>
                                                                    <li class="list-group-item list-group-item-success">
                                                                        <i class="fab fa-edge me-2"></i>Microsoft Edge
                                                                    </li>
                                                                    <li class="list-group-item list-group-item-warning">
                                                                        <i class="fab fa-firefox me-2"></i>Firefox (funcionalidad limitada)
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <h6 class="text-danger">No Compatible:</h6>
                                                                <ul class="list-group">
                                                                    <li class="list-group-item list-group-item-danger">
                                                                        <i class="fab fa-internet-explorer me-2"></i>Internet Explorer
                                                                    </li>
                                                                    <li class="list-group-item list-group-item-danger">
                                                                        <i class="fas fa-mobile-alt me-2"></i>Navegadores móviles antiguos
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Configuración -->
                            <div class="tab-pane fade" id="settings" role="tabpanel">
                                <h5><i class="fas fa-cog text-secondary me-2"></i>Configuración Avanzada</h5>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="card">
                                            <div class="card-header">
                                                <i class="fas fa-sliders-h me-2"></i>Preferencias del Usuario
                                            </div>
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Activación Automática</label>
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" id="autoActivationSwitch">
                                                        <label class="form-check-label" for="autoActivationSwitch">
                                                            Activar ANA automáticamente al cargar la página
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Notificaciones de Ayuda</label>
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" id="helpNotificationsSwitch" checked>
                                                        <label class="form-check-label" for="helpNotificationsSwitch">
                                                            Mostrar notificaciones de ayuda una vez por sesión
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="languageSelect" class="form-label">Idioma del Reconocimiento</label>
                                                    <select class="form-select" id="languageSelect">
                                                        <option value="es-ES" selected>Español (España)</option>
                                                        <option value="es-MX">Español (México)</option>
                                                        <option value="es-AR">Español (Argentina)</option>
                                                        <option value="en-US">English (US)</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="sensitivityRange" class="form-label">Sensibilidad del Micrófono</label>
                                                    <input type="range" class="form-range" min="1" max="10" value="5" id="sensitivityRange">
                                                    <div class="d-flex justify-content-between">
                                                        <small>Baja</small>
                                                        <small>Alta</small>
                                                    </div>
                                                </div>
                                                <button type="button" class="btn btn-primary" id="saveSettingsBtn">
                                                    <i class="fas fa-save me-2"></i>Guardar Configuración
                                                </button>
                                                <button type="button" class="btn btn-outline-secondary ms-2" id="resetSettingsBtn">
                                                    <i class="fas fa-undo me-2"></i>Restaurar Valores por Defecto
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card bg-light">
                                            <div class="card-header">
                                                <i class="fas fa-chart-bar me-2"></i>Estadísticas de Uso
                                            </div>
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <small class="text-muted">Sesión Actual:</small>
                                                    <div class="fw-bold" id="sessionStatsTime">00:00</div>
                                                </div>
                                                <div class="mb-3">
                                                    <small class="text-muted">Veces que abriste la ayuda:</small>
                                                    <div class="fw-bold" id="sessionStatsViews">0</div>
                                                </div>
                                                <div class="mb-3">
                                                    <small class="text-muted">Interacciones:</small>
                                                    <div class="fw-bold" id="sessionStatsInteractions">0</div>
                                                </div>
                                                <hr>
                                                <button type="button" class="btn btn-sm btn-outline-primary w-100" id="exportStatsBtn">
                                                    <i class="fas fa-download me-1"></i>Exportar Datos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex justify-content-between w-100">
                            <div class="text-muted small">
                                <i class="fas fa-info-circle me-1"></i>
                                Sesión: <span id="sessionIdDisplay">cargando...</span>
                            </div>
                            <div>
                                <button type="button" class="btn btn-outline-secondary me-2" id="printHelpBtn">
                                    <i class="fas fa-print me-1"></i>Imprimir
                                </button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                                    <i class="fas fa-check me-1"></i>¡Perfecto, ya entendí!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        // Remover modal existente si existe
        const existingModal = document.getElementById(this.config.modalId);
        if (existingModal) {
            existingModal.remove();
        }

        // Insertar nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        // Event listener para cuando se oculta el modal
        modal.addEventListener('hidden.bs.modal', () => {
            this.trackEvent('modal_closed');
            this.saveSessionData();
            // Disparar evento personalizado para mantener compatibilidad
            window.dispatchEvent(new CustomEvent('anaInstructionsClosed'));
        });

        // Event listener para cuando se muestra el modal
        modal.addEventListener('shown.bs.modal', () => {
            this.analytics.viewCount++;
            this.trackEvent('modal_opened');
            this.updateSessionStats();
            this.updateSessionDisplay();
        });

        // Event listeners para tabs
        const tabButtons = modal.querySelectorAll('[data-bs-toggle="pill"]');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('tab_clicked', { tab: button.getAttribute('data-bs-target') });
            });
        });

        // Event listeners para configuración
        this.attachSettingsListeners();

        // Event listeners para estadísticas
        this.attachStatsListeners();
    }

    attachSettingsListeners() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        // Guardar configuración
        const saveBtn = modal.querySelector('#saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveUserSettings();
                this.showToast('Configuración guardada correctamente', 'success');
            });
        }

        // Restaurar configuración
        const resetBtn = modal.querySelector('#resetSettingsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetUserSettings();
                this.showToast('Configuración restaurada a valores por defecto', 'info');
            });
        }

        // Imprimir ayuda
        const printBtn = modal.querySelector('#printHelpBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printHelp();
                this.trackEvent('help_printed');
            });
        }
    }

    attachStatsListeners() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        // Exportar estadísticas
        const exportBtn = modal.querySelector('#exportStatsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportAnalytics();
                this.trackEvent('stats_exported');
            });
        }

        // Actualizar estadísticas cada 5 segundos mientras el modal está abierto
        this.statsInterval = setInterval(() => {
            if (modal.classList.contains('show')) {
                this.updateSessionStats();
            }
        }, 5000);
    }

    trackEvent(eventName, data = {}) {
        if (!this.config.enableAnalytics) return;

        const event = {
            name: eventName,
            timestamp: Date.now(),
            data: data,
            sessionId: this.analytics.sessionId
        };

        this.analytics.interactionEvents.push(event);

        if (this.config.debugMode) {
            console.log('Event tracked:', event);
        }
    }

    updateSessionStats() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        const timeElement = modal.querySelector('#sessionStatsTime');
        const viewsElement = modal.querySelector('#sessionStatsViews');
        const interactionsElement = modal.querySelector('#sessionStatsInteractions');

        if (timeElement) {
            const sessionTime = Math.floor((Date.now() - this.analytics.startTime) / 1000);
            const minutes = Math.floor(sessionTime / 60);
            const seconds = sessionTime % 60;
            timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        if (viewsElement) {
            viewsElement.textContent = this.analytics.viewCount.toString();
        }

        if (interactionsElement) {
            interactionsElement.textContent = this.analytics.interactionEvents.length.toString();
        }
    }

    updateSessionDisplay() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        const sessionDisplay = modal.querySelector('#sessionIdDisplay');
        if (sessionDisplay) {
            sessionDisplay.textContent = this.analytics.sessionId.substr(-8);
        }
    }

    saveUserSettings() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        const settings = {
            autoActivation: modal.querySelector('#autoActivationSwitch')?.checked || false,
            helpNotifications: modal.querySelector('#helpNotificationsSwitch')?.checked || true,
            language: modal.querySelector('#languageSelect')?.value || 'es-ES',
            sensitivity: modal.querySelector('#sensitivityRange')?.value || 5
        };

        localStorage.setItem('anaAdvancedSettings', JSON.stringify(settings));
        this.trackEvent('settings_saved', settings);
    }

    resetUserSettings() {
        const modal = document.getElementById(this.config.modalId);
        if (!modal) return;

        // Valores por defecto
        const autoSwitch = modal.querySelector('#autoActivationSwitch');
        const helpSwitch = modal.querySelector('#helpNotificationsSwitch');
        const languageSelect = modal.querySelector('#languageSelect');
        const sensitivityRange = modal.querySelector('#sensitivityRange');

        if (autoSwitch) autoSwitch.checked = false;
        if (helpSwitch) helpSwitch.checked = true;
        if (languageSelect) languageSelect.value = 'es-ES';
        if (sensitivityRange) sensitivityRange.value = 5;

        localStorage.removeItem('anaAdvancedSettings');
        this.trackEvent('settings_reset');
    }

    loadUserSettings() {
        const savedSettings = localStorage.getItem('anaAdvancedSettings');
        if (!savedSettings) return;

        try {
            const settings = JSON.parse(savedSettings);
            const modal = document.getElementById(this.config.modalId);
            if (!modal) return;

            const autoSwitch = modal.querySelector('#autoActivationSwitch');
            const helpSwitch = modal.querySelector('#helpNotificationsSwitch');
            const languageSelect = modal.querySelector('#languageSelect');
            const sensitivityRange = modal.querySelector('#sensitivityRange');

            if (autoSwitch) autoSwitch.checked = settings.autoActivation;
            if (helpSwitch) helpSwitch.checked = settings.helpNotifications;
            if (languageSelect) languageSelect.value = settings.language;
            if (sensitivityRange) sensitivityRange.value = settings.sensitivity;

        } catch (error) {
            console.warn('Error loading user settings:', error);
        }
    }

    saveSessionData() {
        if (!this.config.enableSessionTracking) return;

        const sessionData = {
            sessionId: this.analytics.sessionId,
            viewCount: this.analytics.viewCount,
            totalEvents: this.analytics.interactionEvents.length,
            sessionDuration: Date.now() - this.analytics.startTime,
            lastSaved: Date.now()
        };

        sessionStorage.setItem('anaAdvancedSession', JSON.stringify(sessionData));
    }

    loadSessionData() {
        if (!this.config.enableSessionTracking) return;

        const savedSession = sessionStorage.getItem('anaAdvancedSession');
        if (!savedSession) return;

        try {
            const sessionData = JSON.parse(savedSession);
            // Solo restaurar si es la misma sesión (menos de 30 minutos)
            if (sessionData.sessionId && (Date.now() - sessionData.lastSaved) < 1800000) {
                this.analytics.sessionId = sessionData.sessionId;
                this.analytics.viewCount = sessionData.viewCount || 0;
            }
        } catch (error) {
            console.warn('Error loading session data:', error);
        }
    }

    exportAnalytics() {
        const exportData = {
            sessionId: this.analytics.sessionId,
            sessionDuration: Date.now() - this.analytics.startTime,
            viewCount: this.analytics.viewCount,
            events: this.analytics.interactionEvents,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ana-help-analytics-${this.analytics.sessionId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('Datos de analítica exportados correctamente', 'success');
    }

    printHelp() {
        const printWindow = window.open('', '_blank');
        const modal = document.getElementById(this.config.modalId);
        if (!modal || !printWindow) return;

        const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Guía de Ayuda - Asistente ANA</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
            <style>
                @media print {
                    .btn, .modal-footer { display: none; }
                    .tab-content .tab-pane { display: block !important; }
                    .accordion-collapse { display: block !important; }
                }
            </style>
        </head>
        <body class="container py-4">
            <h1 class="text-center mb-4">
                <i class="fas fa-robot text-primary me-2"></i>
                Guía Completa del Asistente ANA
            </h1>
            ${modal.querySelector('.tab-content').outerHTML}
            <footer class="text-center mt-4 text-muted">
                <small>Generado el ${new Date().toLocaleString()} - Sesión: ${this.analytics.sessionId}</small>
            </footer>
        </body>
        </html>`;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    showToast(message, type = 'info') {
        // Crear toast notification
        const toastContainer = document.querySelector('.toast-container') || this.createToastContainer();
        const toastId = 'toast_' + Date.now();
        
        const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();

        // Remover después de que se oculte
        document.getElementById(toastId).addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1080';
        document.body.appendChild(container);
        return container;
    }

    // Métodos públicos para compatibilidad
    showInstructionsNotification() {
        this.show();
    }

    showInstructions() {
        this.show();
    }

    show() {
        const modal = document.getElementById(this.config.modalId);
        if (modal) {
            this.loadUserSettings();
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        }
    }

    hide() {
        const modal = document.getElementById(this.config.modalId);
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
    }

    resetHelpNotification() {
        // Método de compatibilidad - no es necesario en la versión avanzada
        // pero se mantiene para compatibilidad con sistemas existentes
        this.trackEvent('help_notification_reset');
    }

    // Cleanup al destruir
    destroy() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        
        const modal = document.getElementById(this.config.modalId);
        if (modal) {
            modal.remove();
        }

        this.saveSessionData();
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que Bootstrap esté disponible
    if (typeof bootstrap !== 'undefined') {
        window.advancedAnaHelpManager = new AdvancedAnaHelpManager();
        
        // Mantener compatibilidad con el manager básico
        if (!window.anaHelpManager) {
            window.anaHelpManager = window.advancedAnaHelpManager;
        }
    } else {
        console.warn('Bootstrap no está disponible. El Advanced ANA Help Manager requiere Bootstrap 5.');
    }
});

// Compatibilidad con sistemas de módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnaHelpManager;
}