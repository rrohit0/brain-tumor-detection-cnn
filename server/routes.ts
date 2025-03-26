import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer, { FileFilterCallback } from "multer";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { processImage, trainModelWithDataset, DATASET_DIR } from "./model";

// Extend Express Request type to include file property from multer
declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, "../uploads");
const originalDir = path.join(uploadDir, "original");
const processedDir = path.join(uploadDir, "processed");
const datasetDir = path.join(__dirname, "../dataset");
const datasetYesDir = path.join(datasetDir, "yes");
const datasetNoDir = path.join(datasetDir, "no");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(originalDir)) {
  fs.mkdirSync(originalDir, { recursive: true });
}
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}
if (!fs.existsSync(datasetDir)) {
  fs.mkdirSync(datasetDir, { recursive: true });
}
if (!fs.existsSync(datasetYesDir)) {
  fs.mkdirSync(datasetYesDir, { recursive: true });
}
if (!fs.existsSync(datasetNoDir)) {
  fs.mkdirSync(datasetNoDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req: any, _file: Express.Multer.File, cb) => {
      // Check if this is a dataset upload and set the correct destination
      const requestPath = req.originalUrl || req.url || '';
      if (requestPath.includes('/api/dataset/upload') && req.body && req.body.category) {
        const category = req.body.category;
        if (category === 'yes') {
          cb(null, datasetYesDir);
        } else if (category === 'no') {
          cb(null, datasetNoDir);
        } else {
          cb(new Error('Invalid category'), '');
        }
      } else {
        cb(null, originalDir);
      }
    },
    filename: (_req: Express.Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Route to handle image upload
  app.post("/api/upload", upload.single("image"), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      
      const imageUrl = `/uploads/original/${req.file.filename}`;
      
      res.json({
        success: true,
        message: "File uploaded successfully",
        imageUrl,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }
  });

  // Route to analyze uploaded image
  app.post("/api/analyze", upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      
      const originalPath = req.file.path;
      const filename = req.file.filename;
      
      // Process the image and get prediction
      const result = await processImage(originalPath, filename);
      
      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({
        success: false,
        message: "Error analyzing image",
      });
    }
  });
  
  // Route to get a specific image by ID
  app.get("/api/analyze/:id", async (req: Request, res: Response) => {
    try {
      const imageId = req.params.id;
      // In a real app, this would fetch the image analysis from a database
      // For this demo, we'll return a mock response
      
      res.json({
        prediction: Math.random() > 0.5 ? 'yes' : 'no',
        confidence: Math.random() * 0.5 + 0.5,  // Random confidence between 0.5 and 1.0
        processedImageUrl: `/uploads/processed/${imageId}`,
        tumorLocation: "Right frontal lobe",
        tumorSize: "2.3 cm² visible area",
        intensityChar: "Heterogeneous",
        scanQuality: "High",
        areasExamined: "Full brain scan including frontal, parietal, temporal, and occipital lobes"
      });
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving analysis",
      });
    }
  });

  // Dataset upload route - accepts multiple images for a category (yes/no)
  app.post("/api/dataset/upload", express.urlencoded({ extended: true }), upload.array("images", 100), async (req: Request, res: Response) => {
    try {
      const files = (req as any).files;
      const category = (req as any).body?.category;
      
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }
      
      if (!category || (category !== 'yes' && category !== 'no')) {
        return res.status(400).json({ success: false, message: "Invalid category. Must be 'yes' or 'no'" });
      }
      
      res.json({
        success: true,
        message: `Successfully uploaded ${files.length} images to the ${category} category`,
        fileCount: files.length
      });
    } catch (error) {
      console.error("Dataset upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading dataset images",
      });
    }
  });
  
  // Dataset training route - trains the model with the uploaded dataset
  app.post("/api/dataset/train", async (_req: Request, res: Response) => {
    try {
      // Count images in each directory to ensure we have enough data
      const yesImages = fs.readdirSync(datasetYesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
      const noImages = fs.readdirSync(datasetNoDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
      
      if (yesImages.length < 5 || noImages.length < 5) {
        return res.status(400).json({ 
          success: false, 
          message: "Not enough images for training. Upload at least 5 images for each category.",
          counts: {
            yes: yesImages.length,
            no: noImages.length
          }
        });
      }
      
      // Start training in the background
      res.json({
        success: true,
        message: "Training started in the background. This may take some time.",
        datasetSize: {
          yes: yesImages.length,
          no: noImages.length
        }
      });
      
      // Train the model (this runs asynchronously after response is sent)
      trainModelWithDataset(datasetDir)
        .then(success => {
          if (success) {
            console.log("Model training completed successfully");
          } else {
            console.error("Model training failed");
          }
        })
        .catch(err => {
          console.error("Error during model training:", err);
        });
      
    } catch (error) {
      console.error("Dataset training error:", error);
      res.status(500).json({
        success: false,
        message: "Error training model with dataset",
      });
    }
  });
  
  // Route to get dataset status (count of images in each category)
  app.get("/api/dataset/status", (_req: Request, res: Response) => {
    try {
      const yesImages = fs.readdirSync(datasetYesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
      const noImages = fs.readdirSync(datasetNoDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
      
      // Check if model exists and when it was last modified
      let modelExists = false;
      let modelLastModified = null;
      
      const modelPath = path.join(__dirname, "../model/model.json");
      if (fs.existsSync(modelPath)) {
        modelExists = true;
        const stats = fs.statSync(modelPath);
        modelLastModified = stats.mtime;
      }
      
      res.json({
        success: true,
        datasetSize: {
          yes: yesImages.length,
          no: noImages.length,
          total: yesImages.length + noImages.length
        },
        model: {
          exists: modelExists,
          lastModified: modelLastModified
        },
        readyForTraining: yesImages.length >= 5 && noImages.length >= 5
      });
    } catch (error) {
      console.error("Dataset status error:", error);
      res.status(500).json({
        success: false,
        message: "Error getting dataset status",
      });
    }
  });
  
  // Route to download dataset from Kaggle
  app.post("/api/dataset/download-from-kaggle", async (_req: Request, res: Response) => {
    try {
      // This would normally use the Kaggle API with credentials
      // But for demo purposes, we'll return instructions
      res.json({
        success: false,
        message: "To use the Kaggle dataset, please manually download it from https://www.kaggle.com/datasets/navoneel/brain-mri-images-for-brain-tumor-detection and upload the images to the app using the dataset upload feature. The dataset should be organized into 'yes' (tumor) and 'no' (non-tumor) categories."
      });
    } catch (error) {
      console.error("Kaggle download error:", error);
      res.status(500).json({
        success: false,
        message: "Error downloading from Kaggle",
      });
    }
  });
  
  // Route to clear all images in a specific dataset category
  app.post("/api/dataset/clear", express.json(), async (req: Request, res: Response) => {
    try {
      const { category } = req.body;
      
      if (!category || (category !== 'yes' && category !== 'no')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid category. Must be 'yes' or 'no'." 
        });
      }
      
      const categoryDir = path.join(datasetDir, category);
      
      if (fs.existsSync(categoryDir)) {
        // Read all files in the directory
        const files = fs.readdirSync(categoryDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
        
        // Delete each file
        for (const file of files) {
          const filePath = path.join(categoryDir, file);
          fs.unlinkSync(filePath);
        }
        
        res.json({ 
          success: true, 
          message: `Successfully cleared ${files.length} images from the ${category} category`,
          deletedCount: files.length
        });
      } else {
        // Create the directory if it doesn't exist
        fs.mkdirSync(categoryDir, { recursive: true });
        res.json({ 
          success: true, 
          message: `No images to clear. The ${category} category is already empty.`,
          deletedCount: 0
        });
      }
    } catch (error) {
      console.error("Error clearing dataset category:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to clear the dataset category" 
      });
    }
  });
  
  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));
  app.use("/dataset", express.static(datasetDir));

  const httpServer = createServer(app);

  return httpServer;
}
