# Brain Tumor Detection System

A web application for detecting brain tumors from MRI scans using advanced Convolutional Neural Networks (CNN).

## Overview

The Brain Tumor Detection System is a web-based application that enables users to upload MRI brain scans for automated tumor detection. Using a trained convolutional neural network, the system analyzes the uploaded images and provides immediate results with visual guides to potential tumor locations when detected.

## Features

- **Intuitive Interface**: Simple drag-and-drop or file selection for MRI scan uploads
- **Real-time Analysis**: Quickly processes images and displays results on the same screen
- **Visual Results**: Highlights potential tumor regions on the processed image
- **Detailed Reports**: Provides information about tumor characteristics when detected
- **Dataset Management**: Upload, manage, and train on your own datasets
- **Export Options**: Download results as PDF, print or share via email
- **Responsive Design**: Works seamlessly on desktop and mobile devices 
- **Project Poster**: A4-sized informational poster about the project

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Express.js, Node.js
- **Neural Network**: TensorFlow.js with TensorFlow Node.js bindings
- **Image Processing**: Sharp
- **Document Generation**: jsPDF, html2canvas
- **PDF Generation**: Puppeteer (for poster PDF generation)

## Model Information

The system uses a Convolutional Neural Network (CNN) architecture optimized for brain MRI image classification. The model is trained on a dataset of brain MRI scans with and without tumors, achieving high accuracy in detecting various types of brain tumors.

Key components of the model include:
- Multiple convolutional layers for feature extraction
- Pooling layers for dimensionality reduction
- Dropout for regularization
- Dense layers with sigmoid activation for binary classification

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
1. Install dependencies
   ```
   npm install
   ```

2. Start the development server
   ```
   npm run dev
   ```

3. Access the application at `http://localhost:5000`

## Usage

### Tumor Detection
1. Navigate to the home page
2. Upload a brain MRI scan using the file uploader
3. Wait for the analysis to complete (typically a few seconds)
4. View the results showing tumor detection status
5. If a tumor is detected, examine the highlighted regions
6. Download, print, or share the report as needed

### Dataset Management
1. Navigate to the Dataset page
2. Upload images to either the tumor or non-tumor categories
3. Train the model using your custom dataset
4. View dataset statistics and model status

### Project Poster
The project includes an A4-sized informational poster (poster.html) that can be:
1. Viewed directly in a browser
2. Converted to PDF using the generate_pdf.js script
3. Printed for presentations or educational purposes

## Future Enhancements

- Multi-class classification for different tumor types
- 3D MRI scan support
- Integration with hospital PACS systems
- Enhanced visualization with 3D rendering
- Batch processing capability for multiple scans
- User accounts and scan history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact
For any queries, reach out at rcrathod13@gmail.com or open an issue on GitHub!
