/**
 * ana-help-button.js - Gestión unificada de notificaciones de ayuda del Asistente Ana
 * 
 * Este archivo centraliza toda la lógica de las notificaciones de ayuda, incluyendo:
 * - Modal Bootstrap con diseño acordeón
 * - Control de sesión para evitar duplicados
 * - Gestión de eventos y limpieza automática
 * - Bridge methods para compatibilidad con notification-manager.js
 */

class AnaHelpManager {
  constructor() {
    this.helpNotificationShown = false;
    this.modalElement = null;
    this.modalInstance = null;
    
    // Verificar estado almacenado
    this.checkStoredState();
    
    // Inicializar después de que el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
      this.initialize();
    });
  }

  checkStoredState() {
    // Verificar si ya se mostró la notificación de ayuda en esta sesión
    this.helpNotificationShown = sessionStorage.getItem('anaHelpNotificationShown') === 'true';
  }

  initialize() {
    // Crear el modal de ayuda en el DOM
    this.createHelpModal();
    
    // Configurar el botón de ayuda si existe
    this.setupHelpButton();
  }

  createHelpModal() {
    // Verificar si el modal ya existe
    if (document.getElementById('ana-help-modal')) {
      return;
    }

    // Crear el modal con Bootstrap y acordeón
    const modalHTML = `
      <div class="modal fade" id="ana-help-modal" tabindex="-1" aria-labelledby="anaHelpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="anaHelpModalLabel">
                <i class="fas fa-robot me-2"></i>
                Guía del Asistente Virtual Ana
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-info d-flex align-items-center mb-4" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                <div>
                  <strong>¡Bienvenido!</strong> Ana es tu asistente virtual para ayudarte con consultas médicas y navegación en el sistema.
                </div>
              </div>

              <div class="accordion" id="anaHelpAccordion">
                <!-- Cómo activar a Ana -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingActivate">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseActivate" aria-expanded="true" aria-controls="collapseActivate">
                      <i class="fas fa-play-circle me-2 text-success"></i>
                      Cómo activar a Ana
                    </button>
                  </h2>
                  <div id="collapseActivate" class="accordion-collapse collapse show" aria-labelledby="headingActivate" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-2">
                            <i class="fas fa-microphone text-primary me-1"></i>
                            Por Voz
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Di <span class="badge bg-primary">"Hola Ana"</span>
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              O <span class="badge bg-primary">"Ana"</span>
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-2">
                            <i class="fas fa-mouse-pointer text-success me-1"></i>
                            Por Botones
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Botón de micrófono <i class="fas fa-microphone text-danger"></i>
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Botón "Activar Ana" <i class="fas fa-robot text-primary"></i>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Qué puede hacer Ana -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingCapabilities">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCapabilities" aria-expanded="false" aria-controls="collapseCapabilities">
                      <i class="fas fa-cogs me-2 text-info"></i>
                      ¿Qué puede hacer Ana?
                    </button>
                  </h2>
                  <div id="collapseCapabilities" class="accordion-collapse collapse" aria-labelledby="headingCapabilities" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-user-md text-success me-1"></i>
                            Consultas Médicas
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-check text-success me-2"></i>
                              Información sobre síntomas
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check text-success me-2"></i>
                              Orientación médica básica
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check text-success me-2"></i>
                              Primeros auxilios
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-map text-primary me-1"></i>
                            Navegación
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-check text-success me-2"></i>
                              Encontrar secciones
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check text-success me-2"></i>
                              Ayuda con formularios
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check text-success me-2"></i>
                              Información del sistema
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ejemplos de preguntas -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingExamples">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExamples" aria-expanded="false" aria-controls="collapseExamples">
                      <i class="fas fa-comments me-2 text-warning"></i>
                      Ejemplos de preguntas
                    </button>
                  </h2>
                  <div id="collapseExamples" class="accordion-collapse collapse" aria-labelledby="headingExamples" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-12">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-quote-left text-muted me-1"></i>
                            Prueba estas preguntas
                          </h6>
                          <div class="list-group">
                            <div class="list-group-item">
                              <i class="fas fa-question-circle text-primary me-2"></i>
                              "¿Qué síntomas tiene la gripe?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle text-primary me-2"></i>
                              "¿Cómo puedo registrarme como paciente?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle text-primary me-2"></i>
                              "¿Dónde encuentro mi historial médico?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle text-primary me-2"></i>
                              "¿Qué hacer en caso de emergencia?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle text-primary me-2"></i>
                              "Ayúdame a navegar por el sistema"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Consejos importantes -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingTips">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTips" aria-expanded="false" aria-controls="collapseTips">
                      <i class="fas fa-lightbulb me-2 text-warning"></i>
                      Consejos importantes
                    </button>
                  </h2>
                  <div id="collapseTips" class="accordion-collapse collapse" aria-labelledby="headingTips" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="alert alert-warning" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Importante:</strong> Ana proporciona información general y no sustituye la consulta médica profesional.
                      </div>
                      <ul class="list-unstyled">
                        <li class="mb-3">
                          <i class="fas fa-shield-alt text-success me-2"></i>
                          <strong>Privacidad:</strong> Tus conversaciones son privadas y seguras
                        </li>
                        <li class="mb-3">
                          <i class="fas fa-clock text-info me-2"></i>
                          <strong>Disponibilidad:</strong> Ana está disponible 24/7 para ayudarte
                        </li>
                        <li class="mb-3">
                          <i class="fas fa-language text-primary me-2"></i>
                          <strong>Idioma:</strong> Habla claramente y en español para mejores resultados
                        </li>
                        <li class="mb-3">
                          <i class="fas fa-hospital text-danger me-2"></i>
                          <strong>Emergencias:</strong> En caso de emergencia real, contacta servicios médicos inmediatos
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                <i class="fas fa-check me-1"></i>
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insertar el modal en el DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Obtener referencia al elemento del modal
    this.modalElement = document.getElementById('ana-help-modal');
    
    // Configurar eventos del modal
    this.setupModalEvents();
  }

  setupModalEvents() {
    if (!this.modalElement) return;

    // Evento cuando el modal se cierra completamente
    this.modalElement.addEventListener('hidden.bs.modal', () => {
      // Marcar como mostrado en esta sesión
      sessionStorage.setItem('anaHelpNotificationShown', 'true');
      this.helpNotificationShown = true;

      // Limpiar la instancia del modal
      if (this.modalInstance) {
        this.modalInstance.dispose();
        this.modalInstance = null;
      }

      // Emitir evento personalizado para que otros componentes sepan que se cerró
      const event = new CustomEvent('anaInstructionsClosed', {
        detail: { timestamp: Date.now() }
      });
      document.dispatchEvent(event);
    });
  }

  setupHelpButton() {
    // Buscar el botón de ayuda en el DOM
    const helpButton = document.querySelector('[data-ana-help]') || 
                      document.querySelector('.ana-help-button') ||
                      document.getElementById('ana-help-button');
    
    if (helpButton) {
      helpButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showInstructionsNotification(true); // true = forzar mostrar
      });
    }
  }

  /**
   * Método principal para mostrar la notificación de ayuda
   * @param {boolean} forceShow - Si es true, muestra el modal aunque ya se haya mostrado
   */
  showInstructionsNotification(forceShow = false) {
    // Si ya se mostró en esta sesión y no se fuerza, no mostrar
    if (this.helpNotificationShown && !forceShow) {
      console.log('Notificación de ayuda ya mostrada en esta sesión');
      return;
    }

    // Verificar que el modal existe
    if (!this.modalElement) {
      console.error('Modal de ayuda no encontrado');
      return;
    }

    try {
      // Crear instancia del modal Bootstrap si no existe
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(this.modalElement, {
          keyboard: true,
          backdrop: true,
          focus: true
        });
      }

      // Mostrar el modal
      this.modalInstance.show();

      console.log('Modal de ayuda mostrado exitosamente');
    } catch (error) {
      console.error('Error al mostrar modal de ayuda:', error);
    }
  }

  /**
   * Alias para compatibilidad con notification-manager
   */
  showInstructions() {
    this.showInstructionsNotification();
  }

  /**
   * Resetear el estado de las notificaciones de ayuda
   */
  resetHelpNotification() {
    sessionStorage.removeItem('anaHelpNotificationShown');
    this.helpNotificationShown = false;
    console.log('Estado de notificación de ayuda reseteado');
  }

  /**
   * Ocultar el modal si está visible
   */
  hideModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /**
   * Destruir el modal y limpiar recursos
   */
  destroy() {
    if (this.modalInstance) {
      this.modalInstance.dispose();
      this.modalInstance = null;
    }
    
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
    
    this.resetHelpNotification();
  }
}

// Crear la instancia global del gestor de ayuda
const anaHelpManager = new AnaHelpManager();

// Exponer globalmente para que notification-manager.js pueda accederlo
window.anaHelpManager = anaHelpManager;

// Exportar para uso como módulo si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnaHelpManager;
}
