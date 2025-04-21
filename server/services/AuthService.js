/**
 * Servicio de autenticación para manejo de usuarios
 */
class AuthService {
  constructor(io) {
    this.io = io;
    // Simular una base de datos simple para usuarios
    this.users = [];
    // Simular una base de datos para tokens
    this.tokens = {};
  }

  /**
   * Inicializa los eventos de socket para autenticación
   */
  initialize() {
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado a servicio de autenticación');
      
      // Manejar evento de registro
      socket.on('register', (userData) => {
        console.log('Solicitud de registro recibida:', userData.email);
        const result = this.registerUser(userData);
        socket.emit('registerResponse', result);
      });
      
      // Manejar evento de login
      socket.on('login', (loginData) => {
        console.log('Solicitud de login recibida:', loginData.email);
        const result = this.loginUser(loginData);
        socket.emit('loginResponse', result);
      });
      
      // Manejar verificación de tokens
      socket.on('verifyToken', (token) => {
        console.log('Solicitud de verificación de token recibida');
        const result = this.verifyToken(token);
        socket.emit('verifyTokenResponse', result);
      });
      
      // Manejar cierre de sesión
      socket.on('logout', (token) => {
        console.log('Solicitud de cierre de sesión recibida');
        const result = this.logoutUser(token);
        socket.emit('logoutResponse', result);
      });
    });
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   */
  registerUser(userData) {
    try {
      // Validar datos
      if (!userData.nombre || !userData.apellido || !userData.email || !userData.password) {
        return {
          success: false,
          message: 'Todos los campos son requeridos'
        };
      }
      
      // Verificar si el correo ya está registrado
      const existingUser = this.users.find(user => user.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Este correo electrónico ya está registrado'
        };
      }
      
      // En un entorno real, aquí hashearíamos la contraseña
      
      // Crear nuevo usuario con ID único
      const newUser = {
        id: Date.now().toString(),
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        password: userData.password, // En producción, esto debería ser hasheado
        createdAt: new Date()
      };
      
      // Guardar usuario
      this.users.push(newUser);
      
      // Omitir la contraseña en la respuesta
      const { password, ...userWithoutPassword } = newUser;
      
      return {
        success: true,
        message: 'Usuario registrado con éxito',
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  /**
   * Autentica a un usuario
   * @param {Object} loginData - Datos de inicio de sesión
   */
  loginUser(loginData) {
    try {
      // Validar datos
      if (!loginData.email || !loginData.password) {
        return {
          success: false,
          message: 'Correo electrónico y contraseña son requeridos'
        };
      }
      
      // Buscar usuario
      const user = this.users.find(user => user.email === loginData.email);
      if (!user) {
        return {
          success: false,
          message: 'Credenciales incorrectas'
        };
      }
      
      // Verificar contraseña (en un entorno real, compararíamos hashes)
      if (user.password !== loginData.password) {
        return {
          success: false,
          message: 'Credenciales incorrectas'
        };
      }
      
      // Generar token (simulado)
      const token = this.generateToken(user.id);
      
      // Guardar token
      this.tokens[token] = {
        userId: user.id,
        createdAt: new Date()
      };
      
      // Omitir la contraseña en la respuesta
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        token: token,
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  /**
   * Genera un token simple (para fines de demostración)
   * En producción, usaríamos JWT con una clave secreta
   */
  generateToken(userId) {
    return `token-${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Verifica si un token es válido
   * @param {string} token - Token a verificar
   */
  verifyToken(token) {
    try {
      if (!token || !this.tokens[token]) {
        return {
          success: false,
          message: 'Token inválido o expirado'
        };
      }
      
      const tokenData = this.tokens[token];
      const user = this.users.find(user => user.id === tokenData.userId);
      
      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }
      
      // Omitir la contraseña en la respuesta
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        message: 'Token válido',
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Error al verificar token:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  /**
   * Cierra la sesión de un usuario
   * @param {string} token - Token de sesión a invalidar
   */
  logoutUser(token) {
    try {
      if (token && this.tokens[token]) {
        delete this.tokens[token];
      }
      
      return {
        success: true,
        message: 'Sesión cerrada con éxito'
      };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }
}

module.exports = AuthService;
