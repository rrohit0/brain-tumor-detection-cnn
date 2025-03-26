import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-neutral-700 mb-4">About Brain Tumor Detector</h1>
              
              <div className="prose prose-blue max-w-none">
                <p className="my-4">
                  The Brain Tumor Detector is a medical tool designed to assist healthcare professionals in identifying potential brain tumors from MRI scans. 
                  Our system uses advanced deep learning technology, specifically a Convolutional Neural Network (CNN), to analyze brain MRI images with high accuracy.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Our Mission</h2>
                <p>
                  Our mission is to provide accessible, accurate, and timely assistance in the detection of brain tumors, 
                  enabling earlier diagnosis and potentially improving patient outcomes. 
                  We aim to be a valuable supplement to clinical expertise, not a replacement for professional medical judgment.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">The Technology</h2>
                <p>
                  Our detection system is built using a state-of-the-art CNN model trained on thousands of MRI scans. 
                  The model has been optimized to identify visual patterns associated with various types of brain tumors.
                </p>
                <p className="mt-3">
                  Key features of our technology include:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Fast processing of standard MRI scan formats</li>
                  <li>High sensitivity and specificity rates</li>
                  <li>Clear visualization of regions of interest</li>
                  <li>Confidence scoring to assist in clinical decision-making</li>
                  <li>Privacy-focused design that processes all data locally</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Intended Use</h2>
                <p>
                  This tool is designed to be used by medical professionals as a supplementary aid in the diagnostic process. 
                  It should not be used as the sole basis for diagnosis or treatment decisions. 
                  All results should be interpreted within the context of a patient's clinical presentation, medical history, and other diagnostic findings.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">The Team</h2>
                <p>
                  Our team consists of medical imaging specialists, neurologists, data scientists, and software engineers dedicated to improving healthcare through technology. 
                  We work closely with clinical partners to continuously improve our system's accuracy and usability.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
                <p>
                  For more information about our technology or to provide feedback, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
