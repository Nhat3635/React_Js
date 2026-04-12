import requestAPI from ".";

const DEFAULT_UPLOAD_ENDPOINT = "/uploads/image";

const extractImageUrl = (payload) => {
  if (!payload) return "";

  return (
    payload.secure_url ||
    payload.url ||
    payload.imageUrl ||
    payload.image_url ||
    payload?.data?.secure_url ||
    payload?.data?.url ||
    payload?.data?.imageUrl ||
    payload?.data?.image_url ||
    ""
  );
};

export const uploadImageToServer = async (file, folder = "uploads") => {
  if (!file) {
    throw new Error("Khong tim thay file de upload");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const uploadEndpoint = process.env.REACT_APP_UPLOAD_ENDPOINT || DEFAULT_UPLOAD_ENDPOINT;

  const response = await requestAPI({
    method: "POST",
    url: uploadEndpoint,
    data: formData,
  });

  const imageUrl = extractImageUrl(response?.data);

  if (!imageUrl) {
    throw new Error("Backend upload thanh cong nhung khong tra ve URL anh");
  }

  return imageUrl;
};
