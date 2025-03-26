import { createContext, useContext, useState, ReactNode } from "react";

export type DetectionState = "idle" | "loading" | "detected" | "notDetected" | "error";

export interface ResultData {
  confidence: number;
  tumorLocation?: string;
  tumorSize?: string;
  intensityChar?: string;
  scanQuality?: string;
  areasExamined?: string;
}

interface BrainTumorContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  originalImageUrl: string;
  setOriginalImageUrl: (url: string) => void;
  processedImageUrl: string;
  setProcessedImageUrl: (url: string) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  detectionState: DetectionState;
  setDetectionState: (state: DetectionState) => void;
  resultData: ResultData;
  setResultData: (data: ResultData) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  resetState: () => void;
}

const BrainTumorContext = createContext<BrainTumorContextType | undefined>(undefined);

export const BrainTumorProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [detectionState, setDetectionState] = useState<DetectionState>("idle");
  const [resultData, setResultData] = useState<ResultData>({ confidence: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const resetState = () => {
    setFile(null);
    setOriginalImageUrl("");
    setProcessedImageUrl("");
    setUploadProgress(0);
    setErrorMessage("");
    setDetectionState("idle");
    setResultData({ confidence: 0 });
    setIsProcessing(false);
    setIsUploading(false);
  };

  return (
    <BrainTumorContext.Provider
      value={{
        file,
        setFile,
        originalImageUrl,
        setOriginalImageUrl,
        processedImageUrl,
        setProcessedImageUrl,
        uploadProgress,
        setUploadProgress,
        errorMessage,
        setErrorMessage,
        detectionState,
        setDetectionState,
        resultData,
        setResultData,
        isProcessing,
        setIsProcessing,
        isUploading,
        setIsUploading,
        resetState,
      }}
    >
      {children}
    </BrainTumorContext.Provider>
  );
};

export const useBrainTumorContext = () => {
  const context = useContext(BrainTumorContext);
  if (context === undefined) {
    throw new Error("useBrainTumorContext must be used within a BrainTumorProvider");
  }
  return context;
};
