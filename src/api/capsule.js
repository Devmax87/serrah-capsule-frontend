import { getToken } from './auth';

const CAPSULE_BASE = 'https://ca-capsule-dev.mangocliff-a81c22ec.germanywestcentral.azurecontainerapps.io';

async function request(method, path, body, isFormData) {
  const token = getToken();
  const opts = { method, credentials: 'include' };
  opts.headers = {};
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;

  if (body && !isFormData) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body) {
    opts.body = body;
  }

  const res = await fetch(CAPSULE_BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export async function getEnvironments() {
  return request('GET', '/environments');
}

export async function uploadJob(file, environmentId) {
  const fd = new FormData();
  fd.append('file', file, file.name);
  fd.append('environment_id', environmentId);
  return request('POST', '/jobs/upload', fd, true);
}

export async function getJob(jobId) {
  return request('GET', `/jobs/${jobId}`);
}

export async function getJobs(limit = 20, offset = 0) {
  return request('GET', `/jobs?limit=${limit}&offset=${offset}`);
}

export async function patchJob(jobId, payload) {
  return request('PATCH', `/jobs/${jobId}`, payload);
}

export function openJobStream(jobId) {
  const token = getToken();
  const url = `${CAPSULE_BASE}/jobs/${jobId}/stream${token ? `?token=${token}` : ''}`;
  return new EventSource(url, { withCredentials: true });
}

export async function healthCheck() {
  return request('GET', '/health');
}
