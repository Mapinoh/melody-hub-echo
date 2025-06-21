
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import EnhancedUpload from '@/components/EnhancedUpload';

const Upload = () => {
  return (
    <SharedLayout>
      <div className="p-4 pb-24">
        <EnhancedUpload />
      </div>
    </SharedLayout>
  );
};

export default Upload;
