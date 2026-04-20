const AUTH_BASE = 'https://ca-auth-dev.mangocliff-a81c22ec.germanywestcentral.azurecontainerapps.io';

let _token = null;

export function setToken(token) { _token = token; }
export function getToken() { return _token; }
export function clearToken() { _token = null; }

async function request(method, path, body) {
  const opts = { method, credentials: 'include' };
  opts.headers = {};
  if (_token) opts.headers['Authorization'] = `Bearer ${_token}`;
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(AUTH_BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export async function register({ code, email, firstName, lastName, company, role, systems }) {
  return request('POST', '/auth/register', { code, email, firstName, lastName, company, role, systems });
}

export async function verifyEmail(token) {
  const res = await fetch(`${AUTH_BASE}/auth/verify-email?token=${token}`, { credentials: 'include' });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export async function signIn(email) {
  return request('POST', '/auth/signin', { email });
}

export async function signOut() {
  clearToken();
  return { status: 200, data: { ok: true } };
}

export async function getMe() {
  return request('GET', '/auth/me');
}

export async function updateMe(payload) {
  return request('PATCH', '/auth/me', payload);
}
