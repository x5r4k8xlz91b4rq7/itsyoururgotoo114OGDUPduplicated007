'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Clock, Paperclip, GripVertical } from 'lucide-react';
import FilePreview from './FilePreview';
import Notification from './Notification';
import CustomCaptcha from './CustomCaptcha';
import SubmissionWarning from './SubmissionWarning';
import { useFileUpload } from '../hooks/useFileUpload';
import { submitSupportRequest } from '../services/supabaseForm';
import { sendSupportEmail } from '../services/email';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Support = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
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
    clearFiles
  } = useFileUpload();

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
            showNotification('error', `${file.name} is not an image file`);
            return false;
          }
          if (file.size > 5 * 1024 * 1024) {
            showNotification('error', `${file.name} is too large (max 5MB)`);
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
  }, [addFiles, showNotification]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      showNotification('error', 'Please fix the errors');
      return;
    }

    if (!isVerified) {
      showNotification('error', 'Please complete the verification');
      return;
    }

    setIsSubmitting(true);

    try {
      const fileUrls = selectedFiles.map(f => f.name);

      const dbResult = await submitSupportRequest(formData, fileUrls);
      
      const emailResult = await sendSupportEmail(formData, selectedFiles);
      
      if (dbResult.success || emailResult?.success) {
        let message = 'Your support request has been submitted successfully!';
        
        if (emailResult && !emailResult.complete) {
          message += ` Processed ${emailResult.processedCount} of ${emailResult.totalCount} files.`;
        }
        
        if (!dbResult.success && emailResult?.success) {
          message += ' Your message was sent via email.';
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
        showNotification('error', 'There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
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
    if (errors[name as keyof FormData]) {
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
          showNotification('error', `${file.name} is not an image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification('error', `${file.name} is too large (max 5MB)`);
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
          showNotification('error', `${file.name} is not an image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification('error', `${file.name} is too large (max 5MB)`);
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
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-background via-background to-primary/5">
      {notification && <Notification type={notification.type} message={notification.message} />}
      {isSubmitting && <SubmissionWarning />}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            Contact <span className="gradient-text">Support</span>
          </h1>
          <p className="text-muted-foreground">
            Get help with your AI catering solutions. Multiple support channels available including phone, email, and live chat.
          </p>
        </div>

        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Phone Support Card */}
          <div className="glass-card bg-blue-900/20 border-blue-800/30 p-8 rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <Phone className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Phone Support</h2>
            <p className="text-gray-300 mb-4">
              Speak directly with our AI specialists
            </p>
            <a href="tel:+15197746314" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              (519) 774-6314
            </a>
          </div>

          {/* Email Support Card */}
          <div className="glass-card bg-blue-900/20 border-blue-800/30 p-8 rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <Mail className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Email Support</h2>
            <p className="text-gray-300 mb-4">
              Send us a detailed message
            </p>
            <a href="mailto:snapauctions1@gmail.com" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              snapauctions1@gmail.com
            </a>
          </div>
        </div>

        {/* Support Hours Card */}
        <div className="glass-card bg-blue-900/20 border-blue-800/30 p-8 rounded-lg mb-12 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-white">Support Hours</h2>
          </div>
          <div className="space-y-4 text-gray-300">
            <p>Our support team is available during the following hours:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Monday - Friday: 9:00 AM - 5:00 PM EST</li>
              <li>Saturday - Sunday: Closed</li>
              <li>Holidays: Closed</li>
            </ul>
          </div>
        </div>

        {/* Send Message Card */}
        <div className="glass-card bg-blue-900/20 border-blue-800/30 p-8 rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-white">Send Message</h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-white mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.name ? 'border-red-500' : 'border-blue-800/50'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.email ? 'border-red-500' : 'border-blue-800/50'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-white mb-2">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.subject ? 'border-red-500' : 'border-blue-800/50'
                }`}
              >
                <option value="">Select a subject</option>
                <option value="bidding">Bidding</option>
                <option value="payment">Payment</option>
                <option value="shipping">Shipping</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>
              {errors.subject && (
                <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="message" className="block text-white mb-2">Message</label>
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
                    className={`w-full px-4 py-3 pb-12 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                      errors.message ? 'border-red-500' : 'border-blue-800/50'
                    }`}
                    placeholder="Type your message here..."
                  ></textarea>
                  <div className="absolute left-0 bottom-0 p-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-400 hover:text-primary transition-colors"
                      title="Attach Files"
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
                  <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm rounded-md flex items-center justify-center pointer-events-none border-2 border-primary">
                    <div className="text-center">
                      <Paperclip className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-white text-lg font-semibold">Drop files here to attach</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
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
                          showClickSides={true}
                          isPreviewOpen={isPreviewOpen}
                          onOpenPreview={openPreview}
                          onClosePreview={closePreview}
                          showClickSides={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <CustomCaptcha 
                onVerify={setIsVerified}
                theme="dark"
                reset={resetCaptcha}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 button-shine"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending Message...
                </>
              ) : (
                'Submit Support Request'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;