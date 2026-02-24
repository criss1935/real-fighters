import { supabase } from './supabase';

export type BucketName = 
  | 'announcement-images' 
  | 'fighters-photos' 
  | 'events-photos'
  | 'students-photos'
  | 'filiales-images'
  | 'classes-images';

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG o WebP' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen no debe superar 5MB' };
  }

  return { valid: true };
}

export async function uploadImage(
  file: File,
  bucket: BucketName = 'announcement-images'
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function deleteImage(
  url: string,
  bucket: BucketName
): Promise<boolean> {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}