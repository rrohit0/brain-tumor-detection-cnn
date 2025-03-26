import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-neutral-700 mb-4">Terms of Service</h1>
              
              <div className="prose prose-blue max-w-none">
                <p className="my-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Acceptance of Terms</h2>
                <p>
                  By accessing or using the Brain Tumor Detector application, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access or use the application.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Medical Disclaimer</h2>
                <p>
                  The Brain Tumor Detector is designed as a supplementary tool for medical professionals and is not intended to replace professional medical advice, diagnosis, or treatment.
                </p>
                <p className="mt-3">
                  Important disclaimers:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>This application provides analysis that should be reviewed and verified by qualified medical professionals</li>
                  <li>No medical decision should be made solely based on the outputs of this application</li>
                  <li>The application's performance may vary based on image quality and other factors</li>
                  <li>The developers and providers of this application make no warranties regarding the accuracy of the results</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Use License</h2>
                <p>
                  Permission is granted to use the Brain Tumor Detector application for medical and research purposes subject to the following conditions:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>The application may not be reverse engineered, decompiled, or disassembled</li>
                  <li>The application may not be modified or redistributed without explicit permission</li>
                  <li>The application must be used in compliance with all applicable laws and regulations</li>
                  <li>The use of the application must be in accordance with these Terms of Service</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, the developers and providers of the Brain Tumor Detector application shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, data, or other intangible losses resulting from:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>The use or inability to use the application</li>
                  <li>Unauthorized access to or alteration of your data</li>
                  <li>Any outcome related to the use of the application's analysis</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms of Service at any time. It is your responsibility to review these Terms periodically for changes.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
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
