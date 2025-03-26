import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FileUploader from "./FileUploader";
import { useBrainTumorContext } from "@/context/BrainTumorContext";

export default function UploadSection() {
  const { uploadProgress, errorMessage, isUploading } = useBrainTumorContext();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">Upload MRI Scan</h2>
        <p className="text-neutral-500 mb-6">
          Upload a brain MRI scan image to detect potential tumors. Supported formats: JPG, PNG, JPEG
        </p>
        
        <FileUploader />
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <span className="text-sm font-medium text-neutral-500">
                {uploadProgress}%
              </span>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {errorMessage && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
