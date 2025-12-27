import { TrendingUp } from 'lucide-react';
import { LearningCurvePoint } from '../lib/supabase';

interface LearningCurvesProps {
  data: LearningCurvePoint[];
}

export default function LearningCurves({ data }: LearningCurvesProps) {
  if (!data || data.length === 0) return null;

  const maxAccuracy = 1.0;
  const chartHeight = 300;
  const chartWidth = 600;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };

  const maxSize = Math.max(...data.map(d => d.trainingSize));
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const getX = (size: number) => {
    return padding.left + (size / maxSize) * innerWidth;
  };

  const getY = (accuracy: number) => {
    return padding.top + (1 - accuracy / maxAccuracy) * innerHeight;
  };

  const trainPath = data.map((d, i) => {
    const x = getX(d.trainingSize);
    const y = getY(d.trainingAccuracy);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const valPath = data.map((d, i) => {
    const x = getX(d.trainingSize);
    const y = getY(d.validationAccuracy);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const xTicks = [0, maxSize * 0.25, maxSize * 0.5, maxSize * 0.75, maxSize];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Learning Curves</h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        This chart shows how model performance changes with different training set sizes. The gap between training and validation accuracy indicates overfitting.
      </p>

      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          <rect x={padding.left} y={padding.top} width={innerWidth} height={innerHeight} fill="#f9fafb" />

          {yTicks.map(tick => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {xTicks.map(tick => {
            const x = getX(tick);
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={chartHeight - padding.bottom}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {Math.round(tick)}
                </text>
              </g>
            );
          })}

          <path d={trainPath} fill="none" stroke="#3b82f6" strokeWidth="3" />
          <path d={valPath} fill="none" stroke="#10b981" strokeWidth="3" />

          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={getX(d.trainingSize)}
                cy={getY(d.trainingAccuracy)}
                r="4"
                fill="#3b82f6"
              />
              <circle
                cx={getX(d.trainingSize)}
                cy={getY(d.validationAccuracy)}
                r="4"
                fill="#10b981"
              />
            </g>
          ))}

          <text
            x={chartWidth / 2}
            y={chartHeight - 5}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            fontWeight="500"
          >
            Training Size (samples)
          </text>

          <text
            x={15}
            y={chartHeight / 2}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            fontWeight="500"
            transform={`rotate(-90, 15, ${chartHeight / 2})`}
          >
            Accuracy
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Training Accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Validation Accuracy</span>
        </div>
      </div>
    </div>
  );
}
