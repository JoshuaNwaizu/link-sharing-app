export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: {
    url: string;
  };
}

const cleanUrl = (url: string): string => {
  // Remove http://localhost:5173/ if present
  let cleanedUrl = url.replace('http://localhost:5173/', '');
  // Remove www. if present
  cleanedUrl = cleanedUrl.replace('www.', '');
  // Add https:// if no protocol is present
  if (!cleanedUrl.startsWith('http')) {
    cleanedUrl = `https://${cleanedUrl}`;
  }
  return cleanedUrl;
};

export default cleanUrl;
