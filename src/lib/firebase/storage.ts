import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

type UploadProgressCallback = (progress: number) => void;

// Upload a file to Firebase Storage
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

// Upload a product image
export async function uploadProductImage(
  file: File,
  productId: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `products/${productId}/${filename}`;
  return uploadFile(file, path, onProgress);
}

// Upload an artist image
export async function uploadArtistImage(
  file: File,
  artistId: string,
  type: 'profile' | 'gallery',
  onProgress?: UploadProgressCallback
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `artists/${artistId}/${type}/${filename}`;
  return uploadFile(file, path, onProgress);
}

// Upload site content image (hero, seasonal, etc.)
export async function uploadContentImage(
  file: File,
  section: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `site_content/${section}/${filename}`;
  return uploadFile(file, path, onProgress);
}

// Upload appraisal images
export async function uploadAppraisalImage(
  file: File,
  requestId: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `appraisals/${requestId}/${filename}`;
  return uploadFile(file, path, onProgress);
}

// Upload collection item image
export async function uploadCollectionImage(
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `collections/${userId}/${filename}`;
  return uploadFile(file, path, onProgress);
}

// Delete a file from storage
export async function deleteFile(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error: unknown) {
    // Silently handle if file doesn't exist
    if ((error as { code?: string })?.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}
