import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

/**
 * Generic class to handle data persistence.
 * Prioritizes Firestore. Falls back to LocalStorage ONLY for reads when
 * Firestore is completely unavailable (no Firebase config at all).
 * Writes ALWAYS go to Firestore when Firebase is configured.
 */
class BaseService {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this._firestoreReady = null;
    }

    _isFirebaseConfigured() {
        // db is a real Firestore instance if Firebase was initialized,
        // or an empty object {} if mock mode (no env vars)
        return db && typeof db.type === 'string'; // Firestore instances have a `type` property
    }

    // --- LocalStorage helpers (fallback only) ---
    _localGet() {
        try {
            return JSON.parse(localStorage.getItem(this.collectionName) || '[]');
        } catch { return []; }
    }

    _localSet(data) {
        localStorage.setItem(this.collectionName, JSON.stringify(data));
    }

    // --- READ ALL ---
    async getAll() {
        if (!this._isFirebaseConfigured()) {
            return this._localGet();
        }
        try {
            const snapshot = await getDocs(collection(db, this.collectionName));
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            return data;
        } catch (error) {
            console.warn(`[${this.collectionName}] Firestore read failed:`, error.code, error.message);
            // Only fall back to localStorage if Firestore itself is unreachable
            if (error.code === 'unavailable' || error.code === 'failed-precondition') {
                return this._localGet();
            }
            // Permission denied means rules block it - return empty so we don't show stale mock data
            return [];
        }
    }

    // --- CREATE ---
    async create(data) {
        if (!this._isFirebaseConfigured()) {
            const all = this._localGet();
            const newItem = { id: `local_${Date.now()}`, ...data };
            this._localSet([...all, newItem]);
            return newItem;
        }
        const docRef = await addDoc(collection(db, this.collectionName), data);
        return { id: docRef.id, ...data };
    }

    // --- UPDATE ---
    async update(id, data) {
        if (!this._isFirebaseConfigured()) {
            const all = this._localGet();
            const exists = all.some(item => item.id === id);
            const updated = exists
                ? all.map(item => item.id === id ? { ...item, ...data } : item)
                : [...all, { id, ...data }];
            this._localSet(updated);
            return { id, ...data };
        }
        const itemRef = doc(db, this.collectionName, id);
        await updateDoc(itemRef, data);
        return { id, ...data };
    }

    // --- DELETE ---
    async delete(id) {
        if (!this._isFirebaseConfigured()) {
            this._localSet(this._localGet().filter(item => item.id !== id));
            return true;
        }
        await deleteDoc(doc(db, this.collectionName, id));
        return true;
    }
}

export default BaseService;
