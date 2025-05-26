/**
 * notification-manager.js - Gestor simplificado de consentimiento y notificaciones
 * 
 * Gestiona únicamente el flujo de consentimiento inicial y actúa como puente
 * para las notificaciones de ayuda que son manejadas por ana-help-button.js
 */

class NotificationManager {
  constructor() {
    this.consentShown = false;
    
    // Comprobar estado almacenado
    this.checkStoredState();
    
    // Inicializar después que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeNotifications();
    });  }

  checkStoredState() {
    // Comprobar si ya se mostró el diálogo de consentimiento
    this.consentShown = localStorage.getItem('anaConsentShown') === 'true';
  }

  initializeNotifications() {
    // Solo ejecutar en la página principal
    if (!this.isMainPage()) return;
    
    // No mostrar si hubo interacción reciente con controles
    const recentControlInteraction = sessionStorage.getItem('assistantControlInteraction');
    if (recentControlInteraction && Date.now() - parseInt(recentControlInteraction) < 5000) {
      return;
    }
    
    // Mostrar diálogo de consentimiento si no se ha mostrado antes
    if (!this.consentShown) {
      setTimeout(() => {
        this.showConsentDialog();
      }, 1000);
    }  }

  isMainPage() {
    const currentPath = window.location.pathname.toLowerCase();
    return currentPath.includes('index.html') || 
           currentPath.endsWith('/') || 
           currentPath.endsWith('/public/');  }
  showInitialNotification(callback) {
    // Marcar como mostrado inmediatamente y proceder al callback
    sessionStorage.setItem('anaInitialNotificationShown', 'true');
    this.initialNotificationShown = true;
    
    // Ejecutar callback inmediatamente para mostrar el diálogo de consentimiento
    if (typeof callback === 'function') {
      callback();
    }
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
    }  }

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
      
      // Si el usuario habilitó el asistente, mostrar notificación de ayuda después de un breve retraso
      if (enabled) {
        setTimeout(() => {
          this.showInstructionsNotification();
        }, 1000);
      }
      
      // Despachar un evento para notificar al asistente sobre la decisión
      const event = new CustomEvent('anaConsentDecided', { 
        detail: { enabled }
      });
      document.dispatchEvent(event);    }, 500);
  }

  /**
   * Método puente para mostrar notificación de ayuda/instrucciones
   * Llama al método real que está en ana-help-button.js
   */
  showInstructionsNotification() {
    // Llamar al método real en anaHelpManager
    if (window.anaHelpManager && typeof window.anaHelpManager.showInstructionsNotification === 'function') {
      window.anaHelpManager.showInstructionsNotification();
    } else {
      console.warn('anaHelpManager no disponible, esperando...');
      // Intentar de nuevo después de un breve retraso
      setTimeout(() => {
        if (window.anaHelpManager && typeof window.anaHelpManager.showInstructionsNotification === 'function') {
          window.anaHelpManager.showInstructionsNotification();
        } else {
          console.error('anaHelpManager no pudo ser cargado');
        }
      }, 100);
    }  }

  /**
   * Alias para showInstructionsNotification - usado por assistant.js
   */
  showInstructions() {
    this.showInstructionsNotification();
  }

  /**
   * Método puente para resetear el estado de las notificaciones de ayuda
   * Llama al método real que está en ana-help-button.js
   */
  resetHelpNotification() {
    // Llamar al método real en anaHelpManager
    if (window.anaHelpManager && typeof window.anaHelpManager.resetHelpNotification === 'function') {
      window.anaHelpManager.resetHelpNotification();
    } else {
      console.warn('anaHelpManager no disponible para reset');
      // Fallback: resetear directamente
      sessionStorage.removeItem('anaHelpNotificationShown');
    }
  }
}

// Crear la instancia singleton del gestor de notificaciones
const notificationManager = new NotificationManager();

// Exponer globalmente para que otros scripts puedan usarlo
window.notificationManager = notificationManager;
