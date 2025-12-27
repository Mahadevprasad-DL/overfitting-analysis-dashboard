import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface StudentData {
  gender: string;
  race_ethnicity: string;
  parental_education: string;
  lunch: string;
  test_preparation: string;
  math_score: number;
  reading_score: number;
  writing_score: number;
}

interface ProcessedData {
  features: number[][];
  labels: number[];
  featureNames: string[];
}

class DecisionTreeNode {
  feature: number | null = null;
  threshold: number | null = null;
  left: DecisionTreeNode | null = null;
  right: DecisionTreeNode | null = null;
  value: number | null = null;
  samples: number = 0;
  impurity: number = 0;
}

class DecisionTreeClassifier {
  private root: DecisionTreeNode | null = null;
  private maxDepth: number;
  private minSamplesSplit: number;
  public featureImportance: number[] = [];

  constructor(maxDepth = 10, minSamplesSplit = 2) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
  }

  private giniImpurity(labels: number[]): number {
    const counts = new Map<number, number>();
    labels.forEach(label => counts.set(label, (counts.get(label) || 0) + 1));
    
    let impurity = 1.0;
    const total = labels.length;
    for (const count of counts.values()) {
      const prob = count / total;
      impurity -= prob * prob;
    }
    return impurity;
  }

  private splitData(features: number[][], labels: number[], featureIdx: number, threshold: number) {
    const leftIndices: number[] = [];
    const rightIndices: number[] = [];
    
    features.forEach((row, idx) => {
      if (row[featureIdx] <= threshold) {
        leftIndices.push(idx);
      } else {
        rightIndices.push(idx);
      }
    });
    
    return {
      leftFeatures: leftIndices.map(i => features[i]),
      leftLabels: leftIndices.map(i => labels[i]),
      rightFeatures: rightIndices.map(i => features[i]),
      rightLabels: rightIndices.map(i => labels[i]),
    };
  }

  private findBestSplit(features: number[][], labels: number[], numFeatures: number) {
    let bestGain = -1;
    let bestFeature = 0;
    let bestThreshold = 0;
    
    const parentImpurity = this.giniImpurity(labels);
    
    for (let featureIdx = 0; featureIdx < numFeatures; featureIdx++) {
      const values = features.map(row => row[featureIdx]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        const split = this.splitData(features, labels, featureIdx, threshold);
        
        if (split.leftLabels.length === 0 || split.rightLabels.length === 0) continue;
        
        const leftImpurity = this.giniImpurity(split.leftLabels);
        const rightImpurity = this.giniImpurity(split.rightLabels);
        
        const leftWeight = split.leftLabels.length / labels.length;
        const rightWeight = split.rightLabels.length / labels.length;
        const weightedImpurity = leftWeight * leftImpurity + rightWeight * rightImpurity;
        
        const gain = parentImpurity - weightedImpurity;
        
        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = featureIdx;
          bestThreshold = threshold;
        }
      }
    }
    
    return { bestFeature, bestThreshold, bestGain };
  }

  private buildTree(features: number[][], labels: number[], depth: number, numFeatures: number): DecisionTreeNode {
    const node = new DecisionTreeNode();
    node.samples = labels.length;
    node.impurity = this.giniImpurity(labels);
    
    const counts = new Map<number, number>();
    labels.forEach(label => counts.set(label, (counts.get(label) || 0) + 1));
    node.value = [...counts.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    if (depth >= this.maxDepth || labels.length < this.minSamplesSplit || node.impurity === 0) {
      return node;
    }
    
    const { bestFeature, bestThreshold, bestGain } = this.findBestSplit(features, labels, numFeatures);
    
    if (bestGain <= 0) {
      return node;
    }
    
    this.featureImportance[bestFeature] += bestGain * labels.length;
    
    const split = this.splitData(features, labels, bestFeature, bestThreshold);
    
    node.feature = bestFeature;
    node.threshold = bestThreshold;
    node.left = this.buildTree(split.leftFeatures, split.leftLabels, depth + 1, numFeatures);
    node.right = this.buildTree(split.rightFeatures, split.rightLabels, depth + 1, numFeatures);
    
    return node;
  }

  fit(features: number[][], labels: number[]) {
    const numFeatures = features[0].length;
    this.featureImportance = new Array(numFeatures).fill(0);
    this.root = this.buildTree(features, labels, 0, numFeatures);
    
    const totalImportance = this.featureImportance.reduce((a, b) => a + b, 0);
    if (totalImportance > 0) {
      this.featureImportance = this.featureImportance.map(imp => imp / totalImportance);
    }
  }

  private predictSample(features: number[], node: DecisionTreeNode): number {
    if (node.value !== null && (node.left === null || node.right === null)) {
      return node.value;
    }
    
    if (node.feature !== null && node.threshold !== null) {
      if (features[node.feature] <= node.threshold) {
        return node.left ? this.predictSample(features, node.left) : node.value!;
      } else {
        return node.right ? this.predictSample(features, node.right) : node.value!;
      }
    }
    
    return node.value!;
  }

  predict(features: number[][]): number[] {
    if (!this.root) throw new Error('Model not trained');
    return features.map(sample => this.predictSample(sample, this.root!));
  }

  score(features: number[][], labels: number[]): number {
    const predictions = this.predict(features);
    const correct = predictions.filter((pred, idx) => pred === labels[idx]).length;
    return correct / labels.length;
  }
}

