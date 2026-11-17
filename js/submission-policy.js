// Shared by the submission service and its local tests. No visitor data is public.
export const SUBMISSION_COOLDOWN_MS = 10 * 60 * 1000;
export const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function normalizeSubmissionPhone(value) {
  const phone = String(value || '').trim().replace(/[\s.-]/g, '')
    .replace(/^(?:\+212|00212)/, '0');
  if (!/^0[5-7]\d{8}$/.test(phone)) throw new Error('Invalid Moroccan phone number');
  return phone;
}

function hex(value) {
  return Array.from(new TextEncoder().encode(String(value)), byte =>
    byte.toString(16).padStart(2, '0')).join('');
}

export function submissionFingerprintText(collectionName, data) {
  // Hex framing prevents separators inside names/notes from colliding.
  // Dates, status and consent language do not turn a retry into a new request.
  const fields = collectionName === 'donors_volunteers'
    ? ['fullname', 'phone', 'city', 'bloodGroup', 'category', 'subCategory']
    : collectionName === 'team_requests_cloud'
      ? ['teamName', 'category', 'coordinator', 'phone', 'targetBags', 'notes']
      : null;
  if (!fields) throw new Error('Unsupported submission collection');
  return collectionName + '|' + fields.map(field => hex(data[field])).join('|');
}

export async function submissionFingerprint(collectionName, data) {
  const digest = await crypto.subtle.digest('SHA-256',
    new TextEncoder().encode(submissionFingerprintText(collectionName, data)));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function checkSubmissionWindow(limit, duplicate, now = Date.now()) {
  if (duplicate && now - duplicate.submittedAt.toMillis() < DUPLICATE_WINDOW_MS) {
    const error = new Error('This request was already submitted in the last 24 hours');
    error.code = 'submission/duplicate';
    throw error;
  }
  if (limit && now - limit.submittedAt.toMillis() < SUBMISSION_COOLDOWN_MS) {
    const error = new Error('Please wait before submitting another request');
    error.code = 'submission/rate-limited';
    throw error;
  }
}
