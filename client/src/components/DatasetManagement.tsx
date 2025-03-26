import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpCircle, BrainCircuit, FileUp, Image, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DatasetStats {
  yes: number;
  no: number;
  total: number;
}

interface DatasetStatus {
  datasetSize: DatasetStats;
  model: {
    exists: boolean;
    lastModified: string | null;
  };
  readyForTraining: boolean;
}

export default function DatasetManagement() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'yes' | 'no'>('yes');
  const [datasetStatus, setDatasetStatus] = useState<DatasetStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearCategory, setClearCategory] = useState<'yes' | 'no'>('no');
  const { toast } = useToast();

  // Fetch dataset status on component mount
  useEffect(() => {
    fetchDatasetStatus();
  }, []);

  const fetchDatasetStatus = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest({
        url: '/api/dataset/status',
        method: 'GET',
      });

      const data = response as unknown as { 
        success: boolean; 
        datasetSize: DatasetStats; 
        model: any; 
        readyForTraining: boolean 
      };

      if (data.success) {
        setDatasetStatus({
          datasetSize: data.datasetSize,
          model: data.model,
          readyForTraining: data.readyForTraining,
        });
      }
    } catch (error) {
      console.error('Error fetching dataset status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dataset status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleCategoryChange = (category: 'yes' | 'no') => {
    setSelectedCategory(category);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one image file to upload',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append('category', selectedCategory);

      // Add all files to the form data
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
        // Simulate progress updates
        if (i % 3 === 0) {
          setUploadProgress(10 + Math.min(80, Math.floor((i / selectedFiles.length) * 80)));
        }
      }

      const response = await apiRequest({
        url: '/api/dataset/upload',
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type here as it will be set automatically for FormData
        },
      });
      
      const data = response as unknown as { 
        success: boolean; 
        message: string; 
        fileCount: number 
      };

      setUploadProgress(100);

      if (data.success) {
        toast({
          title: 'Upload successful',
          description: `${data.fileCount} images uploaded to the ${selectedCategory} category`,
        });
        // Refresh dataset status after upload
        fetchDatasetStatus();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear file input
      setSelectedFiles(null);
      const fileInput = document.getElementById('dataset-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleStartTraining = async () => {
    try {
      setIsTraining(true);

      const response = await apiRequest({
        url: '/api/dataset/train',
        method: 'POST',
      });
      
      const data = response as unknown as { 
        success: boolean; 
        message: string; 
      };

      if (data.success) {
        toast({
          title: 'Training started',
          description: data.message,
        });
      } else {
        throw new Error(data.message || 'Training failed to start');
      }
    } catch (error) {
      console.error('Training error:', error);
      toast({
        title: 'Training failed',
        description: error instanceof Error ? error.message : 'Failed to start model training',
        variant: 'destructive',
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleKaggleDownload = async () => {
    try {
      const response = await apiRequest({
        url: '/api/dataset/download-from-kaggle',
        method: 'POST',
      });
      
      const data = response as unknown as { 
        success: boolean; 
        message: string; 
      };

      toast({
        title: 'Kaggle Dataset Instructions',
        description: data.message,
      });
    } catch (error) {
      console.error('Kaggle download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get Kaggle dataset instructions',
        variant: 'destructive',
      });
    }
  };
  
  const handleClearDatasetRequest = (category: 'yes' | 'no') => {
    setClearCategory(category);
    setShowClearDialog(true);
  };
  
  const handleClearDataset = async () => {
    try {
      setIsClearing(true);
      
      const response = await apiRequest({
        url: '/api/dataset/clear',
        method: 'POST',
        body: { category: clearCategory },
      });
      
      const data = response as unknown as { 
        success: boolean; 
        message: string; 
        deletedCount: number;
      };
      
      if (data.success) {
        toast({
          title: 'Dataset Cleared',
          description: data.message,
        });
        
        // Refresh dataset status
        fetchDatasetStatus();
      } else {
        throw new Error(data.message || 'Failed to clear dataset');
      }
    } catch (error) {
      console.error('Clear dataset error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to clear dataset category',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dataset Management</CardTitle>
          <CardDescription>
            Upload and manage your brain MRI dataset for model training
          </CardDescription>
        </CardHeader>
        <CardContent>
          {datasetStatus && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4 flex justify-between items-start">
                  <CardTitle className="text-lg">Tumor Images</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleClearDatasetRequest('yes')}
                    disabled={datasetStatus.datasetSize.yes === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{datasetStatus.datasetSize.yes}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 flex justify-between items-start">
                  <CardTitle className="text-lg">Non-Tumor Images</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleClearDatasetRequest('no')}
                    disabled={datasetStatus.datasetSize.no === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{datasetStatus.datasetSize.no}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Model Status</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xl font-semibold">
                    {datasetStatus.model.exists ? 'Trained' : 'Not Trained'}
                  </p>
                  {datasetStatus.model.lastModified && (
                    <p className="text-sm text-gray-500">
                      Last modified: {new Date(datasetStatus.model.lastModified).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Clear Dataset Confirmation Dialog */}
          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear {clearCategory === 'yes' ? 'Tumor' : 'Non-Tumor'} Images</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove all {clearCategory === 'yes' ? 'tumor' : 'non-tumor'} images from the dataset? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowClearDialog(false)} disabled={isClearing}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleClearDataset} 
                  disabled={isClearing}
                >
                  {isClearing ? 'Clearing...' : 'Clear Images'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading dataset information...</p>
            </div>
          ) : (
            <>
              {datasetStatus && !datasetStatus.readyForTraining && (
                <Alert className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Not enough training data</AlertTitle>
                  <AlertDescription>
                    You need at least 5 images in each category (tumor and non-tumor) to train the model.
                    Currently you have {datasetStatus.datasetSize.yes} tumor images and {datasetStatus.datasetSize.no} non-tumor images.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="upload">Upload Images</TabsTrigger>
                  <TabsTrigger value="train">Train Model</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="category" className="font-medium">
                        Image Category
                      </label>
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant={selectedCategory === 'yes' ? 'default' : 'outline'}
                          onClick={() => handleCategoryChange('yes')}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          Tumor Images
                        </Button>
                        <Button
                          type="button"
                          variant={selectedCategory === 'no' ? 'default' : 'outline'}
                          onClick={() => handleCategoryChange('no')}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          Non-Tumor Images
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label htmlFor="dataset-file-input" className="font-medium">
                        Select Images
                      </label>
                      <input
                        id="dataset-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="border rounded p-2"
                        disabled={isUploading}
                      />
                      <p className="text-sm text-gray-500">
                        You can select multiple images at once. Supported formats: JPG, PNG.
                      </p>
                    </div>

                    {selectedFiles && (
                      <p className="text-sm">
                        {selectedFiles.length} file(s) selected for upload to the {selectedCategory}{' '}
                        category
                      </p>
                    )}

                    {isUploading && uploadProgress > 0 && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} />
                        <p className="text-sm text-center">{uploadProgress}% Uploaded</p>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={!selectedFiles || isUploading}
                      >
                        <FileUp className="mr-2 h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload Images'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleKaggleDownload}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        Kaggle Dataset Info
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="train" className="pt-4">
                  <div className="space-y-6">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Training Information</AlertTitle>
                      <AlertDescription>
                        Model training will use your uploaded images to learn to identify brain tumors. Training may take
                        several minutes depending on the size of your dataset. Once trained, the model will be used for
                        all future predictions.
                      </AlertDescription>
                    </Alert>

                    {datasetStatus && (
                      <div className="space-y-2">
                        <p>
                          <strong>Dataset Size:</strong> {datasetStatus.datasetSize.total} images (
                          {datasetStatus.datasetSize.yes} tumor, {datasetStatus.datasetSize.no}{' '}
                          non-tumor)
                        </p>
                        <p>
                          <strong>Training Status:</strong>{' '}
                          {datasetStatus.readyForTraining
                            ? 'Ready for training'
                            : 'Need more images for both categories'}
                        </p>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={handleStartTraining}
                      disabled={
                        isTraining ||
                        (datasetStatus ? !datasetStatus.readyForTraining : true)
                      }
                      className="w-full"
                    >
                      {isTraining ? (
                        <>Training in progress...</>
                      ) : (
                        <>
                          <BrainCircuit className="mr-2 h-4 w-4" />
                          Start Training
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}