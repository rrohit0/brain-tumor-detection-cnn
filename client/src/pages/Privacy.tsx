import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-neutral-700 mb-4">Privacy Policy</h1>
              
              <div className="prose prose-blue max-w-none">
                <p className="my-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
                <p>
                  At Brain Tumor Detector, we take your privacy very seriously. 
                  This Privacy Policy outlines how we collect, use, and protect any information obtained through your use of our application.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Data Processing and Storage</h2>
                <p>
                  Our application is designed with a strong focus on privacy and data security:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>All MRI scan processing is performed locally within your browser</li>
                  <li>MRI scans are not permanently stored on our servers</li>
                  <li>Uploaded scans are temporarily stored only for the duration needed to process them</li>
                  <li>No patient identification information is requested or stored</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Information Collection</h2>
                <p>
                  We collect the following limited information:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Anonymized usage statistics to improve our system</li>
                  <li>Technical information such as browser type and device information</li>
                  <li>Error reports to identify and fix technical issues</li>
                </ul>
                <p className="mt-3">
                  We do not collect or store:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Patient names or identifiers</li>
                  <li>Medical record numbers</li>
                  <li>Personal contact information</li>
                  <li>Any other personal health information (PHI)</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data. These include:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Secure HTTPS connections for all data transfers</li>
                  <li>Automatic deletion of uploaded images after processing</li>
                  <li>Regular security audits and updates</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 
                  You are advised to review this Privacy Policy periodically for any changes.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
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