function encodeData(data: StudentData[]): ProcessedData {
  const genderMap = new Map([['male', 0], ['female', 1]]);
  const raceMap = new Map();
  const educationMap = new Map();
  const lunchMap = new Map([['standard', 1], ['free/reduced', 0]]);
  const testPrepMap = new Map([['completed', 1], ['none', 0]]);
  
  const races = [...new Set(data.map(d => d.race_ethnicity))];
  races.forEach((race, idx) => raceMap.set(race, idx));
  
  const educations = [...new Set(data.map(d => d.parental_education))];
  educations.forEach((edu, idx) => educationMap.set(edu, idx));
  
  const features: number[][] = [];
  const labels: number[] = [];
  
  for (const student of data) {
    const avgScore = (student.math_score + student.reading_score + student.writing_score) / 3;
    const performanceLabel = avgScore >= 70 ? 1 : 0;
    
    features.push([
      genderMap.get(student.gender) || 0,
      raceMap.get(student.race_ethnicity) || 0,
      educationMap.get(student.parental_education) || 0,
      lunchMap.get(student.lunch) || 0,
      testPrepMap.get(student.test_preparation) || 0,
      student.math_score,
      student.reading_score,
      student.writing_score,
    ]);
    labels.push(performanceLabel);
  }
  
  const featureNames = [
    'Gender',
    'Race/Ethnicity',
    'Parental Education',
    'Lunch Type',
    'Test Preparation',
    'Math Score',
    'Reading Score',
    'Writing Score',
  ];
  
  return { features, labels, featureNames };
}

function shuffleData(features: number[][], labels: number[]) {
  const indices = features.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    features: indices.map(i => features[i]),
    labels: indices.map(i => labels[i]),
  };
}

function trainTestSplit(features: number[][], labels: number[], testSize = 0.2) {
  const splitIdx = Math.floor(features.length * (1 - testSize));
  return {
    trainFeatures: features.slice(0, splitIdx),
    trainLabels: labels.slice(0, splitIdx),
    testFeatures: features.slice(splitIdx),
    testLabels: labels.slice(splitIdx),
  };
}

function generateLearningCurves(
  trainFeatures: number[][],
  trainLabels: number[],
  testFeatures: number[][],
  testLabels: number[]
) {
  const curves = [];
  const step = Math.floor(trainFeatures.length / 10);
  
  for (let size = step; size <= trainFeatures.length; size += step) {
    const subsetFeatures = trainFeatures.slice(0, size);
    const subsetLabels = trainLabels.slice(0, size);
    
    const model = new DecisionTreeClassifier(5, 2);
    model.fit(subsetFeatures, subsetLabels);
    
    const trainAcc = model.score(subsetFeatures, subsetLabels);
    const valAcc = model.score(testFeatures, testLabels);
    
    curves.push({
      trainingSize: size,
      trainingAccuracy: trainAcc,
      validationAccuracy: valAcc,
    });
  }
  
  return curves;
}

function detectOverfitting(learningCurves: any[]) {
  if (learningCurves.length === 0) return { detected: false, severity: 'none', gap: 0 };
  
  const lastPoint = learningCurves[learningCurves.length - 1];
  const gap = lastPoint.trainingAccuracy - lastPoint.validationAccuracy;
  
  let severity = 'none';
  let detected = false;
  
  if (gap > 0.15) {
    severity = 'severe';
    detected = true;
  } else if (gap > 0.08) {
    severity = 'moderate';
    detected = true;
  } else if (gap > 0.03) {
    severity = 'mild';
    detected = true;
  }
  
  return { detected, severity, gap };
}

