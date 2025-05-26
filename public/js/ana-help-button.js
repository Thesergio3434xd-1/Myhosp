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
    // Crear el botón de ayuda lateral
    this.createSideHelpButton();
    
    // Crear el modal de ayuda en el DOM
    this.createHelpModal();
    
    // Configurar el botón de ayuda si existe
    this.setupHelpButton();
  }
  createSideHelpButton() {
    // Verificar si el botón ya existe
    if (document.getElementById('ana-side-help-button')) {
      return;
    }

    // Crear el botón lateral
    const sideButton = document.createElement('button');
    sideButton.id = 'ana-side-help-button';
    sideButton.className = 'ana-help-button entering';
    sideButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    sideButton.setAttribute('aria-label', 'Ayuda del Asistente Ana - Guía completa y comandos');
    sideButton.setAttribute('title', 'Ayuda de Ana - Comandos, ejemplos y configuración');
    
    // Añadir evento click
    sideButton.addEventListener('click', () => {
      this.showInstructionsNotification(true);
    });
    
    // Añadir al body
    document.body.appendChild(sideButton);
    
    // Remover la clase entering después de la animación
    setTimeout(() => {
      sideButton.classList.remove('entering');
    }, 500);
    
    // Agregar efecto de pulso después de 3 segundos para llamar la atención
    setTimeout(() => {
      if (!this.helpNotificationShown) {
        sideButton.classList.add('pulse');
        
        // Remover el pulso después de 6 segundos
        setTimeout(() => {
          sideButton.classList.remove('pulse');
        }, 6000);
      }
    }, 3000);
    
    // Agregar eventos de hover para mejorar la experiencia
    sideButton.addEventListener('mouseenter', () => {
      sideButton.classList.remove('pulse');
    });
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
          <div class="modal-content">            <div class="modal-header" style="background: linear-gradient(135deg, #3B9AB8, #00789E); color: white;">
              <h5 class="modal-title" id="anaHelpModalLabel">
                <i class="fas fa-robot me-2"></i>
                Guía del Asistente Virtual Ana
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>            <div class="modal-body">
              <div class="alert d-flex align-items-center mb-4" style="background-color: rgba(59, 154, 184, 0.1); border: 1px solid #3B9AB8; color: #00789E;" role="alert">
                <i class="fas fa-info-circle me-2" style="color: #3B9AB8;"></i>
                <div>
                  <strong>¡Bienvenido a MyHosp!</strong> Ana es tu asistente virtual inteligente que te ayuda con consultas médicas, navegación del sistema y mucho más.
                </div>
              </div>

              <div class="accordion" id="anaHelpAccordion">                <!-- Cómo activar a Ana -->
                <div class="accordion-item border" style="border-color: #3B9AB8 !important;">
                  <h2 class="accordion-header" id="headingActivate">
                    <button class="accordion-button" style="background-color: rgba(59, 154, 184, 0.05); color: #00789E;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseActivate" aria-expanded="true" aria-controls="collapseActivate">
                      <i class="fas fa-play-circle me-2" style="color: #28a745;"></i>
                      <strong>Cómo activar a Ana</strong>
                    </button>
                  </h2>
                  <div id="collapseActivate" class="accordion-collapse collapse show" aria-labelledby="headingActivate" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6">                          <h6 class="fw-bold mb-2">
                            <i class="fas fa-microphone me-1" style="color: #3B9AB8;"></i>
                            Activación por Voz
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Di <span class="badge" style="background-color: #3B9AB8;">"Hola Ana"</span>
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              O simplemente <span class="badge" style="background-color: #3B9AB8;">"Ana"</span>
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              También <span class="badge" style="background-color: #00789E;">"Hey Ana"</span>
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-6">                          <h6 class="fw-bold mb-2">
                            <i class="fas fa-mouse-pointer me-1" style="color: #28a745;"></i>
                            Activación por Botones
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Botón de micrófono <i class="fas fa-microphone" style="color: #dc3545;"></i>
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Botón "Activar Ana" <i class="fas fa-robot" style="color: #3B9AB8;"></i>
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-chevron-right text-muted me-2"></i>
                              Este botón de ayuda <i class="fas fa-question-circle" style="color: #3B9AB8;"></i>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                <!-- Qué puede hacer Ana -->
                <div class="accordion-item border" style="border-color: #3B9AB8 !important;">
                  <h2 class="accordion-header" id="headingCapabilities">
                    <button class="accordion-button collapsed" style="background-color: rgba(59, 154, 184, 0.05); color: #00789E;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCapabilities" aria-expanded="false" aria-controls="collapseCapabilities">
                      <i class="fas fa-cogs me-2" style="color: #17a2b8;"></i>
                      <strong>¿Qué puede hacer Ana?</strong>
                    </button>
                  </h2>                  <div id="collapseCapabilities" class="accordion-collapse collapse" aria-labelledby="headingCapabilities" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-4">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-user-md me-1" style="color: #28a745;"></i>
                            Consultas Médicas
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Información sobre síntomas comunes
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Orientación médica básica
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Primeros auxilios y emergencias
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Medicamentos y dosis básicas
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Prevención y cuidados
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-4">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-map me-1" style="color: #3B9AB8;"></i>
                            Navegación del Sistema
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Encontrar secciones específicas
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Ayuda con formularios
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Gestión de citas médicas
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Acceso al historial médico
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Configuración del perfil
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-4">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-headset me-1" style="color: #ffc107;"></i>
                            Asistencia General
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Explicación de funciones
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Resolución de dudas
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Lectura de contenido
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Comandos de voz personalizados
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-check me-2" style="color: #28a745;"></i>
                              Soporte 24/7
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                <!-- Ejemplos de preguntas -->
                <div class="accordion-item border" style="border-color: #3B9AB8 !important;">
                  <h2 class="accordion-header" id="headingExamples">
                    <button class="accordion-button collapsed" style="background-color: rgba(59, 154, 184, 0.05); color: #00789E;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExamples" aria-expanded="false" aria-controls="collapseExamples">
                      <i class="fas fa-comments me-2" style="color: #ffc107;"></i>
                      <strong>Ejemplos de comandos y preguntas</strong>
                    </button>
                  </h2>                  <div id="collapseExamples" class="accordion-collapse collapse" aria-labelledby="headingExamples" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-stethoscope me-1" style="color: #dc3545;"></i>
                            Consultas Médicas
                          </h6>
                          <div class="list-group mb-3">
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "¿Qué síntomas tiene la gripe?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "¿Qué hacer en caso de emergencia?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "¿Cuáles son los primeros auxilios para quemaduras?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "¿Cómo puedo prevenir el dolor de espalda?"
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-desktop me-1" style="color: #3B9AB8;"></i>
                            Navegación del Sistema
                          </h6>
                          <div class="list-group mb-3">
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "¿Cómo puedo registrarme como paciente?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "¿Dónde encuentro mi historial médico?"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "Ayúdame a agendar una cita"
                            </div>
                            <div class="list-group-item">
                              <i class="fas fa-question-circle me-2" style="color: #3B9AB8;"></i>
                              "Llévame a la sección de perfil"
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-microphone-alt me-1" style="color: #6f42c1;"></i>
                            Comandos de Voz Especiales
                          </h6>
                          <div class="row">
                            <div class="col-md-6">
                              <div class="list-group">
                                <div class="list-group-item" style="background-color: rgba(59, 154, 184, 0.05);">
                                  <i class="fas fa-volume-up me-2" style="color: #3B9AB8;"></i>
                                  "Lee esta sección"
                                </div>
                                <div class="list-group-item" style="background-color: rgba(59, 154, 184, 0.05);">
                                  <i class="fas fa-stop me-2" style="color: #dc3545;"></i>
                                  "Para de hablar" / "Silencio"
                                </div>
                                <div class="list-group-item" style="background-color: rgba(59, 154, 184, 0.05);">
                                  <i class="fas fa-redo me-2" style="color: #ffc107;"></i>
                                  "Repite eso"
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="list-group">
                                <div class="list-group-item" style="background-color: rgba(59, 154, 184, 0.05);">
                                  <i class="fas fa-home me-2" style="color: #28a745;"></i>
                                  "Ir al inicio"
                                </div>
                                <div class="list-group-item" style="background-color: rgba(59, 154, 184, 0.05);">
                                  <i class="fas fa-question me-2" style="color: #17a2b8;"></i>
                                  "¿Qué puedes hacer?"
                                </div>
                                <div class="list-group-item" style="background-color: rgba(59, 154, 184, 0.05);">
                                  <i class="fas fa-power-off me-2" style="color: #6c757d;"></i>
                                  "Adiós Ana" / "Desactivar"
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                <!-- Consejos importantes -->
                <div class="accordion-item border" style="border-color: #3B9AB8 !important;">
                  <h2 class="accordion-header" id="headingTips">
                    <button class="accordion-button collapsed" style="background-color: rgba(59, 154, 184, 0.05); color: #00789E;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTips" aria-expanded="false" aria-controls="collapseTips">
                      <i class="fas fa-lightbulb me-2" style="color: #ffc107;"></i>
                      <strong>Consejos importantes y configuración</strong>
                    </button>
                  </h2>                  <div id="collapseTips" class="accordion-collapse collapse" aria-labelledby="headingTips" data-bs-parent="#anaHelpAccordion">
                    <div class="accordion-body">
                      <div class="alert" style="background-color: rgba(255, 193, 7, 0.1); border: 1px solid #ffc107; color: #856404;" role="alert">
                        <i class="fas fa-exclamation-triangle me-2" style="color: #ffc107;"></i>
                        <strong>Importante:</strong> Ana proporciona información general y orientación. No sustituye la consulta médica profesional ni el diagnóstico médico.
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-shield-alt me-1" style="color: #28a745;"></i>
                            Privacidad y Seguridad
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-lock me-2" style="color: #28a745;"></i>
                              Tus conversaciones son privadas y seguras
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-user-shield me-2" style="color: #28a745;"></i>
                              No almacenamos información personal sensible
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-microphone-slash me-2" style="color: #28a745;"></i>
                              Micrófono se activa solo cuando lo solicitas
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-cog me-1" style="color: #3B9AB8;"></i>
                            Configuración y Uso
                          </h6>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <i class="fas fa-clock me-2" style="color: #17a2b8;"></i>
                              Disponible 24/7 para ayudarte
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-language me-2" style="color: #3B9AB8;"></i>
                              Habla claramente y en español
                            </li>
                            <li class="mb-2">
                              <i class="fas fa-volume-up me-2" style="color: #3B9AB8;"></i>
                              Ajusta el volumen de tu dispositivo
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="row mt-3">
                        <div class="col-12">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-ambulance me-1" style="color: #dc3545;"></i>
                            En Caso de Emergencia
                          </h6>
                          <div class="alert" style="background-color: rgba(220, 53, 69, 0.1); border: 1px solid #dc3545; color: #721c24;">
                            <div class="d-flex">
                              <i class="fas fa-phone me-3 mt-1" style="color: #dc3545;"></i>
                              <div>
                                <strong>Emergencia médica real:</strong> Contacta inmediatamente los servicios de emergencia (911 o número local de emergencias). Ana puede guiarte en primeros auxilios básicos mientras esperas ayuda profesional.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row mt-3">
                        <div class="col-12">
                          <h6 class="fw-bold mb-3">
                            <i class="fas fa-question-circle me-1" style="color: #6f42c1;"></i>
                            ¿Problemas con Ana?
                          </h6>
                          <div class="list-group">
                            <div class="list-group-item d-flex">
                              <i class="fas fa-microphone-slash me-3 mt-1" style="color: #dc3545;"></i>
                              <div>
                                <strong>No me escucha:</strong> Verifica permisos del micrófono en tu navegador y que esté seleccionado el micrófono correcto.
                              </div>
                            </div>
                            <div class="list-group-item d-flex">
                              <i class="fas fa-volume-mute me-3 mt-1" style="color: #ffc107;"></i>
                              <div>
                                <strong>No la escucho:</strong> Verifica el volumen de tu dispositivo y que los altavoces estén funcionando.
                              </div>
                            </div>
                            <div class="list-group-item d-flex">
                              <i class="fas fa-redo me-3 mt-1" style="color: #3B9AB8;"></i>
                              <div>
                                <strong>Respuestas incorrectas:</strong> Intenta reformular tu pregunta de manera más específica o clara.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>            <div class="modal-footer" style="background-color: rgba(59, 154, 184, 0.05); border-top: 1px solid #3B9AB8;">
              <button type="button" class="btn" style="background-color: #3B9AB8; color: white; border: none;" data-bs-dismiss="modal">
                <i class="fas fa-check me-1"></i>
                ¡Entendido! Vamos a comenzar
              </button>
              <button type="button" class="btn btn-outline-secondary" onclick="anaHelpManager.resetHelpNotification()">
                <i class="fas fa-redo me-1"></i>
                Mostrar de nuevo
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
    
    // Mostrar inmediatamente el modal después del reset
    setTimeout(() => {
      this.showInstructionsNotification(true);
    }, 100);
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
   * Mostrar/ocultar el botón de ayuda lateral
   */
  toggleSideButton(show = true) {
    const button = document.getElementById('ana-side-help-button');
    if (button) {
      if (show) {
        button.classList.remove('hidden');
        button.classList.add('entering');
        setTimeout(() => button.classList.remove('entering'), 500);
      } else {
        button.classList.add('hidden');
      }
    }
  }

  /**
   * Activar/desactivar el botón de ayuda lateral
   */
  toggleSideButtonState(enabled = true) {
    const button = document.getElementById('ana-side-help-button');
    if (button) {
      if (enabled) {
        button.classList.remove('disabled');
        button.removeAttribute('disabled');
      } else {
        button.classList.add('disabled');
        button.setAttribute('disabled', 'disabled');
      }
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
    
    // Remover el botón lateral
    const sideButton = document.getElementById('ana-side-help-button');
    if (sideButton) {
      sideButton.remove();
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
