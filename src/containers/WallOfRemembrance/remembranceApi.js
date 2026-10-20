const BASE = 'https://islamicapp.vercel.app/api/remembrance';

const json = async (res) => {
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) throw new Error(body?.message || `Request failed (${res.status})`);
  return body;
};

export const fetchApproved = async () => {
  const body = await json(await fetch(`${BASE}/approved`));
  const list = Array.isArray(body?.data) ? body.data : [];
  return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const fetchRemembrance = async (id) => (await json(await fetch(`${BASE}/${id}`))).data || null;

export const submitRemembrance = async (formData) =>
  json(await fetch(BASE, { method: 'POST', body: formData, headers: { Accept: 'application/json' } }));

const FEMALE_RELATIONS = /mother|mom|mum|sister|daughter|wife|grand ?mother|grandma|aunt|niece|ammi|ami|nani|dadi|khala|phuphi/i;

// Gendered wording for the dua, from the stored gender or, failing that, the relationship.
export const isFemale = (person) => {
  const g = (person?.gender || '').trim().toLowerCase();
  if (g.startsWith('f') || g === 'woman') return true;
  if (g.startsWith('m') || g === 'man') return false;
  return FEMALE_RELATIONS.test(person?.relationship || '');
};
