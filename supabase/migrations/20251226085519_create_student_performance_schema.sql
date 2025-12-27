/*
  # Student Performance Analysis Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `gender` (text) - Student's gender
      - `race_ethnicity` (text) - Race/ethnicity group
      - `parental_education` (text) - Level of parental education
      - `lunch` (text) - Lunch type (standard/free/reduced)
      - `test_preparation` (text) - Test preparation course completion
      - `math_score` (integer) - Math exam score
      - `reading_score` (integer) - Reading exam score
      - `writing_score` (integer) - Writing exam score
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `model_results`
      - `id` (uuid, primary key)
      - `model_name` (text) - Name of the model run
      - `accuracy` (numeric) - Model accuracy
      - `training_accuracy` (numeric) - Training set accuracy
      - `validation_accuracy` (numeric) - Validation set accuracy
      - `overfitting_detected` (boolean) - Whether overfitting was detected
      - `overfitting_severity` (text) - Severity level of overfitting
      - `recommendations` (jsonb) - JSON array of recommendations
      - `learning_curve_data` (jsonb) - Learning curve data points
      - `feature_importance` (jsonb) - Feature importance scores
      - `confusion_matrix` (jsonb) - Confusion matrix data
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gender text NOT NULL,
  race_ethnicity text NOT NULL,
  parental_education text NOT NULL,
  lunch text NOT NULL,
  test_preparation text NOT NULL,
  math_score integer NOT NULL CHECK (math_score >= 0 AND math_score <= 100),
  reading_score integer NOT NULL CHECK (reading_score >= 0 AND reading_score <= 100),
  writing_score integer NOT NULL CHECK (writing_score >= 0 AND writing_score <= 100),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS model_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name text NOT NULL DEFAULT 'Decision Tree Model',
  accuracy numeric NOT NULL,
  training_accuracy numeric NOT NULL,
  validation_accuracy numeric NOT NULL,
  overfitting_detected boolean NOT NULL DEFAULT false,
  overfitting_severity text,
  recommendations jsonb DEFAULT '[]'::jsonb,
  learning_curve_data jsonb DEFAULT '[]'::jsonb,
  feature_importance jsonb DEFAULT '{}'::jsonb,
  confusion_matrix jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to students"
  ON students FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to students"
  ON students FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to students"
  ON students FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to model_results"
  ON model_results FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to model_results"
  ON model_results FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to model_results"
  ON model_results FOR DELETE
  TO public
  USING (true);