import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Paperclip, GripVertical, Facebook, Instagram } from 'lucide-react';
import FilePreview from './components/FilePreview';
import Notification from './components/Notification';
import CustomCaptcha from './components/CustomCaptcha';
import SubmissionWarning from './components/SubmissionWarning';
import { useFileUpload } from './hooks/useFileUpload';
import { sendContactEmail } from './services/email';
import { submitContactForm } from './services/supabaseForm';
import { useTranslation } from 'react-i18next';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const dragCounter = useRef(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [key, setKey] = useState(0);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setKey(prevKey => prevKey + 1);
    };
    
    document.addEventListener('i18n-language-changed', handleLanguageChange);
    
    return () => {
      document.removeEventListener('i18n-language-changed', handleLanguageChange);
    };
  }, []);

  // Create metadata for file uploads based on form data
  const fileMetadata = {
    user_name: formData.name || 'Unknown User',
    user_email: formData.email || 'unknown@email.com',
    subject: formData.subject || 'Contact Request',
    submission_type: 'contact',
    submission_date: new Date().toISOString()
  };

  const { 
    selectedFiles, 
    activeFileId,
    isPreviewOpen,
    addFiles, 
    removeFile, 
    reorderFiles,
    setActiveFile,
    openPreview,
    closePreview,
    uploadFiles,
    getUploadedUrls,
    isUploading,
    clearFiles
  } = useFileUpload({
    bucket: 'contact-attachments',
    folder: 'contact-submissions',
    autoUpload: false,
    metadata: fileMetadata  // Add the metadata here
  });

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Setup global drag-and-drop handlers
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      
      // Only respond to file drags
      if (!e.dataTransfer?.types.includes('Files')) return;
      
      dragCounter.current++;
      setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      
      // Only respond to file drags
      if (!e.dataTransfer?.types.includes('Files')) return;
      
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      
      // Only respond to file drags and document level events
      if (!e.dataTransfer?.types.includes('Files')) return;
      
      dragCounter.current--;
      
      // Only reset isDragging if the counter is 0 (i.e., we've left the document)
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      // Reset drag state and counter immediately
      dragCounter.current = 0;
      setIsDragging(false);
      
      // Only process file drops
      if (!e.dataTransfer?.types.includes('Files')) return;
      
      // Skip if user dropped directly on a drop zone (will be handled by component handlers)
      if (dropZoneRef.current && dropZoneRef.current.contains(e.target as Node)) return;
      
      // Process dropped files
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        const validFiles = filesArray.filter(file => {
          if (!file.type.startsWith('image/')) {
            showNotification('error', `${file.name} ${t('common.notImageFile')}`);
            return false;
          }
          if (file.size > 5 * 1024 * 1024) {
            showNotification('error', `${file.name} ${t('common.tooLarge')}`);
            return false;
          }
          return true;
        });
        
        if (validFiles.length > 0) {
          addFiles(validFiles);
          
          // Scroll to the drop zone
          dropZoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    // Add event listeners
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      // Remove event listeners
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [addFiles, t, showNotification]);

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.nameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('contact.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact.emailInvalid');
    }
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.subjectRequired');
    }
    if (!formData.message.trim()) {
      newErrors.message = t('contact.messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      showNotification('error', t('contact.formErrors'));
      return;
    }

    if (!isVerified) {
      showNotification('error', t('contact.verifyRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Update metadata with the latest form data before upload
      const updatedMetadata = {
        user_name: formData.name,
        user_email: formData.email,
        subject: formData.subject,
        submission_type: 'contact',
        submission_date: new Date().toISOString()
      };

      if (selectedFiles.length > 0 && !isUploading) {
        await uploadFiles(selectedFiles, updatedMetadata); // Pass the updated metadata
      }

      const fileUrls = getUploadedUrls();

      const dbResult = await submitContactForm(formData, fileUrls);
      
      const emailResult = await sendContactEmail(formData, selectedFiles);
      
      if (dbResult.success || emailResult?.success) {
        let message = t('contact.successMessage');
        
        if (emailResult && !emailResult.complete) {
          message += ` ${t('contact.partialSuccess', { processed: emailResult.processedCount, total: emailResult.totalCount })}`;
        }
        
        if (!dbResult.success && emailResult?.success) {
          message += t('contact.emailOnlySuccess');
        }
        
        showNotification('success', message);
        
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        clearFiles();
        
        setResetCaptcha(prev => !prev);
      } else {
        showNotification('error', t('contact.errorMessage'));
      }
    } catch (error) {
      showNotification('error', t('contact.generalError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => {
        if (!file.type.startsWith('image/')) {
          showNotification('error', `${file.name} ${t('common.notImageFile')}`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification('error', `${file.name} ${t('common.tooLarge')}`);
          return false;
        }
        return true;
      });
      addFiles(validFiles);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof dropIndex === 'number' && draggedIndex !== null) {
      reorderFiles(draggedIndex, dropIndex);
      setDraggedIndex(null);
      return;
    }
    
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = filesArray.filter(file => {
        if (!file.type.startsWith('image/')) {
          showNotification('error', `${file.name} ${t('common.notImageFile')}`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification('error', `${file.name} ${t('common.tooLarge')}`);
          return false;
        }
        return true;
      });
      addFiles(validFiles);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="py-20 px-6" key={key}>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {isSubmitting && <SubmissionWarning />}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            {t('contact.title')} <span className="text-gold">{t('common.us')}</span>
          </h1>
          <p className="text-gray-300">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-navy-800 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">{t('contact.getInTouch')}</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-gold mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.phone')}</h3>
                    <p className="text-gray-300">(519) 774-6314</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-gold mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.email')}</h3>
                    <p className="text-gray-300">snapauctions1@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-gold mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.location')}</h3>
                    <p className="text-gray-300">Brantford, ON</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-gold mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.businessHours')}</h3>
                    <p className="text-gray-300" data-testid="business-hours">{t('common.businessHoursText')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="bg-navy-800 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">{t('contact.followUs')}</h2>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.facebook.com/profile.php?id=100063790464096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-gold transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/snap_auctions14"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-gold transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-navy-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">{t('contact.sendMessage')}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-white mb-2">{t('common.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-navy-900 border rounded-md text-white focus:outline-none focus:border-gold ${
                    errors.name ? 'border-red-500' : 'border-navy-700'
                  }`}
                  placeholder={t('contact.namePlaceholder')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">{t('contact.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-navy-900 border rounded-md text-white focus:outline-none focus:border-gold ${
                    errors.email ? 'border-red-500' : 'border-navy-700'
                  }`}
                  placeholder={t('contact.emailPlaceholder')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-white mb-2">{t('common.subject')}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-navy-900 border rounded-md text-white focus:outline-none focus:border-gold ${
                    errors.subject ? 'border-red-500' : 'border-navy-700'
                  }`}
                >
                  <option value="">{t('contact.subjectPlaceholder')}</option>
                  <option value="bidding">{t('contact.subjects.bidding')}</option>
                  <option value="payment">{t('contact.subjects.payment')}</option>
                  <option value="shipping">{t('contact.subjects.shipping')}</option>
                  <option value="account">{t('contact.subjects.account')}</option>
                  <option value="other">{t('contact.subjects.other')}</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              
              <div className="relative">
                <label htmlFor="message" className="block text-white mb-2">{t('common.message')}</label>
                <div
                  ref={dropZoneRef}
                  className={`relative ${isDragging ? 'file-drag-active' : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-2 pb-12 bg-navy-900 border rounded-md text-white focus:outline-none focus:border-gold ${
                        errors.message ? 'border-red-500' : 'border-navy-700'
                      }`}
                      placeholder={t('contact.messagePlaceholder')}
                    ></textarea>
                    <div className="absolute left-0 bottom-0 p-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-gold transition-colors"
                        title={t('common.attachFiles')}
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />

                  {isDragging && (
                    <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm rounded-md flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <Paperclip className="h-12 w-12 text-gold mx-auto mb-2" />
                        <p className="text-white text-lg font-semibold">{t('contact.dropFiles')}</p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}

                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={file.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative ${draggedIndex === index ? 'opacity-50' : ''}`}
                      >
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move text-gray-400 hover:text-white transition-colors z-10">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="pl-8">
                          <FilePreview
                            file={file}
                            onRemove={() => removeFile(file.id)}
                            allFiles={selectedFiles}
                            index={index}
                            onReorder={reorderFiles}
                            activeFileId={activeFileId}
                            onSetActiveFile={setActiveFile}
                            isPreviewOpen={isPreviewOpen}
                            onOpenPreview={openPreview}
                            onClosePreview={closePreview}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <CustomCaptcha 
                  onVerify={setIsVerified}
                  theme="dark"
                  reset={resetCaptcha}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="btn-primary button-shine w-full"
              >
                {isSubmitting ? t('contact.sendingMessage') : isUploading ? t('contact.uploadingFiles') : t('contact.sendButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;