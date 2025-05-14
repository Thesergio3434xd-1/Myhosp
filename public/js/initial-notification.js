/**
 * initial-notification.js - Muestra una notificación al inicio explicando las capacidades del asistente de voz
 */
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para mostrar la notificación después de que la página esté completamente cargada
    setTimeout(() => {
        // Verificar si ya se ha mostrado la notificación en esta sesión
        if (!sessionStorage.getItem('anaInitialNotificationShown')) {
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
            const notification = document.createElement('div');            notification.className = 'ana-initial-notification';
            notification.innerHTML = `
                <div class="initial-notification-header">
                    <i class="fas fa-robot"></i>
                    <h4>Asistente de Voz Ana</h4>
                    <button class="close-notification" aria-label="Cerrar notificación">
                        <i class="fas fa-times"></i>
                    </button>
                </div>                <div class="initial-notification-body">
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
                    <label class="dont-show-again">
                        <input type="checkbox" id="dontShowAgain"> No mostrar de nuevo
                    </label>
                </div>
            `;
            
            // Añadir la notificación al contenedor
            notificationContainer.appendChild(notification);
            
            // Marcar como mostrada en esta sesión
            sessionStorage.setItem('anaInitialNotificationShown', 'true');
            
            // Agregar estilos CSS para la notificación
            const style = document.createElement('style');
            style.textContent = `                .ana-initial-notification {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
                    max-width: 420px; /* Aumentado el ancho máximo */
                    width: 90%;
                    overflow: hidden;
                    animation: slideInRight 0.5s ease-out forwards;
                    margin-bottom: 15px;
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .initial-notification-header {
                    background-color: #3B9AB8;
                    background: linear-gradient(135deg, #3B9AB8, #2980b9);
                    color: white;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .initial-notification-header i.fa-robot {
                    font-size: 20px;
                    margin-right: 10px;
                }

                .initial-notification-header h4 {
                    margin: 0;
                    flex-grow: 1;
                    font-size: 16px;
                    font-weight: 600;
                }

                .close-notification {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                }                .initial-notification-body {
                    padding: 18px;
                    color: #333;
                }

                .initial-notification-body p {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .instruction-group {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 12px;
                    border-left: 4px solid #3B9AB8;
                }
                
                .instruction-title {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #2c3e50;
                    display: flex;
                    align-items: center;
                }
                
                .instruction-title i {
                    margin-right: 8px;
                    color: #3B9AB8;
                }

                .capability {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 8px;
                    background-color: white;
                    padding: 6px 8px;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .capability:last-child {
                    margin-bottom: 0;
                }

                .capability i {
                    color: #4CAF50;
                    margin-right: 8px;
                    font-size: 14px;
                    margin-top: 3px;
                }
                
                .capability strong {
                    color: #1e88e5;
                }

                .initial-notification-footer {
                    border-top: 1px solid #eee;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .dont-show-again {
                    font-size: 12px;
                    color: #777;
                    display: flex;
                    align-items: center;
                }

                .dont-show-again input {
                    margin-right: 5px;
                }

                /* Ajustes responsive */
                @media (max-width: 480px) {
                    .ana-initial-notification {
                        max-width: calc(100% - 40px);
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                    
                    .initial-notification-footer {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .dont-show-again {
                        margin-top: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Manejar eventos de los botones
            const closeButton = notification.querySelector('.close-notification');
            const okButton = notification.querySelector('.ok-button');
            const dontShowCheckbox = notification.querySelector('#dontShowAgain');
            
            function closeNotification() {
                notification.style.animation = 'slideOutRight 0.5s forwards';
                
                // Si se marcó "No mostrar de nuevo", guardar en localStorage
                if (dontShowCheckbox.checked) {
                    localStorage.setItem('anaInitialNotificationDisabled', 'true');
                }
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
            
            // Agregar animación de salida
            const exitAnimation = document.createElement('style');
            exitAnimation.textContent = `
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(exitAnimation);
            
            closeButton.addEventListener('click', closeNotification);
            okButton.addEventListener('click', closeNotification);
        }
    }, 1500); // Mostrar después de 1.5 segundos
});
