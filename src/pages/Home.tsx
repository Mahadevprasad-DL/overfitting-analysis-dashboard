import {
  GraduationCap,
  LineChart,
  AlertTriangle,
  BarChart3,
  Database,
  Cpu,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="px-6 py-10 space-y-16">

      {/* ================= HERO SECTION ================= */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Overfitting Detection Using Learning Curves
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          A machine learning–based system to analyze student performance data
          using a Decision Tree model and detect overfitting through learning
          curve visualization.
        </p>
      </section>

      {/* ================= PROJECT OVERVIEW ================= */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Project Overview
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Overfitting is a common problem in machine learning where a model
          performs well on training data but fails to generalize to unseen data.
          This project focuses on detecting overfitting by analyzing learning
          curves generated during the training of a Decision Tree model on
          student academic performance data.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Database className="w-10 h-10 text-blue-600" />}
            title="CSV Data Upload"
            description="Upload real student marks datasets in CSV format for analysis."
          />

          <FeatureCard
            icon={<Cpu className="w-10 h-10 text-green-600" />}
            title="Decision Tree Model"
            description="Train a Decision Tree classifier to predict student performance."
          />

          <FeatureCard
            icon={<LineChart className="w-10 h-10 text-purple-600" />}
            title="Learning Curves"
            description="Visual comparison of training and validation accuracy curves."
          />

          <FeatureCard
            icon={<AlertTriangle className="w-10 h-10 text-red-600" />}
            title="Overfitting Detection"
            description="Automatically detects and explains overfitting severity."
          />
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          System Workflow
        </h2>

        <ol className="space-y-4 list-decimal list-inside text-gray-700">
          <li>User uploads a student performance dataset (CSV file).</li>
          <li>Data is preprocessed and split into training and validation sets.</li>
          <li>A Decision Tree model is trained on the dataset.</li>
          <li>Learning curves are generated during training.</li>
          <li>Model performance is evaluated using accuracy metrics.</li>
          <li>Overfitting is detected and recommendations are displayed.</li>
        </ol>
      </section>

      {/* ================= USE CASES ================= */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Use Cases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UseCaseCard
            icon={<GraduationCap className="w-8 h-8 text-blue-600" />}
            title="Educational Analysis"
            description="Analyze student performance trends in academic institutions."
          />

          <UseCaseCard
            icon={<BarChart3 className="w-8 h-8 text-green-600" />}
            title="ML Model Evaluation"
            description="Understand model behavior through learning curves."
          />

          <UseCaseCard
            icon={<Users className="w-8 h-8 text-purple-600" />}
            title="Academic Projects"
            description="Ideal for mini-projects, labs, and ML demonstrations."
          />
        </div>
      </section>

      {/* ================= DATASET INFO ================= */}
      <section className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Dataset Information
        </h2>
        <p className="text-gray-700">
          The system works with student performance datasets containing features
          such as internal marks, attendance, assignment scores, and final exam
          results. The dataset is provided in CSV format and can be easily
          modified for experimentation.
        </p>
      </section>

      {/* ================= FOOTER NOTE ================= */}
      <section className="text-center text-gray-600 text-sm">
        <p>
          This project demonstrates practical implementation of machine learning
          concepts including model training, evaluation, and overfitting
          detection using learning curves.
        </p>
      </section>
    </div>
  );
}

/* ================= FEATURE CARD ================= */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}

/* ================= USE CASE CARD ================= */
function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
}
