class Assistant {
  constructor() {
    this.socket = io();
    this.micButton = document.getElementById('micButton');
    this.micIcon = document.getElementById('micIcon');
    this.assistantStatus = document.getElementById('assistantStatus');
    this.anaAssistant = document.getElementById('ana-assistant');
    this.recognition = null;
    this.isListening = false;
    this.isActivated = false;
    this.speechSynthesis = window.speechSynthesis;
    this.activationRecognition = null;
    this.isActivationListening = false;
    // Temporizador de inactividad (3 min)
    this.inactivityTimer = null;
    this.inactivityTimeout = 180000;
    this.isSpeaking = false; // Nueva propiedad para rastrear cuando Ana está hablando
    
    // Identificar el tipo de página en la que estamos
    this.pageType = this.detectPageType();

    // Crear div de notificación en el DOM si estamos en index.html
    if (this.pageType === 'main' && !document.getElementById('assistant-notification-container')) {
      this.createNotificationContainer();
    }

    // Verificar si Ana está habilitada o mostrar diálogo de consentimiento
    // Solo mostrar el diálogo en la página principal, nunca en login/registro
    if (this.pageType === 'main' && !this.checkAnaConsent() && document.getElementById('ana-consent-modal')) {
      this.showAnaConsentDialog();
    } else {
      this.initialize();
    }
  }

