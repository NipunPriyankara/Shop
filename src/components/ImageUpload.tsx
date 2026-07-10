'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Upload Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate size (e.g. 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success('Image uploaded successfully ✅');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2.5">
      {label && (
        <span className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative group w-full h-48 bg-luxury-bg-secondary/40 border border-black/10 flex items-center justify-center overflow-hidden">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="p-2 bg-white text-charcoal-dark hover:bg-[#c99b8f] hover:text-white transition-colors"
              title="Replace Image"
            >
              <UploadCloud className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-white text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`w-full h-48 border border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-6 text-center ${
            dragActive
              ? 'border-[#c99b8f] bg-[#c99b8f]/5 scale-[0.99]'
              : 'border-black/10 hover:border-black/30 hover:bg-black/[0.01]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#c99b8f] animate-spin" />
              <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                Uploading image...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-luxury-bg-secondary flex items-center justify-center mb-1">
                <UploadCloud className="w-5 h-5 text-charcoal-muted" />
              </div>
              <span className="text-xs font-bold text-charcoal-dark uppercase tracking-wider">
                Drag & Drop or Click to Upload
              </span>
              <span className="text-[10px] text-charcoal-muted uppercase tracking-widest">
                PNG, JPG, WEBP (MAX 5MB)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