function generateRecommendations(overfitting: any, dataSize: number) {
  const recommendations = [];
  
  if (overfitting.detected) {
    if (overfitting.severity === 'severe') {
      recommendations.push({
        title: 'Reduce Model Complexity',
        description: 'Decrease max_depth parameter (try 3-5) to prevent the tree from learning noise in the training data.',
        priority: 'high',
      });
      recommendations.push({
        title: 'Increase Training Data',
        description: 'Collect more training samples. Current size: ' + dataSize + '. Consider gathering at least 50% more data.',
        priority: 'high',
      });
      recommendations.push({
        title: 'Apply Pruning',
        description: 'Use cost-complexity pruning to remove branches that provide little predictive power.',
        priority: 'medium',
      });
    } else if (overfitting.severity === 'moderate') {
      recommendations.push({
        title: 'Adjust min_samples_split',
        description: 'Increase min_samples_split parameter (try 5-10) to require more samples before splitting nodes.',
        priority: 'medium',
      });
      recommendations.push({
        title: 'Feature Selection',
        description: 'Remove less important features to reduce model complexity.',
        priority: 'medium',
      });
    } else {
      recommendations.push({
        title: 'Monitor Performance',
        description: 'Mild overfitting detected. Continue monitoring with cross-validation.',
        priority: 'low',
      });
    }
    
    recommendations.push({
      title: 'Use Cross-Validation',
      description: 'Implement k-fold cross-validation (k=5 or k=10) for more robust performance estimates.',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      title: 'Model Performing Well',
      description: 'No significant overfitting detected. Model generalizes well to unseen data.',
      priority: 'low',
    });
    recommendations.push({
      title: 'Consider Ensemble Methods',
      description: 'Try Random Forest or Gradient Boosting for potentially better performance.',
      priority: 'low',
    });
  }
  
  return recommendations;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: students, error: fetchError } = await supabase
      .from('students')
      .select('*');

    if (fetchError) throw fetchError;
    if (!students || students.length === 0) {
      throw new Error('No student data found. Please upload data first.');
    }

    const { features, labels, featureNames } = encodeData(students);
    const shuffled = shuffleData(features, labels);
    const { trainFeatures, trainLabels, testFeatures, testLabels } = trainTestSplit(
      shuffled.features,
      shuffled.labels,
      0.2
    );

    const model = new DecisionTreeClassifier(5, 2);
    model.fit(trainFeatures, trainLabels);

    const trainAccuracy = model.score(trainFeatures, trainLabels);
    const testAccuracy = model.score(testFeatures, testLabels);

    const learningCurves = generateLearningCurves(
      trainFeatures,
      trainLabels,
      testFeatures,
      testLabels
    );

    const overfitting = detectOverfitting(learningCurves);
    const recommendations = generateRecommendations(overfitting, trainFeatures.length);

    const featureImportanceObj: { [key: string]: number } = {};
    featureNames.forEach((name, idx) => {
      featureImportanceObj[name] = Math.round(model.featureImportance[idx] * 1000) / 1000;
    });

    const predictions = model.predict(testFeatures);
    let tp = 0, fp = 0, tn = 0, fn = 0;
    predictions.forEach((pred, idx) => {
      if (pred === 1 && testLabels[idx] === 1) tp++;
      else if (pred === 1 && testLabels[idx] === 0) fp++;
      else if (pred === 0 && testLabels[idx] === 0) tn++;
      else fn++;
    });

    const result = {
      model_name: 'Decision Tree Classifier',
      accuracy: testAccuracy,
      training_accuracy: trainAccuracy,
      validation_accuracy: testAccuracy,
      overfitting_detected: overfitting.detected,
      overfitting_severity: overfitting.severity,
      recommendations: recommendations,
      learning_curve_data: learningCurves,
      feature_importance: featureImportanceObj,
      confusion_matrix: { tp, fp, tn, fn },
    };

    const { error: insertError } = await supabase
      .from('model_results')
      .insert(result);

    if (insertError) throw insertError;

    return new Response(JSON.stringify({
      success: true,
      result,
      stats: {
        totalSamples: students.length,
        trainingSamples: trainFeatures.length,
        testSamples: testFeatures.length,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});