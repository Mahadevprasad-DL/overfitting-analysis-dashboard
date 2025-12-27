import { useState } from 'react';
import { Brain, Loader, AlertCircle } from 'lucide-react';
import { ModelResult } from '../lib/supabase';

interface ModelTrainingProps {
  onTrainingComplete: (result: ModelResult) => void;
}

export default function ModelTraining({ onTrainingComplete }: ModelTrainingProps) {
  const [training, setTraining] = useState(false);
  const [error, setError] = useState('');

  const handleTrain = async () => {
    setTraining(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/train-model`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Training failed');
      }

      onTrainingComplete(data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to train model');
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Train Decision Tree Model</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Train a Decision Tree classifier on the uploaded student data. The model will predict student performance and generate learning curves to detect overfitting.
        </p>

        <button
          onClick={handleTrain}
          disabled={training}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {training ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Training Model...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Train Model
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
