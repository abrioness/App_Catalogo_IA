// Detectar si estamos en Next.js (web) o React Native
const isWeb = typeof window !== 'undefined' && typeof (window as any).localStorage !== 'undefined';

// Helper para obtener SecureStore solo cuando sea necesario (React Native)
// En Next.js, el stub de webpack retornará un objeto vacío
function getSecureStore(): any {
  if (isWeb) {
    return null; // Nunca usar SecureStore en web
  }
  
  try {
    // En React Native, esto funcionará en runtime
    // En Next.js durante el build, el stub evitará errores
    // Usar una verificación dinámica para evitar errores de TypeScript
    const requireFunc = (globalThis as any).require || (window as any).require;
    if (requireFunc) {
      return requireFunc('expo-secure-store');
    }
  } catch (e) {
    // Si no está disponible, retornar null
  }
  
  return null;
}

export async function getToken(): Promise<string | null> {
  try {
    // En Next.js (web), siempre usar localStorage
    if (isWeb) {
      return localStorage.getItem('userToken');
    }
    
    // En React Native, usar SecureStore si está disponible
    const SecureStore = getSecureStore();
    if (SecureStore && SecureStore.getItemAsync) {
      return await SecureStore.getItemAsync('userToken');
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

export async function setToken(token: string) {
  try {
    // En Next.js (web), siempre usar localStorage
    if (isWeb) {
      localStorage.setItem('userToken', token);
      return;
    }
    
    // En React Native, usar SecureStore si está disponible
    const SecureStore = getSecureStore();
    if (SecureStore && SecureStore.setItemAsync) {
      await SecureStore.setItemAsync('userToken', token);
    }
  } catch (e) {
    // noop
  }
}

export async function removeToken() {
  try {
    // En Next.js (web), siempre usar localStorage
    if (isWeb) {
      localStorage.removeItem('userToken');
      return;
    }
    
    // En React Native, usar SecureStore si está disponible
    const SecureStore = getSecureStore();
    if (SecureStore && SecureStore.deleteItemAsync) {
      await SecureStore.deleteItemAsync('userToken');
    }
  } catch (e) {
    // noop
  }
}

