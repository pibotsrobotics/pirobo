import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadService = {
    /**
     * Uploads a file to Firebase Storage
     * @param {File} file - The file to upload
     * @param {string} path - The path in storage (e.g., 'internship-resumes')
     * @returns {Promise<string>} - The download URL of the uploaded file
     */
    uploadFile: async (file, path = 'uploads') => {
        if (!storage || Object.keys(storage).length === 0) {
            console.warn("Firebase Storage not available. Using local mock storage.");
            return new Promise((resolve, reject) => {
                if (!file.type.startsWith('image/')) {
                    console.info("Non-image file detected. Returning dummy URL to prevent LocalStorage quota limits in mock mode.");
                    return resolve("mock_file_url_demo_mode.pdf");
                }
                const img = new Image();
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 300;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 0.7 quality to save local storage space
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };

                img.onerror = () => reject(new Error("Failed to process image"));
                
                reader.readAsDataURL(file);
            });
        }

        try {
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const storageRef = ref(storage, `${path}/${fileName}`);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error) {
            console.error("File upload failed", error);
            throw error;
        }
    }
};

export default uploadService;
