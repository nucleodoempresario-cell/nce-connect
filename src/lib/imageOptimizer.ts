/**
 * Optimizes an image by resizing and compressing it before upload
 * @param file - The original file to optimize
 * @param maxWidth - Maximum width (default 1200px)
 * @param maxHeight - Maximum height (default 1200px)
 * @param quality - JPEG quality 0-1 (default 0.8)
 * @returns Promise<File> - The optimized file
 */
export async function optimizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<File> {
  // If not an image, return as-is
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Skip GIFs to preserve animation
  if (file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const outputQuality = file.type === 'image/png' ? undefined : quality;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }

            // Create new file with optimized content
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, outputType === 'image/png' ? '.png' : '.jpg'),
              { type: outputType }
            );

            console.log(`Image optimized: ${(file.size / 1024).toFixed(1)}KB → ${(optimizedFile.size / 1024).toFixed(1)}KB`);
            resolve(optimizedFile);
          },
          outputType,
          outputQuality
        );
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes image for avatar/profile photos (smaller size)
 */
export function optimizeAvatar(file: File): Promise<File> {
  return optimizeImage(file, 500, 500, 0.85);
}

/**
 * Optimizes image for logos (preserve quality, moderate size)
 */
export function optimizeLogo(file: File): Promise<File> {
  return optimizeImage(file, 800, 800, 0.9);
}

/**
 * Optimizes image for news/blog images
 */
export function optimizeNewsImage(file: File): Promise<File> {
  return optimizeImage(file, 1600, 1200, 0.8);
}
