import { AlertTriangle, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { Recommendation } from '../lib/supabase';

interface OverfittingAnalysisProps {
  detected: boolean;
  severity: string;
  recommendations: Recommendation[];
}

export default function OverfittingAnalysis({ detected, severity, recommendations }: OverfittingAnalysisProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'severe':
        return 'border-red-200 bg-red-50';
      case 'moderate':
        return 'border-orange-200 bg-orange-50';
      case 'mild':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-green-200 bg-green-50';
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'severe':
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'mild':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getSeverityText = () => {
    if (!detected) return 'No Overfitting Detected';
    return `${severity.charAt(0).toUpperCase() + severity.slice(1)} Overfitting Detected`;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-lg border-2 p-6 ${getSeverityColor()}`}>
        <div className="flex items-center gap-3 mb-2">
          {getSeverityIcon()}
          <h2 className="text-xl font-semibold text-gray-800">{getSeverityText()}</h2>
        </div>
        <p className="text-gray-700 text-sm">
          {detected
            ? 'The model shows signs of overfitting. Review the recommendations below to improve generalization.'
            : 'The model generalizes well to unseen data with minimal overfitting.'}
        </p>
      </div>

      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">Recommendations</h2>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadge(rec.priority)}`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
