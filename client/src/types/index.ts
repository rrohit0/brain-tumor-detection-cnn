export interface AnalysisResult {
  prediction: 'no' | 'yes';
  confidence: number;
  processedImageUrl: string;
  warningMessage?: string;
  tumorLocation?: string;
  tumorSize?: string;
  intensityChar?: string;
  scanQuality?: string;
  areasExamined?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}
