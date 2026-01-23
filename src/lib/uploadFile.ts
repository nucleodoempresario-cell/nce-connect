import { supabase } from '@/integrations/supabase/client';

export type BucketName = 'avatars' | 'company-logos' | 'news-images';

export async function uploadFile(
  file: File,
  bucket: BucketName,
  folder?: string
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteFile(bucket: BucketName, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
    return false;
  }
  
  return true;
}
