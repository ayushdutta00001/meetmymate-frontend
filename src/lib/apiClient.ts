import { supabase } from '../supabase';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const SUPABASE_FN_URL =
  'https://stvejpshtkqrseriekjv.supabase.co/functions/v1';

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const token = await getAccessToken();

  if (!token) {
    throw new ApiError('Session expired. Please log in again.', 401);
  }

  const res = await fetch(`${SUPABASE_FN_URL}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let json: any = null;

  try {
    json = await res.json();
  } catch {
    // some edge functions return empty body
  }

  if (!res.ok) {
    throw new ApiError(
      json?.error || 'API request failed',
      res.status
    );
  }

  return json;
}
