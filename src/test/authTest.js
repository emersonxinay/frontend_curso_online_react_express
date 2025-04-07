// Datos de prueba para registro
const testUser = {
  name: "Usuario Prueba",
  email: "test@example.com",
  password: "password123",
  role: "student"
};

// URL del backend
const API_URL = 'http://localhost:5000/api';

// Función para probar el registro
async function testRegister() {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();
    console.log('Registro exitoso:', data);
  } catch (error) {
    console.error('Error en registro:', error);
  }
}

// Función para probar el login
async function testLogin() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const data = await response.json();
    console.log('Login exitoso:', data);
  } catch (error) {
    console.error('Error en login:', error);
  }
}

// Ejecutar pruebas
testRegister();
setTimeout(testLogin, 1000);