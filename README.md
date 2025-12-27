# 📘 Overfitting Detection Using Learning Curves  
### Student Marks Dataset – Decision Tree Classifier

---

## 📌 Project Overview

Overfitting is a common problem in Machine Learning where a model performs extremely well on training data but poorly on unseen data. This project focuses on detecting overfitting using **learning curves** by training a **Decision Tree classifier** on a **Student Marks dataset**.

Learning curves help visualize the relationship between model performance and the amount of training data, making them an effective diagnostic tool for identifying overfitting and underfitting.

---

## 🎯 Objectives

- Train a Decision Tree model on student academic performance data  
- Generate learning curves using training and validation accuracy  
- Detect overfitting based on curve behavior  
- Analyze the impact of dataset size on model generalization  
- Suggest techniques to reduce overfitting  

---

## 📂 Dataset Description

The project uses the **Student Performance Dataset**, which contains academic and demographic information of students.

### Features Included:
- Gender  
- Parental level of education  
- Lunch type  
- Test preparation course  
- Math score  
- Reading score  
- Writing score  

### Target Variable:
- Student performance classified as **Pass** or **Fail** based on marks

The dataset contains **1000 records**, making it suitable for learning curve analysis.

---

## 🧹 Data Preprocessing

The following preprocessing steps are applied before model training:

- Handling missing and inconsistent values  
- Encoding categorical features into numerical format  
- Creating target labels from student marks  
- Splitting data into training and validation sets  

These steps ensure better model performance and reliable results.

---

## 🌳 Model Selection: Decision Tree

A **Decision Tree classifier** is chosen for this project due to its simplicity and interpretability.

### Advantages:
- Easy to understand and visualize  
- Handles both numerical and categorical data  
- Requires minimal data preprocessing  

### Limitation:
- Highly prone to overfitting when the tree grows deep  

This limitation makes Decision Trees ideal for studying overfitting behavior.

---

## 📈 Learning Curves

A **learning curve** plots model performance against increasing training dataset size.

### Types of Curves:
- **Training Curve** – Accuracy on training data  
- **Validation Curve** – Accuracy on unseen data  

Learning curves help identify:
- Underfitting  
- Overfitting  
- Optimal model performance  

---

## ⚙️ Methodology

The following steps are followed in this project:

1. Load the student marks dataset  
2. Preprocess the data  
3. Split data into training and validation sets  
4. Train the Decision Tree model on increasing data sizes  
5. Calculate training and validation accuracy  
6. Plot learning curves  
7. Analyze curves to detect overfitting  

---

## ⚠️ Overfitting Detection

Overfitting is detected by analyzing the gap between training and validation curves.

### Indicators of Overfitting:
- Very high training accuracy  
- Significantly lower validation accuracy  
- Large gap between training and validation curves  

This indicates that the model memorizes training data rather than generalizing well.

---

## 🔧 Reducing Overfitting

To reduce overfitting, the following techniques are applied:

- Limiting tree depth (`max_depth`)  
- Increasing minimum samples per split  
- Applying pruning techniques  
- Increasing training data size  

After applying these techniques, the gap between curves reduces, indicating improved generalization.

---

## 📊 Results

The learning curve analysis clearly identifies overfitting in the Decision Tree model. A constrained (pruned) Decision Tree shows better validation performance and reduced overfitting compared to an unrestricted tree.

---

## 💡 Applications

- Educational performance analysis  
- Model evaluation and validation  
- Machine learning teaching and learning  
- Academic data analytics  

---

## ✅ Conclusion

This project demonstrates how learning curves can effectively detect overfitting in machine learning models. By analyzing training and validation performance of a Decision Tree classifier on student marks data, overfitting is visually identified and mitigated. Learning curves prove to be a valuable tool for improving model reliability and performance.

---

## 🔮 Future Enhancements

- Comparison with ensemble models like Random Forest  
- Use of cross-validation techniques  
- Deployment as a web-based application  
- Testing on larger and more diverse datasets  

---

## 🛠 Tools & Technologies

- Python  
- Pandas  
- NumPy  
- Scikit-learn  
- Matplotlib  

---

## 👨‍💻 Author

**Mahadevprasad D L**  
MCA | Full Stack Developer | AI & ML Enthusiast  

**Freelancer:** mpcodecrafter  
🌐 Portfolio: [https://mpcodecrafter.free.nf/?i=1](https://mpcodecrafter.free.nf/?i=1)

---
