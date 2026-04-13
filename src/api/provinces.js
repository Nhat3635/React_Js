// Backend Provinces API (localhost:3001)
const BACKEND_API = "http://localhost:3001";

// Lấy danh sách tất cả tỉnh với phường/xã
export const getAllProvinces = async () => {
  try {
    const response = await fetch(`${BACKEND_API}/locations/provinces-all`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Backend Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: `${BACKEND_API}/locations/provinces-all`
      });
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    console.error("Stack:", error);
    throw error;
  }
};

// Lấy danh sách phường/xã của một tỉnh
export const getWardsByProvince = async (provinceCode) => {
  try {
    const response = await fetch(`${BACKEND_API}/locations/province/${provinceCode}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(" Backend Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: `${BACKEND_API}/locations/province/${provinceCode}`
      });
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(" Error fetching wards by province:", error.message);
    throw error;
  }
};

// Lấy thông tin chi tiết của một tỉnh
export const getProvinceDetail = async (provinceCode) => {
  try {
    const response = await fetch(`${BACKEND_API}/locations/province/${provinceCode}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Backend Error:", errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching province detail:", error.message);
    throw error;
  }
};

// Lấy thông tin chi tiết của một phường/xã
export const getWardDetail = async (wardCode) => {
  try {
    const response = await fetch(`${BACKEND_API}/locations/ward/${wardCode}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(" Backend Error:", errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching ward detail:", error.message);
    throw error;
  }
};
