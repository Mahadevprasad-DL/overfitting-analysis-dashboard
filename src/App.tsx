import { useState } from 'react';

import DataUpload from './components/DataUpload';
import ModelTraining from './components/ModelTraining';
import LearningCurves from './components/LearningCurves';
import OverfittingAnalysis from './components/OverfittingAnalysis';
import ModelMetrics from './components/ModelMetrics';
import Header from './components/Header';
import Home from './pages/Home';

import { ModelResult } from './lib/supabase';

function App() {
  // Page navigation state
  const [activePage, setActivePage] = useState<'home' | 'detect'>('home');

  // ML workflow state
  const [dataUploaded, setDataUploaded] = useState(false);
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);

  // Called after CSV upload
  const handleUploadComplete = () => {
    setDataUploaded(true);
    setModelResult(null);
  };

  // Called after model training
  const handleTrainingComplete = (result: ModelResult) => {
    setModelResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* ===== HEADER ===== */}
      <Header activePage={activePage} setActivePage={setActivePage} />

      {/* ===== HOME PAGE ===== */}
      {activePage === 'home' && (
        <Home />
      )}

      {/* ===== DETECT PAGE ===== */}
      {activePage === 'detect' && (
        <div className="container mx-auto px-4 py-8 space-y-6">
          
          {/* Upload & Training Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataUpload onUploadComplete={handleUploadComplete} />

            {dataUploaded && (
              <ModelTraining onTrainingComplete={handleTrainingComplete} />
            )}
          </div>

          {/* Results Section */}
          {modelResult && (
            <>
              <ModelMetrics result={modelResult} />

              <LearningCurves data={modelResult.learning_curve_data} />

              <OverfittingAnalysis
                detected={modelResult.overfitting_detected}
                severity={modelResult.overfitting_severity}
                recommendations={modelResult.recommendations}
              />
            </>
          )}

          {/* Default message before upload */}
          {!dataUploaded && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Get Started
              </h2>
              <p className="text-gray-600">
                Upload your student performance CSV file to begin overfitting detection.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="mt-12 text-center text-gray-600 text-sm py-4">
        Built with Decision Tree algorithm using Learning Curves for Overfitting Detection
      </footer>
    </div>
  );
}

export default App;
