/**
 * ana-consent.js - Maneja el diálogo de consentimiento para el asistente Ana
 * Versión con comprobación mejorada para cookies/localStorage
 */
document.addEventListener('DOMContentLoaded', function() {
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

    // Obtener referencia al modal de consentimiento
    const consentModal = document.getElementById('ana-consent-modal');
    
    // Verificar si el modal existe en la página
    if (!consentModal) {
        console.log('Modal de consentimiento no encontrado en esta página');
        return;
    }
    
    // Verificar de manera más robusta si ya se ha mostrado el diálogo antes
    const anaConsentShown = getValue('anaConsentShown') === 'true';
    
    console.log('Estado de consentimiento:', anaConsentShown ? 'Ya mostrado' : 'No mostrado');
    
    // Si ya se mostró antes, ocultar el modal Y verificar el estado de activación
    if (anaConsentShown) {
        consentModal.style.display = 'none';
        
        // También verificamos si Ana está activada o desactivada
        const anaEnabled = getValue('anaEnabled') === 'true';
        console.log('Estado de Ana:', anaEnabled ? 'Activada' : 'Desactivada');
        
        // Si está desactivada, asegurarnos de que se muestre correctamente
        if (!anaEnabled) {
            const assistant = document.getElementById('ana-assistant');
            if (assistant) {
                assistant.classList.add('disabled');
                
                const micIcon = document.getElementById('micIcon');
                if (micIcon) {
                    micIcon.classList.add('disabled');
                }
            }
        }
        
        return;
    }
    
    // Si llegamos aquí, es porque debemos mostrar el modal
    // Forzar un reflow para que la animación funcione correctamente
    consentModal.offsetHeight;
    
    // Mostrar el modal con un pequeño retraso para asegurar que los estilos estén cargados
    setTimeout(() => {
        consentModal.style.display = 'flex';
        console.log('Mostrando modal de consentimiento');
    }, 500);
    
    // Obtener referencias a los botones
    const enableButton = document.getElementById('enableAna');
    const disableButton = document.getElementById('disableAna');
    
    // Configurar evento para el botón de habilitar
    if (enableButton) {
        enableButton.addEventListener('click', function() {
            console.log('Habilitando Ana...');
            saveValue('anaEnabled', 'true');
            saveValue('anaConsentShown', 'true');
            
            // Ocultar modal con animación
            consentModal.classList.add('hiding');
            
            setTimeout(function() {
                consentModal.style.display = 'none';
                consentModal.classList.remove('hiding');
                
                // Crear contenedor de notificaciones si no existe
                let notificationContainer = document.getElementById('assistant-notification-container');
                if (!notificationContainer) {
                    notificationContainer = document.createElement('div');
                    notificationContainer.id = 'assistant-notification-container';
                    notificationContainer.style.position = 'fixed';
                    notificationContainer.style.top = '20px';
                    notificationContainer.style.right = '20px';
                    notificationContainer.style.zIndex = '10002';
                    document.body.appendChild(notificationContainer);
                    console.log('Contenedor de notificaciones creado');
                }
                
                // Notificar al usuario que Ana se ha activado para todas las páginas
                const notification = document.createElement('div');
                notification.className = 'assistant-notification success';
                notification.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Asistente de voz activado en todas las páginas</span>
                `;
                
                notificationContainer.appendChild(notification);
                
                // Forzar reflow para la animación
                notification.offsetHeight;
                
                // Mostrar con animación
                setTimeout(() => {
                    notification.classList.add('show');
                    console.log('Notificación mostrada');
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
                
                // Recargar la página para inicializar Ana
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }, 500);
        });
    }
    
    // Configurar evento para el botón de deshabilitar
    if (disableButton) {
        disableButton.addEventListener('click', function() {
            console.log('Deshabilitando Ana...');
            saveValue('anaEnabled', 'false');
            saveValue('anaConsentShown', 'true');
            
            // Ocultar modal con animación
            consentModal.classList.add('hiding');
            
            setTimeout(function() {
                consentModal.style.display = 'none';
                consentModal.classList.remove('hiding');
                
                // Crear contenedor de notificaciones si no existe
                let notificationContainer = document.getElementById('assistant-notification-container');
                if (!notificationContainer) {
                    notificationContainer = document.createElement('div');
                    notificationContainer.id = 'assistant-notification-container';
                    notificationContainer.style.position = 'fixed';
                    notificationContainer.style.top = '20px';
                    notificationContainer.style.right = '20px';
                    notificationContainer.style.zIndex = '10002';
                    document.body.appendChild(notificationContainer);
                    console.log('Contenedor de notificaciones creado para desactivación');
                }
                
                // Marcar el asistente como deshabilitado visualmente
                const assistant = document.getElementById('ana-assistant');
                if (assistant) {
                    assistant.classList.add('disabled');
                }
                
                // Aplicar estilo gris al icono
                const micIcon = document.getElementById('micIcon');
                if (micIcon) {
                    micIcon.classList.add('disabled');
                }
                
                // Notificar al usuario que Ana se ha desactivado
                const notification = document.createElement('div');
                notification.className = 'assistant-notification info';
                notification.innerHTML = `
                    <i class="fas fa-microphone-slash"></i>
                    <span>Asistente de voz desactivado en todas las páginas</span>
                `;
                
                notificationContainer.appendChild(notification);
                
                // Forzar reflow para la animación
                notification.offsetHeight;
                
                // Mostrar con animación
                setTimeout(() => {
                    notification.classList.add('show');
                    console.log('Notificación de desactivación mostrada');
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
            }, 500);
        });
    }

    // Manejar el clic en el botón de micrófono cuando Ana está deshabilitada
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.addEventListener('click', function() {
            // Solo activar este evento si Ana está deshabilitada
            if (getValue('anaEnabled') === 'false') {
                showReactivationDialog();
            }
        });
    }

    // Función para mostrar el diálogo de reactivación
    function showReactivationDialog() {
        // Verificar si ya existe un diálogo de reactivación
        let reactivationDialog = document.getElementById('ana-reactivation-dialog');
        
        // Si existe, eliminarlo primero para evitar duplicados
        if (reactivationDialog) {
            reactivationDialog.remove();
        }
        
        // Crear el diálogo de reactivación
        reactivationDialog = document.createElement('div');
        reactivationDialog.id = 'ana-reactivation-dialog';
        reactivationDialog.className = 'ana-reactivation-dialog';
        reactivationDialog.innerHTML = `
            <div class="reactivation-content">
                <p>¿Seguro que quieres activar el asistente de voz Ana?</p>
                <div class="reactivation-buttons">
                    <button id="enableAnaReactivate" class="btn btn-primary-custom btn-sm">Sí, activar</button>
                    <button id="cancelReactivate" class="btn btn-outline-secondary btn-sm">No</button>
                </div>
            </div>
        `;
        document.body.appendChild(reactivationDialog);
        
        // Eventos para los botones
        document.getElementById('enableAnaReactivate').addEventListener('click', function() {
            saveValue('anaEnabled', 'true');
            
            // Quitar estilo deshabilitado
            const assistant = document.getElementById('ana-assistant');
            if (assistant) {
                assistant.classList.remove('disabled');
            }
            
            // Quitar estilo gris al icono
            const micIcon = document.getElementById('micIcon');
            if (micIcon) {
                micIcon.classList.remove('disabled');
            }
            
            reactivationDialog.remove();
            
            // Crear contenedor de notificaciones si no existe
            let notificationContainer = document.getElementById('assistant-notification-container');
            if (!notificationContainer) {
                notificationContainer = document.createElement('div');
                notificationContainer.id = 'assistant-notification-container';
                notificationContainer.style.position = 'fixed';
                notificationContainer.style.top = '20px';
                notificationContainer.style.right = '20px';
                notificationContainer.style.zIndex = '10002';
                document.body.appendChild(notificationContainer);
                console.log('Contenedor de notificaciones creado para reactivación');
            }
            
            // Mostrar notificación de activación
            const notification = document.createElement('div');
            notification.className = 'assistant-notification success';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Asistente de voz activado en todas las páginas</span>
            `;
            
            notificationContainer.appendChild(notification);
            
            // Forzar un reflow para que la animación funcione
            notification.offsetHeight;
            
            // Mostrar con animación
            setTimeout(() => {
                notification.classList.add('show');
                console.log('Notificación de reactivación mostrada');
            }, 10);
            
            // Ocultar automáticamente después de 3 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
            
            // Recargar para activar el asistente completamente
            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
        
        document.getElementById('cancelReactivate').addEventListener('click', function() {
            reactivationDialog.remove();
        });
        
        // Auto-ocultar después de un tiempo
        setTimeout(() => {
            if (document.body.contains(reactivationDialog)) {
                reactivationDialog.remove();
            }
        }, 5000);
    }
});