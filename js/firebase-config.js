/**
 * Blood Donors Association of Berkane Province
 * Association des Donneurs de Sang de la Province de Berkane
 * 
 * Firebase Firestore Configuration & Services
 * Project: berkane-blood-donors-website
 * Collections: donors_volunteers, emergency_alert, hero_gallery
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-check.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  runTransaction,
  serverTimestamp, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// =========================================================================
// 1. Firebase Project Configuration
// Project: berkane-blood-donors-website
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCsjxSWSoVpQBmseM6bJxoiUIzFJxZzmWQ",
  authDomain: "berkane-blood-donors-website.firebaseapp.com",
  projectId: "berkane-blood-donors-website",
  storageBucket: "berkane-blood-donors-website.firebasestorage.app",
  messagingSenderId: "338509584140",
  appId: "1:338509584140:web:745a933b63b79ac44f5b29",
  measurementId: "G-VDM7KB62CK"
};

export const DONORS_COLLECTION = "donors_volunteers";
export const EMERGENCY_COLLECTION = "emergency_alert";
export const HERO_GALLERY_COLLECTION = "hero_gallery";
export const ACTIVITIES_GALLERY_COLLECTION = "activities_gallery_cloud";
export const PARTNERS_COLLECTION = "partners_cloud";
export const LEADERBOARD_TEAMS_COLLECTION = "leaderboard_teams_cloud";
export const TEAM_REQUESTS_COLLECTION = "team_requests_cloud";
export const SITE_SETTINGS_COLLECTION = "site_settings";
export const STATS_DOC_ID = "stats_counters";
export const CAMPAIGN_DOC_ID = "campaign_data";
export const SOCIAL_LINKS_DOC_ID = "social_links";
export const PILLARS_DOC_ID = "pillar_cards";

const LOCAL_STORAGE_DONORS_KEY = "admin_donors_volunteers_local";
const LOCAL_STORAGE_EMERGENCY_KEY = "admin_emergency_alert";
const LOCAL_STORAGE_HERO_KEY = "admin_general_gallery";
const LOCAL_STORAGE_HERO_FALLBACK_KEY = "admin_hero_slider_items";
const LOCAL_STORAGE_GALLERY_KEY = "admin_gallery_items";
const LOCAL_STORAGE_PARTNERS_KEY = "admin_partners_items";
const LOCAL_STORAGE_STATS_KEY = "admin_stats_counters";
const LOCAL_STORAGE_STATS_FALLBACK_KEY = "admin_stats_data";
const LOCAL_STORAGE_CAMPAIGN_KEY = "admin_campaign_data";
const LOCAL_STORAGE_LEADERBOARD_KEY = "admin_leaderboard_teams";
const LOCAL_STORAGE_TEAM_REQUESTS_KEY = "admin_team_requests";
const LOCAL_STORAGE_SOCIAL_KEY = "admin_social_links";
const LOCAL_STORAGE_PILLARS_KEY = "admin_pillar_cards";

// Helper: Check if Firebase has a live configured API key
export function isFirebaseConfigured() {
  return typeof firebaseConfig.apiKey === "string" &&
         firebaseConfig.apiKey.length > 20 &&
         !firebaseConfig.apiKey.includes("YOUR_FIREBASE_API_KEY");
}

// Initialize App Check before Firestore and Auth so their requests include tokens.
let app = null;
let db = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6LfMoBYuAAAAAN7QvLjW46T3WaOmJksJdLXWk2nN"),
    isTokenAutoRefreshEnabled: true
  });
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.info("[Firebase] Operating in local/offline fallback mode:", e.message);
}

export { app, db, auth };

// =========================================================================
// 1.1 Firebase Authentication Services
// =========================================================================
export async function loginAdmin(email, password) {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized or offline.");
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  if (!auth) return;
  return await signOut(auth);
}

export function subscribeToAuthState(callback) {
  if (!auth) {
    if (typeof callback === 'function') callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
}

// =========================================================================
// 2. Local Storage Fallback Helpers
// =========================================================================
export function getLocalBackups() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DONORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateLocalStatus(id, newStatus) {
  try {
    const list = getLocalBackups();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(LOCAL_STORAGE_DONORS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('registrationsUpdated'));
    }
  } catch (e) {}
}

function deleteLocalRecord(id) {
  try {
    let list = getLocalBackups();
    list = list.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_DONORS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('registrationsUpdated'));
  } catch (e) {}
}

// =========================================================================
// 3. Firestore Registrations CRUD (Donors & Volunteers)
// =========================================================================
export function createSubmissionId() {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase is unavailable");
  return doc(collection(db, DONORS_COLLECTION)).id;
}

export async function addRegistration(data, submissionId) {
  const nowIso = new Date().toISOString();

  const payload = {
    fullname: (data.fullname || "").trim(),
    phone: (data.phone || "").trim(),
    city: (data.city || data.district || "بركان").trim(),
    bloodGroup: (data.bloodGroup || data.bloodgroup || "N/A").trim(),
    category: data.category === "volunteer" ? "volunteer" : "donor",
    subCategory: (data.subCategory || data.area || "").trim(),
    status: "pending",
    createdAt: nowIso,
    source: "website_form"
  };

  if (payload.category === "donor") {
    if (data.consentAccepted !== true || data.consentVersion !== "donor-consent-v1" ||
        !["ar", "fr"].includes(data.consentLanguage)) {
      throw new Error("Donor consent is required");
    }
    payload.consentAccepted = true;
    payload.consentVersion = data.consentVersion;
    payload.consentLanguage = data.consentLanguage;
  }

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  try {
    const docRef = submissionId ? doc(db, DONORS_COLLECTION, submissionId) : doc(collection(db, DONORS_COLLECTION));
    await setDoc(docRef, {
      ...payload,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, isLocal: false, ...payload };
  } catch (error) {
    console.warn("[Firebase] Registration failed:", error.message);
    throw error;
  }
}

export function subscribeToRegistrations(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback(getLocalBackups(), { isLocal: true, count: getLocalBackups().length });
    const updateHandler = () => {
      callback(getLocalBackups(), { isLocal: true, count: getLocalBackups().length });
    };
    window.addEventListener('storage', updateHandler);
    window.addEventListener('registrationsUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', updateHandler);
      window.removeEventListener('registrationsUpdated', updateHandler);
    };
  }

  try {
    const q = query(collection(db, DONORS_COLLECTION), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      const records = [];
      snapshot.forEach((docSnap) => {
        records.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(records, { isLocal: false, count: records.length });
    }, (error) => {
      console.warn("[Firebase] onSnapshot registrations error, fallback to local:", error.message);
      callback(getLocalBackups(), { isLocal: true, count: getLocalBackups().length, error });
    });
  } catch (err) {
    callback(getLocalBackups(), { isLocal: true, count: getLocalBackups().length });
    return () => {};
  }
}

export async function approveRegistration(docId) {
  if (!isFirebaseConfigured() || !db || docId.startsWith("reg_")) {
    throw new Error("Cloud registration is unavailable");
  }
  await updateDoc(doc(db, DONORS_COLLECTION, docId), { status: "approved" });
  updateLocalStatus(docId, "approved");
  return true;
}

export async function deleteRegistration(docId) {
  if (!isFirebaseConfigured() || !db || docId.startsWith("reg_")) {
    throw new Error("Cloud registration is unavailable");
  }
  await deleteDoc(doc(db, DONORS_COLLECTION, docId));
  deleteLocalRecord(docId);
  return true;
}

// =========================================================================
// 4. Firestore Emergency Alert Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_ALERT = {
  active: false,
  bloodType: 'O-',
  location: '',
  textAr: '',
  textFr: ''
};

export function getLocalEmergencyAlert() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EMERGENCY_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ALERT;
  } catch (e) {
    return DEFAULT_ALERT;
  }
}

export async function saveEmergencyAlert(alertData) {
  const payload = {
    active: alertData.active !== false,
    bloodType: (alertData.bloodType || 'O-').trim(),
    location: (alertData.location || '').trim(),
    textAr: (alertData.textAr || '').trim(),
    textFr: (alertData.textFr || '').trim(),
    updatedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = doc(db, EMERGENCY_COLLECTION, "current");
  await setDoc(docRef, {
    ...payload,
    timestamp: serverTimestamp()
  }, { merge: true });
  try {
    localStorage.setItem(LOCAL_STORAGE_EMERGENCY_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('emergencyAlertUpdated', { detail: payload }));
  } catch (e) {}
  return { isLocal: false, ...payload };
}

export function subscribeToEmergencyAlert(callback) {
  const deliverLocal = () => {
    callback(getLocalEmergencyAlert(), { isLocal: true });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const data = e.detail || getLocalEmergencyAlert();
      callback(data, { isLocal: true });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('emergencyAlertUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('emergencyAlertUpdated', updateHandler);
    };
  }

  try {
    const docRef = doc(db, EMERGENCY_COLLECTION, "current");
    const unsubscribe = onSnapshot(docRef, { includeMetadataChanges: true }, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        try {
          localStorage.setItem(LOCAL_STORAGE_EMERGENCY_KEY, JSON.stringify(data));
        } catch (e) {}
        callback(data, { isLocal: docSnap.metadata.fromCache });
      } else {
        callback(DEFAULT_ALERT, { isLocal: docSnap.metadata.fromCache });
      }
    }, (error) => {
      console.warn("[Firebase] Emergency onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });

    return unsubscribe;
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 5. Firestore Hero Gallery Slider Services (Cloud Sync & Real-time)
// =========================================================================
export function getLocalHeroGallery() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HERO_KEY) || localStorage.getItem(LOCAL_STORAGE_HERO_FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateLocalHeroGallery(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_HERO_KEY, JSON.stringify(items));
    localStorage.setItem(LOCAL_STORAGE_HERO_FALLBACK_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('heroGalleryUpdated', { detail: items }));
  } catch (e) {}
}

export async function addHeroGalleryItem(item) {
  const payload = {
    image: (item.image || item.url || "").trim(),
    titleAr: (item.titleAr || "").trim(),
    titleFr: (item.titleFr || "").trim(),
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = await addDoc(collection(db, HERO_GALLERY_COLLECTION), {
    ...payload,
    timestamp: serverTimestamp()
  });
  return { id: docRef.id, isLocal: false, ...payload };
}

export async function updateHeroGalleryItem(id, item) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("hero_")) {
    throw new Error("Cloud gallery item is unavailable");
  }

  const payload = {
    image: (item.image || item.url || "").trim(),
    titleAr: (item.titleAr || "").trim(),
    titleFr: (item.titleFr || "").trim(),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, HERO_GALLERY_COLLECTION, String(id)), {
    ...payload,
    timestamp: serverTimestamp()
  });

  try {
    const list = getLocalHeroGallery();
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      updateLocalHeroGallery(list);
    }
  } catch (e) {}

  return { id, isLocal: false, ...payload };
}

export async function deleteHeroGalleryItem(id) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("hero_")) {
    throw new Error("Cloud gallery item is unavailable");
  }
  await deleteDoc(doc(db, HERO_GALLERY_COLLECTION, id));
  return true;
}

export function subscribeToHeroGallery(callback) {
  const deliverLocal = () => {
    callback(getLocalHeroGallery(), { isLocal: true, count: getLocalHeroGallery().length });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const items = e.detail || getLocalHeroGallery();
      callback(items, { isLocal: true, count: items.length });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('heroGalleryUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('heroGalleryUpdated', updateHandler);
    };
  }

  try {
    const q = query(collection(db, HERO_GALLERY_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      updateLocalHeroGallery(items);
      callback(items, { isLocal: false, count: items.length });
    }, (error) => {
      console.warn("[Firebase] Hero gallery onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 6. Firestore Activities Gallery Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_GALLERY = [];

export function getLocalActivitiesGallery() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
    if (raw !== null && raw !== undefined) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading admin_gallery_items:', e);
  }
  return [];
}

function updateLocalActivitiesGallery(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('activitiesGalleryUpdated', { detail: items }));
  } catch (e) {}
}

export async function addActivitiesGalleryItem(item) {
  const payload = {
    image: (item.image || 'assets/campaign-1.svg').trim(),
    date: (item.date || '').trim(),
    category: item.category || 'campaign',
    categoryLabel: (item.categoryLabel || 'نشاط').trim(),
    titleAr: (item.titleAr || '').trim(),
    titleFr: (item.titleFr || '').trim(),
    description: (item.description || item.descAr || item.descFr || '').trim(),
    descAr: (item.descAr || item.description || '').trim(),
    descFr: (item.descFr || '').trim(),
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = await addDoc(collection(db, ACTIVITIES_GALLERY_COLLECTION), {
    ...payload,
    timestamp: serverTimestamp()
  });
  return { id: docRef.id, isLocal: false, ...payload };
}

export async function updateActivitiesGalleryItem(id, item) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("gal_")) {
    throw new Error("Cloud gallery item is unavailable");
  }

  const payload = {
    image: (item.image || 'assets/campaign-1.svg').trim(),
    date: (item.date || '').trim(),
    category: item.category || 'campaign',
    categoryLabel: (item.categoryLabel || 'نشاط').trim(),
    titleAr: (item.titleAr || '').trim(),
    titleFr: (item.titleFr || '').trim(),
    description: (item.description || item.descAr || item.descFr || '').trim(),
    descAr: (item.descAr || item.description || '').trim(),
    descFr: (item.descFr || '').trim(),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, ACTIVITIES_GALLERY_COLLECTION, String(id)), {
    ...payload,
    timestamp: serverTimestamp()
  });

  try {
    const list = getLocalActivitiesGallery();
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      updateLocalActivitiesGallery(list);
    }
  } catch (e) {}

  return { id, isLocal: false, ...payload };
}

export async function deleteActivitiesGalleryItem(id) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("gal_")) {
    throw new Error("Cloud gallery item is unavailable");
  }
  await deleteDoc(doc(db, ACTIVITIES_GALLERY_COLLECTION, id));
  return true;
}

export function subscribeToActivitiesGallery(callback) {
  const deliverLocal = () => {
    callback(getLocalActivitiesGallery(), { isLocal: true, count: getLocalActivitiesGallery().length });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const items = e.detail || getLocalActivitiesGallery();
      callback(items, { isLocal: true, count: items.length });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('activitiesGalleryUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('activitiesGalleryUpdated', updateHandler);
    };
  }

  try {
    const q = query(collection(db, ACTIVITIES_GALLERY_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      updateLocalActivitiesGallery(items);
      callback(items, { isLocal: false, count: items.length });
    }, (error) => {
      console.warn("[Firebase] Activities gallery onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 7. Firestore Partners & Supporters Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_PARTNERS = [];

export function getLocalPartners() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY);
    if (raw !== null && raw !== undefined) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading admin_partners_items:', e);
  }
  return [];
}

function updateLocalPartners(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PARTNERS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('partnersUpdated', { detail: items }));
  } catch (e) {}
}

export async function addPartnerItem(partner) {
  const payload = {
    logo: (partner.logo || 'assets/partner-1.svg').trim(),
    nameAr: (partner.nameAr || '').trim(),
    nameFr: (partner.nameFr || '').trim(),
    descAr: (partner.descAr || '').trim(),
    descFr: (partner.descFr || '').trim(),
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }
  const docRef = await addDoc(collection(db, PARTNERS_COLLECTION), {
    ...payload,
    timestamp: serverTimestamp()
  });
  return { id: docRef.id, isLocal: false, ...payload };
}

export async function updatePartnerItem(id, partner) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("part_")) {
    throw new Error("Cloud partner is unavailable");
  }

  const payload = {
    logo: (partner.logo || 'assets/partner-1.svg').trim(),
    nameAr: (partner.nameAr || '').trim(),
    nameFr: (partner.nameFr || '').trim(),
    descAr: (partner.descAr || '').trim(),
    descFr: (partner.descFr || '').trim(),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, PARTNERS_COLLECTION, String(id)), {
    ...payload,
    timestamp: serverTimestamp()
  });

  try {
    const list = getLocalPartners();
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      updateLocalPartners(list);
    }
  } catch (e) {}

  return { id, isLocal: false, ...payload };
}

export async function deletePartnerItem(id) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("part_")) {
    throw new Error("Cloud partner is unavailable");
  }
  await deleteDoc(doc(db, PARTNERS_COLLECTION, id));
  return true;
}

export function subscribeToPartners(callback) {
  const deliverLocal = () => {
    callback(getLocalPartners(), { isLocal: true, count: getLocalPartners().length });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const items = e.detail || getLocalPartners();
      callback(items, { isLocal: true, count: items.length });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('partnersUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('partnersUpdated', updateHandler);
    };
  }

  try {
    const q = query(collection(db, PARTNERS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      updateLocalPartners(items);
      callback(items, { isLocal: false, count: items.length });
    }, (error) => {
      console.warn("[Firebase] Partners onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 8. Firestore Statistics Counters Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_STATS = {
  donors: 3500,
  bags: 8200,
  campaigns: 130,
  lives: 24000
};

export function getLocalStatsCounters() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STATS_KEY) || localStorage.getItem(LOCAL_STORAGE_STATS_FALLBACK_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_STATS;
  } catch (e) {
    return DEFAULT_STATS;
  }
}

export async function saveStatsCounters(statsData) {
  const payload = {
    donors: Number(statsData.donors) || 0,
    bags: Number(statsData.bags) || 0,
    campaigns: Number(statsData.campaigns) || 0,
    lives: Number(statsData.lives) || 0,
    updatedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = doc(db, SITE_SETTINGS_COLLECTION, STATS_DOC_ID);
  await setDoc(docRef, {
    ...payload,
    timestamp: serverTimestamp()
  }, { merge: true });
  try {
    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(payload));
    localStorage.setItem(LOCAL_STORAGE_STATS_FALLBACK_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('statsCountersUpdated', { detail: payload }));
  } catch (e) {}
  return { isLocal: false, ...payload };
}

export function subscribeToStatsCounters(callback) {
  const deliverLocal = () => {
    callback(getLocalStatsCounters(), { isLocal: true });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const data = e.detail || getLocalStatsCounters();
      callback(data, { isLocal: true });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('statsCountersUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('statsCountersUpdated', updateHandler);
    };
  }

  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, STATS_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        try {
          localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(data));
          localStorage.setItem(LOCAL_STORAGE_STATS_FALLBACK_KEY, JSON.stringify(data));
        } catch (e) {}
        callback(data, { isLocal: false });
      } else {
        deliverLocal();
      }
    }, (error) => {
      console.warn("[Firebase] Stats counters onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 9. Firestore Upcoming Campaign & Countdown Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_CAMPAIGN = {
  titleAr: '',
  titleFr: '',
  locAr: '',
  locFr: '',
  dateAr: '',
  dateFr: '',
  dateText: '',
  targetDatetime: ''
};

export function getLocalCampaignData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CAMPAIGN_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CAMPAIGN;
  } catch (e) {
    return DEFAULT_CAMPAIGN;
  }
}

export async function saveCampaignData(campaignData) {
  const payload = {
    titleAr: (campaignData.titleAr || '').trim(),
    titleFr: (campaignData.titleFr || '').trim(),
    locAr: (campaignData.locAr || '').trim(),
    locFr: (campaignData.locFr || '').trim(),
    dateAr: (campaignData.dateAr || campaignData.dateText || '').trim(),
    dateFr: (campaignData.dateFr || '').trim(),
    dateText: (campaignData.dateAr || campaignData.dateText || '').trim(),
    targetDatetime: campaignData.targetDatetime || '',
    updatedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = doc(db, SITE_SETTINGS_COLLECTION, CAMPAIGN_DOC_ID);
  await setDoc(docRef, {
    ...payload,
    timestamp: serverTimestamp()
  }, { merge: true });
  try {
    localStorage.setItem(LOCAL_STORAGE_CAMPAIGN_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('campaignDataUpdated', { detail: payload }));
  } catch (e) {}
  return { isLocal: false, ...payload };
}

export function subscribeToCampaignData(callback) {
  const deliverLocal = () => {
    callback(getLocalCampaignData(), { isLocal: true });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const data = e.detail || getLocalCampaignData();
      callback(data, { isLocal: true });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('campaignDataUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('campaignDataUpdated', updateHandler);
    };
  }

  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, CAMPAIGN_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        try {
          localStorage.setItem(LOCAL_STORAGE_CAMPAIGN_KEY, JSON.stringify(data));
        } catch (e) {}
        callback(data, { isLocal: false });
      } else {
        deliverLocal();
      }
    }, (error) => {
      console.warn("[Firebase] Campaign data onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 10. Firestore Leaderboard Teams Services (Cloud Sync & Real-time)
// =========================================================================
export function getLocalLeaderboardTeams() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
    if (raw !== null && raw !== undefined) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Error reading local leaderboard teams:", e);
  }
  return [];
}

function updateLocalLeaderboardTeams(teams) {
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(teams));
    window.dispatchEvent(new CustomEvent('leaderboardTeamsUpdated', { detail: teams }));
  } catch (e) {}
}

export async function saveLeaderboardTeam(teamData) {
  if (!isFirebaseConfigured() || !db || (teamData.id && String(teamData.id).startsWith("team_"))) {
    throw new Error("Cloud team is unavailable");
  }

  const payload = {
    nameAr: (teamData.nameAr || teamData.name || '').trim(),
    nameFr: (teamData.nameFr || '').trim(),
    category: teamData.category || 'education',
    currentBags: Number(teamData.currentBags) || 0,
    targetBags: Number(teamData.targetBags) || 30,
    icon: (teamData.icon || '🏆').trim(),
    updatedAt: new Date().toISOString()
  };

  if (teamData.id) {
    const docId = String(teamData.id);
    await updateDoc(doc(db, LEADERBOARD_TEAMS_COLLECTION, docId), { ...payload, timestamp: serverTimestamp() });
    return { id: docId, isLocal: false, ...payload };
  }
  const docRef = await addDoc(collection(db, LEADERBOARD_TEAMS_COLLECTION), {
    ...payload, createdAt: new Date().toISOString(), timestamp: serverTimestamp()
  });
  return { id: docRef.id, isLocal: false, ...payload };
}

export async function deleteLeaderboardTeam(id) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("team_")) {
    throw new Error("Cloud team is unavailable");
  }
  await deleteDoc(doc(db, LEADERBOARD_TEAMS_COLLECTION, id));
  return true;
}

export function subscribeToLeaderboardTeams(callback) {
  const deliverLocal = () => {
    callback(getLocalLeaderboardTeams(), { isLocal: true, count: getLocalLeaderboardTeams().length });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const items = e.detail || getLocalLeaderboardTeams();
      callback(items, { isLocal: true, count: items.length });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('leaderboardTeamsUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('leaderboardTeamsUpdated', updateHandler);
    };
  }

  try {
    const q = query(collection(db, LEADERBOARD_TEAMS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const teams = [];
      snapshot.forEach((docSnap) => {
        teams.push({ id: docSnap.id, ...docSnap.data() });
      });
      updateLocalLeaderboardTeams(teams);
      callback(teams, { isLocal: false, count: teams.length });
    }, (error) => {
      console.warn("[Firebase] Leaderboard onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 11. Firestore Team Registration Requests Services (Cloud Sync & Real-time)
// =========================================================================
export function getLocalTeamRequests() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEAM_REQUESTS_KEY);
    if (raw !== null && raw !== undefined) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Error reading local team requests:", e);
  }
  return [];
}

function updateLocalTeamRequests(reqs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TEAM_REQUESTS_KEY, JSON.stringify(reqs));
    window.dispatchEvent(new CustomEvent('teamRequestsUpdated', { detail: reqs }));
  } catch (e) {}
}

export async function addTeamRequest(data, submissionId) {
  const nowIso = new Date().toISOString();

  const payload = {
    teamName: (data.teamName || data.name || '').trim(),
    category: data.category || 'other',
    coordinator: (data.coordinator || '').trim(),
    phone: (data.phone || '').trim(),
    targetBags: Number(data.targetBags) || 30,
    notes: (data.notes || '').trim(),
    status: data.status || 'pending',
    date: data.date || new Date().toLocaleDateString('ar-MA'),
    createdAt: nowIso
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  try {
    const docRef = submissionId ? doc(db, TEAM_REQUESTS_COLLECTION, submissionId) : doc(collection(db, TEAM_REQUESTS_COLLECTION));
    await setDoc(docRef, {
      ...payload,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, isLocal: false, ...payload };
  } catch (error) {
    console.warn("[Firebase] Team request failed:", error.message);
    throw error;
  }
}

export async function approveTeamRequest(requestId, teamData) {
  if (!isFirebaseConfigured() || !db || !requestId || String(requestId).startsWith('req_')) {
    throw new Error('Cloud team request is unavailable');
  }

  const requestRef = doc(db, TEAM_REQUESTS_COLLECTION, requestId);
  const teamRef = doc(collection(db, LEADERBOARD_TEAMS_COLLECTION));
  await runTransaction(db, async (transaction) => {
    const request = await transaction.get(requestRef);
    if (!request.exists()) throw new Error('Team request no longer exists');
    const data = request.data();
    const now = new Date().toISOString();
    transaction.set(teamRef, {
      nameAr: (data.teamName || '').trim(),
      nameFr: (data.teamName || '').trim(),
      category: data.category || 'other',
      currentBags: 0,
      targetBags: Number(data.targetBags) || 30,
      icon: (teamData.icon || '🏆').trim(),
      createdAt: now,
      updatedAt: now,
      timestamp: serverTimestamp()
    });
    transaction.delete(requestRef);
  });
  return teamRef.id;
}

export async function deleteTeamRequest(id) {
  if (!isFirebaseConfigured() || !db || !id || String(id).startsWith("req_")) {
    throw new Error("Cloud team request is unavailable");
  }
  await deleteDoc(doc(db, TEAM_REQUESTS_COLLECTION, id));
  return true;
}

export function subscribeToTeamRequests(callback) {
  const deliverLocal = () => {
    callback(getLocalTeamRequests(), { isLocal: true, count: getLocalTeamRequests().length });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const items = e.detail || getLocalTeamRequests();
      callback(items, { isLocal: true, count: items.length });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('teamRequestsUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('teamRequestsUpdated', updateHandler);
    };
  }

  try {
    const q = query(collection(db, TEAM_REQUESTS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const reqs = [];
      snapshot.forEach((docSnap) => {
        reqs.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(reqs, { isLocal: false, count: reqs.length });
    }, (error) => {
      console.warn("[Firebase] Team requests onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 12. Firestore Social Media & Contact Links Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  whatsapp: '212677216964',
  phone: '+212 677 216 964',
  email: 'contact@donneursdesang-berkane.ma'
};

export function getLocalSocialLinks() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SOCIAL_KEY);
    if (raw) return { ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("Error reading local social links:", e);
  }
  return DEFAULT_SOCIAL_LINKS;
}

export async function saveSocialLinks(linksData) {
  const payload = {
    facebook: (linksData.facebook || '').trim(),
    instagram: (linksData.instagram || '').trim(),
    tiktok: (linksData.tiktok || '').trim(),
    whatsapp: (linksData.whatsapp || '').trim(),
    phone: (linksData.phone || '').trim(),
    email: (linksData.email || '').trim(),
    updatedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = doc(db, SITE_SETTINGS_COLLECTION, SOCIAL_LINKS_DOC_ID);
  await setDoc(docRef, { ...payload, timestamp: serverTimestamp() }, { merge: true });
  try {
    localStorage.setItem(LOCAL_STORAGE_SOCIAL_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('socialLinksUpdated', { detail: payload }));
  } catch (e) {}
  return { isLocal: false, ...payload };
}

export function subscribeToSocialLinks(callback) {
  const deliverLocal = () => {
    callback(getLocalSocialLinks(), { isLocal: true });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const data = e.detail || getLocalSocialLinks();
      callback(data, { isLocal: true });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('socialLinksUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('socialLinksUpdated', updateHandler);
    };
  }

  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, SOCIAL_LINKS_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        try {
          localStorage.setItem(LOCAL_STORAGE_SOCIAL_KEY, JSON.stringify(data));
        } catch (e) {}
        callback(data, { isLocal: false });
      } else {
        deliverLocal();
      }
    }, (error) => {
      console.warn("[Firebase] Social links onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 13. Firestore Core Pillar Cards Services (Cloud Sync & Real-time)
// =========================================================================
export const DEFAULT_PILLARS = [
  {
    id: 1,
    icon: 'fa-handshake-angle',
    titleAr: 'شراكات مؤسساتية',
    titleFr: 'Partenariats institutionnels',
    descAr: 'شراكات فاعلة مع المركز الجهوي لتحاقن الدم والمؤسسات الصحية والجمعوية بالجهة الشرقية.',
    descFr: 'Partenariats actifs avec le Centre Régional de Transfusion Sanguine et les établissements sanitaires et associatifs de la région de l\'Oriental.'
  },
  {
    id: 2,
    icon: 'fa-bullhorn',
    titleAr: 'توعية وتحسيس',
    titleFr: 'Sensibilisation',
    descAr: 'أنشطة تحسيسية مستمرة لنشر ثقافة التبرع الطوعي بالدم بين مختلف فئات المجتمع.',
    descFr: 'Activités de sensibilisation continues pour promouvoir la culture du don volontaire de sang auprès de toutes les catégories de la société.'
  },
  {
    id: 3,
    icon: 'fa-truck-medical',
    titleAr: 'حملات متنقلة',
    titleFr: 'Campagnes mobiles',
    descAr: 'تنظيم حملات للتبرع بالدم في مختلف مناطق إقليم بركان بتنسيق مع المستشفيات والمراكز الصحية.',
    descFr: 'Organisation de campagnes de don de sang dans les différentes zones de la province de Berkane en coordination avec les hôpitaux et centres de santé.'
  }
];

export function getLocalPillars() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PILLARS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
    }
  } catch (e) {
    console.warn("Error reading local pillars:", e);
  }
  return DEFAULT_PILLARS;
}

export async function savePillars(pillarsArray) {
  const normalized = Array.isArray(pillarsArray) ? pillarsArray : DEFAULT_PILLARS;
  const payload = {
    items: normalized,
    updatedAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is unavailable");
  }

  const docRef = doc(db, SITE_SETTINGS_COLLECTION, PILLARS_DOC_ID);
  await setDoc(docRef, { ...payload, timestamp: serverTimestamp() }, { merge: true });
  try {
    localStorage.setItem(LOCAL_STORAGE_PILLARS_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('pillarsUpdated', { detail: normalized }));
  } catch (e) {}
  return { isLocal: false, items: normalized };
}

export function subscribeToPillars(callback) {
  const deliverLocal = () => {
    callback(getLocalPillars(), { isLocal: true });
  };

  if (!isFirebaseConfigured() || !db) {
    deliverLocal();
    const updateHandler = (e) => {
      const data = e.detail || getLocalPillars();
      callback(data, { isLocal: true });
    };
    window.addEventListener('storage', deliverLocal);
    window.addEventListener('pillarsUpdated', updateHandler);
    return () => {
      window.removeEventListener('storage', deliverLocal);
      window.removeEventListener('pillarsUpdated', updateHandler);
    };
  }

  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, PILLARS_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const items = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : getLocalPillars());
        try {
          localStorage.setItem(LOCAL_STORAGE_PILLARS_KEY, JSON.stringify(items));
        } catch (e) {}
        callback(items, { isLocal: false });
      } else {
        deliverLocal();
      }
    }, (error) => {
      console.warn("[Firebase] Pillars onSnapshot error, falling back to local:", error.message);
      deliverLocal();
    });
  } catch (err) {
    deliverLocal();
    return () => {};
  }
}

// =========================================================================
// 14. Global Window Registration
// =========================================================================
if (typeof window !== "undefined") {
  window.BloodDonorsFirebase = {
    firebaseConfig,
    isFirebaseConfigured,
    // Firebase Authentication
    auth,
    loginAdmin,
    logoutAdmin,
    subscribeToAuthState,
    getCurrentUser,
    // Registrations
    addRegistration,
    createSubmissionId,
    subscribeToRegistrations,
    approveRegistration,
    deleteRegistration,
    getLocalBackups,
    DONORS_COLLECTION,
    // Emergency Alert
    DEFAULT_ALERT,
    getLocalEmergencyAlert,
    saveEmergencyAlert,
    subscribeToEmergencyAlert,
    EMERGENCY_COLLECTION,
    // Hero Gallery
    getLocalHeroGallery,
    addHeroGalleryItem,
    updateHeroGalleryItem,
    deleteHeroGalleryItem,
    subscribeToHeroGallery,
    HERO_GALLERY_COLLECTION,
    // Activities & Campaigns Gallery
    DEFAULT_GALLERY,
    getLocalActivitiesGallery,
    addActivitiesGalleryItem,
    updateActivitiesGalleryItem,
    deleteActivitiesGalleryItem,
    subscribeToActivitiesGallery,
    ACTIVITIES_GALLERY_COLLECTION,
    // Partners & Supporters
    DEFAULT_PARTNERS,
    getLocalPartners,
    addPartnerItem,
    updatePartnerItem,
    deletePartnerItem,
    subscribeToPartners,
    PARTNERS_COLLECTION,
    // Site Settings: Statistics Counters
    SITE_SETTINGS_COLLECTION,
    STATS_DOC_ID,
    DEFAULT_STATS,
    getLocalStatsCounters,
    saveStatsCounters,
    subscribeToStatsCounters,
    // Site Settings: Upcoming Campaign & Countdown
    CAMPAIGN_DOC_ID,
    DEFAULT_CAMPAIGN,
    getLocalCampaignData,
    saveCampaignData,
    subscribeToCampaignData,
    // Leaderboard Teams
    LEADERBOARD_TEAMS_COLLECTION,
    getLocalLeaderboardTeams,
    saveLeaderboardTeam,
    deleteLeaderboardTeam,
    subscribeToLeaderboardTeams,
    // Team Requests
    TEAM_REQUESTS_COLLECTION,
    getLocalTeamRequests,
    addTeamRequest,
    approveTeamRequest,
    deleteTeamRequest,
    subscribeToTeamRequests,
    // Social Links
    SOCIAL_LINKS_DOC_ID,
    DEFAULT_SOCIAL_LINKS,
    getLocalSocialLinks,
    saveSocialLinks,
    subscribeToSocialLinks,
    // Pillars
    PILLARS_DOC_ID,
    DEFAULT_PILLARS,
    getLocalPillars,
    savePillars,
    subscribeToPillars
  };

  window.dispatchEvent(new CustomEvent('bloodDonorsFirebaseReady', { detail: window.BloodDonorsFirebase }));
}
