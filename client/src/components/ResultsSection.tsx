import { Button } from "@/components/ui/button";
import { useBrainTumorContext } from "@/context/BrainTumorContext";
import { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultsSection() {
  const { detectionState, resultData } = useBrainTumorContext();
  const [headerStyle, setHeaderStyle] = useState("bg-blue-500");
  const [headerIcon, setHeaderIcon] = useState("pending");
  const [headerTitle, setHeaderTitle] = useState("Processing");

  // Update header styles based on detection state
  useEffect(() => {
    switch (detectionState) {
      case "loading":
        setHeaderStyle("bg-blue-500");
        setHeaderIcon("pending");
        setHeaderTitle("Processing");
        break;
      case "detected":
        setHeaderStyle("bg-red-500");
        setHeaderIcon("error");
        setHeaderTitle("Tumor Detected");
        break;
      case "notDetected":
        setHeaderStyle("bg-green-500");
        setHeaderIcon("check_circle");
        setHeaderTitle("No Tumor Detected");
        break;
      case "error":
        setHeaderStyle("bg-orange-500");
        setHeaderIcon("warning");
        setHeaderTitle("Analysis Error");
        break;
      default:
        setHeaderStyle("bg-blue-500");
        setHeaderIcon("pending");
        setHeaderTitle("Processing");
    }
  }, [detectionState]);

  const handleExportReport = async () => {
    try {
      const resultsElement = document.getElementById('results-section');
      if (!resultsElement) return;
      
      const canvas = await html2canvas(resultsElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add title
      pdf.setFontSize(18);
      pdf.text('Brain Tumor Analysis Report', 20, 20);
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      
      // Add image (scaled to fit page width with some margins)
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save('brain-tumor-analysis.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const subject = "Brain Tumor Analysis Results";
    const body = `Analysis Results:\n\nDetection Status: ${headerTitle}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" id="results-section">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">Analysis Results</h2>
        
        {/* Results Card */}
        <div className="rounded-lg border overflow-hidden">
          {/* Card Header */}
          <div className={`p-4 text-white font-medium flex items-center text-lg justify-between ${headerStyle}`}>
            <div className="flex items-center">
              <span className="material-icons mr-2">{headerIcon}</span>
              <span>{headerTitle}</span>
            </div>
          </div>
          
          {/* Card Body */}
          <div className="bg-white p-6">
            {/* Loading Result */}
            {detectionState === "loading" && (
              <div className="flex flex-col items-center justify-center py-6">
                <span className="material-icons text-primary animate-pulse text-4xl">pending</span>
                <p className="mt-4 text-center text-neutral-700">Analyzing MRI scan...</p>
                <p className="mt-1 text-sm text-neutral-500">This may take a few moments</p>
              </div>
            )}
            
            {/* Tumor Detected Result */}
            {detectionState === "detected" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Tumor Detected</h3>
                  <p className="mt-1 text-neutral-500">
                    The algorithm has detected characteristics consistent with a brain tumor in the provided MRI scan.
                  </p>
                </div>
                
                <div className="border-t border-b border-neutral-200 py-4">
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">Detection Details</h4>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-neutral-500">Tumor Location</dt>
                      <dd className="mt-1 text-sm text-neutral-700">{resultData.tumorLocation}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-neutral-500">Approximate Size</dt>
                      <dd className="mt-1 text-sm text-neutral-700">{resultData.tumorSize}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-neutral-500">Intensity Characteristics</dt>
                      <dd className="mt-1 text-sm text-neutral-700">{resultData.intensityChar}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="material-icons text-yellow-400">info</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          This is an AI-assisted analysis and should not be used as the sole basis for medical diagnosis. 
                          Please consult with a qualified radiologist or neurologist for proper diagnosis and treatment options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* No Tumor Result */}
            {detectionState === "notDetected" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">No Tumor Detected</h3>
                  <p className="mt-1 text-neutral-500">
                    The algorithm did not detect characteristics consistent with a brain tumor in the provided MRI scan.
                  </p>
                </div>
                
                <div className="border-t border-b border-neutral-200 py-4">
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">Analysis Details</h4>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-neutral-500">Scan Quality</dt>
                      <dd className="mt-1 text-sm text-neutral-700">{resultData.scanQuality}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-neutral-500">Areas Examined</dt>
                      <dd className="mt-1 text-sm text-neutral-700">{resultData.areasExamined}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="material-icons text-blue-400">info</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Even with a negative result, regular follow-up examinations are recommended if symptoms persist. 
                          This analysis is an AI-assisted tool and should be confirmed by a qualified medical professional.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Result */}
            {detectionState === "error" && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="material-icons text-red-500">error</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>We encountered an error while analyzing this MRI scan. This could be due to image quality issues or unsupported scan type.</p>
                      <p className="mt-3">Please try uploading a different image or contact support if the problem persists.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        {detectionState !== "loading" && detectionState !== "idle" && (
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <Button 
              className="inline-flex items-center"
              onClick={handleExportReport}
            >
              <span className="material-icons text-sm mr-1">download</span>
              Export Report
            </Button>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="inline-flex items-center"
                onClick={handlePrint}
              >
                <span className="material-icons text-sm mr-1">print</span>
                Print
              </Button>
              <Button 
                variant="outline" 
                className="inline-flex items-center"
                onClick={handleSendEmail}
              >
                <span className="material-icons text-sm mr-1">email</span>
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
