import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StudentData {
  id?: string;
  gender: string;
  race_ethnicity: string;
  parental_education: string;
  lunch: string;
  test_preparation: string;
  math_score: number;
  reading_score: number;
  writing_score: number;
  created_at?: string;
}

export interface ModelResult {
  id?: string;
  model_name: string;
  accuracy: number;
  training_accuracy: number;
  validation_accuracy: number;
  overfitting_detected: boolean;
  overfitting_severity: string;
  recommendations: Recommendation[];
  learning_curve_data: LearningCurvePoint[];
  feature_importance: { [key: string]: number };
  confusion_matrix: ConfusionMatrix;
  created_at?: string;
}

export interface LearningCurvePoint {
  trainingSize: number;
  trainingAccuracy: number;
  validationAccuracy: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: string;
}

export interface ConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}
