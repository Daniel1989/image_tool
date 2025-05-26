'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Download, 
  Settings, 
  Image as ImageIcon, 
  Sliders,
  Printer,
  ArrowLeft,
  Maximize2,
  FileImage,
  Zap,
  MessageSquare,
  ThumbsUp,
  Send,
  Shield
} from 'lucide-react';

type ToolType = 'menu' | 'resize' | 'convert' | 'resolution' | 'compress' | 'features';

interface ImageProcessingOptions {
  width: number;
  height: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio: boolean;
  resolution: number;
  resolutionUnit: 'dpi' | 'ppi';
}

interface ProcessedImage {
  originalFile: File;
  processedDataUrl: string;
  originalDimensions: { width: number; height: number };
  processedDimensions: { width: number; height: number };
  originalSize: number;
  processedSize: number;
  resolution: number;
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  userName?: string;
  userEmail?: string;
  priority: string;
  status: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

const RESOLUTION_PRESETS = [
  { label: 'Web (72 DPI)', value: 72, description: 'For screen display' },
  { label: 'Print (300 DPI)', value: 300, description: 'High quality print' },
  { label: 'Professional (600 DPI)', value: 600, description: 'Ultra high quality' },
];

const MENU_ITEMS = [
  {
    id: 'resize' as ToolType,
    title: 'Resize Image',
    description: 'Change image dimensions',
    icon: Maximize2,
    color: 'blue'
  },
  {
    id: 'convert' as ToolType,
    title: 'Convert Format',
    description: 'Change image format (JPEG, PNG, WebP)',
    icon: FileImage,
    color: 'green'
  },
  {
    id: 'resolution' as ToolType,
    title: 'Set Resolution',
    description: 'Set DPI/PPI for printing',
    icon: Printer,
    color: 'purple'
  },
  {
    id: 'compress' as ToolType,
    title: 'Compress Image',
    description: 'Reduce file size with quality control',
    icon: Zap,
    color: 'orange'
  },
  {
    id: 'features' as ToolType,
    title: 'Feature Requests',
    description: 'Submit and view feature requests',
    icon: MessageSquare,
    color: 'teal'
  }
];

export default function ImageTools() {
  const [currentTool, setCurrentTool] = useState<ToolType>('menu');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<ImageProcessingOptions>({
    width: 800,
    height: 600,
    quality: 90,
    format: 'jpeg',
    maintainAspectRatio: true,
    resolution: 72,
    resolutionUnit: 'dpi'
  });

  // Feature requests state
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    userName: '',
    userEmail: '',
    priority: 'MEDIUM'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        const img = new Image();
        img.onload = () => {
          setOptions(prev => ({
            ...prev,
            width: img.width,
            height: img.height
          }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
      setProcessedImage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const updateDimensions = (newWidth: number, newHeight: number) => {
    if (options.maintainAspectRatio && uploadedImage && imagePreview) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (newWidth !== options.width) {
          setOptions(prev => ({
            ...prev,
            width: newWidth,
            height: Math.round(newWidth / aspectRatio)
          }));
        } else if (newHeight !== options.height) {
          setOptions(prev => ({
            ...prev,
            width: Math.round(newHeight * aspectRatio),
            height: newHeight
          }));
        }
      };
      img.src = imagePreview;
    } else {
      setOptions(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }));
    }
  };

  const calculatePrintSize = () => {
    const widthInches = (options.width / options.resolution).toFixed(2);
    const heightInches = (options.height / options.resolution).toFixed(2);
    const widthCm = (parseFloat(widthInches) * 2.54).toFixed(2);
    const heightCm = (parseFloat(heightInches) * 2.54).toFixed(2);
    
    return {
      inches: `${widthInches}" × ${heightInches}"`,
      cm: `${widthCm}cm × ${heightCm}cm`
    };
  };

