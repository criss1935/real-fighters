import { supabase } from './supabase';

/**
 * Sube una imagen a Supabase Storage
 * @param file - Archivo de imagen a subir
 * @param bucket - Nombre del bucket ('announcement-images', 'fighters-photos', etc.)
 * @returns URL pública de la imagen o null si falla
 */
export async function uploadImage(
  file: File,
  bucket: 'announcement-images' | 'fighters-photos' | 'events-photos' = 'announcement-images'
): Promise<string | null> {
  try {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar tamaño (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('La imagen no debe superar 5MB');
    }

    // Generar nombre único para evitar colisiones
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      throw error;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('✅ Imagen subida exitosamente:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (error: any) {
    console.error('Error en uploadImage:', error);
    alert(`Error al subir imagen: ${error.message}`);
    return null;
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param imageUrl - URL completa de la imagen
 * @param bucket - Nombre del bucket
 * @returns true si se eliminó exitosamente
 */
export async function deleteImage(
  imageUrl: string,
  bucket: 'announcement-images' | 'fighters-photos' | 'events-photos' = 'announcement-images'
): Promise<boolean> {
  try {
    // Extraer el path del archivo de la URL
    const urlParts = imageUrl.split(`/${bucket}/`);
    if (urlParts.length < 2) {
      throw new Error('URL de imagen inválida');
    }
    const filePath = urlParts[1];

    // Eliminar de Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting from Supabase Storage:', error);
      throw error;
    }

    console.log('✅ Imagen eliminada exitosamente');
    return true;

  } catch (error: any) {
    console.error('Error en deleteImage:', error);
    return false;
  }
}

/**
 * Valida si un archivo es una imagen válida
 * @param file - Archivo a validar
 * @returns true si es válido, mensaje de error si no
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Validar tipo
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen (JPG, PNG, WebP)' };
  }

  // Validar tamaño (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen no debe superar 5MB' };
  }

  // Validar extensiones permitidas
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no permitido. Use JPG, PNG o WebP' };
  }

  return { valid: true };
}