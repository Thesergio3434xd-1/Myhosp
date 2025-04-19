class Assistant {
  constructor() {
    this.socket = io();
    this.micButton = document.getElementById('micButton');
    this.micIcon = document.getElementById('micIcon');
    this.assistantStatus = document.getElementById('assistantStatus');
    this.recognition = null;
    this.isListening = false;
    this.isActivated = false;
    this.speechSynthesis = window.speechSynthesis;
    this.activationRecognition = null;
    this.isActivationListening = false;
    // Temporizador de inactividad (30 segundos)
    this.inactivityTimer = null;
    this.inactivityTimeout = 30000;

    this.initialize();
  }

  initialize() {
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
    this.updateUI(true, '¿A dónde quieres ir? (Inicio, Funcionalidades, Testimonios, Contacto)', true);
    this.speak('En qué te puedo ayudar. Puedo llevarte a Inicio, Funcionalidades, Testimonios o Contacto.');

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

  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
    });

    this.socket.on('voiceResponse', (response) => {
      if (response.text) {
        this.speak(response.text);
      }

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
      // Mensaje de bienvenida mejorado que incluye instrucciones de uso
      const welcomeMessage = 'Hola, soy Ana, tu asistente virtual de MyHosp. Para activarme solo di "Ana" o presiona el botón del micrófono, y para desactivarme di "Para Ana" o "apágate". Puedo ayudarte a navegar diciendo "llévame a funcionalidades" o "muéstrame testimonios". También puedo leer el contenido de cualquier sección diciendo "lee sección inicio" o "léeme testimonios".';

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
    if (this.recognition && !this.isListening) {
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
