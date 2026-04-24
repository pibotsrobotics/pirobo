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
        // Real Firestore instances have a type 'firestore'
        // If it's a mock {} object, this will be false
        return !!(db && (db.type === 'firestore' || typeof db.type === 'string'));
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
            const all = this._localGet();
            return all.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        }
        try {
            const snapshot = await getDocs(collection(db, this.collectionName));
            // Ensure document ID (d.id) is NEVER overwritten by a field named 'id' inside the data
            let data = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            // Sort by createdAt ascending (oldest added shows up first)
            data.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
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

    async create(data) {
        const payload = { ...data, createdAt: Date.now() };
        if (!this._isFirebaseConfigured()) {
            const all = this._localGet();
            const newItem = { id: `local_${Date.now()}`, ...payload };
            this._localSet([...all, newItem]);
            return newItem;
        }
        try {
            const docRef = await addDoc(collection(db, this.collectionName), payload);
            return { id: docRef.id, ...payload };
        } catch (error) {
            console.error(`[${this.collectionName}] Create failed:`, error);
            alert(`Database Write Error: ${error.message}\nIf this is a permission error, please update your Firestore Rules to allow writes.`);
            throw error;
        }
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
        try {
            if (!id) throw new Error("Missing document ID");
            const docId = String(id);
            const itemRef = doc(db, this.collectionName, docId);
            await updateDoc(itemRef, data);
            return { id: docId, ...data };
        } catch (error) {
            console.error(`[${this.collectionName}] Update failed:`, error);
            alert(`Database Update Error (ID: ${id}): ${error.message}\nPlease check your Firestore Security Rules if this is a permission issue.`);
            throw error;
        }
    }

    // --- DELETE ---
    async delete(id) {
        if (!this._isFirebaseConfigured()) {
            this._localSet(this._localGet().filter(item => item.id !== id));
            return true;
        }
        try {
            if (!id) throw new Error("Missing document ID");
            const docId = String(id);
            await deleteDoc(doc(db, this.collectionName, docId));
            return true;
        } catch (error) {
            console.error(`[${this.collectionName}] Delete failed:`, error);
            alert(`Database Delete Error (ID: ${id}): ${error.message}\nIf this is a "r.indexOf" error, the ID might be invalid. Otherwise, check your Security Rules.`);
            throw error;
        }
    }
}

export default BaseService;
