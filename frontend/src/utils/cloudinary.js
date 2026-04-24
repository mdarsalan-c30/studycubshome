import axios from 'axios';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dikonxiyq/auto/upload';
const UPLOAD_PRESET = 'studycubshome';

export const uploadToCloudinary = async (file, resourceType = 'auto', fileName = null) => {
  const formData = new FormData();
  if (fileName) {
    formData.append('file', file, fileName);
  } else {
    formData.append('file', file);
  }
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', resourceType); 
  
  try {
    const res = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // Applying 'q_auto' and 'f_auto' only for images to avoid breaking PDFs/Videos
    let optimizedUrl = res.data.secure_url;
    const isImage = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(optimizedUrl);
    
    if (isImage && optimizedUrl.includes('/upload/')) {
        optimizedUrl = optimizedUrl.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    
    return optimizedUrl;
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    throw err;
  }
};
