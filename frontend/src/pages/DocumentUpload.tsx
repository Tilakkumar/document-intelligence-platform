import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadDocument } from '../services/api';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  result?: any;
  error?: string;
}

const DocumentUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    for (const fileObj of newFiles) {
      try {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        
        const result = await uploadDocument(formData, (progress) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileObj.id 
                ? { ...f, progress }
                : f
            )
          );
        });

        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'success', progress: 100, result }
              : f
          )
        );

        toast.success(`Successfully uploaded ${fileObj.file.name}`);
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'error', error: error.message }
              : f
          )
        );
        toast.error(`Failed to upload ${fileObj.file.name}`);
      }
    }

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'txt':
        return <FileText className="h-8 w-8 text-gray-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-8 w-8 text-green-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600">
          Upload documents for intelligent analysis and processing. Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 text-lg">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 text-lg mb-2">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-gray-400 text-sm">
              Maximum file size: 10MB
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-4">
            {uploadedFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fileObj.file.name)}
                    <div>
                      <p className="font-medium text-gray-900">{fileObj.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {fileObj.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fileObj.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{fileObj.progress}%</span>
                      </div>
                    )}
                    
                    {fileObj.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    
                    {fileObj.status === 'error' && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm text-red-600">{fileObj.error}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {fileObj.result && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Processing Results</h4>
                    <div className="text-sm text-gray-600">
                      <p><strong>Document ID:</strong> {fileObj.result.id}</p>
                      <p><strong>Content Type:</strong> {fileObj.result.contentType}</p>
                      <p><strong>Processing Status:</strong> {fileObj.result.status}</p>
                      {fileObj.result.entities && (
                        <p><strong>Entities Found:</strong> {fileObj.result.entities.length}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;