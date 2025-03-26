import { Button } from "@/components/ui/button";
import { useBrainTumorContext } from "@/context/BrainTumorContext";

export default function ImagePreviewSection() {
  const { 
    originalImageUrl, 
    processedImageUrl, 
    resetState, 
    isProcessing 
  } = useBrainTumorContext();

  const handleDownload = () => {
    // Create a temporary link to download the processed image
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = 'processed-mri-scan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">MRI Scan Preview</h2>
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Original Image Preview */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-neutral-500 mb-2">Original Image</h3>
            <div className="bg-neutral-50 rounded-lg p-2 border border-neutral-200 relative">
              <img 
                src={originalImageUrl} 
                alt="Original MRI scan" 
                className="max-w-full h-auto max-h-80 mx-auto rounded object-contain" 
              />
            </div>
          </div>
          
          {/* Processed Image Preview */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-neutral-500 mb-2">Processed Image</h3>
            <div className="bg-neutral-50 rounded-lg p-2 border border-neutral-200 relative">
              <img 
                src={processedImageUrl || originalImageUrl} 
                alt="Processed MRI scan" 
                className="max-w-full h-auto max-h-80 mx-auto rounded object-contain" 
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                  <div className="text-center">
                    <span className="material-icons text-primary animate-pulse text-4xl">pending</span>
                    <p className="mt-2 text-sm text-neutral-700">Processing image...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Image Controls */}
        <div className="mt-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            className="inline-flex items-center"
            onClick={resetState}
          >
            <span className="material-icons text-sm mr-1">autorenew</span>
            Upload Different Image
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="inline-flex items-center"
              onClick={handleDownload}
              disabled={!processedImageUrl || isProcessing}
            >
              <span className="material-icons text-sm mr-1">download</span>
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
