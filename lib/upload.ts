/** Uploads through our own route handler so the imgbb key never reaches the browser. */
export function uploadImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("image", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.url) resolve(json.url);
        else reject(new Error(json.message ?? "The image upload failed. Please try again."));
      } catch {
        reject(new Error("The image upload failed. Please try again."));
      }
    };
    xhr.onerror = () => reject(new Error("The image upload failed. Please check your connection."));
    xhr.send(form);
  });
}
