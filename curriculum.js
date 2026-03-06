/* ════════════════════════════════════════════════
   AI Engineer Roadmap — Course Curriculum Data
   All lesson content, code examples, exercises
   ════════════════════════════════════════════════ */

const CURRICULUM = {

  stages: [

    /* ══════════════════════════════════════════
       STAGE 1 — Python for AI
    ══════════════════════════════════════════ */
    {
      id: 1,
      title: "Python for AI",
      icon: "🐍",
      color: "#3b82f6",
      duration: "2–3 weeks",
      description: "Master the Python data science ecosystem. Even if you know programming, the NumPy/Pandas/Matplotlib stack is its own world — and it's the foundation every AI library is built on.",
      lessons: [

        {
          id: "1-1",
          title: "NumPy: Numerical Computing Foundation",
          icon: "⚡",
          duration: "45 min",
          tags: ["NumPy", "Arrays", "Vectorization", "Broadcasting"],
          runnable: true,
          packages: [],
          theory: `
<h3>Why NumPy Exists</h3>
<p>Python lists are flexible but <strong>slow for math</strong>. Each element is a full Python object with type info, reference count, and heap allocation. A list of 1 million floats uses ~35 MB and requires explicit loops to process.</p>
<p>NumPy's <code>ndarray</code> stores data in <strong>contiguous typed memory</strong> — like a C array. Operations run in pre-compiled C/Fortran code, making them 50–200x faster than pure Python loops.</p>

<h3>Core Concepts</h3>
<div class="concept-grid">
  <div class="concept-card">
    <strong>ndarray</strong>
    <p>N-dimensional array. All elements same type. Shape (3,) = 1D, (3,4) = matrix, (2,3,4) = 3D tensor.</p>
  </div>
  <div class="concept-card">
    <strong>dtype</strong>
    <p>Data type: float32, float64, int32, bool. Critical for GPU memory and model training speed.</p>
  </div>
  <div class="concept-card">
    <strong>Broadcasting</strong>
    <p>Operate on arrays of different shapes without loops. Adding scalar to matrix = broadcasts to every element.</p>
  </div>
  <div class="concept-card">
    <strong>Vectorization</strong>
    <p>Replace Python for-loops with array operations. The key pattern in all AI/ML code.</p>
  </div>
</div>

<h3>Why This Matters for AI</h3>
<p>Every ML model is math on arrays. Feature matrices are 2D NumPy arrays. Model weights are arrays. Loss gradients are arrays. Mastering NumPy means you understand <em>what's actually happening</em> inside PyTorch and TensorFlow.</p>

<div class="info-box">
  <strong>Key insight:</strong> In ML code you'll see expressions like <code>X.T @ W + b</code> — that's a NumPy matrix multiply + broadcast. Once this feels natural, ML code becomes readable.
</div>`,
          code: `import numpy as np

# ── Creating Arrays ────────────────────────────────────────
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 4))                  # 3x4 of zeros
c = np.ones((2, 3)) * 5               # 2x3 of fives
d = np.arange(0, 10, 2)              # [0, 2, 4, 6, 8]
e = np.linspace(0, 1, 6)             # 6 points from 0→1

print("Shapes:", a.shape, b.shape, c.shape)
print("d =", d)
print("e =", e.round(2))

# ── Vectorized Math (no loops!) ────────────────────────────
prices   = np.array([100, 250, 80, 450, 320])
discount = 0.15
final    = prices * (1 - discount)
print("\nPrices:  ", prices)
print("Final:   ", final.astype(int))

# ── Statistics ─────────────────────────────────────────────
scores = np.array([85, 92, 78, 96, 61, 74, 88, 95, 70, 83])
print(f"\nTest scores stats:")
print(f"  Mean:   {scores.mean():.1f}")
print(f"  Std:    {scores.std():.1f}")
print(f"  Median: {np.median(scores):.1f}")
print(f"  Top 10%: {np.percentile(scores, 90):.1f}")

# ── Indexing & Boolean Filtering ───────────────────────────
matrix = np.arange(1, 13).reshape(3, 4)
print("\nMatrix:")
print(matrix)
print("Row 1:", matrix[1])
print("Col 2:", matrix[:, 2])
print("Block:", matrix[0:2, 1:3])

ages    = np.array([25, 17, 34, 15, 28, 42, 16])
adults  = ages[ages >= 18]
print("\nAges:", ages)
print("Adults:", adults)

# ── Linear Algebra (backbone of ML) ──────────────────────
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print("\nMatrix multiply A @ B:")
print(A @ B)
print("Eigenvalues of A:", np.linalg.eig(A)[0].round(3))`,
          exercise: {
            title: "Challenge: Feature Normalization",
            description: "In machine learning, feature normalization is essential — it prevents larger-scale features from dominating training. Implement two common normalization functions using NumPy.",
            tasks: [
              "Min-Max normalization: scale to [0, 1] → (x - min) / (max - min)",
              "Z-score standardization: mean=0, std=1 → (x - mean) / std",
              "Find which scores fall above average (boolean indexing)"
            ],
            starter: `import numpy as np

def min_max_normalize(arr):
    """Scale array to [0, 1] range."""
    # TODO: return (arr - arr.min()) / (arr.max() - arr.min())
    pass

def z_score(arr):
    """Standardize: mean=0, std=1."""
    # TODO: return (arr - arr.mean()) / arr.std()
    pass

# Test data: student exam scores
scores = np.array([45, 72, 61, 88, 95, 53, 79, 66, 91, 58])

norm = min_max_normalize(scores)
z    = z_score(scores)

print("Original:  ", scores)
print("Min-Max:   ", np.round(norm, 3) if norm is not None else "Not implemented")
print("Z-Score:   ", np.round(z, 3)    if z    is not None else "Not implemented")

# Bonus: which scores are above average?
# TODO: use boolean indexing → scores[scores > scores.mean()]
above_avg = None
print("Above avg: ", above_avg)`,
            solution: `import numpy as np

def min_max_normalize(arr):
    return (arr - arr.min()) / (arr.max() - arr.min())

def z_score(arr):
    return (arr - arr.mean()) / arr.std()

scores = np.array([45, 72, 61, 88, 95, 53, 79, 66, 91, 58])

norm = min_max_normalize(scores)
z    = z_score(scores)

print("Original:  ", scores)
print("Min-Max:   ", np.round(norm, 3))
print("Z-Score:   ", np.round(z, 3))

above_avg = scores[scores > scores.mean()]
print("Above avg: ", above_avg)`
          }
        },

        {
          id: "1-2",
          title: "Pandas: Data Analysis & Manipulation",
          icon: "📊",
          duration: "60 min",
          tags: ["Pandas", "DataFrame", "GroupBy", "EDA"],
          runnable: true,
          packages: [],
          theory: `
<h3>The Data Layer</h3>
<p>Before any model trains, data must be cleaned, explored, and transformed. Pandas is the tool for this. Think of a <strong>DataFrame</strong> as an Excel spreadsheet in Python — rows are samples, columns are features.</p>

<h3>Core Structures</h3>
<div class="concept-grid">
  <div class="concept-card">
    <strong>Series</strong>
    <p>1D labeled array. Like a single column. Has an index — which is what makes Pandas powerful for alignment.</p>
  </div>
  <div class="concept-card">
    <strong>DataFrame</strong>
    <p>2D table of columns, each a Series. The workhorse of data science. Rows = samples, columns = features.</p>
  </div>
  <div class="concept-card">
    <strong>Indexing</strong>
    <p><code>.loc[]</code> = label-based, <code>.iloc[]</code> = integer position. Don't confuse them — common bug source.</p>
  </div>
  <div class="concept-card">
    <strong>groupby</strong>
    <p>Split-apply-combine pattern. Group rows by category, apply aggregation (mean, sum, count), combine results.</p>
  </div>
</div>

<h3>The EDA Workflow</h3>
<p>Exploratory Data Analysis (EDA) is the first thing any ML engineer does with new data:</p>
<ol>
  <li><strong>Shape & types</strong> — <code>df.shape</code>, <code>df.dtypes</code>, <code>df.info()</code></li>
  <li><strong>Missing values</strong> — <code>df.isnull().sum()</code></li>
  <li><strong>Statistics</strong> — <code>df.describe()</code></li>
  <li><strong>Distributions</strong> — groupby + aggregation</li>
  <li><strong>Correlations</strong> — <code>df.corr()</code></li>
</ol>

<div class="info-box">
  <strong>Rule of thumb:</strong> You'll spend 60–80% of any ML project on data prep (Pandas). The model is often the easy part.
</div>`,
          code: `import pandas as pd
import numpy as np

# ── Build a realistic dataset ──────────────────────────────
np.random.seed(42)
n = 200

departments = np.random.choice(['Engineering', 'Sales', 'Marketing', 'HR'], n)
experience  = np.random.randint(1, 15, n)
base_salary = {'Engineering': 95000, 'Sales': 65000, 'Marketing': 70000, 'HR': 58000}
salary = np.array([base_salary[d] + experience[i]*2500 + np.random.normal(0, 5000)
                   for i, d in enumerate(departments)]).astype(int)
rating = np.clip(np.random.normal(3.5, 0.7, n), 1, 5).round(1)

df = pd.DataFrame({
    'Department': departments,
    'YearsExp':   experience,
    'Salary':     salary,
    'Rating':     rating
})

# ── Basic Exploration ──────────────────────────────────────
print("Shape:", df.shape)
print("\nFirst 3 rows:")
print(df.head(3).to_string())
print("\nData types:")
print(df.dtypes.to_string())

# ── Filtering ──────────────────────────────────────────────
eng_senior = df[(df['Department'] == 'Engineering') & (df['YearsExp'] >= 8)]
print(f"\nSenior Engineers: {len(eng_senior)} people")
print(f"  Avg salary: ${eng_senior['Salary'].mean():,.0f}")

# ── GroupBy Analysis ──────────────────────────────────────
print("\nDepartment Summary:")
summary = df.groupby('Department').agg(
    Count=('Salary', 'count'),
    AvgSalary=('Salary', 'mean'),
    AvgRating=('Rating', 'mean'),
    AvgExp=('YearsExp', 'mean')
).round(1)
print(summary.to_string())

# ── Derived Columns ────────────────────────────────────────
df['SalaryBand'] = pd.cut(df['Salary'],
    bins=[0, 70000, 90000, 120000, 999999],
    labels=['Entry', 'Mid', 'Senior', 'Lead'])
print("\nSalary distribution:")
print(df['SalaryBand'].value_counts().to_string())

# ── Missing Data handling ──────────────────────────────────
df_with_missing = df.copy()
df_with_missing.loc[np.random.choice(n, 20), 'Rating'] = np.nan
print(f"\nMissing ratings: {df_with_missing['Rating'].isnull().sum()}")
df_with_missing['Rating'].fillna(df_with_missing['Rating'].mean(), inplace=True)
print(f"After fill: {df_with_missing['Rating'].isnull().sum()} missing")`,
          exercise: {
            title: "Challenge: Sales Performance Analysis",
            description: "Analyse a sales dataset using Pandas groupby, filtering, and aggregation.",
            tasks: [
              "Find the top 3 products by total revenue",
              "Calculate monthly average order value",
              "Find regions where revenue > $50,000"
            ],
            starter: `import pandas as pd
import numpy as np

np.random.seed(0)
n = 150
df = pd.DataFrame({
    'Product': np.random.choice(['Laptop', 'Phone', 'Tablet', 'Watch'], n),
    'Region':  np.random.choice(['North', 'South', 'East', 'West'], n),
    'Month':   np.random.choice(['Jan', 'Feb', 'Mar', 'Apr', 'May'], n),
    'Units':   np.random.randint(1, 50, n),
    'Price':   np.random.choice([999, 599, 399, 299], n)
})
df['Revenue'] = df['Units'] * df['Price']

# TODO 1: Top 3 products by total revenue
top_products = None  # df.groupby('Product')['Revenue'].sum().nlargest(3)
print("Top 3 products:")
print(top_products)

# TODO 2: Monthly average order value
monthly_avg = None  # df.groupby('Month')['Revenue'].mean().round(0)
print("\nMonthly avg revenue:")
print(monthly_avg)

# TODO 3: High-performing regions (total > 50000)
region_rev = None  # df.groupby('Region')['Revenue'].sum()
high_regions = None  # region_rev[region_rev > 50000]
print("\nHigh revenue regions:")
print(high_regions)`,
            solution: `import pandas as pd
import numpy as np

np.random.seed(0)
n = 150
df = pd.DataFrame({
    'Product': np.random.choice(['Laptop', 'Phone', 'Tablet', 'Watch'], n),
    'Region':  np.random.choice(['North', 'South', 'East', 'West'], n),
    'Month':   np.random.choice(['Jan', 'Feb', 'Mar', 'Apr', 'May'], n),
    'Units':   np.random.randint(1, 50, n),
    'Price':   np.random.choice([999, 599, 399, 299], n)
})
df['Revenue'] = df['Units'] * df['Price']

top_products = df.groupby('Product')['Revenue'].sum().nlargest(3)
print("Top 3 products:")
print(top_products)

monthly_avg = df.groupby('Month')['Revenue'].mean().round(0)
print("\nMonthly avg revenue:")
print(monthly_avg)

region_rev  = df.groupby('Region')['Revenue'].sum()
high_regions = region_rev[region_rev > 50000]
print("\nHigh revenue regions:")
print(high_regions)`
          }
        },

        {
          id: "1-3",
          title: "Matplotlib: Data Visualization",
          icon: "📈",
          duration: "45 min",
          tags: ["Matplotlib", "Visualization", "Plots", "EDA"],
          runnable: true,
          packages: [],
          theory: `
<h3>Why Visualization Matters in AI</h3>
<p>Data visualization is not just for presentations. It's a <strong>debugging tool</strong> and an <strong>understanding tool</strong>. Before training any model, plot your data. You'll catch outliers, see distributions, spot correlations, and understand what the model needs to learn.</p>

<h3>Key Plot Types for ML</h3>
<table class="algo-table">
  <tr><th>Plot</th><th>When to use</th><th>Code</th></tr>
  <tr><td>Line</td><td>Trends over time, training loss curves</td><td><code>ax.plot(x, y)</code></td></tr>
  <tr><td>Scatter</td><td>Relationship between 2 features</td><td><code>ax.scatter(x, y)</code></td></tr>
  <tr><td>Histogram</td><td>Distribution of a feature</td><td><code>ax.hist(x, bins=30)</code></td></tr>
  <tr><td>Bar</td><td>Comparing categories</td><td><code>ax.bar(cats, vals)</code></td></tr>
  <tr><td>Heatmap</td><td>Correlation matrices</td><td><code>ax.imshow(matrix)</code></td></tr>
</table>

<h3>Matplotlib Mental Model</h3>
<p>Always use the <strong>OO interface</strong> (not <code>plt.plot()</code> functions). Create a figure and axes explicitly:</p>
<ul>
  <li><code>fig, ax = plt.subplots()</code> — one plot</li>
  <li><code>fig, axes = plt.subplots(2, 2)</code> — 2x2 grid</li>
  <li>Call methods on <code>ax</code>: <code>ax.plot()</code>, <code>ax.set_title()</code>, etc.</li>
</ul>

<div class="info-box">
  <strong>In production AI:</strong> You'll use matplotlib to plot training/validation loss curves, confusion matrices, feature importance charts, and prediction distributions.
</div>`,
          code: `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64

np.random.seed(42)

# ── Create a 2x2 dashboard of plots ─────────────────────
fig, axes = plt.subplots(2, 2, figsize=(10, 8))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('ML Data Exploration Dashboard', color='#e6edf3', fontsize=14, fontweight='bold', y=1.01)

STYLE = dict(facecolor='#161b22', tick_params=dict(colors='#8b949e'))
def style_ax(ax, title):
    ax.set_facecolor('#161b22')
    ax.tick_params(colors='#8b949e')
    ax.set_title(title, color='#e6edf3', fontsize=10, pad=8)
    for spine in ax.spines.values(): spine.set_color('#30363d')

# Plot 1: Training loss curve
epochs = np.arange(1, 51)
train_loss = 2.5 * np.exp(-0.08 * epochs) + 0.1 + np.random.normal(0, 0.02, 50)
val_loss   = 2.5 * np.exp(-0.07 * epochs) + 0.18 + np.random.normal(0, 0.03, 50)
ax = axes[0, 0]
ax.plot(epochs, train_loss, color='#818cf8', label='Train Loss', linewidth=1.8)
ax.plot(epochs, val_loss,   color='#f472b6', label='Val Loss',   linewidth=1.8, linestyle='--')
ax.legend(facecolor='#21262d', edgecolor='#30363d', labelcolor='#e6edf3', fontsize=8)
ax.set_xlabel('Epoch', color='#8b949e', fontsize=9)
style_ax(ax, 'Training Loss Curve')

# Plot 2: Feature distribution (histogram)
feature = np.concatenate([np.random.normal(50, 10, 500), np.random.normal(80, 8, 200)])
ax = axes[0, 1]
ax.hist(feature, bins=30, color='#3b82f6', edgecolor='#0d1117', alpha=0.85)
ax.axvline(feature.mean(), color='#f59e0b', linestyle='--', linewidth=1.5, label=f'Mean: {feature.mean():.1f}')
ax.legend(facecolor='#21262d', edgecolor='#30363d', labelcolor='#e6edf3', fontsize=8)
style_ax(ax, 'Feature Distribution')

# Plot 3: Scatter — two classes
c1 = np.random.multivariate_normal([2, 2], [[1,.5],[.5,1]], 150)
c2 = np.random.multivariate_normal([5, 5], [[1,-.3],[-.3,1]], 150)
ax = axes[1, 0]
ax.scatter(c1[:,0], c1[:,1], color='#10b981', alpha=0.6, s=18, label='Class 0')
ax.scatter(c2[:,0], c2[:,1], color='#f472b6', alpha=0.6, s=18, label='Class 1')
ax.legend(facecolor='#21262d', edgecolor='#30363d', labelcolor='#e6edf3', fontsize=8)
style_ax(ax, 'Feature Scatter (2 Classes)')

# Plot 4: Feature importance bar chart
features   = ['Age', 'Income', 'Score', 'Tenure', 'Region']
importance = [0.31, 0.27, 0.19, 0.14, 0.09]
colors     = ['#818cf8' if v == max(importance) else '#3b82f6' for v in importance]
ax = axes[1, 1]
bars = ax.barh(features, importance, color=colors, edgecolor='#0d1117')
for bar, val in zip(bars, importance):
    ax.text(bar.get_width() + 0.005, bar.get_y() + bar.get_height()/2,
            f'{val:.0%}', va='center', color='#8b949e', fontsize=8)
style_ax(ax, 'Feature Importance')

plt.tight_layout()

# Capture and display
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=110, bbox_inches='tight', facecolor='#0d1117')
plt.close()
buf.seek(0)
print(f"__PLOT__:{base64.b64encode(buf.read()).decode()}")`,
          exercise: {
            title: "Challenge: Visualize Your Own Dataset",
            description: "Create a scatter plot showing the relationship between study hours and exam scores, with a color for pass/fail.",
            tasks: [
              "Generate 80 students with random hours (1–10) and scores",
              "Color points: green if score >= 60 (pass), red if fail",
              "Add a horizontal line at score=60 (pass threshold)",
              "Label axes and add a title"
            ],
            starter: `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64

np.random.seed(7)
hours  = np.random.uniform(1, 10, 80)
scores = hours * 8 + np.random.normal(0, 8, 80)
scores = np.clip(scores, 10, 100)

fig, ax = plt.subplots(figsize=(8, 5))
fig.patch.set_facecolor('#0d1117')
ax.set_facecolor('#161b22')
for spine in ax.spines.values(): spine.set_color('#30363d')
ax.tick_params(colors='#8b949e')

# TODO: scatter points — use 'green' for pass (>=60), 'red' for fail
# Hint: colors = np.where(scores >= 60, 'green', 'red')
# ax.scatter(hours, scores, c=colors, alpha=0.7, s=40)

# TODO: add horizontal line at 60 (pass threshold)
# ax.axhline(60, ...)

# TODO: labels and title
# ax.set_xlabel(...)

buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#0d1117')
plt.close()
buf.seek(0)
print(f"__PLOT__:{base64.b64encode(buf.read()).decode()}")`,
            solution: `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64

np.random.seed(7)
hours  = np.random.uniform(1, 10, 80)
scores = hours * 8 + np.random.normal(0, 8, 80)
scores = np.clip(scores, 10, 100)

fig, ax = plt.subplots(figsize=(8, 5))
fig.patch.set_facecolor('#0d1117')
ax.set_facecolor('#161b22')
for spine in ax.spines.values(): spine.set_color('#30363d')
ax.tick_params(colors='#8b949e')

colors = np.where(scores >= 60, '#10b981', '#f85149')
ax.scatter(hours, scores, c=colors, alpha=0.75, s=45, edgecolors='#30363d', linewidths=0.5)
ax.axhline(60, color='#f59e0b', linestyle='--', linewidth=1.5, label='Pass threshold (60)')
ax.set_xlabel('Study Hours', color='#8b949e')
ax.set_ylabel('Exam Score', color='#8b949e')
ax.set_title('Study Hours vs Exam Score', color='#e6edf3', fontsize=12)
ax.legend(facecolor='#21262d', edgecolor='#30363d', labelcolor='#e6edf3')

buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#0d1117')
plt.close()
buf.seek(0)
print(f"__PLOT__:{base64.b64encode(buf.read()).decode()}")`
          }
        }
      ]
    },

    /* ══════════════════════════════════════════
       STAGE 2 — Machine Learning Foundations
    ══════════════════════════════════════════ */
    {
      id: 2,
      title: "Machine Learning Foundations",
      icon: "🤖",
      color: "#f59e0b",
      duration: "4–5 weeks",
      description: "Learn how machines learn. Understand the core algorithms, when to use each one, and how to evaluate model performance — all with scikit-learn.",
      lessons: [

        {
          id: "2-1",
          title: "Linear Regression: Teaching Machines to Predict",
          icon: "📉",
          duration: "50 min",
          tags: ["sklearn", "Regression", "MSE", "R²"],
          runnable: true,
          packages: ["scikit-learn"],
          theory: `
<h3>What is Machine Learning?</h3>
<p>A model <strong>learns a function from data</strong>. Instead of hardcoding rules, we give the algorithm examples (features X, target y) and it finds the mapping y = f(X).</p>

<h3>Linear Regression</h3>
<p>The simplest model: predict y as a weighted sum of features.</p>
<p><strong>y = w₁x₁ + w₂x₂ + ... + b</strong></p>
<p>The algorithm finds weights (w) and bias (b) that minimize <strong>Mean Squared Error</strong>: average of (predicted − actual)².</p>

<h3>The sklearn Workflow (same for every model)</h3>
<ol>
  <li>Split data: <code>train_test_split(X, y, test_size=0.2)</code></li>
  <li>Create model: <code>model = LinearRegression()</code></li>
  <li>Train: <code>model.fit(X_train, y_train)</code></li>
  <li>Predict: <code>y_pred = model.predict(X_test)</code></li>
  <li>Evaluate: RMSE, R² score</li>
</ol>

<div class="concept-grid">
  <div class="concept-card">
    <strong>R² Score</strong>
    <p>1.0 = perfect. 0 = model just predicts the mean. Negative = worse than mean. Target: > 0.8 for most tasks.</p>
  </div>
  <div class="concept-card">
    <strong>RMSE</strong>
    <p>Root Mean Squared Error. In the same units as y. Easy to interpret: "predictions are off by X units on average."</p>
  </div>
  <div class="concept-card">
    <strong>Overfitting</strong>
    <p>Model memorizes training data but fails on new data. Train score >> Test score = overfitting.</p>
  </div>
  <div class="concept-card">
    <strong>Underfitting</strong>
    <p>Model too simple — both train and test score are low. Solution: more features or more complex model.</p>
  </div>
</div>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# ── Synthetic housing dataset ─────────────────────────────
np.random.seed(42)
n = 300

size     = np.random.normal(1500, 400, n).clip(500, 3000)
bedrooms = np.random.choice([1, 2, 3, 4, 5], n)
age      = np.random.uniform(0, 50, n)

# Ground truth: price is a function of these features
price = (size * 120 + bedrooms * 10000 - age * 600
         + np.random.normal(0, 18000, n))

X = np.column_stack([size, bedrooms, age])
y = price

# ── Train / Test split ────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
print(f"Train: {len(X_train)} samples | Test: {len(X_test)} samples")

# ── Train model ───────────────────────────────────────────
model = LinearRegression()
model.fit(X_train, y_train)

# ── Evaluate ──────────────────────────────────────────────
y_pred   = model.predict(X_test)
rmse     = np.sqrt(mean_squared_error(y_test, y_pred))
r2_train = r2_score(y_train, model.predict(X_train))
r2_test  = r2_score(y_test, y_pred)

print(f"\nModel Performance:")
print(f"  Train R²: {r2_train:.4f}")
print(f"  Test  R²: {r2_test:.4f}  ← how well it generalizes")
print(f"  RMSE:     ${rmse:,.0f}  (avg prediction error)")

# ── Interpret coefficients ────────────────────────────────
features = ['Size (sqft)', 'Bedrooms', 'Age (years)']
print(f"\nLearned Weights:")
for name, coef in zip(features, model.coef_):
    print(f"  {name:15s}: ${coef:+,.0f} per unit")
print(f"  {'Intercept':15s}: ${model.intercept_:,.0f}")

# ── Predict a new house ───────────────────────────────────
house = np.array([[2200, 3, 8]])   # 2200 sqft, 3 beds, 8 yrs old
pred  = model.predict(house)[0]
print(f"\nNew house (2200sqft, 3bed, 8yrs): ${pred:,.0f}")`,
          exercise: {
            title: "Challenge: Salary Predictor",
            description: "Build a linear regression model to predict salaries from years of experience.",
            tasks: [
              "Split data 80/20 train/test",
              "Train a LinearRegression model",
              "Evaluate with R² and RMSE",
              "Predict salary for 7 years experience"
            ],
            starter: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

np.random.seed(1)
years  = np.random.uniform(0, 20, 100)
salary = years * 4200 + 35000 + np.random.normal(0, 6000, 100)

X = years.reshape(-1, 1)
y = salary

# TODO 1: Split — 80% train, 20% test (test_size=0.2, random_state=42)
X_train, X_test, y_train, y_test = None, None, None, None

# TODO 2: Create and train model
model = None  # LinearRegression()
# model.fit(...)

# TODO 3: Predict on test set
y_pred = None

# TODO 4: Print R² and RMSE
print("R² score:", None)
print("RMSE:    ", None)

# TODO 5: Predict salary for 7 years
pred_7 = None
print("7 years exp → salary:", pred_7)`,
            solution: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

np.random.seed(1)
years  = np.random.uniform(0, 20, 100)
salary = years * 4200 + 35000 + np.random.normal(0, 6000, 100)

X = years.reshape(-1, 1)
y = salary

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print(f"R² score: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE:     ${np.sqrt(mean_squared_error(y_test, y_pred)):,.0f}")

pred_7 = model.predict([[7]])[0]
print(f"7 years exp → salary: ${pred_7:,.0f}")`
          }
        },

        {
          id: "2-2",
          title: "Classification: Logistic Regression & Decision Trees",
          icon: "🎯",
          duration: "55 min",
          tags: ["Classification", "Logistic Regression", "Decision Tree", "Accuracy"],
          runnable: true,
          packages: ["scikit-learn"],
          theory: `
<h3>Classification vs Regression</h3>
<p>In <strong>regression</strong>, we predict a number (salary, price). In <strong>classification</strong>, we predict a <strong>category</strong> (spam/not-spam, disease/healthy, cat/dog).</p>

<h3>Key Algorithms</h3>
<table class="algo-table">
  <tr><th>Algorithm</th><th>How it works</th><th>Best for</th></tr>
  <tr><td>Logistic Regression</td><td>Linear boundary + sigmoid function. Outputs probability.</td><td>Binary, linearly separable</td></tr>
  <tr><td>Decision Tree</td><td>Splits data by best feature at each node. Interpretable.</td><td>Mixed types, non-linear</td></tr>
  <tr><td>Random Forest</td><td>Ensemble of trees — reduces overfitting.</td><td>Most tabular tasks</td></tr>
  <tr><td>SVM</td><td>Finds maximum-margin hyperplane.</td><td>High-dimensional, small data</td></tr>
</table>

<h3>Evaluation Metrics</h3>
<div class="concept-grid">
  <div class="concept-card">
    <strong>Accuracy</strong>
    <p>% correct predictions. Misleading on imbalanced datasets (99% accuracy predicting "not cancer" if 1% have it).</p>
  </div>
  <div class="concept-card">
    <strong>Precision</strong>
    <p>Of predicted positives, how many are actually positive? High precision = few false alarms.</p>
  </div>
  <div class="concept-card">
    <strong>Recall</strong>
    <p>Of actual positives, how many did we catch? High recall = few missed cases (critical in medicine).</p>
  </div>
  <div class="concept-card">
    <strong>F1 Score</strong>
    <p>Harmonic mean of precision and recall. Use when classes are imbalanced.</p>
  </div>
</div>

<div class="info-box">
  <strong>The confusion matrix</strong> is your best friend. It shows true positives, false positives, true negatives, false negatives — giving you the full picture.
</div>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (accuracy_score, precision_score,
                              recall_score, f1_score, confusion_matrix)

# ── Generate a classification dataset ────────────────────
X, y = make_classification(
    n_samples=500, n_features=8, n_informative=5,
    n_redundant=2, n_classes=2, random_state=42)
print(f"Dataset: {X.shape} features, {y.sum()} positives / {(y==0).sum()} negatives")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# ── Train & evaluate both models ─────────────────────────
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Decision Tree':       DecisionTreeClassifier(max_depth=5, random_state=42)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    print(f"\n── {name} ──")
    print(f"  Accuracy:  {accuracy_score(y_test, y_pred):.3f}")
    print(f"  Precision: {precision_score(y_test, y_pred):.3f}")
    print(f"  Recall:    {recall_score(y_test, y_pred):.3f}")
    print(f"  F1:        {f1_score(y_test, y_pred):.3f}")

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    print(f"  Confusion Matrix:")
    print(f"    True Neg:  {tn:3d} | False Pos: {fp:3d}")
    print(f"    False Neg: {fn:3d} | True Pos:  {tp:3d}")

# ── Logistic Regression also gives probabilities ──────────
lr = models['Logistic Regression']
probs = lr.predict_proba(X_test[:5])
print("\nPrediction probabilities (first 5 samples):")
for i, (p0, p1) in enumerate(probs):
    pred = "POSITIVE" if p1 >= 0.5 else "negative"
    print(f"  Sample {i}: {p0:.3f} neg / {p1:.3f} pos → {pred}")`,
          exercise: {
            title: "Challenge: Email Spam Classifier",
            description: "Train a logistic regression classifier on a synthetic email dataset.",
            tasks: [
              "Use make_classification to create 400 samples, 10 features",
              "Train LogisticRegression",
              "Print accuracy, F1, and the confusion matrix",
              "Identify the 3 most confident positive predictions using predict_proba"
            ],
            starter: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

# TODO: create dataset, 400 samples, 10 features, random_state=0
X, y = None, None

# TODO: split 80/20
X_train, X_test, y_train, y_test = None, None, None, None

# TODO: train logistic regression
model = None

# TODO: evaluate
y_pred = None
print("Accuracy:", None)
print("F1:      ", None)
print("Conf matrix:")
print(None)

# TODO: top 3 most confident positives using model.predict_proba(X_test)
# probs = model.predict_proba(X_test)[:, 1]
# top3_idx = np.argsort(probs)[-3:]
print("Top 3 confident positives:", None)`,
            solution: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

X, y = make_classification(n_samples=400, n_features=10, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"F1:       {f1_score(y_test, y_pred):.3f}")
print("Conf matrix:")
print(confusion_matrix(y_test, y_pred))

probs    = model.predict_proba(X_test)[:, 1]
top3_idx = np.argsort(probs)[-3:]
print(f"Top 3 most confident positives (indices): {top3_idx}")
print(f"Their probabilities: {probs[top3_idx].round(3)}")`
          }
        },

        {
          id: "2-3",
          title: "Random Forest & Gradient Boosting",
          icon: "🌲",
          duration: "55 min",
          tags: ["Random Forest", "Gradient Boosting", "Ensemble", "Feature Importance"],
          runnable: true,
          packages: ["scikit-learn"],
          theory: `
<h3>Why Ensembles?</h3>
<p>A single decision tree is interpretable but overfits easily. <strong>Ensemble methods</strong> combine many weak models into a strong one. Two main approaches:</p>

<div class="concept-grid">
  <div class="concept-card">
    <strong>Bagging</strong>
    <p>Train many models on random subsets of data (in parallel). Average their predictions. Random Forest uses this. Reduces variance.</p>
  </div>
  <div class="concept-card">
    <strong>Boosting</strong>
    <p>Train models sequentially — each one focuses on errors of the previous. Gradient Boosting, XGBoost, LightGBM use this. Reduces bias.</p>
  </div>
</div>

<h3>Random Forest</h3>
<p>Builds N decision trees, each on a random sample of data + random subset of features. Final prediction = majority vote (classification) or mean (regression).</p>
<p>Key hyperparameters: <code>n_estimators</code> (more = more stable), <code>max_depth</code>, <code>min_samples_leaf</code></p>

<h3>Gradient Boosting</h3>
<p>Trains trees sequentially. Each tree corrects errors of the ensemble so far. <strong>XGBoost</strong> and <strong>LightGBM</strong> are industrial-strength implementations — they win Kaggle competitions.</p>
<p>Key hyperparameters: <code>learning_rate</code> (lower = need more trees), <code>n_estimators</code>, <code>max_depth</code></p>

<div class="info-box">
  <strong>Industry default:</strong> Start with Random Forest for interpretability and speed. Switch to LightGBM/XGBoost when you need top performance on tabular data.
</div>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64

X, y = make_classification(n_samples=600, n_features=12, n_informative=7,
                            n_redundant=3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

feature_names = [f'Feature_{i}' for i in range(12)]

# ── Random Forest ─────────────────────────────────────────
rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
rf.fit(X_train, y_train)
rf_acc = accuracy_score(y_test, rf.predict(X_test))

# ── Gradient Boosting ─────────────────────────────────────
gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1,
                                 max_depth=4, random_state=42)
gb.fit(X_train, y_train)
gb_acc = accuracy_score(y_test, gb.predict(X_test))

print(f"Random Forest Accuracy:   {rf_acc:.4f}")
print(f"Gradient Boosting Acc:    {gb_acc:.4f}")

# ── Cross-validation (more reliable than single split) ────
cv_rf = cross_val_score(rf, X, y, cv=5, scoring='accuracy')
cv_gb = cross_val_score(gb, X, y, cv=5, scoring='accuracy')
print(f"\n5-Fold Cross-Validation:")
print(f"  RF:  {cv_rf.mean():.4f} ± {cv_rf.std():.4f}")
print(f"  GB:  {cv_gb.mean():.4f} ± {cv_gb.std():.4f}")

# ── Feature Importance Plot ───────────────────────────────
importance = rf.feature_importances_
idx = np.argsort(importance)[-8:]   # top 8

fig, ax = plt.subplots(figsize=(7, 4))
fig.patch.set_facecolor('#0d1117')
ax.set_facecolor('#161b22')
for spine in ax.spines.values(): spine.set_color('#30363d')
ax.tick_params(colors='#8b949e')

colors = ['#818cf8' if i == idx[-1] else '#3b82f6' for i in idx]
ax.barh([feature_names[i] for i in idx], importance[idx], color=colors)
ax.set_title('Random Forest — Top Feature Importances', color='#e6edf3')
ax.set_xlabel('Importance', color='#8b949e')

plt.tight_layout()
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#0d1117')
plt.close(); buf.seek(0)
print(f"__PLOT__:{base64.b64encode(buf.read()).decode()}")`,
          exercise: {
            title: "Challenge: Compare Ensemble Models",
            description: "Train and compare Random Forest vs Gradient Boosting with cross-validation. Find the better model.",
            tasks: [
              "Use make_classification with 800 samples, 15 features",
              "Train RF (n_estimators=100) and GB (learning_rate=0.05, n_estimators=200)",
              "Compare using 5-fold cross_val_score",
              "Print which model wins and by how much"
            ],
            starter: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=800, n_features=15, n_informative=8, random_state=0)

# TODO: create models
rf = None  # RandomForestClassifier(n_estimators=100, random_state=0)
gb = None  # GradientBoostingClassifier(learning_rate=0.05, n_estimators=200, random_state=0)

# TODO: 5-fold CV for both
cv_rf = None
cv_gb = None

print(f"RF:  {cv_rf.mean():.4f} ± {cv_rf.std():.4f}" if cv_rf is not None else "RF not done")
print(f"GB:  {cv_gb.mean():.4f} ± {cv_gb.std():.4f}" if cv_gb is not None else "GB not done")
print("Winner:", None)`,
            solution: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=800, n_features=15, n_informative=8, random_state=0)

rf = RandomForestClassifier(n_estimators=100, random_state=0)
gb = GradientBoostingClassifier(learning_rate=0.05, n_estimators=200, random_state=0)

cv_rf = cross_val_score(rf, X, y, cv=5)
cv_gb = cross_val_score(gb, X, y, cv=5)

print(f"RF:  {cv_rf.mean():.4f} ± {cv_rf.std():.4f}")
print(f"GB:  {cv_gb.mean():.4f} ± {cv_gb.std():.4f}")
winner = "Random Forest" if cv_rf.mean() > cv_gb.mean() else "Gradient Boosting"
diff   = abs(cv_rf.mean() - cv_gb.mean()) * 100
print(f"Winner: {winner} by {diff:.2f}%")`
          }
        },

        {
          id: "2-4",
          title: "Clustering: Unsupervised Learning",
          icon: "🔵",
          duration: "45 min",
          tags: ["K-Means", "Clustering", "Unsupervised", "Segmentation"],
          runnable: true,
          packages: ["scikit-learn"],
          theory: `
<h3>Unsupervised Learning</h3>
<p>No labels. The algorithm discovers structure in data on its own. Common use cases: customer segmentation, anomaly detection, data compression, exploratory analysis.</p>

<h3>K-Means Algorithm</h3>
<ol>
  <li>Initialize K cluster centroids randomly</li>
  <li>Assign each point to the nearest centroid</li>
  <li>Update centroids to the mean of assigned points</li>
  <li>Repeat until convergence</li>
</ol>

<h3>How to Choose K: The Elbow Method</h3>
<p>Plot inertia (sum of squared distances to cluster center) vs K. Look for the "elbow" — the point where adding more clusters gives diminishing returns.</p>

<div class="concept-grid">
  <div class="concept-card">
    <strong>Inertia</strong>
    <p>Within-cluster sum of squares. Lower = tighter clusters. Used to find optimal K.</p>
  </div>
  <div class="concept-card">
    <strong>Silhouette Score</strong>
    <p>Measures how similar a point is to its own cluster vs others. Ranges -1 to 1. Higher = better.</p>
  </div>
  <div class="concept-card">
    <strong>DBSCAN</strong>
    <p>Density-based. Finds arbitrary-shaped clusters. Handles noise/outliers. No need to specify K.</p>
  </div>
  <div class="concept-card">
    <strong>Scale first!</strong>
    <p>K-Means is distance-based. Always StandardScaler before clustering or features with large ranges dominate.</p>
  </div>
</div>`,
          code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64

np.random.seed(42)

# ── Simulate customer data ────────────────────────────────
# 4 natural customer segments
segments = [
    np.random.multivariate_normal([20, 5000],  [[10,0],[0,200000]], 100),  # Young low-income
    np.random.multivariate_normal([45, 90000], [[20,0],[0,500000]], 100),  # Middle-aged high-income
    np.random.multivariate_normal([30, 40000], [[15,0],[0,100000]], 100),  # Young mid-income
    np.random.multivariate_normal([60, 70000], [[25,0],[0,300000]], 100),  # Senior high-income
]
data = np.vstack(segments)
print(f"Dataset: {data.shape[0]} customers, features: [Age, AnnualIncome]")

# ── Scale — CRITICAL for K-Means ─────────────────────────
scaler = StandardScaler()
X = scaler.fit_transform(data)

# ── Elbow Method: find optimal K ─────────────────────────
inertias  = []
sil_scores = []
K_range = range(2, 9)
for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init='auto')
    km.fit(X)
    inertias.append(km.inertia_)
    sil_scores.append(silhouette_score(X, km.labels_))

best_k = K_range[np.argmax(sil_scores)]
print(f"\nBest K by silhouette: {best_k}")

# ── Fit final model ───────────────────────────────────────
km_final = KMeans(n_clusters=4, random_state=42, n_init='auto')
labels = km_final.fit_predict(X)

# ── Analyze segments ──────────────────────────────────────
print("\nCustomer Segments:")
for seg in range(4):
    mask = labels == seg
    ages    = data[mask, 0]
    incomes = data[mask, 1]
    print(f"  Segment {seg}: {mask.sum():3d} customers | "
          f"Age {ages.mean():.0f}y | Income ${incomes.mean():,.0f}")

# ── Visualization ─────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
fig.patch.set_facecolor('#0d1117')
colors_map = ['#818cf8', '#f59e0b', '#10b981', '#f472b6']

for ax in axes:
    ax.set_facecolor('#161b22')
    ax.tick_params(colors='#8b949e')
    for spine in ax.spines.values(): spine.set_color('#30363d')

ax1 = axes[0]
for seg, c in zip(range(4), colors_map):
    mask = labels == seg
    ax1.scatter(data[mask,0], data[mask,1]/1000, c=c, alpha=0.6, s=20, label=f'Seg {seg}')
ax1.set_xlabel('Age', color='#8b949e')
ax1.set_ylabel('Income (k$)', color='#8b949e')
ax1.set_title('Customer Segments', color='#e6edf3')
ax1.legend(fontsize=8, facecolor='#21262d', edgecolor='#30363d', labelcolor='#e6edf3')

ax2 = axes[1]
ax2.plot(list(K_range), sil_scores, 'o-', color='#818cf8', linewidth=2)
ax2.axvline(best_k, color='#f59e0b', linestyle='--', linewidth=1.5)
ax2.set_xlabel('Number of Clusters K', color='#8b949e')
ax2.set_ylabel('Silhouette Score', color='#8b949e')
ax2.set_title('Optimal K Selection', color='#e6edf3')

plt.tight_layout()
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#0d1117')
plt.close(); buf.seek(0)
print(f"__PLOT__:{base64.b64encode(buf.read()).decode()}")`,
          exercise: {
            title: "Challenge: Cluster Product Data",
            description: "Group e-commerce products into clusters based on price and rating.",
            tasks: [
              "Generate 200 products with price ($5–$500) and rating (1–5)",
              "StandardScale the features",
              "Try K=3 clusters and fit KMeans",
              "Print average price and rating per cluster"
            ],
            starter: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

np.random.seed(5)
prices  = np.random.exponential(scale=80, size=200).clip(5, 500)
ratings = np.clip(np.random.normal(3.5, 0.9, 200), 1, 5)
data = np.column_stack([prices, ratings])

# TODO: Scale the data
scaler = StandardScaler()
X = None  # scaler.fit_transform(data)

# TODO: Fit KMeans with 3 clusters
km = None  # KMeans(n_clusters=3, random_state=42, n_init='auto')
labels = None

# TODO: Print cluster stats
for k in range(3):
    mask = labels == k
    print(f"Cluster {k}: {mask.sum()} products | "
          f"avg price ${data[mask,0].mean():.0f} | "
          f"avg rating {data[mask,1].mean():.2f}")`,
            solution: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

np.random.seed(5)
prices  = np.random.exponential(scale=80, size=200).clip(5, 500)
ratings = np.clip(np.random.normal(3.5, 0.9, 200), 1, 5)
data = np.column_stack([prices, ratings])

scaler = StandardScaler()
X = scaler.fit_transform(data)

km = KMeans(n_clusters=3, random_state=42, n_init='auto')
labels = km.fit_predict(X)

for k in range(3):
    mask = labels == k
    print(f"Cluster {k}: {mask.sum()} products | "
          f"avg price ${data[mask,0].mean():.0f} | "
          f"avg rating {data[mask,1].mean():.2f}")`
          }
        }
      ]
    },

    /* ══════════════════════════════════════════
       STAGE 3 — Deep Learning
    ══════════════════════════════════════════ */
    {
      id: 3,
      title: "Deep Learning",
      icon: "🧠",
      color: "#ec4899",
      duration: "5–6 weeks",
      description: "Neural networks, CNNs, RNNs, and the Transformer architecture. Use PyTorch — the industry standard for research and production AI.",
      lessons: [
        {
          id: "3-1",
          title: "Neural Networks: The Building Blocks",
          icon: "⚡",
          duration: "60 min",
          tags: ["PyTorch", "Neural Network", "Backprop", "Activation"],
          runnable: false,
          theory: `
<h3>From Linear Models to Neural Networks</h3>
<p>A neural network is a sequence of linear transformations with <strong>non-linear activation functions</strong> between them. Without activations, stacking layers would just be one big linear model.</p>

<h3>Key Concepts</h3>
<div class="concept-grid">
  <div class="concept-card">
    <strong>Layer</strong>
    <p>A linear transformation: output = W·input + b. Each neuron in a layer has its own weights.</p>
  </div>
  <div class="concept-card">
    <strong>Activation</strong>
    <p>Non-linearity applied element-wise. ReLU (max(0,x)) is the default. Sigmoid for binary outputs.</p>
  </div>
  <div class="concept-card">
    <strong>Forward Pass</strong>
    <p>Input flows through layers to produce prediction. Each layer transforms the representation.</p>
  </div>
  <div class="concept-card">
    <strong>Backprop</strong>
    <p>Compute gradient of loss w.r.t. every weight using chain rule. PyTorch does this automatically.</p>
  </div>
  <div class="concept-card">
    <strong>Optimizer</strong>
    <p>Adam, SGD update weights using gradients. Adam is the default — adapts learning rate per parameter.</p>
  </div>
  <div class="concept-card">
    <strong>Loss Function</strong>
    <p>MSE for regression. CrossEntropyLoss for classification. This is what gets minimized.</p>
  </div>
</div>

<div class="info-box">
  <strong>GPU memory:</strong> Use <code>float32</code> not <code>float64</code>. Always move tensors to device with <code>.to(device)</code>. This is the #1 source of bugs for beginners.
</div>`,
          code: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import numpy as np

# ── Device setup ──────────────────────────────────────────
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using: {device}")

# ── Synthetic classification dataset ─────────────────────
np.random.seed(42)
X = np.random.randn(1000, 10).astype(np.float32)
y = (X[:, 0] + X[:, 1] * 2 - X[:, 3] > 0).astype(np.float32)

X_t = torch.tensor(X)
y_t = torch.tensor(y).unsqueeze(1)

dataset = TensorDataset(X_t, y_t)
loader  = DataLoader(dataset, batch_size=32, shuffle=True)

# ── Define the network ────────────────────────────────────
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(10, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

model     = MLP().to(device)
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=1e-3)

print(f"\nModel parameters: {sum(p.numel() for p in model.parameters()):,}")

# ── Training loop ─────────────────────────────────────────
for epoch in range(20):
    model.train()
    total_loss = 0
    for X_batch, y_batch in loader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)

        optimizer.zero_grad()          # Clear gradients
        pred = model(X_batch)          # Forward pass
        loss = criterion(pred, y_batch)
        loss.backward()                # Backpropagation
        optimizer.step()               # Update weights

        total_loss += loss.item()

    if (epoch + 1) % 5 == 0:
        model.eval()
        with torch.no_grad():
            preds = (model(X_t.to(device)) > 0.5).float().squeeze()
            acc   = (preds == y_t.squeeze()).float().mean()
        avg_loss = total_loss / len(loader)
        print(f"Epoch {epoch+1:2d} | Loss: {avg_loss:.4f} | Accuracy: {acc:.4f}")`,
          exercise: null
        },

        {
          id: "3-2",
          title: "Convolutional Neural Networks (CNN)",
          icon: "🖼️",
          duration: "60 min",
          tags: ["CNN", "Conv2D", "Pooling", "Image Classification"],
          runnable: false,
          theory: `
<h3>Why CNNs for Images?</h3>
<p>A 224×224 RGB image has 150,528 pixels. A fully connected layer would need millions of weights per layer. CNNs solve this with <strong>parameter sharing</strong> and <strong>local connectivity</strong>.</p>

<h3>Core Layers</h3>
<table class="algo-table">
  <tr><th>Layer</th><th>What it does</th><th>Key param</th></tr>
  <tr><td>Conv2D</td><td>Learns spatial filters. Detects edges, textures, patterns.</td><td>kernel_size, out_channels</td></tr>
  <tr><td>BatchNorm</td><td>Normalizes feature maps. Stabilizes and speeds training.</td><td>num_features</td></tr>
  <tr><td>MaxPool2D</td><td>Downsamples by taking max in each region. Reduces spatial dims.</td><td>kernel_size=2</td></tr>
  <tr><td>Flatten</td><td>Converts 3D feature maps to 1D vector for the classifier head.</td><td>—</td></tr>
  <tr><td>Dropout</td><td>Randomly zeros activations during training. Prevents overfitting.</td><td>p (probability)</td></tr>
</table>

<h3>Architecture Pattern</h3>
<p>Backbone (feature extractor) → Global Pooling → Classifier head</p>
<ul>
  <li>Each conv block: Conv → BN → ReLU → Pool</li>
  <li>Channels increase as spatial dims decrease: 3 → 32 → 64 → 128</li>
  <li>Final: flatten → linear layers → output</li>
</ul>

<div class="info-box">
  <strong>In practice:</strong> You almost never train CNNs from scratch. Use <strong>transfer learning</strong> — take ResNet50/EfficientNet pretrained on ImageNet, replace the head, fine-tune on your data.
</div>`,
          code: `import torch
import torch.nn as nn

class CNN(nn.Module):
    """
    CNN for image classification.
    Input: (batch, 3, 64, 64) — 3-channel 64x64 images
    Output: (batch, num_classes)
    """
    def __init__(self, num_classes=10):
        super().__init__()

        # Feature extractor — spatial dims reduce, channels increase
        self.features = nn.Sequential(
            # Block 1: 3x64x64 → 32x32x32
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),             # 64 → 32

            # Block 2: 32x32x32 → 64x16x16
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),             # 32 → 16

            # Block 3: 64x16x16 → 128x8x8
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),             # 16 → 8
        )

        # Classifier head
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),     # 128x8x8 → 128x1x1 (global avg pool)
            nn.Flatten(),                # 128
            nn.Linear(128, 256),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)

# ── Inspect architecture ──────────────────────────────────
model = CNN(num_classes=10)
total_params = sum(p.numel() for p in model.parameters())
print(f"Total parameters: {total_params:,}")

# ── Trace through an image batch ──────────────────────────
dummy_input = torch.randn(4, 3, 64, 64)  # batch of 4 images
print(f"Input:  {dummy_input.shape}")

with torch.no_grad():
    features = model.features(dummy_input)
    print(f"After features: {features.shape}")
    output = model(dummy_input)
    print(f"Output: {output.shape}")

# ── Training loop (same pattern as MLP) ──────────────────
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)

# One training step:
dummy_labels = torch.randint(0, 10, (4,))
logits = model(dummy_input)
loss   = criterion(logits, dummy_labels)
loss.backward()
optimizer.step()
print(f"\nLoss on random batch: {loss.item():.4f}")

# ── Transfer Learning (real-world approach) ───────────────
# from torchvision.models import resnet50, ResNet50_Weights
# backbone = resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)
# for param in backbone.parameters():
#     param.requires_grad = False          # freeze pretrained weights
# backbone.fc = nn.Linear(2048, 5)        # replace head for 5 classes
# # Only backbone.fc trains — much faster, fewer overfitting risks`,
          exercise: null
        },

        {
          id: "3-3",
          title: "Transformers & Attention Mechanism",
          icon: "🔮",
          duration: "75 min",
          tags: ["Transformer", "Attention", "BERT", "GPT"],
          runnable: false,
          theory: `
<h3>The Attention Revolution</h3>
<p>Before Transformers (2017), sequence tasks used RNNs. RNNs process tokens one at a time — slow, and they struggle with long-range dependencies.</p>
<p><strong>Attention</strong> allows every token to directly attend to every other token simultaneously. This is why GPT can understand context across thousands of tokens.</p>

<h3>Self-Attention: The Core Idea</h3>
<p>For each token, compute 3 vectors: Query (Q), Key (K), Value (V). Attention score = softmax(QKᵀ / √dₖ). Output = weighted sum of V vectors.</p>
<p>Intuitively: "How relevant is each other token to me right now?"</p>

<div class="concept-grid">
  <div class="concept-card">
    <strong>Multi-Head Attention</strong>
    <p>Run attention H times in parallel with different projections. Each head learns different relationship types.</p>
  </div>
  <div class="concept-card">
    <strong>Positional Encoding</strong>
    <p>Attention is order-agnostic. Add positional information to embeddings so the model knows token order.</p>
  </div>
  <div class="concept-card">
    <strong>Encoder (BERT)</strong>
    <p>Bidirectional — sees full context. Used for understanding tasks: classification, NER, Q&A.</p>
  </div>
  <div class="concept-card">
    <strong>Decoder (GPT)</strong>
    <p>Causal/unidirectional — can only see past tokens. Used for generation tasks.</p>
  </div>
</div>

<div class="info-box">
  <strong>The modern stack:</strong> You rarely implement Transformers from scratch. Use <strong>Hugging Face Transformers</strong> library. Fine-tune a pretrained model (BERT, RoBERTa, Llama) in a few lines of code.
</div>`,
          code: `import torch
import torch.nn as nn
import math

# ── Self-Attention from scratch ───────────────────────────
class SelfAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.d_k     = d_model // n_heads
        self.n_heads = n_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.out = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, T, D = x.shape
        H = self.n_heads

        Q = self.W_q(x).view(B, T, H, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(B, T, H, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(B, T, H, self.d_k).transpose(1, 2)

        # Scaled dot-product attention
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn   = torch.softmax(scores, dim=-1)
        out    = (attn @ V).transpose(1, 2).reshape(B, T, D)
        return self.out(out), attn

# ── Transformer Block ─────────────────────────────────────
class TransformerBlock(nn.Module):
    def __init__(self, d_model=256, n_heads=8, d_ff=1024, dropout=0.1):
        super().__init__()
        self.attn  = SelfAttention(d_model, n_heads)
        self.ff    = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model)
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.drop  = nn.Dropout(dropout)

    def forward(self, x):
        # Pre-norm architecture (modern variant)
        attn_out, _ = self.attn(self.norm1(x))
        x = x + self.drop(attn_out)
        x = x + self.drop(self.ff(self.norm2(x)))
        return x

# ── Using HuggingFace (real-world approach) ───────────────
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# import torch
#
# model_name = "distilbert-base-uncased"
# tokenizer  = AutoTokenizer.from_pretrained(model_name)
# model      = AutoModelForSequenceClassification.from_pretrained(
#                  model_name, num_labels=2)
#
# text   = "This movie was absolutely fantastic!"
# inputs = tokenizer(text, return_tensors="pt", truncation=True)
# with torch.no_grad():
#     logits = model(**inputs).logits
#     pred   = torch.argmax(logits, dim=1)
# print("Sentiment:", "Positive" if pred == 1 else "Negative")

# ── Test our implementation ───────────────────────────────
block = TransformerBlock(d_model=256, n_heads=8)
x = torch.randn(2, 16, 256)   # batch=2, seq_len=16, d_model=256
out = block(x)
print(f"Input:  {x.shape}")
print(f"Output: {out.shape}")
print(f"Params: {sum(p.numel() for p in block.parameters()):,}")`,
          exercise: null
        }
      ]
    },

    /* ══════════════════════════════════════════
       STAGE 4 — Generative AI & LLMs
    ══════════════════════════════════════════ */
    {
      id: 4,
      title: "Generative AI & LLMs",
      icon: "🤖",
      color: "#8b5cf6",
      duration: "4–5 weeks",
      description: "The fastest-growing field in AI. Learn to build with LLMs: RAG pipelines, vector databases, prompt engineering, and fine-tuning.",
      lessons: [
        {
          id: "4-1",
          title: "LLM Fundamentals & API Usage",
          icon: "💬",
          duration: "45 min",
          tags: ["LLMs", "API", "Tokens", "Temperature"],
          runnable: false,
          theory: `
<h3>How LLMs Work (the key ideas)</h3>
<p>LLMs are Transformer decoders trained to predict the next token. Given "The sky is", they predict "blue" by assigning probabilities to all possible next tokens. Training data: trillions of web tokens.</p>

<div class="concept-grid">
  <div class="concept-card">
    <strong>Tokens</strong>
    <p>Chunks of text (~4 chars). "ChatGPT" = 2 tokens. Context window = max tokens model can process at once.</p>
  </div>
  <div class="concept-card">
    <strong>Temperature</strong>
    <p>Controls randomness. 0 = deterministic (same answer every time). 1 = creative. 2 = chaotic/random.</p>
  </div>
  <div class="concept-card">
    <strong>System Prompt</strong>
    <p>Instructions before the conversation. Defines the model's persona, constraints, and output format.</p>
  </div>
  <div class="concept-card">
    <strong>Context Window</strong>
    <p>Max tokens in memory. GPT-4: 128k. Claude: 200k. Longer context = more expensive but better understanding.</p>
  </div>
</div>

<h3>The 3 Ways to Use an LLM</h3>
<ol>
  <li><strong>Direct API</strong> — Call the model with a prompt. Fast, simple, no training. Limited by what the model already knows.</li>
  <li><strong>RAG</strong> — Retrieve relevant documents, inject into context. Grounds the model in your data.</li>
  <li><strong>Fine-tuning</strong> — Train on your specific data. Best quality but expensive and needs labeled data.</li>
</ol>`,
          code: `# ── Using Anthropic Claude API ───────────────────────────
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")  # or use env var

# Basic completion
message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system="You are a concise technical expert. Answer in 2-3 sentences.",
    messages=[
        {"role": "user", "content": "What is gradient descent?"}
    ]
)
print(message.content[0].text)

# ── Structured output ─────────────────────────────────────
import json

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=512,
    system="Return ONLY valid JSON. No explanation.",
    messages=[{
        "role": "user",
        "content": """Extract key info from this job posting:
        'Senior ML Engineer at TechCorp. 5+ years PyTorch required.
         Remote, $180k-220k. Apply by Dec 31.'

        Return: {"title", "company", "years_exp", "skills", "salary_range", "remote", "deadline"}"""
    }]
)
job_data = json.loads(response.content[0].text)
print(json.dumps(job_data, indent=2))

# ── Streaming (for real-time UX) ──────────────────────────
with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain transformers briefly"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# ── OpenAI API (same pattern) ─────────────────────────────
# from openai import OpenAI
# client = OpenAI(api_key="your-key")
# response = client.chat.completions.create(
#     model="gpt-4o",
#     messages=[
#         {"role": "system", "content": "You are a helpful assistant"},
#         {"role": "user",   "content": "What is RAG?"}
#     ],
#     temperature=0.7
# )
# print(response.choices[0].message.content)`,
          exercise: null
        },

        {
          id: "4-2",
          title: "RAG: Retrieval Augmented Generation",
          icon: "🔍",
          duration: "70 min",
          tags: ["RAG", "Embeddings", "Vector DB", "LangChain"],
          runnable: false,
          theory: `
<h3>The Problem RAG Solves</h3>
<p>LLMs have a knowledge cutoff and don't know about <em>your</em> data — company docs, internal wikis, recent papers. Fine-tuning is expensive. RAG is the pragmatic solution:</p>

<h3>RAG Pipeline</h3>
<ol>
  <li><strong>Index</strong>: Split docs → Embed each chunk → Store in vector DB</li>
  <li><strong>Retrieve</strong>: Embed query → Similarity search → Get top-K chunks</li>
  <li><strong>Generate</strong>: Inject chunks into prompt → LLM answers with context</li>
</ol>

<div class="concept-grid">
  <div class="concept-card">
    <strong>Embeddings</strong>
    <p>Convert text to dense vectors (e.g., 1536-dim). Similar meaning = similar vectors. Key for semantic search.</p>
  </div>
  <div class="concept-card">
    <strong>Vector Database</strong>
    <p>Stores embeddings and enables fast similarity search. Options: Chroma (local), Pinecone (cloud), Weaviate.</p>
  </div>
  <div class="concept-card">
    <strong>Chunking</strong>
    <p>How you split docs matters. Too small = missing context. Too large = diluted relevance. ~500 tokens is common.</p>
  </div>
  <div class="concept-card">
    <strong>Reranking</strong>
    <p>After retrieval, use a cross-encoder to re-score chunks for better relevance. Significant quality boost.</p>
  </div>
</div>

<div class="info-box">
  <strong>RAG quality checklist:</strong> chunk size, overlap, embedding model quality, top-K, prompt template. Each one affects output quality significantly.
</div>`,
          code: `# ── RAG Pipeline with LangChain + Chroma ────────────────
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_anthropic import ChatAnthropic

# ── 1. Load Documents ─────────────────────────────────────
loader = DirectoryLoader('./docs/', glob="*.pdf", loader_cls=PyPDFLoader)
raw_docs = loader.load()
print(f"Loaded {len(raw_docs)} documents")

# ── 2. Split into Chunks ──────────────────────────────────
splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,        # tokens per chunk
    chunk_overlap=64,      # overlap to preserve context at boundaries
    separators=["\n\n", "\n", ".", " "]
)
chunks = splitter.split_documents(raw_docs)
print(f"Created {len(chunks)} chunks")

# ── 3. Embed & Index ──────────────────────────────────────
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
# Free, runs locally — 384-dim vectors

vectorstore = Chroma.from_documents(
    chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)
print("Indexed to Chroma!")

# ── 4. Build RAG Chain ────────────────────────────────────
llm = ChatAnthropic(model="claude-opus-4-6", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",       # stuff = inject all chunks into one prompt
    retriever=vectorstore.as_retriever(
        search_type="mmr",    # Maximum Marginal Relevance — diverse results
        search_kwargs={"k": 5, "fetch_k": 20}
    ),
    return_source_documents=True
)

# ── 5. Ask Questions ──────────────────────────────────────
query = "What is the company's refund policy?"
result = qa_chain({"query": query})

print(f"\nQ: {query}")
print(f"A: {result['result']}")
print("\nSources:")
for doc in result['source_documents']:
    print(f"  - {doc.metadata.get('source', 'unknown')}, p.{doc.metadata.get('page', '?')}")

# ── Advanced: Custom Prompt Template ─────────────────────
from langchain.prompts import PromptTemplate

custom_prompt = PromptTemplate(
    template="""You are a helpful assistant. Use ONLY the context below.
If the answer is not in the context, say "I don't have that information."

Context:
{context}

Question: {question}

Answer:""",
    input_variables=["context", "question"]
)`,
          exercise: null
        },

        {
          id: "4-3",
          title: "Prompt Engineering Patterns",
          icon: "✍️",
          duration: "40 min",
          tags: ["Prompting", "Chain of Thought", "Few-Shot", "System Prompts"],
          runnable: false,
          isPromptLab: true,
          theory: `
<h3>Why Prompting Matters</h3>
<p>The same model can give wildly different outputs depending on how you phrase the request. Prompt engineering is the discipline of systematically improving LLM outputs through careful instruction design.</p>

<h3>Core Techniques</h3>
<table class="algo-table">
  <tr><th>Technique</th><th>When to use</th><th>Example</th></tr>
  <tr><td>Zero-Shot</td><td>Simple, clear tasks</td><td>"Classify this email as spam/not-spam."</td></tr>
  <tr><td>Few-Shot</td><td>Complex output formats</td><td>Give 2-3 examples of expected input→output</td></tr>
  <tr><td>Chain-of-Thought</td><td>Reasoning tasks, math, logic</td><td>"Think step-by-step before answering."</td></tr>
  <tr><td>Role Playing</td><td>Consistent persona</td><td>"You are a senior Python engineer with 10 years experience."</td></tr>
  <tr><td>Output Format</td><td>Structured data extraction</td><td>"Respond in JSON with keys: name, salary, skills"</td></tr>
  <tr><td>Self-Critique</td><td>Quality improvement</td><td>"Review your answer. Fix any errors. Provide final answer."</td></tr>
</table>

<h3>The Anatomy of a Good System Prompt</h3>
<ol>
  <li><strong>Role/Persona</strong> — Who the model is</li>
  <li><strong>Context</strong> — What it knows about the situation</li>
  <li><strong>Task definition</strong> — Exactly what to do</li>
  <li><strong>Constraints</strong> — What NOT to do</li>
  <li><strong>Output format</strong> — How to structure the response</li>
</ol>

<div class="info-box">
  <strong>Golden rule:</strong> Be explicit. LLMs are literal. Vague prompts get vague answers. Specific, structured prompts get specific, structured answers.
</div>`,
          code: `# ── Technique 1: Zero-Shot vs Few-Shot ───────────────────
# Zero-shot — just describe the task
zero_shot = """Classify the sentiment of this review as POSITIVE, NEGATIVE, or NEUTRAL.
Review: "The product arrived on time but the quality was disappointing."
Sentiment:"""

# Few-shot — give examples first
few_shot = """Classify review sentiment as POSITIVE, NEGATIVE, or NEUTRAL.

Review: "Absolutely love it! Best purchase this year."
Sentiment: POSITIVE

Review: "Completely broken on arrival. Waste of money."
Sentiment: NEGATIVE

Review: "It's okay. Does the job but nothing special."
Sentiment: NEUTRAL

Review: "The product arrived on time but the quality was disappointing."
Sentiment:"""

# ── Technique 2: Chain of Thought ────────────────────────
cot_prompt = """Solve this step-by-step.

Problem: A store has 240 items. On Monday it sells 15% of stock.
On Tuesday it receives a shipment of 48 new items, then sells
25 items. How many items are left?

Let me think step by step:"""

# ── Technique 3: Structured Extraction ───────────────────
extraction_prompt = """Extract all job requirements from the posting below.
Return ONLY valid JSON. No explanation. No markdown.

Schema:
{
  "job_title": "string",
  "required_skills": ["list", "of", "skills"],
  "years_experience": number,
  "salary_range": "string or null",
  "is_remote": boolean
}

Job Posting:
Senior ML Engineer wanted at DataCorp. Minimum 5 years of experience
with PyTorch and MLOps. Must know Docker, Kubernetes, and cloud platforms.
Salary: $160k–$200k. Fully remote position."""

# ── Technique 4: Self-Critique ────────────────────────────
self_critique = """Write a Python function that reverses words in a sentence.

[First attempt - write the code]

[Self-review - check for edge cases: empty string, single word,
multiple spaces, punctuation]

[Final, corrected version]"""

# ── System Prompt Template for a Code Assistant ──────────
system_prompt = """You are a senior Python engineer with expertise in
AI/ML systems. Follow these rules strictly:

1. Write clean, idiomatic Python 3.10+ code
2. Include type hints on all function signatures
3. Add a brief docstring to every function
4. For ML code: always set random seeds, split data before scaling
5. Call out potential performance issues proactively
6. If asked to fix code: first explain the bug, then provide the fix

Output format: code blocks with explanations above them."""`,
          exercise: null
        }
      ]
    },

    /* ══════════════════════════════════════════
       STAGE 5 — Portfolio Projects
    ══════════════════════════════════════════ */
    {
      id: 5,
      title: "Build Portfolio Projects",
      icon: "🏗️",
      color: "#10b981",
      duration: "6–8 weeks",
      description: "Projects separate candidates from the rest. Build 4–5 real AI projects, host on GitHub, and write compelling READMEs. Recruiters look at repos.",
      lessons: [
        {
          id: "5-1",
          title: "Project 1: AI Resume Analyzer",
          icon: "📄",
          duration: "1 week",
          tags: ["NLP", "Claude API", "FastAPI", "Resume"],
          runnable: false,
          isProject: true,
          difficulty: "easy",
          stack: ["Python", "Claude API", "FastAPI", "PyPDF2", "React"],
          description: "Upload a resume + job description. Get a match score, missing skills analysis, and actionable improvement suggestions.",
          architecture: `PDF/DOCX → Text Extraction → Claude API → Structured Analysis → API Response → React UI`,
          steps: [
            "Extract text from PDF/DOCX using PyPDF2/python-docx",
            "Parse job description (copy-paste or URL scraping)",
            "Build structured prompt: resume + job desc → JSON output",
            "Call Claude API — get match score, missing skills, suggestions",
            "FastAPI endpoint: POST /analyze → returns JSON",
            "Simple React frontend with file upload and results display",
            "Deploy on Railway or Render (free tier)"
          ],
          code: `import anthropic
import json
from fastapi import FastAPI, UploadFile
import PyPDF2
import io

app    = FastAPI()
client = anthropic.Anthropic()

def extract_pdf_text(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    return " ".join(page.extract_text() for page in reader.pages)

@app.post("/analyze")
async def analyze_resume(
    resume:  UploadFile,
    job_desc: str
):
    resume_text = extract_pdf_text(await resume.read())

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1500,
        system="You are an expert HR analyst. Return ONLY valid JSON.",
        messages=[{
            "role": "user",
            "content": f"""Analyze this resume against the job description.

Resume: {resume_text[:3000]}

Job Description: {job_desc[:2000]}

Return JSON:
{{
  "match_score": 0-100,
  "matching_skills": ["list"],
  "missing_skills": ["list"],
  "strengths": ["list of 3"],
  "improvements": ["list of 3 actionable items"],
  "summary": "2 sentence overview"
}}"""
        }]
    )
    return json.loads(response.content[0].text)`
        },

        {
          id: "5-2",
          title: "Project 2: RAG Chatbot",
          icon: "💬",
          duration: "1.5 weeks",
          tags: ["RAG", "LangChain", "Vector DB", "Streamlit"],
          runnable: false,
          isProject: true,
          difficulty: "medium",
          stack: ["Python", "LangChain", "Chroma", "Claude API", "Streamlit"],
          description: "Upload any PDF/text documents and chat with them. The chatbot retrieves relevant sections and answers with citations.",
          architecture: `Docs → Chunk → Embed → Chroma DB ← Query → Retrieve → Prompt + Context → Claude → Response with sources`,
          steps: [
            "Streamlit UI: drag-and-drop file upload + chat interface",
            "Index uploaded docs: chunk → embed (BAAI/bge-small) → Chroma",
            "On each user message: embed query → retrieve top-5 chunks",
            "Build prompt: system + retrieved context + chat history + question",
            "Stream Claude response back to UI",
            "Display source documents with page numbers for transparency",
            "Add memory: maintain last 5 exchanges in context"
          ],
          code: `import streamlit as st
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import anthropic

@st.cache_resource
def load_embeddings():
    return HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

def build_prompt(context: str, history: list, question: str) -> str:
    return f"""You are a helpful assistant. Answer using ONLY the context below.
Always cite your sources as [Source: filename, p.X].

Context:
{context}

Conversation:
{chr(10).join(f"{m['role']}: {m['content']}" for m in history[-4:])}

User: {question}
Assistant:"""

# Streamlit app
st.title("Chat with your Documents")
uploaded = st.file_uploader("Upload PDFs", type="pdf", accept_multiple_files=True)

if uploaded and "vectorstore" not in st.session_state:
    with st.spinner("Indexing documents..."):
        # chunk + embed + store
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        # ... (see full code in repo)
        st.success(f"Indexed {len(uploaded)} documents")`
        },

        {
          id: "5-3",
          title: "Project 3: Plant Disease Detector",
          icon: "🌿",
          duration: "1.5 weeks",
          tags: ["CNN", "Transfer Learning", "Image Classification", "FastAPI"],
          runnable: false,
          isProject: true,
          difficulty: "medium",
          stack: ["PyTorch", "torchvision", "FastAPI", "Pillow", "React"],
          description: "Upload a plant leaf photo. Detect disease type and severity using a fine-tuned EfficientNet. Suggest treatments.",
          architecture: `Image Upload → Preprocess → EfficientNet (fine-tuned) → Disease Class + Confidence → Treatment Lookup → Response`,
          steps: [
            "Download PlantVillage dataset (38 classes, 54k images) from Kaggle",
            "Load EfficientNet-B0 pretrained on ImageNet (torchvision.models)",
            "Replace final classifier head: Linear(1280, 38)",
            "Train with progressive unfreezing: head first, then full model",
            "Augmentations: RandomHorizontalFlip, ColorJitter, RandomRotation",
            "Export model with torch.save(). Achieve 95%+ on test set",
            "FastAPI + Pillow: accept image upload → preprocess → predict → return JSON with disease + treatment tips"
          ],
          code: `import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

# ── Load fine-tuned model ─────────────────────────────────
CLASSES = ['Apple___Apple_scab', 'Apple___Black_rot', ...]  # 38 classes
TREATMENTS = {
    'Apple___Apple_scab': "Apply fungicide. Remove infected leaves.",
    # ...
}

model = models.efficientnet_b0(weights=None)
model.classifier[1] = nn.Linear(1280, len(CLASSES))
model.load_state_dict(torch.load('plant_model.pth', map_location='cpu'))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def predict(image_bytes: bytes) -> dict:
    img    = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1)[0]
    top_idx    = probs.argmax().item()
    confidence = probs[top_idx].item()
    disease    = CLASSES[top_idx]
    return {
        "disease":    disease,
        "confidence": f"{confidence:.1%}",
        "treatment":  TREATMENTS.get(disease, "Consult an expert."),
        "is_healthy": "healthy" in disease.lower()
    }`
        },

        {
          id: "5-4",
          title: "Project 4: Document Summarizer",
          icon: "📝",
          duration: "1 week",
          tags: ["LLM", "Summarization", "MapReduce", "Claude API"],
          runnable: false,
          isProject: true,
          difficulty: "easy",
          stack: ["Python", "Claude API", "LangChain", "Streamlit", "PyPDF2"],
          description: "Upload long documents (research papers, legal docs, reports). Get executive summaries, key points, and Q&A.",
          architecture: `Long Doc → Chunk (map) → Summarize each chunk → Combine → Final Summary (reduce) + Key Points + Q&A`,
          steps: [
            "Handle long documents with Map-Reduce: summarize chunks, then combine summaries",
            "Output 3 formats: executive summary (2 paragraphs), bullet points (5-7), key quotes",
            "Add 'Ask a question about this document' feature (simple RAG)",
            "Support: PDF, DOCX, TXT, URLs (newspaper3k for web articles)",
            "Progress bar in Streamlit while processing large documents",
            "Export summary as PDF/markdown",
            "Track history: show previous summaries in sidebar"
          ],
          code: `import anthropic

client = anthropic.Anthropic()

def chunk_text(text: str, max_chars: int = 3000) -> list[str]:
    """Split text at paragraph boundaries."""
    paragraphs = text.split('\n\n')
    chunks, current = [], ''
    for para in paragraphs:
        if len(current) + len(para) < max_chars:
            current += '\n\n' + para
        else:
            if current: chunks.append(current.strip())
            current = para
    if current: chunks.append(current.strip())
    return chunks

def map_reduce_summarize(text: str) -> dict:
    chunks = chunk_text(text)

    # MAP: summarize each chunk
    chunk_summaries = []
    for i, chunk in enumerate(chunks):
        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",  # Fast + cheap for map step
            max_tokens=300,
            messages=[{"role": "user",
                        "content": f"Summarize in 3-5 sentences:\n{chunk}"}]
        )
        chunk_summaries.append(resp.content[0].text)

    # REDUCE: final summary
    combined = "\n\n".join(chunk_summaries)
    final = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=800,
        system="Expert document analyst. Be concise.",
        messages=[{"role": "user", "content": f"""
Create a structured summary from these section summaries:
{combined}

Return JSON: {{"executive_summary": "...", "key_points": [...5 items], "conclusion": "..."}}"""}]
    )
    return final`
        },

        {
          id: "5-5",
          title: "Project 5: AI Code Assistant",
          icon: "💻",
          duration: "2 weeks",
          tags: ["Code Generation", "Claude API", "VS Code Extension", "AST"],
          runnable: false,
          isProject: true,
          difficulty: "hard",
          stack: ["TypeScript", "Claude API", "VS Code API", "Node.js", "AST"],
          description: "A VS Code extension that explains selected code, suggests refactors, generates tests, and fixes bugs — all in the editor.",
          architecture: `User selects code → Command palette → Read context (file + selection) → Claude API → Show in side panel or inline diff`,
          steps: [
            "Scaffold VS Code extension: yo code (TypeScript template)",
            "Register commands: Explain, Refactor, Generate Tests, Fix Bug",
            "On command: read active editor selection + surrounding context",
            "Build prompt with file language, selected code, and task",
            "Stream Claude response into WebviewPanel (sidebar)",
            "For Fix Bug: show diff and apply changes with workspace.applyEdit",
            "Package with vsce and publish to VS Code Marketplace"
          ],
          code: `// extension.ts — VS Code Extension
import * as vscode from 'vscode';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export function activate(context: vscode.ExtensionContext) {

    const explainCode = vscode.commands.registerCommand(
        'ai-assistant.explain', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const code      = editor.document.getText(selection);
        const language  = editor.document.languageId;

        if (!code) {
            vscode.window.showWarningMessage('Select code first');
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'aiExplanation', 'AI Explanation', vscode.ViewColumn.Beside, {}
        );

        panel.webview.html = getLoadingHtml();

        const stream = await client.messages.stream({
            model: 'claude-opus-4-6',
            max_tokens: 1024,
            system: \`You are a code expert. Explain \${language} code clearly.\`,
            messages: [{
                role: 'user',
                content: \`Explain this code:\n\\\`\\\`\\\`\${language}\n\${code}\n\\\`\\\`\\\`\`
            }]
        });

        let explanation = '';
        for await (const chunk of stream.text_stream) {
            explanation += chunk;
            panel.webview.html = renderMarkdown(explanation);
        }
    });

    context.subscriptions.push(explainCode);
}`
        }
      ]
    },

    /* ══════════════════════════════════════════
       STAGE 6 — Deploy AI Systems
    ══════════════════════════════════════════ */
    {
      id: 6,
      title: "Deploy AI Systems",
      icon: "🚀",
      color: "#ef4444",
      duration: "3–4 weeks",
      description: "Most AI learners stop at notebooks. Deployment is where experienced engineers stand out. Learn FastAPI, Docker, and Kubernetes to ship production AI.",
      lessons: [
        {
          id: "6-1",
          title: "FastAPI: Production AI Endpoints",
          icon: "⚡",
          duration: "50 min",
          tags: ["FastAPI", "REST API", "Pydantic", "Async"],
          runnable: false,
          theory: `
<h3>Why FastAPI for AI?</h3>
<p>FastAPI is purpose-built for Python APIs. It's <strong>async-first</strong> (critical for concurrent AI calls), auto-generates OpenAPI docs, validates inputs with Pydantic, and handles file uploads natively.</p>

<h3>Key Features</h3>
<div class="concept-grid">
  <div class="concept-card"><strong>Async/Await</strong><p>Handle many concurrent requests. Essential when each request calls an LLM API that takes 1-5 seconds.</p></div>
  <div class="concept-card"><strong>Pydantic Models</strong><p>Define request/response schemas with type hints. Auto-validates inputs, auto-generates docs.</p></div>
  <div class="concept-card"><strong>Dependency Injection</strong><p>Load models once at startup. Inject into route handlers. Prevents loading model on every request.</p></div>
  <div class="concept-card"><strong>Background Tasks</strong><p>Fire-and-forget for async work. Send job to queue, return immediately, process in background.</p></div>
</div>`,
          code: `from fastapi import FastAPI, UploadFile, HTTPException, Depends
from pydantic import BaseModel
from contextlib import asynccontextmanager
import anthropic
import torch
from functools import lru_cache
from typing import Optional
import asyncio

# ── Models (loaded once at startup) ──────────────────────
class AppState:
    anthropic_client: anthropic.AsyncAnthropic = None
    ml_model = None

state = AppState()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load everything expensive once
    state.anthropic_client = anthropic.AsyncAnthropic()
    state.ml_model = torch.load('model.pth', map_location='cpu')
    state.ml_model.eval()
    print("Models loaded!")
    yield
    # Shutdown cleanup
    print("Shutting down...")

app = FastAPI(title="AI Service", version="1.0.0", lifespan=lifespan)

# ── Request / Response schemas ────────────────────────────
class AnalysisRequest(BaseModel):
    text:        str
    max_tokens:  int    = 512
    temperature: float  = 0.7
    language:    str    = "en"

class AnalysisResponse(BaseModel):
    summary:     str
    sentiment:   str
    confidence:  float
    tokens_used: int

# ── Endpoint ──────────────────────────────────────────────
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(req: AnalysisRequest):
    if len(req.text) > 50_000:
        raise HTTPException(status_code=413, detail="Text too long (max 50k chars)")

    message = await state.anthropic_client.messages.create(
        model="claude-opus-4-6",
        max_tokens=req.max_tokens,
        system="Analyze text. Return JSON: {summary, sentiment, confidence}",
        messages=[{"role": "user", "content": req.text}]
    )
    import json
    data = json.loads(message.content[0].text)
    return AnalysisResponse(
        summary=data["summary"],
        sentiment=data["sentiment"],
        confidence=data["confidence"],
        tokens_used=message.usage.input_tokens + message.usage.output_tokens
    )

# ── Health check (required for Kubernetes) ────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "model": "loaded" if state.ml_model else "none"}

# Run: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4`,
          exercise: null
        },

        {
          id: "6-2",
          title: "Docker: Containerize Your AI App",
          icon: "🐳",
          duration: "45 min",
          tags: ["Docker", "Container", "Dockerfile", "Multi-stage"],
          runnable: false,
          theory: `
<h3>Why Containers for AI?</h3>
<p>The classic "it works on my machine" problem. Containers bundle your app + dependencies + Python version + system libraries into one portable unit. Deploy anywhere: AWS, GCP, Azure, on-prem.</p>

<h3>AI-Specific Docker Challenges</h3>
<ul>
  <li><strong>Large images</strong>: PyTorch alone is 1.5GB. Use multi-stage builds.</li>
  <li><strong>GPU access</strong>: Need NVIDIA Docker runtime. Use <code>--gpus all</code> flag.</li>
  <li><strong>Model weights</strong>: Don't bake into image. Mount as volume or download at startup.</li>
  <li><strong>Environment variables</strong>: Never hardcode API keys. Use <code>--env-file</code>.</li>
</ul>

<div class="info-box">
  <strong>Production rule:</strong> Run containers as non-root user. Set resource limits. Use health checks. Tag images with git commit SHA, not "latest".
</div>`,
          code: `# ── Dockerfile (multi-stage, production-ready) ────────────

# Stage 1: Build dependencies
FROM python:3.11-slim as builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ──────────────────────────────────────────────────────────
# Stage 2: Runtime image (smaller — no build tools)
FROM python:3.11-slim

# System deps (keep minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 curl && \
    rm -rf /var/lib/apt/lists/*

# Non-root user (security)
RUN useradd -m -u 1000 appuser
WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy application code
COPY --chown=appuser:appuser . .

USER appuser

# Health check — Kubernetes uses this
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]


# ── .dockerignore ─────────────────────────────────────────
# .env
# __pycache__/
# *.pyc
# .git/
# tests/
# *.ipynb
# models/*.pth     ← don't bake models into image!


# ── docker-compose.yml (local dev + all services) ─────────
# version: "3.9"
# services:
#   api:
#     build: .
#     ports: ["8000:8000"]
#     env_file: .env
#     volumes:
#       - ./models:/app/models   # mount models from host
#     depends_on: [chroma]
#
#   chroma:
#     image: chromadb/chroma:latest
#     ports: ["8001:8000"]
#     volumes: ["chroma_data:/chroma/chroma"]
#
# volumes:
#   chroma_data:


# ── Build & Run commands ──────────────────────────────────
# docker build -t ai-service:$(git rev-parse --short HEAD) .
# docker run --env-file .env -p 8000:8000 ai-service:abc1234
#
# GPU support:
# docker run --gpus all --env-file .env -p 8000:8000 ai-service:abc1234
#
# Push to registry:
# docker tag ai-service:abc1234 gcr.io/myproject/ai-service:abc1234
# docker push gcr.io/myproject/ai-service:abc1234`,
          exercise: null
        },

        {
          id: "6-3",
          title: "Kubernetes: Scale AI at Production",
          icon: "☸️",
          duration: "60 min",
          tags: ["Kubernetes", "Scaling", "Deployment", "HPA"],
          runnable: false,
          theory: `
<h3>When You Need Kubernetes</h3>
<p>Docker runs one container on one machine. Kubernetes (K8s) orchestrates containers across many machines. Use it when you need:</p>
<ul>
  <li><strong>Horizontal scaling</strong>: Auto-scale pods based on CPU/memory/custom metrics (requests/sec)</li>
  <li><strong>Zero-downtime deploys</strong>: Rolling updates, blue-green deployments</li>
  <li><strong>Self-healing</strong>: Auto-restart crashed pods</li>
  <li><strong>Service discovery</strong>: Pods find each other by service name</li>
</ul>

<h3>Key Concepts</h3>
<div class="concept-grid">
  <div class="concept-card"><strong>Pod</strong><p>Smallest unit. One or more containers sharing network/storage. Ephemeral — don't store state here.</p></div>
  <div class="concept-card"><strong>Deployment</strong><p>Manages pods. Declares desired state: "3 replicas of this image". K8s ensures it stays that way.</p></div>
  <div class="concept-card"><strong>Service</strong><p>Stable network endpoint for a set of pods. Load balances traffic. Type: ClusterIP, LoadBalancer.</p></div>
  <div class="concept-card"><strong>HPA</strong><p>Horizontal Pod Autoscaler. Scale replicas 2→10 based on metrics. Critical for variable AI workloads.</p></div>
</div>`,
          code: `# ── deployment.yaml ──────────────────────────────────────
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
  labels:
    app: ai-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: ai-service
    spec:
      containers:
      - name: ai-service
        image: gcr.io/myproject/ai-service:abc1234
        ports:
        - containerPort: 8000
        env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:           # Never hardcode — use K8s Secrets
              name: ai-secrets
              key: anthropic-api-key
        resources:
          requests:
            cpu: "500m"             # 0.5 CPU cores
            memory: "512Mi"
          limits:
            cpu: "2000m"            # 2 CPU cores max
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 20
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10

---
# ── service.yaml ─────────────────────────────────────────
apiVersion: v1
kind: Service
metadata:
  name: ai-service
spec:
  selector:
    app: ai-service
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer            # Exposes externally on cloud providers

---
# ── hpa.yaml (Horizontal Pod Autoscaler) ─────────────────
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # Scale up when avg CPU > 70%

# ── Useful kubectl commands ───────────────────────────────
# kubectl apply -f deployment.yaml
# kubectl get pods -w                    # watch pods
# kubectl logs -f pod/ai-service-xyz     # stream logs
# kubectl scale deployment ai-service --replicas=5
# kubectl rollout status deployment/ai-service
# kubectl rollout undo deployment/ai-service  # rollback!`,
          exercise: null
        }
      ]
    }
  ]
};
