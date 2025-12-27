import { BarChart3, Target } from 'lucide-react';
import { ModelResult } from '../lib/supabase';

interface ModelMetricsProps {
  result: ModelResult;
}

export default function ModelMetrics({ result }: ModelMetricsProps) {
  const precision = result.confusion_matrix.tp / (result.confusion_matrix.tp + result.confusion_matrix.fp) || 0;
  const recall = result.confusion_matrix.tp / (result.confusion_matrix.tp + result.confusion_matrix.fn) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

  const featureImportanceArray = Object.entries(result.feature_importance)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const maxImportance = Math.max(...featureImportanceArray.map(f => f.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Model Performance</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Test Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">
                {(result.accuracy * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Training Accuracy</p>
              <p className="text-2xl font-bold text-green-600">
                {(result.training_accuracy * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Precision</p>
              <p className="text-lg font-semibold text-gray-800">
                {(precision * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Recall</p>
              <p className="text-lg font-semibold text-gray-800">
                {(recall * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">F1 Score</p>
              <p className="text-lg font-semibold text-gray-800">
                {(f1Score * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Confusion Matrix</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-xs text-gray-600 mb-1">True Positive</p>
                <p className="text-xl font-bold text-green-600">{result.confusion_matrix.tp}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-xs text-gray-600 mb-1">False Positive</p>
                <p className="text-xl font-bold text-red-600">{result.confusion_matrix.fp}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-xs text-gray-600 mb-1">False Negative</p>
                <p className="text-xl font-bold text-red-600">{result.confusion_matrix.fn}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-xs text-gray-600 mb-1">True Negative</p>
                <p className="text-xl font-bold text-green-600">{result.confusion_matrix.tn}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Feature Importance</h2>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Features ranked by their contribution to model predictions.
        </p>

        <div className="space-y-3">
          {featureImportanceArray.map((feature, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                <span className="text-sm text-gray-600">{(feature.value * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${(feature.value / maxImportance) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
