import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to model file
const MODEL_PATH = path.join(__dirname, "../model/model.json");
const MODEL_DIR = path.dirname(MODEL_PATH);

/**
 * Train a tumor detection model using a dataset
 * 
 * Dataset should be structured as:
 * - dataset/
 *   - yes/
 *     - tumor_image1.jpg
 *     - tumor_image2.jpg
 *     ...
 *   - no/
 *     - non_tumor_image1.jpg
 *     - non_tumor_image2.jpg
 *     ...
 * 
 * @param datasetPath Path to the dataset directory
 * @param epochs Number of training epochs
 */
export async function trainModel(datasetPath: string, epochs: number = 20): Promise<void> {
  console.log(`Starting training with dataset from ${datasetPath}`);

  // Validate dataset path
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset directory doesn't exist: ${datasetPath}`);
  }

  // Check for yes/no subdirectories
  const yesDirPath = path.join(datasetPath, "yes");
  const noDirPath = path.join(datasetPath, "no");
  
  if (!fs.existsSync(yesDirPath) || !fs.existsSync(noDirPath)) {
    throw new Error("Dataset must contain 'yes' and 'no' subdirectories for tumor and non-tumor images");
  }

  // Load and process images
  const data: number[][][][] = [];
  const labels: number[] = [];
  
  // Process tumor images (yes)
  console.log("Processing tumor images...");
  await processImagesInDirectory(yesDirPath, data, labels, 1);
  
  // Process non-tumor images (no)
  console.log("Processing non-tumor images...");
  await processImagesInDirectory(noDirPath, data, labels, 0);
  
  if (data.length === 0) {
    throw new Error("No valid images found in the dataset");
  }

  console.log(`Loaded ${data.length} images: ${labels.filter(l => l === 1).length} tumor, ${labels.filter(l => l === 0).length} non-tumor`);

  // Convert to tensors
  const imageTensor = tf.tensor4d(data);
  const labelTensor = tf.tensor1d(labels);

  // Create and compile the model
  const model = createModel();
  
  // Train the model
  console.log("Starting model training...");
  await model.fit(imageTensor, labelTensor, {
    epochs,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1} completed. Loss: ${logs?.loss.toFixed(4)}, Accuracy: ${logs?.acc.toFixed(4)}`);
      }
    }
  });

  // Save the model
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }
  
  await model.save(`file://${MODEL_DIR}`);
  console.log(`Model trained and saved to ${MODEL_DIR}`);
  
  // Cleanup
  imageTensor.dispose();
  labelTensor.dispose();
  model.dispose();
}

/**
 * Process all images in a directory and add them to the data and labels arrays
 */
async function processImagesInDirectory(
  dirPath: string, 
  data: number[][][][], 
  labels: number[], 
  label: number
): Promise<void> {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      try {
        const filePath = path.join(dirPath, file);
        const processedImage = await processImageForTraining(filePath);
        data.push(processedImage);
        labels.push(label);
      } catch (err) {
        console.error(`Error processing image ${file}:`, err);
      }
    }
  }
}

/**
 * Process a single image for training
 */
async function processImageForTraining(imagePath: string): Promise<number[][][]> {
  // Process image using sharp
  const imageBuffer = await sharp(imagePath)
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0 } })
    .normalise()
    .sharpen(0.5, 0.5, 0.5)
    .toBuffer();
  
  // Convert to tensor and normalize
  const imageTensor = tf.node.decodeImage(imageBuffer, 3);
  const normalizedTensor = imageTensor.div(tf.scalar(255.0));
  
  // Convert to array, cleanup, and return
  const imageArray = Array.from(normalizedTensor.arraySync() as number[][][]);
  imageTensor.dispose();
  normalizedTensor.dispose();
  
  return imageArray;
}

/**
 * Create a CNN model for tumor detection
 */
function createModel(): tf.Sequential {
  const model = tf.sequential();
  
  // First conv layer
  model.add(tf.layers.conv2d({
    inputShape: [128, 128, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Second conv layer
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Third conv layer
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Fully connected layers
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  
  // Compile model
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
}

// For ES modules we don't have require.main === module
// Instead, we can use this approach with import.meta if needed separately
// This code won't run automatically on import
export async function runTraining() {
  const datasetPath = process.argv[2] || path.join(__dirname, "../dataset");
  const epochs = parseInt(process.argv[3] || "20", 10);
  
  try {
    await trainModel(datasetPath, epochs);
    console.log("Training completed");
  } catch (err) {
    console.error("Training failed:", err);
  }
}