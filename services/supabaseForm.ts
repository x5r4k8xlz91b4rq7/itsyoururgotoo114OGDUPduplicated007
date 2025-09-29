interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitSupportRequest = async (formData: FormData, fileUrls: string[]) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Support request submitted:', {
      ...formData,
      attachments: fileUrls,
      timestamp: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to submit support request:', error);
    return { success: false, error };
  }
};