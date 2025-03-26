import DatasetManagement from "@/components/DatasetManagement";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Dataset() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Brain Tumor Dataset Management</h1>
        <p className="text-gray-600 mt-2">
          Upload training data and train the CNN model to improve tumor detection accuracy
        </p>
      </div>
      
      <DatasetManagement />
    </div>
  );
}