  // Método para crear el contenedor de notificaciones
  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'assistant-notification-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '10002';
    document.body.appendChild(container);
  }

  // Comprobar si el usuario ya ha dado consentimiento para Ana
  checkAnaConsent() {
    return localStorage.getItem('anaEnabled') === 'true';
  }

  // Mostrar diálogo de consentimiento para Ana
  showAnaConsentDialog() {
    const consentModal = document.getElementById('ana-consent-modal');
    if (!consentModal) return;

    // Configurar listeners para los botones del diálogo
    const enableButton = document.getElementById('enableAna');
    const disableButton = document.getElementById('disableAna');

    if (enableButton) {
      enableButton.addEventListener('click', () => {
        localStorage.setItem('anaEnabled', 'true');
        
        // Ocultar el modal con animación
        const modalContent = consentModal.querySelector('.ana-consent-modal');
        modalContent.classList.add('hide');
        
        setTimeout(() => {
          consentModal.style.display = 'none';
          // Inicializar el asistente tras aceptar
          this.initialize();
          // Mostrar notificación de activación
          this.showNotification('Asistente de voz activado', 'success', 'fa-check-circle');
        }, 300);
      });
    }

    if (disableButton) {
      disableButton.addEventListener('click', () => {
        localStorage.setItem('anaEnabled', 'false');
        
        // Ocultar el modal con animación
        const modalContent = consentModal.querySelector('.ana-consent-modal');
        modalContent.classList.add('hide');
        
        setTimeout(() => {
          consentModal.style.display = 'none';
          // Inicializar, pero deshabilitar funcionalidad
          this.initializeDisabled();
          // Mostrar notificación de desactivación
          this.showNotification('Asistente de voz desactivado', 'info', 'fa-info-circle');
        }, 300);
      });
    }
  }

  // Método para mostrar notificaciones
  showNotification(message, type = 'info', icon = 'fa-info-circle') {
    // Verificar si estamos en index.html
    if (this.pageType !== 'main') return;
    
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
    
    // Añadir al contenedor o al body si no existe el contenedor
    const container = document.getElementById('assistant-notification-container') || document.body;
    container.appendChild(notification);
    
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

  // Nuevo método para inicializar Ana en modo deshabilitado (visible pero sin funcionalidad)
  initializeDisabled() {
    if (this.anaAssistant) {
      // Aplicar estilo deshabilitado pero mantener visible
      this.anaAssistant.classList.add('disabled');
      
      // Aplicar estilos al icono para que se vea gris
      if (this.micIcon) {
        this.micIcon.classList.add('disabled');
      }
      
      // Solo mostrar mensaje de estado desactivado en la página principal, no en login/registro
      if (this.pageType === 'main') {
        this.updateUI(false, 'Asistente desactivado', false);
      } else {
        // En login/registro solo aplicamos estilos visuales sin mensaje
        this.updateUI(false, '', false);
      }
      
      // Añadir listener para reactivar si el usuario cambia de opinión
      this.micButton.addEventListener('click', () => {
        this.showReactivationDialog();
      });
    }
  }
  
  // Diálogo para reactivar a Ana si el usuario la deshabilitó previamente
  showReactivationDialog() {
    // Comprobar si ya hay un diálogo de reactivación
    let reactivationDialog = document.getElementById('ana-reactivation-dialog');
    
    // Si no existe, crearlo
    if (!reactivationDialog) {
      reactivationDialog = document.createElement('div');
      reactivationDialog.id = 'ana-reactivation-dialog';
      reactivationDialog.className = 'ana-reactivation-dialog';
      reactivationDialog.innerHTML = `
        <div class="reactivation-content">
          <p>¿Deseas activar el asistente de voz Ana?</p>
          <div class="reactivation-buttons">
            <button id="enableAnaReactivate" class="btn btn-primary-custom btn-sm">Sí, activar</button>
            <button id="cancelReactivate" class="btn btn-outline-secondary btn-sm">No</button>
          </div>
        </div>
      `;
      document.body.appendChild(reactivationDialog);
      
      // Eventos para los botones
      document.getElementById('enableAnaReactivate').addEventListener('click', () => {
        localStorage.setItem('anaEnabled', 'true');
        this.anaAssistant.classList.remove('disabled');
        if (this.micIcon) {
          this.micIcon.classList.remove('disabled');
        }
        reactivationDialog.remove();
        this.initialize();
        
        // Mostrar notificación de activación
        this.showNotification('Asistente de voz activado', 'success', 'fa-check-circle');
      });
      
      document.getElementById('cancelReactivate').addEventListener('click', () => {
        reactivationDialog.remove();
      });
      
      // Auto-ocultar después de un tiempo
      setTimeout(() => {
        if (document.body.contains(reactivationDialog)) {
          reactivationDialog.remove();
        }
      }, 5000);
    }
  }

  // Detectar el tipo de página en la que se encuentra el asistente
  detectPageType() {
    const currentPath = window.location.pathname.toLowerCase();
    
    if (currentPath.includes('login.html')) {
      return 'login';
    } else if (currentPath.includes('registro.html')) {
      return 'register';
    } else if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/public/')) {
      return 'main'; // Página principal (index.html o ruta raíz)
    } else {
      return 'other'; // Otras páginas
    }
  }

  initialize() {
    // Si Ana está deshabilitada, inicializarla en modo deshabilitado
    if (localStorage.getItem('anaEnabled') === 'false') {
      this.initializeDisabled();
      return;
    }
    
    // Si está habilitada, quitar cualquier clase de deshabilitado
    if (this.anaAssistant) {
      this.anaAssistant.classList.remove('disabled');
      if (this.micIcon) {
        this.micIcon.classList.remove('disabled');
      }
    }
    
    this.setupSpeechRecognition();
    this.setupActivationRecognition();
    this.setupEventListeners();
    this.setupSocketListeners();
    this.welcomeUser();
  }

  setupSpeechRecognition() {
    // Verificar compatibilidad con reconocimiento de voz
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUI(true, 'Escuchando...', true);
      };

      this.recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Comando recibido:', command);

        // Reiniciar el temporizador de inactividad al recibir un comando
        this.resetInactivityTimer();

        this.updateUI(false, `Procesando: "${command}"`);
        this.processCommand(command);
      };

      this.recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        this.updateUI(false, 'No pude entender. Intenta de nuevo.');
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;

        // Si Ana sigue activada, reanudar escucha automáticamente
        if (this.isActivated) {
          setTimeout(() => {
            this.startListening();
          }, 1000);
        } else {
          setTimeout(() => {
            this.updateUI(false, '', false);
          }, 2000);
        }
      };
    } else {
      console.error('El navegador no soporta reconocimiento de voz');
      this.updateUI(false, 'Tu navegador no soporta reconocimiento de voz');
    }
  }

  setupActivationRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.activationRecognition = new SpeechRecognition();
      this.activationRecognition.lang = 'es-ES';
      this.activationRecognition.continuous = true; // Escucha continua para detectar "Ana"
      this.activationRecognition.interimResults = false;

      this.activationRecognition.onstart = () => {
        this.isActivationListening = true;
        console.log('Escuchando para activar a Ana...');
      };

      this.activationRecognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          console.log('Detectado:', transcript);

          if (transcript.includes('ana')) {
            this.activateAssistant();
            break;
          }
        }
      };

      this.activationRecognition.onerror = (event) => {
        console.error('Error en reconocimiento de activación:', event.error);
        this.isActivationListening = false;

        // Reintentar escucha de activación tras un error
        setTimeout(() => {
          this.startActivationListening();
        }, 2000);
      };

      this.activationRecognition.onend = () => {
        this.isActivationListening = false;
        console.log('Escucha de activación finalizada');

        // Reiniciar si no está activa Ana
        if (!this.isActivated) {
          setTimeout(() => {
            this.startActivationListening();
          }, 500);
        }
      };
    }
  }

  activateAssistant() {
    console.log('Activando a Ana');
    // Detener la escucha de activación
    if (this.activationRecognition) {
      try {
        this.activationRecognition.stop();
      } catch (e) {
        console.error('Error al detener reconocimiento de activación:', e);
      }
    }

    this.isActivated = true;
    
    // Mensajes específicos según la página
    let welcomeMessage = '';
    
    switch (this.pageType) {
      case 'login':
        welcomeMessage = '¿En qué puedo ayudarte? Puedo asistirte con el inicio de sesión o llevarte a la página de registro si aún no tienes cuenta.';
        this.updateUI(true, '¿Necesitas ayuda para iniciar sesión?', true);
        break;
      case 'register':
        welcomeMessage = '¿En qué puedo ayudarte? Puedo asistirte con el registro o llevarte a la página de inicio de sesión si ya tienes cuenta.';
        this.updateUI(true, '¿Necesitas ayuda para crear tu cuenta?', true);
        break;
      default:
        welcomeMessage = 'En qué te puedo ayudar. Puedo llevarte a Inicio, Funcionalidades, Testimonios o Contacto.';
        this.updateUI(true, '¿A dónde quieres ir? (Inicio, Funcionalidades, Testimonios, Contacto)', true);
        break;
    }
    
    this.speak(welcomeMessage);

    // Iniciar el temporizador de inactividad
    this.startInactivityTimer();

    setTimeout(() => {
      this.startListening();
    }, 1000);
  }

  // Método para desactivar a Ana (incluyendo por inactividad)
  deactivateAssistant(reason = '') {
    console.log(`Desactivando asistente. Razón: ${reason || 'comando del usuario'}`);
    // Limpiar el temporizador de inactividad
    this.clearInactivityTimer();

    // Desactivar el asistente
    this.isActivated = false;
    this.stopListening();

    const message = reason === 'inactivity'
      ? 'Me desactivé por inactividad. Di "Ana" para activarme'
      : 'Asistente desactivado';

    this.updateUI(false, message, false);

    const speechText = reason === 'inactivity'
      ? 'Me desactivé por inactividad. Di Ana para activarme.'
      : 'Hasta pronto';

    // Cancelar cualquier síntesis de voz en curso antes de hablar
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
    
    // Marcar visualmente como desactivado y cambiar el icono a gris
    if (this.anaAssistant) {
      this.anaAssistant.classList.add('disabled');
      
      if (this.micIcon) {
        this.micIcon.classList.add('disabled');
      }
      
      // Solo en la landing page mostramos la notificación de desactivación
      // y usamos forzosamente el contenedor de notificaciones que creamos
      if (this.pageType === 'main') {
        localStorage.setItem('anaEnabled', 'false');
        
        const notificationContainer = document.getElementById('assistant-notification-container');
        if (notificationContainer) {
          // Primero, limpiamos cualquier notificación previa
          notificationContainer.innerHTML = '';
          
          // Crear notificación directamente en el contenedor específico
          const notification = document.createElement('div');
          notification.className = 'assistant-notification info';
          notification.innerHTML = `
            <i class="fas fa-microphone-slash"></i>
            <span>Asistente de voz desactivado</span>
          `;
          
          notificationContainer.appendChild(notification);
          
          // Forzar un reflow para asegurar que la animación funcione
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
                notification.remove();
              }
            }, 300);
          }, 3000);
        }
      }
    }

    this.speak(speechText);

    // Reiniciar la escucha para activación
    setTimeout(() => {
      this.startActivationListening();
    }, 1000);
  }

  // Inicia el temporizador de inactividad
  startInactivityTimer() {
    // Limpiar cualquier temporizador existente primero
    this.clearInactivityTimer();

    // Crear nuevo temporizador
    this.inactivityTimer = setTimeout(() => {
      console.log('Desactivando por inactividad');
      if (this.isActivated) {
        this.deactivateAssistant('inactivity');
      }
    }, this.inactivityTimeout);

    console.log('Temporizador de inactividad iniciado');
  }

  // Reinicia el temporizador de inactividad
  resetInactivityTimer() {
    if (this.isActivated) {
      this.startInactivityTimer();
    }
  }

  // Limpia el temporizador de inactividad
  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  setupEventListeners() {
    // Activar/desactivar micrófono al hacer clic
    this.micButton.addEventListener('click', () => {
      if (this.isActivated) {
        // Si ya está activada, desactivarla
        this.deactivateAssistant();
      } else {
        // Si no está activada, activarla
        this.activateAssistant();
      }
    });

    // Modificar el comportamiento del document click para no detener el habla
    // Solo reiniciar el temporizador de inactividad
    document.addEventListener('click', () => {
      // Reiniciar el temporizador de inactividad al interactuar con la página
      this.resetInactivityTimer();
    });
  }

  // Socket listeners para respuestas del servidor  
  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
    });

    this.socket.on('voiceResponse', (response) => {
      console.log('Respuesta del servidor:', response);
      
      // Procesar respuestas específicas para suspensión/desactivación
      if (response.action === 'suspend_temporary') {
        // Solo suspensión temporal
        this.suspendAssistant();
        return;
      } else if (response.action === 'deactivate_complete') {
        // Desactivación completa (modo gris)
        this.deactivateAssistant('user_complete');
        return;
      }
      
      // Procesar respuestas normales
      if (response.text) {
        this.speak(response.text);
      }

      // Navegación entre páginas
      if (response.action === 'navigatePage' && response.target) {
        setTimeout(() => {
          window.location.href = response.target;
        }, 1500);
        return;
      }

      // Navegación dentro de la misma página
      if (response.action === 'navigate' && response.target) {
        setTimeout(() => {
          const targetElement = document.querySelector(response.target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Resaltar la sección
            targetElement.classList.add('highlight-section');
            setTimeout(() => {
              targetElement.classList.remove('highlight-section');
            }, 2000);
          } else {
            console.error(`Elemento no encontrado: ${response.target}`);
          }
        }, 500);
      }
    });
  }

  welcomeUser() {
    setTimeout(() => {
      // Mensaje de bienvenida adaptado según el tipo de página
      let welcomeMessage = '';
      
      switch (this.pageType) {
        case 'login':
          welcomeMessage = 'Hola, soy Ana, tu asistente virtual de MyHosp. Para activarme solo di "Ana" o presiona el botón del micrófono. Puedo ayudarte a iniciar sesión, recuperar tu contraseña o llevarte a la página de registro si aún no tienes cuenta.';
          break;
        case 'register':
          welcomeMessage = 'Hola, soy Ana, tu asistente virtual de MyHosp. Para activarme solo di "Ana" o presiona el botón del micrófono. Puedo ayudarte a completar el formulario de registro o llevarte a la página de inicio de sesión si ya tienes cuenta.';
          break;
        default:
          welcomeMessage = 'Hola, soy Ana, tu asistente virtual de MyHosp. Para activarme solo di "Ana" o presiona el botón del micrófono, y para desactivarme di "Para Ana" o "apágate". Puedo ayudarte a navegar diciendo "llévame a funcionalidades" o "muéstrame testimonios". También puedo leer el contenido de cualquier sección diciendo "lee sección inicio" o "léeme testimonios".';
          break;
      }

      // Mostrar el mensaje completo en el estado del asistente
      this.assistantStatus.textContent = welcomeMessage;
      this.assistantStatus.classList.add('visible');
      this.assistantStatus.classList.add('welcome');
      this.assistantStatus.classList.remove('listening');
      this.assistantStatus.classList.remove('active');

      // Hablar el mensaje de bienvenida
      this.speak(welcomeMessage, true);

      // Calcular duración aproximada del mensaje (1 palabra por 0.3 segundos es una buena aproximación)
      const wordCount = welcomeMessage.split(' ').length;
      const estimatedDuration = Math.max(wordCount * 300, 10000); // Mínimo 10 segundos

      // Iniciar escucha para activación DESPUÉS de terminar el mensaje completo
      setTimeout(() => {
        this.startActivationListening();
        // AHORA sí, actualizar a un mensaje más corto después de la bienvenida completa
        this.updateUI(false, 'Di "Ana" para activarme', false);
      }, estimatedDuration); // Tiempo calculado según longitud del mensaje
    }, 1500);
  }

  startActivationListening() {
    if (this.activationRecognition && !this.isActivated && !this.isActivationListening) {
      try {
        this.activationRecognition.stop(); // Detener la escucha anterior si existe

        setTimeout(() => {
          this.activationRecognition.start();
          this.isActivationListening = true;
          console.log('Escuchando para detectar "Ana"...');
        }, 100);
      } catch (error) {
        console.error('Error al iniciar reconocimiento de activación:', error);
        // Reintentar después de un error
        setTimeout(() => {
          this.startActivationListening();
        }, 2000);
      }
    }
  }

  startListening() {
    // Solo iniciar reconocimiento si Ana NO está hablando
    if (this.recognition && !this.isListening && !this.isSpeaking) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error al iniciar reconocimiento:', error);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  updateUI(isListening, message, isActive = this.isActivated) {
    // Actualizar botón de micrófono
    this.micButton.classList.toggle('listening', isListening);
    this.micButton.classList.toggle('active', isActive);

    // Actualizar icono de micrófono
    this.micIcon.classList.toggle('active', isActive);

    // Actualizar mensaje de estado
    if (message) {
      this.assistantStatus.textContent = message;
      this.assistantStatus.classList.add('visible');
      this.assistantStatus.classList.toggle('listening', isListening);
      this.assistantStatus.classList.toggle('active', isActive);
      this.assistantStatus.classList.toggle('welcome', !isActive && !isListening);
    } else {
      this.assistantStatus.classList.remove('visible');
    }
  }

  processCommand(command) {
    console.log('Procesando comando:', command);

    // Ignorar comandos mientras Ana está hablando
    if (this.isSpeaking) {
      console.log('Ignorando comando mientras Ana está hablando');
      return;
    }

    // Reiniciar el temporizador de inactividad al recibir un comando
    this.resetInactivityTimer();

    // Comprobar comandos de apagado primero - aseguramos reconocer todas las variantes
    if (command.includes('para ana') || command.includes('apágate') ||
      command.includes('adiós ana') || command.includes('adios ana') ||
      command.includes('hasta luego ana') || command.includes('desactivate')) {
      console.log('Comando de apagado detectado:', command);
      this.deactivateAssistant();
      return;
    }

    // Comandos específicos según la página
    switch (this.pageType) {
      case 'login':
        if (this.processLoginCommands(command)) {
          return; // Si se procesó un comando específico de login, terminamos
        }
        break;
      case 'register':
        if (this.processRegisterCommands(command)) {
          return; // Si se procesó un comando específico de registro, terminamos
        }
        break;
    }

    // Si llegamos aquí, procesamos comandos genéricos o navegación
    
    // Mejorar la detección de comandos de lectura
    if (command.includes('lee sección') || command.includes('léeme') ||
      command.includes('leer') || command.includes('leer contenido') ||
      command.match(/lee\s+[a-z]+/) || command.includes('qué dice')) {

      // Mapeo de secciones para la lectura
      const sections = {
        'inicio': '#inicio',
        'funcionalidades': '#funcionalidades',
        'testimonios': '#testimonios',
        'contacto': '#contacto',
        'beneficios': '#beneficios'
      };

      let targetSection = null;

      // Determinar qué sección se quiere leer
      for (const section in sections) {
        if (command.includes(section)) {
          targetSection = section;
          break;
        }
      }

      // Si se encontró una sección válida
      if (targetSection) {
        console.log(`Leyendo sección: ${targetSection}`);
        const sectionElement = document.querySelector(sections[targetSection]);

        if (sectionElement) {
          // Verificar si la sección está visible en el viewport
          const rect = sectionElement.getBoundingClientRect();
          const isInViewport = rect.top >= 0 &&
            rect.top <= window.innerHeight * 0.5 &&
            rect.bottom <= window.innerHeight;

          if (!isInViewport) {
            // Si no está en la sección, navegar primero y después leer
            const navigationMsg = `Llevándote a la sección ${targetSection}`;
            this.speak(navigationMsg, false, () => {
              // Esta función se ejecutará cuando termine de decir el mensaje de navegación

              // Navegar a la sección
              sectionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });

              // Resaltar la sección
              sectionElement.classList.add('highlight-section');
              setTimeout(() => {
                sectionElement.classList.remove('highlight-section');
              }, 2000);

              // Esperar un poco para que termine la navegación
              setTimeout(() => {
                // Extraer y leer el contenido directamente, sin usar el servidor
                const sectionContent = this.extractReadableContent(sectionElement);
                if (sectionContent) {
                  this.speak(`Contenido de la sección ${targetSection}: ${sectionContent}`);
                }
              }, 1000);
            });
          } else {
            // Si ya estamos en la sección, leer directamente
            const sectionContent = this.extractReadableContent(sectionElement);
            if (sectionContent) {
              this.speak(`Contenido de la sección ${targetSection}: ${sectionContent}`);
            }
          }

          return; // Terminar procesamiento del comando
        }
      } else {
        // Si menciona leer pero no especifica qué sección
        this.speak("¿Qué sección te gustaría que leyera? Puedes decir 'lee inicio', 'lee funcionalidades', 'lee testimonios' o 'lee contacto'.");
        return;
      }
    }

    // Verificar si es un comando de navegación primero
    const navigationKeywords = {
      'inicio': '#inicio',
      'funcionalidades': '#funcionalidades',
      'testimonios': '#testimonios',
      'contacto': '#contacto',
      'beneficios': '#beneficios'
    };

    // Primero, intentar navegación directa en cliente para una respuesta más rápida
    let targetSection = null;
    for (const section in navigationKeywords) {
      if (command.toLowerCase().includes(section)) {
        targetSection = navigationKeywords[section];
        console.log(`Detectada navegación a sección: ${section}`);
        break;
      }
    }

    // Si encontramos una sección, navegamos a ella directamente
    if (targetSection) {
      const targetElement = document.querySelector(targetSection);
      if (targetElement) {
        console.log(`Navegando a elemento: ${targetSection}`);
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Añadir efecto de resaltado
        targetElement.classList.add('highlight-section');
        setTimeout(() => {
          targetElement.classList.remove('highlight-section');
        }, 2000);
      }
    }

    // Enviar comando al servidor destacando la sección si es navegación
    if (targetSection) {
      this.socket.emit('voiceCommand', `navegar:${targetSection.substring(1)} ${command}`);
    } else {
      this.socket.emit('voiceCommand', command);
    }
  }

  // Nuevo método para procesar comandos específicos de la página de login
  processLoginCommands(command) {
    // Comando para ayuda con el formulario de login
    if (command.includes('ayuda') || command.includes('qué debo hacer') || 
        command.includes('cómo inicio') || command.includes('cómo puedo iniciar')) {
      this.speak('Para iniciar sesión, debes ingresar tu correo electrónico y contraseña. Si olvidaste tu contraseña, puedes usar el enlace de recuperación debajo del formulario.');
      return true;
    }
    
    // Comando para recuperar contraseña
    if (command.includes('contraseña') && 
        (command.includes('olvidé') || command.includes('olvidada') || command.includes('recuperar') || command.includes('restablecer'))) {
      this.speak('Para recuperar tu contraseña, haz clic en el enlace "¿Olvidaste tu contraseña?" debajo del formulario.');
      
      // Resaltar el enlace visualmente
      const forgotPasswordLink = document.querySelector('.forgot-password');
      if (forgotPasswordLink) {
        forgotPasswordLink.classList.add('highlight-section');
        setTimeout(() => {
          forgotPasswordLink.classList.remove('highlight-section');
        }, 3000);
      }
      return true;
    }
    
    // Comando para ir a registro
    if (command.includes('registrar') || command.includes('crear cuenta') || command.includes('registro') ||
        command.includes('no tengo cuenta')) {
      this.speak('Te llevaré a la página de registro para crear una nueva cuenta.');
      setTimeout(() => {
        window.location.href = 'registro.html';
      }, 1500);
      return true;
    }
    
    // Comando para completar el formulario (simulación)
    if (command.includes('completa') || command.includes('llena') || command.includes('rellena') || 
        (command.includes('formulario') && command.includes('ejemplo'))) {
      this.speak('Voy a completar el formulario con datos de ejemplo para demostrarte cómo funciona.');
      // Esto es solo demostrativo, en producción probablemente no se implementaría
      document.getElementById('email').value = 'usuario@ejemplo.com';
      document.getElementById('password').value = 'Contraseña123';
      return true;
    }
    
    return false; // No se procesó ningún comando específico
  }

  // Nuevo método para procesar comandos específicos de la página de registro
  processRegisterCommands(command) {
    // Comando para ayuda con el formulario de registro
    if (command.includes('ayuda') || command.includes('qué debo hacer') || 
        command.includes('cómo me registro') || command.includes('cómo crear cuenta')) {
      this.speak('Para registrarte, debes completar todos los campos del formulario con tu nombre, apellido, correo electrónico y una contraseña segura. Luego acepta los términos y condiciones y haz clic en el botón Crear cuenta.');
      return true;
    }
    
    // Comando para explicar requisitos de contraseña
    if ((command.includes('contraseña') || command.includes('clave')) && 
        (command.includes('requisitos') || command.includes('cómo debe ser') || command.includes('segura'))) {
      this.speak('Tu contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una minúscula y un número. Esto es importante para la seguridad de tu cuenta.');
      return true;
    }
    
    // Comando para ir a login
    if (command.includes('iniciar sesión') || command.includes('ya tengo cuenta') || command.includes('login')) {
      this.speak('Te llevaré a la página de inicio de sesión.');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return true;
    }
    
    // Comando para términos y condiciones
    if (command.includes('términos') || command.includes('condiciones')) {
      this.speak('Los términos y condiciones describen tus derechos y responsabilidades al usar nuestra plataforma. Es importante que los leas antes de registrarte.');
      // Resaltar el enlace de términos
      const termsLink = document.querySelector('.term-link');
      if (termsLink) {
        termsLink.classList.add('highlight-section');
        setTimeout(() => {
          termsLink.classList.remove('highlight-section');
        }, 3000);
      }
      return true;
    }
    
    return false; // No se procesó ningún comando específico
  }

  // Nuevo método para extraer texto legible de una sección
  extractReadableContent(element) {
    // Extraer títulos importantes
    const titleElements = element.querySelectorAll('h1, h2, h3, h4, h5');

    // Extraemos todos los párrafos y elementos de texto significativos
    const textElements = element.querySelectorAll('p, .card-text, .lead, li');

    let readableText = '';

    // Añadir títulos
    titleElements.forEach(title => {
      if (title.textContent.trim().length > 0) {
        readableText += title.textContent.trim() + '. ';
      }
    });

    // Añadir TODOS los párrafos sin limitación
    textElements.forEach(paragraph => {
      if (paragraph.textContent.trim().length > 0) {
        readableText += paragraph.textContent.trim() + '. ';
      }
    });

    // Si no encontramos suficiente contenido estructurado, extraer todo el texto visible
    if (readableText.length < 30) {
      readableText = element.textContent
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Si aún así no hay contenido
    if (readableText.length < 5) {
      return 'No hay contenido disponible para leer en esta sección.';
    }

    return readableText;
  }

  speak(text, isWelcome = false, onEndCallback = null) {
    if ('speechSynthesis' in window) {
      // Detener cualquier síntesis de voz en curso
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Intentar encontrar una voz femenina en español
      setTimeout(() => {
        const voices = this.speechSynthesis.getVoices();
        const spanishFemaleVoice = voices.find(voice =>
          voice.lang.includes('es') && (voice.name.includes('female') || voice.name.includes('mujer'))
        );
        
        if (spanishFemaleVoice) {
          utterance.voice = spanishFemaleVoice;
        }

        utterance.onstart = () => {
          // Marcar que Ana está hablando
          this.isSpeaking = true;
          
          // Detener el reconocimiento de voz mientras Ana habla
          if (this.isListening) {
            this.stopListening();
          }
          
          // Mostrar el botón de silenciar cuando Ana está hablando
          if (this.muteButton) {
            this.muteButton.style.display = 'flex';
          }
          
          // Reiniciar el temporizador de inactividad cuando Ana está hablando
          this.resetInactivityTimer();

          if (!isWelcome) {
            // Si no es la bienvenida, mostrar "Ana está hablando..."
            this.updateUI(false, 'Ana está hablando...', this.isActivated);
          }
          // Si es la bienvenida, ya se muestra el texto completo
        };

        utterance.onend = () => {
          // Ya no está hablando
          this.isSpeaking = false;
          
          // Ocultar el botón de silenciar cuando Ana termina de hablar
          if (this.muteButton) {
            this.muteButton.style.display = 'none';
          }
          
          // Si hay una función de callback para cuando termine de hablar
          if (onEndCallback && typeof onEndCallback === 'function') {
            onEndCallback();
          }

          setTimeout(() => {
            if (this.isActivated) {
              this.updateUI(true, 'Escuchando...', true);
              // Reiniciar escucha automáticamente después de que Ana termine de hablar
              this.startListening();
            } else if (!isWelcome) {
              this.updateUI(false, '', false);
            }
            // Si es la bienvenida, mantenemos el texto visible
          }, 500);
        };

        this.speechSynthesis.speak(utterance);
      }, 100);
    }
  }
}

// Inicializar el asistente cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  new Assistant();
});
