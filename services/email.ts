interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FileWithId {
  id: string;
  file: File;
  preview?: string;
}

export const sendSupportEmail = async (formData: FormData, files: FileWithId[]) => {
  try {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Support email sent:', {
      ...formData,
      fileCount: files.length,
      timestamp: new Date().toISOString()
    });
    
    return { 
      success: true, 
      complete: true,
      processedCount: files.length,
      totalCount: files.length
    };
  } catch (error) {
    console.error('Failed to send support email:', error);
    return { 
      success: false, 
      complete: false,
      processedCount: 0,
      totalCount: files.length
    };
  }
};