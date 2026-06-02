const BASE_URL = import.meta.env.VITE_API_URL;


/**
 * FUNCIÓN INTERNA PARA MANEJAR RESPUESTAS MIXTAS (JSON O TEXTO)
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en la petición");
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    const text = await response.text();
    return { message: text };
  }
}

// --- AUTENTICACIÓN ---

export async function login(email: any, password: any) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, { // ✅ FIX
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

// --- FUNCIONES DE OBTENCIÓN (GET) ---

export async function fetchIngresos(token: string) {
  const response = await fetch(`${BASE_URL}/api/ingresos`, { // ✅ FIX
   // headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function fetchGastos(token: string) {
  const response = await fetch(`${BASE_URL}/api/gastos`, { // ✅ FIX
   // headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function fetchHistorial(token: string) {
  const response = await fetch(`${BASE_URL}/api/gastos/historial`, { // ✅ FIX
  //  headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function fetchBalance(token: string) {
  const response = await fetch(`${BASE_URL}/api/gastos/balance`, { // ✅ FIX
   // headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

// --- FUNCIONES DE GUARDADO (POST) ---

export async function saveIngreso(ingreso: any, token: string) {
  const response = await fetch(`${BASE_URL}/api/ingresos`, { // ✅ FIX
    method: "POST",
    headers: {
      "Content-Type": "application/json",
     // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(ingreso),
  });

  return handleResponse(response);
}

export async function saveGasto(gasto: any, token: string) {
  const response = await fetch(`${BASE_URL}/api/gastos`, { // ✅ FIX
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    //  "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(gasto),
  });

  return handleResponse(response);
}
export async function updateGasto(id: number, gasto: any) {
  const response = await fetch(
    `${BASE_URL}/api/gastos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gasto)
    }
  );

  return handleResponse(response);
}
export async function deleteGasto(id: number) {
  const response = await fetch(
    `${BASE_URL}/api/gastos/${id}`,
    {
      method: "DELETE"
    }
  );

  return handleResponse(response);
}
export async function updateIngreso(id: number, ingreso: any) {
  const response = await fetch(
    `${BASE_URL}/api/ingresos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ingreso)
    }
  );

  return handleResponse(response);
}

export async function deleteIngreso(id: number) {
  const response = await fetch(
    `${BASE_URL}/api/ingresos/${id}`,
    {
      method: "DELETE"
    }
  );

  return handleResponse(response);
}