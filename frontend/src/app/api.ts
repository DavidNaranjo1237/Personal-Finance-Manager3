const BASE_URL = "http://localhost:8080/api";

/**
 * FUNCIÓN INTERNA PARA MANEJAR RESPUESTAS MIXTAS (JSON O TEXTO)
 * Valida si la respuesta es exitosa y maneja el contenido según su tipo.
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    // Lanza un error con el mensaje del backend si la petición falla (4xx o 5xx)
    throw new Error(errorText || "Error en la petición");
  }

  const contentType = response.headers.get("content-type");
  
  // Si el backend devuelve JSON (gracias al cambio en el Controller)
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    // Si el backend envía texto plano, lo devolvemos como objeto para mantener consistencia
    const text = await response.text();
    return { message: text };
  }
}

// --- AUTENTICACIÓN ---

export async function login(email: any, password: any) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

// --- FUNCIONES DE OBTENCIÓN (GET) ---

export async function fetchIngresos(token: string) {
  const response = await fetch(`${BASE_URL}/ingresos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function fetchGastos(token: string) {
  const response = await fetch(`${BASE_URL}/gastos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function fetchHistorial(token: string) {
  // Coincide con @GetMapping("/historial")
  const response = await fetch(`${BASE_URL}/gastos/historial`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function fetchBalance(token: string) {
  // Coincide con @GetMapping("/balance")
  const response = await fetch(`${BASE_URL}/gastos/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

// --- FUNCIONES DE GUARDADO (POST) ---

export async function saveIngreso(ingreso: any, token: string) {
  const response = await fetch(`${BASE_URL}/ingresos`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(ingreso),
  });
  
  return handleResponse(response);
}

export async function saveGasto(gasto: any, token: string) {
  // Coincide con @PostMapping en el GastoController
  const response = await fetch(`${BASE_URL}/gastos`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(gasto),
  });
  
  return handleResponse(response);
}