  const processImage = async () => {
    if (!uploadedImage || !imagePreview || !canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = options.width;
        canvas.height = options.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, options.width, options.height);
        
        const mimeType = `image/${options.format}`;
        const quality = options.quality / 100;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              setProcessedImage({
                originalFile: uploadedImage,
                processedDataUrl: reader.result as string,
                originalDimensions: { width: img.width, height: img.height },
                processedDimensions: { width: options.width, height: options.height },
                originalSize: uploadedImage.size,
                processedSize: blob.size,
                resolution: options.resolution,
              });
              setIsProcessing(false);
            };
            reader.readAsDataURL(blob);
          }
        }, mimeType, quality);
      };
      img.src = imagePreview;
    } catch (error) {
      console.error('Error processing image:', error);
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.download = `${currentTool}_${uploadedImage?.name?.split('.')[0] || 'image'}.${options.format}`;
    link.href = processedImage.processedDataUrl;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetToMenu = () => {
    setCurrentTool('menu');
    setProcessedImage(null);
  };

  const selectTool = (tool: ToolType) => {
    setCurrentTool(tool);
    setProcessedImage(null);
    if (tool === 'features') {
      fetchFeatureRequests();
    }
  };

  // Feature request functions
  const fetchFeatureRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/feature-requests');
      if (response.ok) {
        const data = await response.json();
        setFeatureRequests(data);
      }
    } catch (error) {
      console.error('Error fetching feature requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeatureRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });

      if (response.ok) {
        setNewRequest({
          title: '',
          description: '',
          userName: '',
          userEmail: '',
          priority: 'MEDIUM'
        });
        fetchFeatureRequests();
      }
    } catch (error) {
      console.error('Error submitting feature request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteOnFeature = async (id: string) => {
    try {
      const response = await fetch(`/api/feature-requests/${id}/vote`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchFeatureRequests();
      }
    } catch (error) {
      console.error('Error voting on feature request:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Menu View
  if (currentTool === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-3">
              <ImageIcon className="w-10 h-10 text-blue-600" />
              Image Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose a tool to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {MENU_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => selectTool(item.id)}
                  className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-left group`}
                >
                  <div className={`w-12 h-12 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Admin Link */}
          <div className="mt-8 text-center">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Feature Request View
  if (currentTool === 'features') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={resetToMenu}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Feature Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Submit ideas for new features or vote on existing ones
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Submit New Request */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Submit Feature Request
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Feature Title *
                    </label>
                    <input
                      type="text"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Add batch processing support"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the feature in detail..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={newRequest.userName}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, userName: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={newRequest.userEmail}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, userEmail: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <button
                    onClick={submitFeatureRequest}
                    disabled={isSubmitting || !newRequest.title.trim() || !newRequest.description.trim()}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Requests List */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  All Feature Requests
                </h2>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
                  </div>
                ) : featureRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No feature requests yet. Be the first to submit one!
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {featureRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {request.title}
                          </h3>
                          <button
                            onClick={() => voteOnFeature(request.id)}
                            className="flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm font-medium">{request.votes}</span>
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {request.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {request.userName && (
                              <span>{request.userName} • </span>
                            )}
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tool View
  const currentMenuItem = MENU_ITEMS.find(item => item.id === currentTool);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={resetToMenu}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentMenuItem?.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {currentMenuItem?.description}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload and Controls */}
          <div className="space-y-6">
            {/* File Upload - Only show for image tools */}
            {['resize', 'convert', 'resolution', 'compress'].includes(currentTool) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Image
                </h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600 dark:text-blue-400">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Supports: JPEG, PNG, GIF, BMP, WebP
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tool-Specific Controls */}
            {uploadedImage && ['resize', 'convert', 'resolution', 'compress'].includes(currentTool) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {currentMenuItem?.title} Settings
                </h2>

                <div className="space-y-4">
                  {/* Resize Tool */}
                  {currentTool === 'resize' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dimensions (Pixels)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                            <input
                              type="number"
                              value={options.width}
                              onChange={(e) => updateDimensions(parseInt(e.target.value) || 0, options.height)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
                            <input
                              type="number"
                              value={options.height}
                              onChange={(e) => updateDimensions(options.width, parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={options.maintainAspectRatio}
                            onChange={(e) => setOptions(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Maintain aspect ratio</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Convert Tool */}
                  {currentTool === 'convert' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Format
                      </label>
                      <select
                        value={options.format}
                        onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value as 'jpeg' | 'png' | 'webp' }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                  )}

                  {/* Resolution Tool */}
                  {currentTool === 'resolution' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Resolution Preset
                        </label>
                        <div className="space-y-2">
                          {RESOLUTION_PRESETS.map((preset) => (
                            <button
                              key={preset.value}
                              onClick={() => setOptions(prev => ({ ...prev, resolution: preset.value }))}
                              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                                options.resolution === preset.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium">{preset.label}</div>
                              <div className="text-sm text-gray-500">{preset.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Print Size</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {calculatePrintSize().inches} ({calculatePrintSize().cm})
                        </p>
                      </div>
                    </>
                  )}

                  {/* Compress Tool */}
                  {currentTool === 'compress' && options.format !== 'png' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quality: {options.quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={options.quality}
                        onChange={(e) => setOptions(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Smaller file</span>
                        <span>Better quality</span>
                      </div>
                    </div>
                  )}

                  {/* Process Button */}
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sliders className="w-4 h-4" />
                        Apply {currentMenuItem?.title}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview and Results */}
          <div className="space-y-6">
            {/* Original Image Preview */}
            {imagePreview && ['resize', 'convert', 'resolution', 'compress'].includes(currentTool) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Original Image
                </h2>
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>File: {uploadedImage?.name}</p>
                  <p>Size: {formatFileSize(uploadedImage?.size || 0)}</p>
                </div>
              </div>
            )}

            {/* Processed Image */}
            {processedImage && ['resize', 'convert', 'resolution', 'compress'].includes(currentTool) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Processed Image
                </h2>
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={processedImage.processedDataUrl}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Results */}
                <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>{processedImage.processedDimensions.width} × {processedImage.processedDimensions.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span>{formatFileSize(processedImage.processedSize)}</span>
                  </div>
                  {currentTool === 'resolution' && (
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span>{processedImage.resolution} DPI</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadProcessedImage}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Result
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
