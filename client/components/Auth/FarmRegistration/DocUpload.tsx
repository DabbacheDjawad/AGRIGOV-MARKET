"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function DocumentUpload({ file, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    onChange(picked);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="md:col-span-2 mt-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
        Business Verification
      </h4>

      {file ? (
        /* File selected — show name + remove button */
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl border border-primary/50 bg-primary/5 dark:bg-primary/5">
          <span className="material-icons text-primary-dark dark:text-primary">
            insert_drive_file
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-icons text-sm">close</span>
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload document"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`flex justify-center rounded-xl border-2 border-dashed px-6 pt-5 pb-6 transition-colors cursor-pointer group ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-white/5 hover:bg-primary/5 hover:border-primary/50"
          }`}
        >
          <div className="space-y-1 text-center pointer-events-none">
            <div
              className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm transition-colors ${
                isDragging ? "text-primary" : "text-gray-400 group-hover:text-primary"
              }`}
            >
              <span className="material-icons text-2xl">cloud_upload</span>
            </div>
            <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
              <span className="font-medium text-primary-dark dark:text-primary">
                Upload a file
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Land Title Deed or Business Registration (PDF, PNG, JPG up to 10MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id="file-upload"
        name="file-upload"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}