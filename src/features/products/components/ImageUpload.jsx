import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';

const ImageUpload = ({ label, images, onImagesChange, required = false, error }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    onImagesChange([...images, ...newImages]);
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: true
  });

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-400 bg-blue-50' :
          error ? 'border-red-300 bg-red-50' :
          'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Drop files here...' : 'Drag & drop images or click to select'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Supports: JPEG, PNG, GIF, WebP</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" /> {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => {
              // Handle both string URLs and object formats
              const imgSrc = typeof image === 'string' ? image : image.preview;
              const imgName = typeof image === 'string' 
                ? image.split('/').pop() 
                : image.name;

              return (
                <div key={index} className="relative group">
                  <img
                    src={imgSrc}
                    alt={imgName}
                    className="w-full h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{imgName}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;