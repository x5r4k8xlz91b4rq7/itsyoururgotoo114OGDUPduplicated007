import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      support: {
        title: 'Contact',
        highlight: 'Support',
        subtitle: 'Get help with your AI catering solutions. Multiple support channels available including phone, email, and live chat.',
        phoneSupport: 'Phone Support',
        phoneDesc: 'Speak directly with our AI specialists',
        emailSupport: 'Email Support', 
        emailDesc: 'Send us a detailed message',
        hours: 'Support Hours',
        hoursDesc: 'Our support team is available during the following hours:',
        successMessage: 'Your support request has been submitted successfully!',
        errorMessage: 'There was an error submitting your request. Please try again.',
        emailOnlySuccess: ' Your message was sent via email.',
        submitButton: 'Submit Support Request',
        topics: {
          bidding: 'Bidding',
          payment: 'Payment',
          shipping: 'Shipping', 
          account: 'Account',
          other: 'Other'
        }
      },
      contact: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Email is invalid',
        subjectRequired: 'Subject is required',
        messageRequired: 'Message is required',
        sendMessage: 'Send Message',
        namePlaceholder: 'Enter your full name',
        emailPlaceholder: 'Enter your email address',
        subjectPlaceholder: 'Select a subject',
        messagePlaceholder: 'Type your message here...',
        dropFiles: 'Drop files here to attach',
        sendingMessage: 'Sending Message...',
        uploadingFiles: 'Uploading Files...',
        verifyRequired: 'Please complete the verification',
        partialSuccess: 'Processed {processed} of {total} files.'
      },
      common: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        attachFiles: 'Attach Files',
        pleaseFixErrors: 'Please fix the errors',
        generalError: 'An error occurred. Please try again.',
        notImageFile: 'is not an image file',
        tooLarge: 'is too large (max 5MB)',
        closed: 'Closed',
        holidays: 'Holidays',
        orClickSides: 'or click sides',
        orClickSidesSr: 'You can also click the left or right side of the image to navigate',
        previous: 'Previous',
        next: 'Next'
      },
      captcha: {
        notRobot: "I'm not a robot"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;