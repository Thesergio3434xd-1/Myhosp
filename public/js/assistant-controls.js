/**
 * assistant-controls.js - Script para manejar los botones de control del asistente de voz
 */
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los botones de control
    const enableButton = document.getElementById('enableAssistant');
    const disableButton = document.getElementById('disableAssistant');
    const assistantElement = document.getElementById('ana-assistant');
    const micIcon = document.getElementById('micIcon');
    
    // Funciones para manejo de almacenamiento (localStorage con fallback a cookies)
    function isLocalStorageAvailable() {
        try {
            const testKey = "__test_storage__";
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error('localStorage no disponible:', e);
            return false;
        }
    }
    
    function saveValue(key, value) {
        try {
            if (isLocalStorageAvailable()) {
                localStorage.setItem(key, value);
            } else {
                setCookie(key, value, 30); // 30 días
            }
            return true;
        } catch (e) {
            console.error('Error al guardar valor:', e);
            return false;
        }
    }
    
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
    
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    
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
    
    // Función para mostrar notificaciones
    function showNotification(message, type = 'info', icon = 'fa-info-circle') {
        // Verificar si existe el contenedor, si no, crearlo
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
        
        // Remover notificaciones anteriores si existen
        const oldNotification = document.querySelector('.assistant-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `assistant-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Añadir al contenedor
        notificationContainer.appendChild(notification);
        
        // Forzar un reflow para que la animación funcione correctamente
        notification.offsetHeight;
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar automáticamente después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Función para activar el asistente
    function enableAssistant() {
        // Guardar estado en localStorage y cookies
        saveValue('anaEnabled', 'true');
        saveValue('anaConsentShown', 'true');
        
        // Aplicar cambios visuales
        if (assistantElement) {
            assistantElement.classList.remove('disabled');
        }
        
        if (micIcon) {
            micIcon.classList.remove('disabled');
        }
        
        // Actualizar estilos de botones
        enableButton.classList.add('active');
        disableButton.classList.remove('active');
        
        // Mostrar notificación
        showNotification('Asistente de voz activado en todas las páginas', 'success', 'fa-check-circle');
        
        // Recargar la página para inicializar el asistente
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }
    
    // Función para desactivar el asistente
    function disableAssistant() {
        console.log('Desactivando asistente de voz...');
        
        // 1. Guardar estado en localStorage y cookies
        saveValue('anaEnabled', 'false');
        saveValue('anaConsentShown', 'true');
        
        // 2. Aplicar cambios visuales inmediatamente
        if (assistantElement) {
            assistantElement.classList.add('disabled');
        }
        
        if (micIcon) {
            micIcon.classList.add('disabled');
        }
        
        // 3. Actualizar estilos de botones
        disableButton.classList.add('active');
        enableButton.classList.remove('active');
        
        // 4. Detener todos los procesos de reconocimiento de voz de forma agresiva
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            try {
                // Detener cualquier instancia global de reconocimiento
                if (window.recognition) {
                    window.recognition.abort();
                }
                if (window.activationRecognition) {
                    window.activationRecognition.abort();
                }
                
                // Detener instancias en el asistente
                if (window.assistantInstance) {
                    console.log('Deteniendo instancia del asistente...');
                    
                    // Abortar reconocimiento principal
                    if (window.assistantInstance.recognition) {
                        window.assistantInstance.recognition.abort();
                        window.assistantInstance.recognition.onend = null;
                        window.assistantInstance.recognition.onresult = null;
                        window.assistantInstance.recognition.onerror = null;
                        window.assistantInstance.recognition = null;
                    }
                    
                    // Abortar reconocimiento de activación
                    if (window.assistantInstance.activationRecognition) {
                        window.assistantInstance.activationRecognition.abort();
                        window.assistantInstance.activationRecognition.onend = null;
                        window.assistantInstance.activationRecognition.onresult = null;
                        window.assistantInstance.activationRecognition.onerror = null;
                        window.assistantInstance.activationRecognition = null;
                    }
                    
                    // Actualizar estados
                    window.assistantInstance.isActivated = false;
                    window.assistantInstance.isListening = false;
                    window.assistantInstance.isActivationListening = false;
                    
                    // Detener síntesis de voz
                    if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                    }
                    
                    if (window.assistantInstance.speechSynthesis) {
                        window.assistantInstance.speechSynthesis.cancel();
                    }
                    
                    // Limpiar temporizadores
                    if (window.assistantInstance.inactivityTimer) {
                        clearTimeout(window.assistantInstance.inactivityTimer);
                        window.assistantInstance.inactivityTimer = null;
                    }
                    
                    // Actualizar UI
                    if (window.assistantInstance.updateUI) {
                        window.assistantInstance.updateUI(false, 'Asistente desactivado', false);
                    }
                    
                    console.log('Asistente detenido completamente');
                }
            } catch (error) {
                console.error('Error al detener procesos del asistente:', error);
            }
        }
        
        // 5. Detener todos los speechSynthesis activos (redundante, pero por seguridad)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        
        // 6. Mostrar notificación
        showNotification('Asistente de voz desactivado en todas las páginas', 'info', 'fa-microphone-slash');
        
        // 7. Como última medida, recargar la página después de un breve retardo
        // Esto garantiza que todos los procesos se detengan completamente
        setTimeout(() => {
            console.log('Recargando página para asegurar detención completa...');
            window.location.reload();
        }, 300);
    }
    
    // Verificar el estado actual y aplicar los estilos iniciales
    const anaEnabled = getValue('anaEnabled') === 'true';
    
    if (anaEnabled) {
        enableButton.classList.add('active');
        disableButton.classList.remove('active');
        
        if (assistantElement) {
            assistantElement.classList.remove('disabled');
        }
        
        if (micIcon) {
            micIcon.classList.remove('disabled');
        }
    } else {
        disableButton.classList.add('active');
        enableButton.classList.remove('active');
        
        if (assistantElement) {
            assistantElement.classList.add('disabled');
        }
        
        if (micIcon) {
            micIcon.classList.add('disabled');
        }
    }
    
    // Configurar eventos para los botones
    if (enableButton) {
        enableButton.addEventListener('click', enableAssistant);
    }
    
    if (disableButton) {
        disableButton.addEventListener('click', disableAssistant);
    }
});