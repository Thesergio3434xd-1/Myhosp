/**
 * notification-manager.js - Gestiona la presentación coordinada de notificaciones en el sistema
 * 
 * Este archivo coordina las notificaciones del asistente Ana para evitar
 * que las notificaciones iniciales y los diálogos de consentimiento se muestren simultáneamente
 * y causar una experiencia confusa para el usuario.
 */

class NotificationManager {
  constructor() {
    this.consentShown = false;
    this.initialNotificationShown = false;
    
    // Comprobar estado almacenado
    this.checkStoredState();
    
    // Inicializar después que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeNotifications();
    });
  }
    checkStoredState() {
    // Comprobar si ya se mostró la notificación inicial en esta sesión
    this.initialNotificationShown = sessionStorage.getItem('anaInitialNotificationShown') === 'true' || 
                                  localStorage.getItem('anaInitialNotificationPermanentlyHidden') === 'true';
    
    // Comprobar si ya se mostró el diálogo de consentimiento
    this.consentShown = localStorage.getItem('anaConsentShown') === 'true';
  }
  
  initializeNotifications() {
    // Determinar qué página estamos mostrando
    const isMainPage = this.isMainPage();
    
    // Solo ejecutar en la página principal
    if (!isMainPage) return;
    
    // Si nunca se ha mostrado el consentimiento, mostrar primero la notificación inicial
    if (!this.consentShown && !this.initialNotificationShown) {
      // Mostrar notificación informativa inicial después de un pequeño retraso
      setTimeout(() => {
        this.showInitialNotification(() => {
          // Una vez cerrada la notificación inicial, mostrar diálogo de consentimiento
          setTimeout(() => {
            this.showConsentDialog();
          }, 500);
        });
      }, 2000);
    } 
    // Si ya se mostró notificación inicial pero no consentimiento
    else if (!this.consentShown) {
      // Mostrar solo diálogo de consentimiento
      setTimeout(() => {
        this.showConsentDialog();
      }, 1000);
    }
    // Si ya se ha mostrado todo, no hacer nada
  }
  
  isMainPage() {
    const currentPath = window.location.pathname.toLowerCase();
    return currentPath.includes('index.html') || 
           currentPath.endsWith('/') || 
           currentPath.endsWith('/public/');
  }
  
  showInitialNotification(callback) {
    // Buscar o crear el contenedor de notificaciones
    let notificationContainer = document.getElementById('assistant-notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'assistant-notification-container';
      notificationContainer.style.position = 'fixed';
      notificationContainer.style.top = '20px';
      notificationContainer.style.right = '20px';
      notificationContainer.style.zIndex = '10002';
      document.body.appendChild(notificationContainer);
    }
      // Crear una notificación más completa y estructurada
    const notification = document.createElement('div');
    notification.className = 'ana-initial-notification';
    notification.innerHTML = `
      <div class="initial-notification-header">
          <i class="fas fa-robot"></i>
          <h4>Asistente Virtual Ana</h4>
          <button class="close-notification" aria-label="Cerrar notificación">
              <i class="fas fa-times"></i>
          </button>
      </div>
      <div class="initial-notification-body">
          <p>¡Hola! Soy Ana, tu asistente virtual con reconocimiento de voz que puede ayudarte en tu experiencia con MyHosp.</p>
          
          <div class="instruction-group">
              <div class="instruction-title">Capacidades principales:</div>
              <div class="capability"><i class="fas fa-map-marker-alt"></i> Navegación entre secciones ("Ve a Beneficios")</div>
              <div class="capability"><i class="fas fa-book-reader"></i> Lectura de contenido ("Lee sección Testimonios")</div>
              <div class="capability"><i class="fas fa-question-circle"></i> Respuestas a preguntas frecuentes</div>
          </div>
          
          <div class="instruction-group">
              <div class="instruction-title">Comandos útiles:</div>
              <div class="capability"><i class="fas fa-power-off"></i> "Hey Ana" para activar el asistente</div>
              <div class="capability"><i class="fas fa-volume-mute"></i> "Para Ana" o "Adiós Ana" para desactivar</div>
              <div class="capability"><i class="fas fa-info-circle"></i> "Ayuda" para instrucciones adicionales</div>
          </div>
          
          <p>A continuación te preguntaré si deseas activar el asistente.</p>
      </div>
      <div class="initial-notification-footer">
          <div class="dont-show-again">
              <input type="checkbox" id="dontShowAgain"> 
              <label for="dontShowAgain">No mostrar de nuevo</label>
          </div>
          <button class="btn btn-primary-custom ok-button">Continuar</button>
      </div>
    `;
    
    // Agregar al contenedor
    notificationContainer.appendChild(notification);
    
    // Marcar como mostrado en esta sesión
    sessionStorage.setItem('anaInitialNotificationShown', 'true');
    this.initialNotificationShown = true;
      // Añadir event listeners para manejar interacciones
    const closeButton = notification.querySelector('.close-notification');
    const okButton = notification.querySelector('.ok-button');
    const dontShowCheckbox = notification.querySelector('#dontShowAgain');
    
    const closeNotification = () => {
      // Si el checkbox está marcado, recordar la preferencia permanentemente
      if (dontShowCheckbox && dontShowCheckbox.checked) {
        localStorage.setItem('anaInitialNotificationPermanentlyHidden', 'true');
      }
      
      // Animar cierre
      notification.classList.add('hiding');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
          if (typeof callback === 'function') {
            callback();
          }
        }
      }, 500);
    };
    
    closeButton.addEventListener('click', closeNotification);
    okButton.addEventListener('click', closeNotification);
    
    // Ya no auto-cerramos, esperamos interacción del usuario
  }
  
  showConsentDialog() {
    const consentModal = document.getElementById('ana-consent-modal');
    if (!consentModal) return;
    
    // Mostrar el modal
    consentModal.style.display = 'flex';
    
    // Configurar oyentes para los botones
    const enableButton = document.getElementById('enableAna');
    const disableButton = document.getElementById('disableAna');
    
    if (enableButton) {
      enableButton.addEventListener('click', () => {
        this.handleConsentChoice(true, consentModal);
      });
    }
    
    if (disableButton) {
      disableButton.addEventListener('click', () => {
        this.handleConsentChoice(false, consentModal);
      });
    }
  }
  
  handleConsentChoice(enabled, modal) {
    // Guardar la elección del usuario
    localStorage.setItem('anaEnabled', enabled ? 'true' : 'false');
    localStorage.setItem('anaConsentShown', 'true');
    this.consentShown = true;
    
    // Animar la salida del modal
    const modalContent = modal.querySelector('.ana-consent-modal');
    modalContent.classList.add('hiding');
    modal.classList.add('hiding');
    
    setTimeout(() => {
      modal.style.display = 'none';
      
      // Despachar un evento para notificar al asistente sobre la decisión
      const event = new CustomEvent('anaConsentDecided', { 
        detail: { enabled }
      });
      document.dispatchEvent(event);
    }, 500);
  }
}

// Crear la instancia singleton del gestor de notificaciones
const notificationManager = new NotificationManager();
