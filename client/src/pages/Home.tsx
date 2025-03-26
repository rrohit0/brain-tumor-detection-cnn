import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import ImagePreviewSection from "@/components/ImagePreviewSection";
import ResultsSection from "@/components/ResultsSection";
import InfoSection from "@/components/InfoSection";
import { useBrainTumorContext } from "@/context/BrainTumorContext";
import { analyzeImage } from "@/lib/tumorDetection";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { 
    file, 
    originalImageUrl, 
    processedImageUrl,
    setProcessedImageUrl,
    setDetectionState,
    setResultData,
    detectionState,
    setIsProcessing,
    isUploading
  } = useBrainTumorContext();
  const { toast } = useToast();

  // When the file is uploaded, start the analysis process
  useEffect(() => {
    const performAnalysis = async () => {
      if (file && originalImageUrl && !isUploading && detectionState === "idle") {
        try {
          setDetectionState("loading");
          setIsProcessing(true);
          
          // Create a new FormData object to send the file to the backend
          const formData = new FormData();
          formData.append("image", file);
          
          // Send the file to the backend for analysis
          const response = await fetch("/api/analyze", {
            method: "POST",
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Analysis failed: ${response.statusText}`);
          }
          
          const result = await response.json();
          
          // Update the state with the results
          setProcessedImageUrl(result.processedImageUrl);
          setResultData({
            confidence: result.confidence,
            tumorLocation: result.tumorLocation,
            tumorSize: result.tumorSize,
            intensityChar: result.intensityChar,
            scanQuality: result.scanQuality,
            areasExamined: result.areasExamined
          });
          
          setDetectionState(result.prediction === 'yes' ? "detected" : "notDetected");
          
        } catch (error) {
          console.error("Analysis error:", error);
          setDetectionState("error");
          toast({
            title: "Analysis Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    performAnalysis();
  }, [file, originalImageUrl, isUploading]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Show upload section when no file is uploaded */}
          {!originalImageUrl && <UploadSection />}
          
          {/* Show preview and results when file is uploaded */}
          {originalImageUrl && (
            <>
              <ImagePreviewSection />
              <ResultsSection />
            </>
          )}
          
          <InfoSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
