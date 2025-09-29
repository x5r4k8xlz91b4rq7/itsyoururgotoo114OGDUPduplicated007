"use client"

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmissionWarning: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background border p-6 rounded-lg shadow-xl max-w-sm mx-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h3 className="font-semibold text-foreground">Submitting Request</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Please wait while we process your support request...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionWarning;