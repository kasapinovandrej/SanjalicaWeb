import supabase from "@/api/supabase";

export const storageBucket = "images";

export const uploadImage = async (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(storageBucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
  if (error) throw error;
  const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
};

// Existing URLs are kept as-is; new files are uploaded and their paths pushed
// to `uploadedPaths` so the caller can roll back if a later step fails.
export const resolveImage = async (
  value: File | string,
  uploadedPaths: string[],
) => {
  if (typeof value === "string") return value;
  const image = await uploadImage(value);
  uploadedPaths.push(image.path);
  return image.url;
};

export const removeImages = async (paths: string[]) => {
  if (paths.length) await supabase.storage.from(storageBucket).remove(paths);
};

const publicPathPrefix = `/storage/v1/object/public/${storageBucket}/`;

// Only images uploaded to our bucket are removed; static /assets URLs are skipped.
export const removeImageUrls = async (urls: string[]) => {
  const paths = urls.flatMap((url) => {
    const index = url.indexOf(publicPathPrefix);
    return index === -1
      ? []
      : [decodeURIComponent(url.slice(index + publicPathPrefix.length))];
  });
  await removeImages(paths);
};
