import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface DataUploadProps {
  onUploadComplete: () => void;
}

export default function DataUpload({ onUploadComplete }: DataUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            csvData: text,
            clearExisting: true,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(`Successfully uploaded ${data.count} student records`);
      onUploadComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to upload data');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Upload Student Data</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Upload a CSV file containing student performance data. The file should include columns for gender, race/ethnicity, parental education, lunch type, test preparation, and exam scores.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload CSV file'}
            </span>
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}
