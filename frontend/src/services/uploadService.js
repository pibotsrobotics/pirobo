import { storage } from '../config/firebase';

const uploadService = {
    /**
     * Compresses and converts an image to a Data URL to save space in Firestore.
     * Bypasses Firebase Storage since the user is on the free Spark plan.
     */
    uploadFile: async (file, path = 'uploads', maxWidth = 1200, quality = 0.9) => {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                return reject(new Error("File is not an image"));
            }
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Allow dynamic max size based on context (Gallery vs Profile)
                const MAX_SIZE = maxWidth;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Use higher quality for the Data URL
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };

            img.onerror = () => reject(new Error("Failed to process image"));
            
            reader.readAsDataURL(file);
        });
    }
};

export default uploadService;
