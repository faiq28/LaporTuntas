export async function fileToResizedDataUrl(
  file: File,
  maxSize = 960,
  quality = 0.78,
): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("Berkas harus berupa gambar (JPG, PNG, atau WebP).");
  if (file.size > 8 * 1024 * 1024)
    throw new Error("Ukuran foto maksimal 8 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () =>
        reject(new Error("Foto tidak dapat dibaca. Coba format JPG atau PNG."));
      i.src = url;
    });
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Browser tidak mendukung pemrosesan gambar.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
