/**
 * ana-help-button.js - Botón lateral para mostrar información sobre el asistente de voz Ana
 */

document.addEventListener('DOMContentLoaded', function() {
  // Crear el botón de ayuda de Ana
  const helpButton = document.createElement('button');
  helpButton.className = 'ana-help-button';
  helpButton.setAttribute('aria-label', 'Mostrar ayuda del asistente de voz Ana');
  helpButton.innerHTML = '<i class="fas fa-question"></i>';
  
  // Añadir al DOM
  document.body.appendChild(helpButton);
  
  // Añadir evento de clic para mostrar la notificación de ayuda
  helpButton.addEventListener('click', function() {
    showAnaHelpNotification();
  });
  
  // Función para mostrar la notificación de ayuda de Ana
  function showAnaHelpNotification() {
    // Crear el contenedor de notificación si no existe
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
    
    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = 'ana-initial-notification';
    notification.innerHTML = `
      <div class="initial-notification-header">
        <i class="fas fa-robot"></i>
        <h4>Asistente de Voz Ana</h4>
        <button class="close-notification" aria-label="Cerrar notificación">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="initial-notification-body">
        <p>¡Hola! Soy Ana, tu asistente de voz. Puedo ayudarte a navegar por todas las secciones del sitio:</p>
        
        <div class="instruction-group">
          <div class="instruction-title">
            <i class="fas fa-magic"></i> Cómo activarme
          </div>
          <p class="capability"><i class="fas fa-check-circle"></i> Di <strong>"Ana"</strong> para activarme</p>
          <p class="capability"><i class="fas fa-check-circle"></i> También puedes hacer clic en el botón del micrófono</p>
        </div>
        
        <div class="instruction-group">
          <div class="instruction-title">
            <i class="fas fa-map-marked-alt"></i> Navegación por voz
          </div>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Llévame a Inicio"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Muéstrame Nosotros"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Ir a Funcionalidades"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Quiero ver Beneficios"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Vamos a App Móvil"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Muéstrame Testimonios"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Llévame a Contacto"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Quiero Ingresar"</strong></p>
        </div>
        
        <div class="instruction-group">
          <div class="instruction-title">
            <i class="fas fa-book-reader"></i> Leer contenido
          </div>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Lee sección Funcionalidades"</strong></p>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Léeme Beneficios"</strong></p>
        </div>
        
        <div class="instruction-group">
          <div class="instruction-title">
            <i class="fas fa-microphone-slash"></i> Interrumpir mientras hablo
          </div>
          <p class="capability"><i class="fas fa-check-circle"></i> Simplemente <strong>habla en cualquier momento</strong> para interrumpirme</p>
          <p class="capability"><i class="fas fa-check-circle"></i> Puedo escucharte incluso mientras estoy hablando</p>
        </div>
        
        <div class="instruction-group">
          <div class="instruction-title">
            <i class="fas fa-power-off"></i> Desactivarme
          </div>
          <p class="capability"><i class="fas fa-check-circle"></i> <strong>"Para Ana"</strong> o <strong>"Apágate"</strong></p>
        </div>
      </div>
      <div class="initial-notification-footer">
        <button class="btn btn-primary-custom btn-sm ok-button">Entendido</button>
      </div>
    `;
    
    // Añadir la notificación al contenedor
    notificationContainer.appendChild(notification);
    
    // Manejo del botón de cierre
    const closeButton = notification.querySelector('.close-notification');
    const okButton = notification.querySelector('.ok-button');
    
    function closeNotification() {
      notification.style.animation = 'slideOutRight 0.5s forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }
    
    closeButton.addEventListener('click', closeNotification);
    okButton.addEventListener('click', closeNotification);
  }
});
