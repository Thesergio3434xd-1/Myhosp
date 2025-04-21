/**
 * Ana Control Buttons - Maneja los botones para activar/desactivar el asistente de voz Ana
 */
document.addEventListener('DOMContentLoaded', function() {
    // Botones de control para activar/desactivar Ana
    const enableButton = document.getElementById('enableAssistant');
    const disableButton = document.getElementById('disableAssistant');
    const anaAssistant = document.getElementById('ana-assistant');
    
    // Función para comprobar si el localStorage está disponible
    function isLocalStorageAvailable() {
        try {
            const testKey = '__test_storage__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error('localStorage no está disponible:', e);
            return false;
        }
    }

    // Función para crear cookies como respaldo si localStorage no está disponible
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    // Función para leer cookies
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Función para guardar valores (intenta localStorage primero, luego cookies)
    function saveValue(key, value) {
        try {
            if (isLocalStorageAvailable()) {
                localStorage.setItem(key, value);
            } else {
                setCookie(key, value, 30); // 30 días de duración
            }
            return true;
        } catch (e) {
            console.error('Error al guardar valor:', e);
            return false;
        }
    }

    // Función para obtener valores (intenta localStorage primero, luego cookies)
    function getValue(key, defaultValue = null) {
        try {
            if (isLocalStorageAvailable()) {
                return localStorage.getItem(key);
            } else {
                return getCookie(key);
            }
        } catch (e) {
            console.error('Error al obtener valor:', e);
            return defaultValue;
        }
    }
    
    // Verificar estado actual del asistente y aplicar estilos iniciales
    const anaEnabled = getValue('anaEnabled') === 'true';
    if (!anaEnabled && anaAssistant) {
        anaAssistant.classList.add('disabled');
        
        const micIcon = document.getElementById('micIcon');
        if (micIcon) {
            micIcon.classList.add('disabled');
        }
    }
    
    // Función para mostrar notificación
    function showNotification(message, type = 'info', icon = 'fa-info-circle') {
        // Crear contenedor de notificaciones si no existe
        let container = document.getElementById('assistant-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'assistant-notification-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '10002';
            document.body.appendChild(container);
        }
        
        // Limpiar notificaciones anteriores
        container.innerHTML = '';
        
        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `assistant-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // Forzar reflow para la animación
        notification.offsetHeight;
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Evento para el botón de activar asistente
    if (enableButton) {
        enableButton.addEventListener('click', function() {
            console.log('Activando asistente desde botón de control...');
            saveValue('anaEnabled', 'true');
            saveValue('anaConsentShown', 'true');
            
            // Quitar estado deshabilitado
            if (anaAssistant) {
                anaAssistant.classList.remove('disabled');
                
                const micIcon = document.getElementById('micIcon');
                if (micIcon) {
                    micIcon.classList.remove('disabled');
                }
            }
            
            // Mostrar notificación de activación
            showNotification('Asistente de voz activado en todas las páginas', 'success', 'fa-check-circle');
            
            // Recargar la página para inicializar Ana correctamente
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
    
    // Evento para el botón de desactivar asistente
    if (disableButton) {
        disableButton.addEventListener('click', function() {
            console.log('Desactivando asistente desde botón de control...');
            saveValue('anaEnabled', 'false');
            saveValue('anaConsentShown', 'true');
            
            // Aplicar estado deshabilitado
            if (anaAssistant) {
                anaAssistant.classList.add('disabled');
                
                const micIcon = document.getElementById('micIcon');
                if (micIcon) {
                    micIcon.classList.add('disabled');
                }
            }
            
            // Mostrar notificación de desactivación
            showNotification('Asistente de voz desactivado en todas las páginas', 'info', 'fa-microphone-slash');
            
            // Recargar la página para aplicar los cambios correctamente
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
});