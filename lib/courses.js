export const courses = [
  {
    slug: "python-fundamentals",
    title: "Python Fundamentals",
    description:
      "Learn the basics of Python programming including variables, data types, control flow, functions and more.",
    duration: "8 weeks",
    level: "Beginner",
    overview:
      "This course introduces you to Python, one of the most popular and versatile programming languages. You will learn core concepts that form the foundation for any programming career, including working with data, automating tasks, and building simple applications.",
    outcomes: [
      "Write clean and efficient Python code",
      "Understand variables, loops, and conditionals",
      "Work with lists, dictionaries and file I/O",
      "Build simple command-line applications",
      "Debug and troubleshoot common errors",
    ],
    modules: [
      "Introduction to Python & Setup",
      "Variables, Data Types & Operators",
      "Control Flow: If Statements & Loops",
      "Functions & Modules",
      "Data Structures: Lists, Tuples, Dicts",
      "File Handling & Exceptions",
      "Introduction to OOP",
      "Capstone Project",
    ],
    requirements: [
      "No prior programming experience required",
      "A computer with internet access",
      "Willingness to learn and practice",
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "Master HTML, CSS and JavaScript to build responsive and interactive websites from scratch.",
    duration: "10 weeks",
    level: "Beginner",
    overview:
      "Dive into web development and learn to create stunning, responsive websites. This course covers the core trio of web technologies: HTML for structure, CSS for styling, and JavaScript for interactivity. You'll build real projects to solidify your skills.",
    outcomes: [
      "Build responsive web pages with HTML & CSS",
      "Add interactivity using JavaScript and the DOM",
      "Understand CSS Flexbox and Grid layouts",
      "Deploy websites to the internet",
      "Follow modern web development best practices",
    ],
    modules: [
      "HTML Fundamentals & Semantic Markup",
      "CSS Styling & Box Model",
      "Responsive Design & Media Queries",
      "CSS Flexbox & Grid",
      "JavaScript Basics & the DOM",
      "Events, Forms & Validation",
      "Fetch API & Working with APIs",
      "Version Control with Git",
      "Deploying Your Website",
      "Portfolio Project",
    ],
    requirements: [
      "Basic computer literacy",
      "A modern web browser (Chrome recommended)",
      "A code editor (VS Code recommended)",
    ],
  },
  {
    slug: "data-science",
    title: "Data Science with Python",
    description:
      "Explore data analysis, visualization and machine learning using Python's powerful data science libraries.",
    duration: "12 weeks",
    level: "Intermediate",
    overview:
      "This course takes you through the data science pipeline using Python. From data cleaning and exploration to visualization and machine learning, you will gain hands-on experience with industry-standard libraries like Pandas, Matplotlib, and Scikit-learn.",
    outcomes: [
      "Clean and preprocess datasets with Pandas",
      "Create insightful visualizations with Matplotlib & Seaborn",
      "Perform statistical analysis on real-world data",
      "Build and evaluate machine learning models",
      "Present data-driven findings effectively",
    ],
    modules: [
      "Introduction to Data Science",
      "NumPy for Numerical Computing",
      "Data Manipulation with Pandas",
      "Data Visualization: Matplotlib & Seaborn",
      "Exploratory Data Analysis",
      "Statistics for Data Science",
      "Introduction to Machine Learning",
      "Supervised Learning: Regression & Classification",
      "Unsupervised Learning: Clustering",
      "Model Evaluation & Tuning",
      "Working with Real-World Datasets",
      "Final Data Science Project",
    ],
    requirements: [
      "Basic Python knowledge (or completion of Python Fundamentals)",
      "Understanding of basic mathematics",
      "A computer with Python installed",
    ],
  },
  {
    slug: "java-programming",
    title: "Java Programming",
    description:
      "Master object-oriented programming with Java, one of the most widely used enterprise languages.",
    duration: "10 weeks",
    level: "Intermediate",
    overview:
      "Java remains one of the top programming languages worldwide. This course covers core Java concepts, object-oriented programming principles, exception handling, collections, and file I/O. You'll build practical applications throughout the course.",
    outcomes: [
      "Write well-structured Java programs",
      "Understand OOP: classes, inheritance, polymorphism",
      "Work with Java Collections Framework",
      "Handle exceptions and file operations",
      "Build a complete Java application",
    ],
    modules: [
      "Java Setup & First Program",
      "Variables, Data Types & Operators",
      "Control Structures & Arrays",
      "Methods & Scope",
      "Object-Oriented Programming Basics",
      "Inheritance & Polymorphism",
      "Interfaces & Abstract Classes",
      "Exception Handling",
      "Collections Framework",
      "Final Project: Java Application",
    ],
    requirements: [
      "Basic programming concepts helpful but not required",
      "JDK installed on your computer",
      "IDE such as IntelliJ IDEA or Eclipse",
    ],
  },
  {
    slug: "database-management",
    title: "Database Management & SQL",
    description:
      "Learn to design, query and manage relational databases using SQL and modern database tools.",
    duration: "6 weeks",
    level: "Beginner",
    overview:
      "Databases are at the heart of every application. This course teaches you relational database concepts, SQL querying, database design, normalization, and how to work with popular database management systems like MySQL and PostgreSQL.",
    outcomes: [
      "Design normalized database schemas",
      "Write complex SQL queries (SELECT, JOIN, subqueries)",
      "Create and manage tables, indexes, and views",
      "Understand transactions and data integrity",
      "Connect databases to applications",
    ],
    modules: [
      "Introduction to Databases & RDBMS",
      "SQL Basics: SELECT, INSERT, UPDATE, DELETE",
      "Filtering, Sorting & Aggregation",
      "JOINs & Subqueries",
      "Database Design & Normalization",
      "Indexes, Views & Stored Procedures",
    ],
    requirements: [
      "No prior database experience needed",
      "A computer with MySQL or PostgreSQL installed",
      "Basic understanding of data concepts",
    ],
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing Essentials",
    description:
      "Understand cloud infrastructure, services and deployment using platforms like AWS and Azure.",
    duration: "8 weeks",
    level: "Advanced",
    overview:
      "Cloud computing is transforming how we build and deploy software. This course covers cloud fundamentals, infrastructure as a service, platform as a service, serverless computing, and hands-on projects using major cloud providers.",
    outcomes: [
      "Understand cloud computing models (IaaS, PaaS, SaaS)",
      "Deploy applications on AWS and Azure",
      "Configure virtual machines and networking",
      "Implement serverless functions and storage",
      "Follow cloud security best practices",
    ],
    modules: [
      "Introduction to Cloud Computing",
      "Cloud Service Models & Providers",
      "Virtual Machines & Compute Services",
      "Cloud Storage & Databases",
      "Networking in the Cloud",
      "Serverless Computing",
      "Containers & Docker Basics",
      "Cloud Security & Best Practices",
    ],
    requirements: [
      "Basic networking and Linux knowledge",
      "Familiarity with command-line interfaces",
      "A free-tier cloud account (AWS or Azure)",
    ],
  },
];

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug);
}
