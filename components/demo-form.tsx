"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import CustomCaptcha from '@/components/CustomCaptcha'
import { Send, Paperclip, GripVertical } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'
import FilePreview from '@/components/FilePreview'
import FilePreviewModal from '@/components/FilePreviewModal'
import Notification from '@/components/Notification'
import SubmissionWarning from '@/components/SubmissionWarning'

interface DemoFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export default function DemoForm({ 
  isOpen,
  onOpenChange,
  title = "Schedule Your Demo", 
  description = "Get a personalized demo of our AI catering solutions" 
}: DemoFormProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [resetCaptcha, setResetCaptcha] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null)

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

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
  } = useFileUpload()

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const validFiles = filesArray.filter(file => {
        if (!file.type.startsWith('image/')) {
          showNotification('error', `${file.name} is not an image file`)
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification('error', `${file.name} is too large (max 5MB)`)
          return false
        }
        return true
      })
      if (validFiles.length > 0) {
        addFiles(validFiles)
      }
      // Reset the file input
      e.target.value = ''
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'reorder'); // Mark as reorder operation
  };

  const handleLocalDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set dragging state if it's a file drop, not a reorder
    if (!e.dataTransfer.types.includes('text/plain')) {
      setIsDragging(true)
    }
  }

  const handleLocalDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only reset dragging state if it's a file drop, not a reorder
    if (!e.dataTransfer.types.includes('text/plain')) {
      setIsDragging(false)
    }
  }

  const handleLocalDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleLocalDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault()
    e.stopPropagation()

    const isReorderOperation = e.dataTransfer.types.includes('text/plain');
    
    if (typeof dropIndex === 'number' && draggedIndex !== null) {
      reorderFiles(draggedIndex, dropIndex);
      setDraggedIndex(null);
      return;
    }
    
    // Only reset dragging state if it's not a reorder operation
    if (!isReorderOperation) {
      setIsDragging(false)
    }
    
    // Only process file drops if it's not a reorder operation
    if (!isReorderOperation && e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files)
      const validFiles = filesArray.filter(file => {
        if (!file.type.startsWith('image/')) {
          showNotification('error', `${file.name} is not an image file`)
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification('error', `${file.name} is too large (max 5MB)`)
          return false
        }
        return true
      })
      if (validFiles.length > 0) {
        addFiles(validFiles)
      }
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false); // Reset any dragging state
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isVerified) {
      showNotification('error', 'Please complete the verification')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Handle form submission here
      console.log('Contact form submitted:', contactForm)
      
      showNotification('success', "Demo request submitted! We'll contact you within 24 hours to schedule your personalized demo.")
      
      onOpenChange(false)
      setContactForm({
        fullName: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      })
      
      clearFiles()
      
      setIsVerified(false)
      setResetCaptcha(prev => !prev)
    } catch (error) {
      showNotification('error', 'Something went wrong. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing the form when image preview is open
      if (!open && isPreviewOpen) {
        return; // Don't allow closing
      }
      onOpenChange(open);
    }}>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {isSubmitting && <SubmissionWarning />}
      <DialogContent 
        className="sm:max-w-md glass-card border-2 border-primary max-h-[90vh] flex flex-col shadow-xl shadow-primary/25"
        onEscapeKeyDown={(e) => {
          // Prevent Escape from closing the form when preview is open
          if (isPreviewOpen) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          // Prevent clicking outside from closing the form when preview is open
          if (isPreviewOpen) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Prevent any outside interaction from closing the form when preview is open
          if (isPreviewOpen) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text mb-2">
            {title}
          </DialogTitle>
          <p className="text-muted-foreground">
            {description}
          </p>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 px-1">
          <form onSubmit={handleContactSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={contactForm.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  required
                  value={contactForm.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your catering business"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@business.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Tell us about your needs *</Label>
              <div
                ref={dropZoneRef}
                className={`relative ${isDragging ? 'file-drag-active' : ''}`}
                onDragEnter={handleLocalDragEnter}
                onDragLeave={handleLocalDragLeave}
                onDragOver={handleLocalDragOver}
                onDrop={handleLocalDrop}
              >
                <div className="relative">
                  <Textarea
                    id="message"
                    required
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="What challenges are you facing with lead management, customer service, or operations?"
                    className="min-h-[100px] pb-12 resize-none"
                  />
                  <div className="absolute left-0 bottom-0 p-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                     className="text-gray-500 opacity-60 hover:text-primary hover:opacity-100 transition-all"
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
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={file.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleLocalDragOver}
                      onDrop={(e) => handleLocalDrop(e, index)}
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
            <div className="mt-6 mb-6">
              <img
                src="https://i.postimg.cc/52vMpD47/Video.gif"
                alt="Demo preview animation"
                loading="lazy"
                decoding="async"
                className="w-full h-auto max-h-[160px] sm:max-h-[200px] md:max-h-[240px] object-contain rounded-lg border border-border/50 ring-1 ring-primary/10"
              />
            </div>
            <CustomCaptcha
              onVerify={setIsVerified}
              reset={resetCaptcha}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Schedule Demo
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    {(() => {
      if (isPreviewOpen && activeFileId) {
        const activeFileIndex = selectedFiles.findIndex(file => file.id === activeFileId);
        
        // Convert selectedFiles to PreviewItem format
        const previewItems = selectedFiles.map(file => ({
          id: file.id,
          name: file.name,
          type: 'file' as const,
          data: file
        }));
        
        if (activeFileIndex !== -1) {
          return createPortal(
            <FilePreviewModal
              showClickSides={true}
              items={previewItems}
              currentIndex={activeFileIndex}
              onClose={closePreview}
              onDelete={() => {
                removeFile(activeFileId);
                // If no more files, close preview but keep form open
                if (selectedFiles.length <= 1) {
                  closePreview();
                }
              }}
              onReorder={reorderFiles}
              onSetActiveFile={setActiveFile}
            />,
            document.body
          )
        }
      }
      return null
    })()}
    </>
  )
}