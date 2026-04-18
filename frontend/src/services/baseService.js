import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

/**
 * Generic class to handle dual-mode data persistence (Firestore + LocalStorage fallback)
 */
class BaseService {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this._firestoreReady = null; // detected on first use
    }

    async _isFirestoreAvailable() {
        if (this._firestoreReady !== null) return this._firestoreReady;
        try {
            // Our mock in firebase.js uses {} which will fail this check
            if (!db || Object.keys(db).length === 0) { 
                this._firestoreReady = false; 
                return false; 
            }
            await getDocs(collection(db, '__ping__'));
            this._firestoreReady = true;
        } catch (e) {
            const code = e?.code || '';
            // Permission / auth errors → Firestore IS reachable
            // unavailable / failed-precondition → no Firebase configured
            this._firestoreReady = !['unavailable', 'failed-precondition'].includes(code);
            if (!this._firestoreReady) {
                console.info(`[${this.collectionName}] Firestore unavailable – using LocalStorage.`);
            }
        }
        return this._firestoreReady;
    }

    // --- LocalStorage helpers ---
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
        if (await this._isFirestoreAvailable()) {
            try {
                const snapshot = await getDocs(collection(db, this.collectionName));
                return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch (error) {
                console.warn(`[${this.collectionName}] Firestore read failed, falling back.`, error.message);
            }
        }
        return this._localGet();
    }

    // --- CREATE ---
    async create(data) {
        if (await this._isFirestoreAvailable()) {
            try {
                const docRef = await addDoc(collection(db, this.collectionName), data);
                return { id: docRef.id, ...data };
            } catch (error) {
                console.warn(`[${this.collectionName}] Firestore create failed, falling back.`, error.message);
            }
        }
        const all = this._localGet();
        const newItem = { id: `local_${Date.now()}`, ...data };
        this._localSet([...all, newItem]);
        return newItem;
    }

    // --- UPDATE ---
    async update(id, data) {
        if (await this._isFirestoreAvailable()) {
            try {
                const itemRef = doc(db, this.collectionName, id);
                await updateDoc(itemRef, data);
                return { id, ...data };
            } catch (error) {
                console.warn(`[${this.collectionName}] Firestore update failed, falling back.`, error.message);
            }
        }
        // LocalStorage fallback — upsert by ID (handles Firestore-seeded IDs too)
        const all = this._localGet();
        const exists = all.some(item => item.id === id);
        const updated = exists
            ? all.map(item => item.id === id ? { ...item, ...data } : item)
            : [...all, { id, ...data }];
        this._localSet(updated);
        return { id, ...data };
    }

    // --- DELETE ---
    async delete(id) {
        if (await this._isFirestoreAvailable()) {
            try {
                await deleteDoc(doc(db, this.collectionName, id));
                return true;
            } catch (error) {
                console.warn(`[${this.collectionName}] Firestore delete failed, falling back.`, error.message);
            }
        }
        this._localSet(this._localGet().filter(item => item.id !== id));
        return true;
    }
}

export default BaseService;
