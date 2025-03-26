export default function InfoSection() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">About This Tool</h2>
        <div className="prose prose-blue max-w-none">
          <p>
            This brain tumor detection tool uses a Convolutional Neural Network (CNN) trained on MRI scan data to identify potential brain tumors. 
            The model analyzes the provided image and provides a prediction based on patterns it has learned from thousands of MRI scans.
          </p>
          
          <h3 className="text-lg font-medium mt-4">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Upload a brain MRI scan image through the interface</li>
            <li>The system preprocesses the image to match the format used during model training</li>
            <li>The CNN model analyzes the image and generates a prediction</li>
            <li>Results are displayed with a confidence score indicating the reliability of the prediction</li>
          </ol>
          
          <h3 className="text-lg font-medium mt-4">Important Disclaimers</h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>This tool is intended for assistive purposes only and should not replace professional medical diagnosis</li>
            <li>All patient data is processed locally and is not stored on any external servers</li>
            <li>The CNN model has been trained on a specific dataset and may not perform equally well on all types of MRI scans</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
