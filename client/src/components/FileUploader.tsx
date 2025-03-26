import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { useBrainTumorContext } from '@/context/BrainTumorContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/tumorDetection';

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFile, setOriginalImageUrl, setUploadProgress, setErrorMessage, setIsUploading } = useBrainTumorContext();
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG).');
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPG, PNG).",
        variant: "destructive"
      });
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      toast({
        title: "File too large",
        description: "File size exceeds the 10MB limit.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!validateFile(file)) return;
      
      setFile(file);
      setErrorMessage('');
      setIsUploading(true);
      
      try {
        await processUpload(file);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        setErrorMessage(message);
        toast({
          title: "Upload Failed",
          description: message,
          variant: "destructive"
        });
        setIsUploading(false);
      }
    }
  };

  const processUpload = async (file: File) => {
    try {
      // Start with reading the file for local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setOriginalImageUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Now upload to server with progress tracking
      await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (!validateFile(file)) return;
      
      setFile(file);
      setErrorMessage('');
      setIsUploading(true);
      
      try {
        await processUpload(file);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        setErrorMessage(message);
        toast({
          title: "Upload Failed",
          description: message,
          variant: "destructive"
        });
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-neutral-200'} rounded-lg p-8 text-center`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <span className="material-icons text-primary text-5xl">upload_file</span>
        <div className="text-neutral-500">
          <p className="font-medium">Drag and drop your MRI scan here</p>
          <p className="text-sm">or</p>
        </div>
        <Button 
          onClick={handleUploadClick}
          className="inline-flex items-center"
        >
          <span className="material-icons text-sm mr-1">file_upload</span>
          Browse Files
        </Button>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/jpg"
        />
        <p className="text-xs text-neutral-400">Maximum file size: 10MB</p>
      </div>
    </div>
  );
}
