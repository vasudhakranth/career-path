import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SkillLearningPage.css';

// Skill-specific learning content with level assignments
const skillProfiles = {
python: {
    title: 'Python',
    icon: '🐍',
    conceptTitle: 'Python Core Concepts',
    topics: [
      { id: 'python-intro', title: 'Python Introduction', level: 'beginner', subtopics: ['What is Python?', 'Features of Python', 'Applications', 'Installation', 'First Python Program'] },
      { id: 'python-basics', title: 'Python Basics', level: 'beginner', subtopics: ['Variables', 'Keywords', 'Identifiers', 'Comments', 'Input & Output', 'Type Conversion'] },
      { id: 'data-types', title: 'Data Types', level: 'beginner', subtopics: ['Numbers', 'Strings', 'Lists', 'Tuples', 'Sets', 'Dictionaries', 'Boolean'] },
      { id: 'operators', title: 'Operators', level: 'beginner', subtopics: ['Arithmetic', 'Assignment', 'Comparison', 'Logical', 'Bitwise', 'Identity', 'Membership'] },
      { id: 'conditional', title: 'Conditional Statements', level: 'beginner', subtopics: ['if', 'if-else', 'if-elif-else', 'Nested if', 'Match Case'] },
      { id: 'loops', title: 'Loops', level: 'beginner', subtopics: ['for Loop', 'while Loop', 'break', 'continue', 'pass', 'Nested Loops'] },
      { id: 'functions', title: 'Functions', level: 'intermediate', subtopics: ['Defining Functions', 'Parameters', 'Return Statement', 'Lambda', 'Recursion', 'Scope'] },
      { id: 'strings', title: 'Strings', level: 'intermediate', subtopics: ['String Methods', 'Indexing', 'Slicing', 'Formatting', 'Regular Expressions'] },
      { id: 'lists', title: 'Lists', level: 'intermediate', subtopics: ['Creating Lists', 'List Methods', 'Indexing', 'Slicing', 'List Comprehension', 'Nested Lists'] },
      { id: 'tuples', title: 'Tuples', level: 'intermediate', subtopics: ['Creating Tuples', 'Tuple Methods', 'Packing', 'Unpacking'] },
      { id: 'sets', title: 'Sets', level: 'intermediate', subtopics: ['Creating Sets', 'Set Methods', 'Union', 'Intersection', 'Difference', 'Symmetric Difference'] },
      { id: 'dictionaries', title: 'Dictionaries', level: 'intermediate', subtopics: ['Creating Dictionaries', 'Dictionary Methods', 'Nested Dictionaries', 'Looping', 'Dictionary Comprehension'] },
      { id: 'file-handling', title: 'File Handling', level: 'intermediate', subtopics: ['Read Files', 'Write Files', 'Append Files', 'CSV Files', 'JSON Files'] },
      { id: 'exception-handling', title: 'Exception Handling', level: 'intermediate', subtopics: ['try', 'except', 'finally', 'raise', 'Custom Exceptions'] },
      { id: 'oop', title: 'Object-Oriented Programming', level: 'advanced', subtopics: ['Classes', 'Objects', 'Constructors', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction', 'Magic Methods'] },
      { id: 'modules-packages', title: 'Modules & Packages', level: 'advanced', subtopics: ['Import', 'Built-in Modules', 'Custom Modules', 'Pip Packages'] },
      { id: 'advanced-python', title: 'Advanced Python', level: 'advanced', subtopics: ['Decorators', 'Generators', 'Iterators', 'Closures', 'Context Managers', 'Multithreading', 'Multiprocessing', 'Async Programming'] },
      { id: 'popular-libraries', title: 'Popular Libraries', level: 'advanced', subtopics: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Flask', 'Django', 'OpenCV'] },
      { id: 'database', title: 'Database Connectivity', level: 'advanced', subtopics: ['SQLite', 'MySQL', 'PostgreSQL', 'MongoDB'] },
      { id: 'testing', title: 'Testing', level: 'advanced', subtopics: ['unittest', 'pytest', 'Mock Testing'] },
      { id: 'projects', title: 'Projects', level: 'advanced', subtopics: ['Beginner Projects', 'Intermediate Projects', 'Advanced Projects', 'Mini Applications'] },
      { id: 'interview', title: 'Interview Preparation', level: 'advanced', subtopics: ['Python MCQs', 'Coding Questions', 'Interview Questions', 'Coding Patterns', 'Company Questions'] },
      { id: 'cheatsheets', title: 'Cheat Sheets & References', level: 'advanced', subtopics: ['Syntax Cheat Sheet', 'Built-in Functions', 'Standard Library', 'Quick Revision Notes'] }
    ],
    challenges: [
      { id: 'py-fib', title: 'Fibonacci Sequence', difficulty: 'Easy' },
      { id: 'py-parens', title: 'Validate Parentheses', difficulty: 'Medium' }
    ]
  },
  html: {
    title: 'HTML',
    icon: '🌐',
    conceptTitle: 'HTML Markup and Structure',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['HTML basics', 'Elements', 'Attributes'] },
      { id: 'text', title: 'Text Formatting', level: 'beginner', subtopics: ['Headings', 'Paragraphs', 'Lists'] },
      { id: 'links', title: 'Links & Images', level: 'intermediate', subtopics: ['Anchor tags', 'Images', 'Accessibility'] },
      { id: 'forms', title: 'Forms', level: 'intermediate', subtopics: ['Input types', 'Validation', 'Form layout'] },
      { id: 'semantics', title: 'Semantic HTML', level: 'advanced', subtopics: ['Header/Footer', 'Sections', 'ARIA'] }
    ],
    challenges: [
      { id: 'html-forms', title: 'Build a Contact Form', difficulty: 'Easy' }
    ]
  },
  css: {
    title: 'CSS',
    icon: '🎨',
    conceptTitle: 'Styling with CSS',
    topics: [
      { id: 'selectors', title: 'Selectors', level: 'beginner', subtopics: ['Type', 'Class', 'ID', 'Attribute'] },
      { id: 'box', title: 'Box Model', level: 'beginner', subtopics: ['Margin', 'Border', 'Padding', 'Content'] },
      { id: 'layout', title: 'Layout', level: 'intermediate', subtopics: ['Flexbox', 'Grid', 'Positioning'] },
      { id: 'responsive', title: 'Responsive', level: 'intermediate', subtopics: ['Media queries', 'Mobile-first'] },
      { id: 'animations', title: 'Animations', level: 'advanced', subtopics: ['Transitions', 'Keyframes'] }
    ]
  },
  javascript: {
    title: 'JavaScript',
    icon: '🟨',
    conceptTitle: 'JavaScript Language Fundamentals',
    topics: [
      { id: 'js-intro', title: 'JavaScript Introduction', level: 'beginner', subtopics: ['What is JavaScript?', 'Features of JavaScript', 'History & Evolution', 'Applications', 'How JavaScript Works', 'First JavaScript Program'] },
      { id: 'js-basics', title: 'JavaScript Basics', level: 'beginner', subtopics: ['Variables (var, let, const)', 'Data Types', 'Operators', 'Type Conversion', 'Comments', 'Input & Output', 'Strict Mode'] },
      { id: 'js-control-flow', title: 'Control Flow', level: 'beginner', subtopics: ['if Statement', 'if...else', 'else if', 'switch Statement', 'Ternary Operator', 'Truthy & Falsy Values'] },
      { id: 'js-loops', title: 'Loops', level: 'beginner', subtopics: ['for Loop', 'while Loop', 'do...while', 'for...in', 'for...of', 'break', 'continue', 'Nested Loops'] },
      { id: 'js-functions', title: 'Functions', level: 'intermediate', subtopics: ['Function Declaration', 'Function Expression', 'Arrow Functions', 'Parameters & Arguments', 'Default Parameters', 'Rest Parameters', 'Callback Functions', 'Higher Order Functions', 'Closures', 'Recursion'] },
      { id: 'js-strings', title: 'Strings', level: 'intermediate', subtopics: ['String Methods', 'Template Literals', 'String Search', 'String Replace', 'String Split & Join', 'Regular Expressions'] },
      { id: 'js-arrays', title: 'Arrays', level: 'intermediate', subtopics: ['Creating Arrays', 'Array Methods', 'map()', 'filter()', 'reduce()', 'find()', 'some() & every()', 'sort()', 'Destructuring', 'Spread Operator'] },
      { id: 'js-objects', title: 'Objects', level: 'intermediate', subtopics: ['Object Basics', 'Object Methods', 'Object Destructuring', 'Object.keys()', 'Object.values()', 'Object.entries()', 'this Keyword', 'JSON'] },
      { id: 'js-dom', title: 'DOM Manipulation', level: 'intermediate', subtopics: ['DOM Introduction', 'Selecting Elements', 'Changing Content', 'Styling Elements', 'Creating Elements', 'Removing Elements', 'Traversing DOM', 'DOM Projects'] },
      { id: 'js-events', title: 'Events', level: 'intermediate', subtopics: ['Event Listeners', 'Mouse Events', 'Keyboard Events', 'Form Events', 'Event Bubbling', 'Event Capturing', 'Event Delegation', 'Prevent Default'] },
      { id: 'js-es6', title: 'ES6+ Features', level: 'intermediate', subtopics: ['let & const', 'Arrow Functions', 'Template Literals', 'Destructuring', 'Spread Operator', 'Rest Operator', 'Modules', 'Classes', 'Promises', 'Optional Chaining'] },
      { id: 'js-async', title: 'Asynchronous JavaScript', level: 'advanced', subtopics: ['Synchronous vs Asynchronous', 'Callbacks', 'Callback Hell', 'Promises', 'async/await', 'Fetch API', 'Axios', 'Error Handling'] },
      { id: 'js-browser-apis', title: 'Browser APIs', level: 'advanced', subtopics: ['Local Storage', 'Session Storage', 'Cookies', 'Geolocation API', 'Clipboard API', 'Notification API', 'History API', 'Web Storage'] },
      { id: 'js-modules', title: 'Modules', level: 'advanced', subtopics: ['Import', 'Export', 'Named Export', 'Default Export', 'Module Bundlers'] },
      { id: 'js-oop', title: 'Object-Oriented JavaScript', level: 'advanced', subtopics: ['Classes', 'Objects', 'Constructors', 'Inheritance', 'Encapsulation', 'Polymorphism', 'Prototypes', 'Prototype Chain'] },
      { id: 'js-error-handling', title: 'Error Handling', level: 'advanced', subtopics: ['try', 'catch', 'finally', 'throw', 'Custom Errors'] },
      { id: 'js-advanced', title: 'Advanced JavaScript', level: 'advanced', subtopics: ['Closures', 'Hoisting', 'Scope', 'Event Loop', 'Call Stack', 'Memory Management', 'Debouncing', 'Throttling', 'Generators', 'Iterators', 'Proxy', 'Reflect'] },
      { id: 'js-api-integration', title: 'API Integration', level: 'advanced', subtopics: ['REST APIs', 'CRUD Operations', 'Fetch API', 'Axios', 'Authentication', 'JWT', 'Error Handling'] },
      { id: 'js-projects', title: 'JavaScript Projects', level: 'advanced', subtopics: ['Calculator', 'To-Do App', 'Weather App', 'Quiz App', 'Expense Tracker', 'Chat Application', 'E-commerce Cart', 'Portfolio Website'] },
      { id: 'js-interview', title: 'Interview Preparation', level: 'advanced', subtopics: ['JavaScript MCQs', 'Coding Questions', 'Output-Based Questions', 'Scenario-Based Questions', 'Interview Questions', 'Company Questions', 'JavaScript Cheat Sheet'] },
      { id: 'js-references', title: 'References', level: 'advanced', subtopics: ['Best Practices', 'Coding Standards', 'Useful Libraries', 'Useful Tools', 'Official Documentation'] }
    ],
    challenges: [
      { id: 'js-debounce', title: 'Implement Debounce', difficulty: 'Medium' },
      { id: 'js-async', title: 'Fetch & Render API Data', difficulty: 'Easy' }
    ]
  },
  typescript: {
    title: 'TypeScript',
    icon: '🔷',
    conceptTitle: 'TypeScript Basics',
    topics: [
      { id: 'types', title: 'Types', level: 'beginner', subtopics: ['Primitives', 'Interfaces', 'Enums'] },
      { id: 'tsconfig', title: 'Tooling', level: 'intermediate', subtopics: ['Compiler options', 'tsconfig.json'] },
      { id: 'advanced', title: 'Advanced Types', level: 'advanced', subtopics: ['Generics', 'Mapped types'] }
    ]
  },
  java: {
    title: 'Java',
    icon: '☕',
    conceptTitle: 'Java Core',
    topics: [
      { id: 'syntax', title: 'Syntax', level: 'beginner', subtopics: ['Classes', 'Methods', 'Variables'] },
      { id: 'oop', title: 'OOP', level: 'intermediate', subtopics: ['Inheritance', 'Polymorphism', 'Abstraction'] },
      { id: 'collections', title: 'Collections', level: 'advanced', subtopics: ['List', 'Map', 'Set'] }
    ]
  },
  c: {
    title: 'C',
    icon: '🔣',
    conceptTitle: 'C Language Basics',
    topics: [
      { id: 'basics', title: 'Basics', level: 'beginner', subtopics: ['Syntax', 'Pointers', 'Memory'] },
      { id: 'stdlib', title: 'Std Library', level: 'intermediate', subtopics: ['stdio', 'stdlib'] }
    ]
  },
  cpp: {
    title: 'C++',
    icon: '⚙️',
    conceptTitle: 'C++ Fundamentals',
    topics: [
      { id: 'syntax', title: 'Syntax', level: 'beginner', subtopics: ['Variables', 'Functions', 'OOP'] },
      { id: 'stl', title: 'STL', level: 'intermediate', subtopics: ['Vectors', 'Maps', 'Algorithms'] }
    ]
  },
  sql: {
    title: 'SQL',
    icon: '🛢️',
    conceptTitle: 'Understanding SQL Fundamentals',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['What is SQL?', 'Why databases matter'] },
      { id: 'select', title: 'SELECT Queries', level: 'beginner', subtopics: ['Filtering rows', 'Sorting results'] },
      { id: 'joins', title: 'Joins', level: 'intermediate', subtopics: ['INNER JOIN', 'LEFT JOIN', 'GROUP BY'] },
      { id: 'schema', title: 'Schema Design', level: 'intermediate', subtopics: ['Tables', 'Keys', 'Indexes'] },
      { id: 'functions', title: 'Functions', level: 'advanced', subtopics: ['Aggregate functions', 'Date functions'] }
    ],
    challenges: [
      { id: 'sql-top-customers', title: 'Top Customers Query', difficulty: 'Easy' }
    ]
  },
  react: {
    title: 'React',
    icon: '⚛️',
    conceptTitle: 'React Basics',
    topics: [
      { id: 'react-intro', title: 'React Introduction', level: 'beginner', subtopics: ['What is React?', 'Features of React', 'Why React?', 'React vs Other Frameworks', 'Installation & Setup', 'First React App'] },
      { id: 'react-jsx', title: 'JSX', level: 'beginner', subtopics: ['Introduction to JSX', 'JSX Syntax', 'Expressions in JSX', 'JSX Attributes', 'JSX vs HTML'] },
      { id: 'react-components', title: 'Components', level: 'beginner', subtopics: ['Functional Components', 'Class Components', 'Component Structure', 'Reusable Components', 'Component Composition'] },
      { id: 'react-props', title: 'Props', level: 'beginner', subtopics: ['Introduction', 'Passing Props', 'Default Props', 'Children Props', 'Prop Drilling'] },
      { id: 'react-state', title: 'State', level: 'intermediate', subtopics: ['useState Hook', 'Updating State', 'State vs Props', 'State Management Basics'] },
      { id: 'react-events', title: 'Event Handling', level: 'intermediate', subtopics: ['Click Events', 'Form Events', 'Keyboard Events', 'Event Object', 'Event Binding'] },
      { id: 'react-conditional', title: 'Conditional Rendering', level: 'intermediate', subtopics: ['if Statement', 'Ternary Operator', 'Logical AND (&&)', 'Switch Rendering'] },
      { id: 'react-lists', title: 'Lists & Keys', level: 'intermediate', subtopics: ['Rendering Lists', 'map()', 'Keys', 'Filtering Lists'] },
      { id: 'react-forms', title: 'Forms', level: 'intermediate', subtopics: ['Controlled Components', 'Uncontrolled Components', 'Form Validation', 'Handling User Input'] },
      { id: 'react-hooks', title: 'Hooks', level: 'intermediate', subtopics: ['useState', 'useEffect', 'useContext', 'useReducer', 'useRef', 'useMemo', 'useCallback', 'Custom Hooks'] },
      { id: 'react-styling', title: 'Styling React', level: 'intermediate', subtopics: ['CSS', 'CSS Modules', 'Tailwind CSS', 'Bootstrap', 'Styled Components', 'Material UI'] },
      { id: 'react-router', title: 'React Router', level: 'advanced', subtopics: ['Installation', 'BrowserRouter', 'Routes', 'Route Parameters', 'Nested Routes', 'Navigation'] },
      { id: 'react-api', title: 'API Integration', level: 'advanced', subtopics: ['Fetch API', 'Axios', 'CRUD Operations', 'Loading State', 'Error Handling'] },
      { id: 'react-context', title: 'Context API', level: 'advanced', subtopics: ['Creating Context', 'Provider', 'useContext', 'Global State'] },
      { id: 'react-redux', title: 'Redux', level: 'advanced', subtopics: ['Redux Basics', 'Redux Toolkit', 'Store', 'Actions', 'Reducers', 'useSelector & useDispatch'] },
      { id: 'react-performance', title: 'Performance Optimization', level: 'advanced', subtopics: ['React.memo', 'Lazy Loading', 'Code Splitting', 'useMemo', 'useCallback'] },
      { id: 'react-auth', title: 'Authentication', level: 'advanced', subtopics: ['JWT Authentication', 'Protected Routes', 'Login & Logout', 'Token Storage'] },
      { id: 'react-testing', title: 'Testing', level: 'advanced', subtopics: ['Jest', 'React Testing Library', 'Unit Testing', 'Component Testing'] },
      { id: 'react-projects', title: 'React Projects', level: 'advanced', subtopics: ['To-Do App', 'Weather App', 'Expense Tracker', 'E-commerce Website', 'Chat Application', 'Admin Dashboard', 'Portfolio Website'] },
      { id: 'react-deployment', title: 'Deployment', level: 'advanced', subtopics: ['Build React App', 'Vercel', 'Netlify', 'GitHub Pages', 'Environment Variables'] },
      { id: 'react-interview', title: 'Interview Preparation', level: 'advanced', subtopics: ['React MCQs', 'Interview Questions', 'Coding Questions', 'Hooks Questions', 'Scenario-Based Questions', 'Company Questions'] },
      { id: 'react-references', title: 'References', level: 'advanced', subtopics: ['React Cheat Sheet', 'Best Practices', 'Common Mistakes', 'Useful Libraries', 'Official React Documentation'] }
    ],
    challenges: [
      { id: 'react-todo', title: 'Build a Todo App', difficulty: 'Easy' }
    ]
  },
  nodejs: {
    title: 'Node.js',
    icon: '🟩',
    conceptTitle: 'Server-side JavaScript',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['Event loop', 'Modules'] },
      { id: 'http', title: 'HTTP', level: 'intermediate', subtopics: ['Creating servers', 'Routing'] },
      { id: 'npm', title: 'NPM', level: 'intermediate', subtopics: ['Packages', 'Scripts'] }
    ],
    challenges: [
      { id: 'node-api', title: 'Create a REST API', difficulty: 'Medium' }
    ]
  },
  mongodb: {
    title: 'MongoDB',
    icon: '🍃',
    conceptTitle: 'MongoDB Basics',
    topics: [
      { id: 'mongodb-intro', title: 'MongoDB Introduction', level: 'beginner', subtopics: ['What is MongoDB?', 'Features of MongoDB', 'SQL vs MongoDB', 'NoSQL Basics', 'Installation', 'MongoDB Compass'] },
      { id: 'mongodb-basics', title: 'MongoDB Basics', level: 'beginner', subtopics: ['Database', 'Collections', 'Documents', 'BSON', 'Data Types', 'Shell Commands'] },
      { id: 'mongodb-crud', title: 'CRUD Operations', level: 'beginner', subtopics: ['Insert Documents', 'Find Documents', 'Update Documents', 'Delete Documents', 'Replace Documents', 'Bulk Operations'] },
      { id: 'mongodb-queries', title: 'Query Operators', level: 'intermediate', subtopics: ['Comparison Operators', 'Logical Operators', 'Element Operators', 'Evaluation Operators', 'Array Operators', 'Query Examples'] },
      { id: 'mongodb-projection', title: 'Projection & Sorting', level: 'intermediate', subtopics: ['Projection', 'Sorting', 'Limit', 'Skip', 'Pagination'] },
      { id: 'mongodb-indexing', title: 'Indexing', level: 'intermediate', subtopics: ['What are Indexes?', 'Single Field Index', 'Compound Index', 'Text Index', 'Unique Index', 'Performance Optimization'] },
      { id: 'mongodb-aggregation', title: 'Aggregation Framework', level: 'intermediate', subtopics: ['Aggregation Pipeline', '$match', '$group', '$project', '$sort', '$lookup', '$unwind', 'Aggregation Examples'] },
      { id: 'mongodb-relationships', title: 'Relationships', level: 'intermediate', subtopics: ['Embedded Documents', 'Referenced Documents', 'One-to-One', 'One-to-Many', 'Many-to-Many'] },
      { id: 'mongodb-schema', title: 'Schema Design', level: 'intermediate', subtopics: ['Schema Design Principles', 'Embedding vs Referencing', 'Data Modeling', 'Best Practices'] },
      { id: 'mongodb-node', title: 'MongoDB with Node.js', level: 'advanced', subtopics: ['MongoDB Driver', 'Connecting to MongoDB', 'CRUD with Node.js', 'Async Operations', 'Error Handling'] },
      { id: 'mongodb-mongoose', title: 'Mongoose', level: 'advanced', subtopics: ['Introduction', 'Schemas', 'Models', 'Validation', 'Middleware', 'Population', 'CRUD with Mongoose'] },
      { id: 'mongodb-transactions', title: 'Transactions', level: 'advanced', subtopics: ['ACID Transactions', 'Sessions', 'Commit', 'Rollback'] },
      { id: 'mongodb-security', title: 'Security', level: 'advanced', subtopics: ['Authentication', 'Authorization', 'User Roles', 'Data Encryption', 'Backup & Restore'] },
      { id: 'mongodb-atlas', title: 'MongoDB Atlas', level: 'advanced', subtopics: ['Creating Cluster', 'Database Deployment', 'Connection String', 'Atlas Security', 'Monitoring'] },
      { id: 'mongodb-performance', title: 'Performance Tuning', level: 'advanced', subtopics: ['Query Optimization', 'Explain Plan', 'Index Optimization', 'Caching', 'Monitoring'] },
      { id: 'mongodb-projects', title: 'MongoDB Projects', level: 'advanced', subtopics: ['Student Management System', 'Library Management', 'E-commerce Database', 'Blog Application', 'Inventory System', 'User Authentication System'] },
      { id: 'mongodb-interview', title: 'Interview Preparation', level: 'advanced', subtopics: ['MongoDB MCQs', 'CRUD Interview Questions', 'Aggregation Questions', 'Mongoose Questions', 'Scenario-Based Questions', 'Company Interview Questions'] },
      { id: 'mongodb-references', title: 'References', level: 'advanced', subtopics: ['MongoDB Cheat Sheet', 'Best Practices', 'Common Errors', 'Useful Tools', 'Official MongoDB Documentation'] }
    ]
  },
  mysql: {
    title: 'MySQL',
    icon: '🗄️',
    conceptTitle: 'MySQL Fundamentals',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['Install', 'Connect'] },
      { id: 'queries', title: 'Queries', level: 'intermediate', subtopics: ['SELECT', 'JOINs', 'Indexes'] }
    ]
  },
  git: {
    title: 'Git',
    icon: '🌲',
    conceptTitle: 'Version Control with Git',
    topics: [
      { id: 'basics', title: 'Basics', level: 'beginner', subtopics: ['Init', 'Commit', 'Branches'] },
      { id: 'remotes', title: 'Remotes', level: 'intermediate', subtopics: ['Push', 'Fetch', 'Merge'] }
    ]
  },
  github: {
    title: 'GitHub',
    icon: '🐙',
    conceptTitle: 'Hosting and Collaboration',
    topics: [
      { id: 'repos', title: 'Repositories', level: 'beginner', subtopics: ['Create', 'Fork', 'Clone'] },
      { id: 'prs', title: 'Pull Requests', level: 'intermediate', subtopics: ['Review', 'Merge', 'CI'] }
    ]
  },
  docker: {
    title: 'Docker',
    icon: '🐳',
    conceptTitle: 'Containerization',
    topics: [
      { id: 'images', title: 'Images', level: 'beginner', subtopics: ['Dockerfile', 'Build'] },
      { id: 'containers', title: 'Containers', level: 'intermediate', subtopics: ['Run', 'Volumes', 'Networking'] }
    ]
  },
  aws: {
    title: 'AWS',
    icon: '☁️',
    conceptTitle: 'Cloud Fundamentals',
    topics: [
      { id: 'core', title: 'Core Services', level: 'beginner', subtopics: ['EC2', 'S3', 'IAM'] },
      { id: 'deploy', title: 'Deployment', level: 'intermediate', subtopics: ['Elastic Beanstalk', 'Lambda'] }
    ]
  },
  linux: {
    title: 'Linux',
    icon: '🐧',
    conceptTitle: 'Linux Basics',
    topics: [
      { id: 'shell', title: 'Shell', level: 'beginner', subtopics: ['Commands', 'Permissions'] },
      { id: 'process', title: 'Process', level: 'intermediate', subtopics: ['ps', 'top', 'jobs'] }
    ]
  },
  'machine-learning': {
    title: 'Machine Learning',
    icon: '🤖',
    conceptTitle: 'ML Foundations',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['Supervised', 'Unsupervised'] },
      { id: 'models', title: 'Models', level: 'intermediate', subtopics: ['Regression', 'Classification'] }
    ]
  },
  ai: {
    title: 'Artificial Intelligence',
    icon: '🧠',
    conceptTitle: 'AI Overview',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['History', 'Applications'] },
      { id: 'ml', title: 'Relation to ML', level: 'intermediate', subtopics: ['ML vs AI', 'Use cases'] }
    ]
  },
  'data-science': {
    title: 'Data Science',
    icon: '📊',
    conceptTitle: 'Data Science Workflow',
    topics: [
      { id: 'explore', title: 'Exploration', level: 'beginner', subtopics: ['EDA', 'Visualization'] },
      { id: 'pipelines', title: 'Pipelines', level: 'intermediate', subtopics: ['Cleaning', 'Feature engineering'] }
    ]
  },
  'cloud-computing': {
    title: 'Cloud Computing',
    icon: '☁️',
    conceptTitle: 'Cloud Concepts',
    topics: [
      { id: 'models', title: 'Service Models', level: 'beginner', subtopics: ['IaaS', 'PaaS', 'SaaS'] },
      { id: 'deploy', title: 'Deployment Models', level: 'intermediate', subtopics: ['Public', 'Private', 'Hybrid'] }
    ]
  },
  'cyber-security': {
    title: 'Cyber Security',
    icon: '🔒',
    conceptTitle: 'Security Fundamentals',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['CIA triad', 'Threats'] },
      { id: 'network', title: 'Network Security', level: 'intermediate', subtopics: ['Firewalls', 'VPNs'] }
    ]
  },
  default: {
    title: 'Programming',
    icon: '💡',
    conceptTitle: 'Understanding Core Concepts',
    topics: [
      { id: 'intro', title: 'Introduction', level: 'beginner', subtopics: ['Basics', 'Setup'] },
      { id: 'practice', title: 'Practice', level: 'intermediate', subtopics: ['Exercises', 'Mini projects'] }
    ]
  }
};

const skillResourceCatalog = {
  python: [
    { title: 'Python Official Docs', type: 'Docs', link: 'https://docs.python.org/3/', description: 'Authoritative language reference and tutorials.' },
    { title: 'Automate the Boring Stuff', type: 'Book', link: 'https://automatetheboringstuff.com/', description: 'A practical beginner-friendly Python guide.' },
    { title: 'Real Python', type: 'Tutorials', link: 'https://realpython.com/', description: 'High-quality lessons for beginners and intermediate learners.' }
  ],
  javascript: [
    { title: 'MDN JavaScript Guide', type: 'Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', description: 'Trusted browser-side and language reference documentation.' },
    { title: 'JavaScript.info', type: 'Tutorials', link: 'https://javascript.info/', description: 'Clear explanations with examples and exercises.' },
    { title: 'Eloquent JavaScript', type: 'Book', link: 'https://eloquentjavascript.net/', description: 'Excellent introduction to modern JavaScript.' }
  ],
  html: [
    { title: 'MDN HTML Guide', type: 'Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML', description: 'Official and detailed HTML reference.' },
    { title: 'W3Schools HTML Tutorial', type: 'Tutorials', link: 'https://www.w3schools.com/html/', description: 'Beginner-focused structure and examples.' },
    { title: 'HTML5 Specification', type: 'Spec', link: 'https://html.spec.whatwg.org/', description: 'Reference for modern semantic HTML standards.' }
  ],
  css: [
    { title: 'MDN CSS Guide', type: 'Docs', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS', description: 'In-depth styling reference and examples.' },
    { title: 'CSS Tricks', type: 'Tutorials', link: 'https://css-tricks.com/', description: 'Practical layout and CSS patterns.' },
    { title: 'Refactoring UI', type: 'Book', link: 'https://www.refactoringui.com/', description: 'Design-focused CSS and interface guidance.' }
  ],
  react: [
    { title: 'React Documentation', type: 'Docs', link: 'https://react.dev/', description: 'Official React guides and examples.' },
    { title: 'React Router Docs', type: 'Docs', link: 'https://reactrouter.com/', description: 'Routing patterns for real applications.' },
    { title: 'Frontend Mentor', type: 'Practice', link: 'https://www.frontendmentor.io/', description: 'Build polished UI projects with real requirements.' }
  ],
  sql: [
    { title: 'SQLBolt', type: 'Tutorials', link: 'https://sqlbolt.com/', description: 'Straightforward SQL practice and lessons.' },
    { title: 'PostgreSQL Docs', type: 'Docs', link: 'https://www.postgresql.org/docs/', description: 'Reliable reference for SQL and database concepts.' },
    { title: 'Mode SQL Tutorial', type: 'Tutorials', link: 'https://mode.com/sql-tutorial/', description: 'Practical queries for analysis and reporting.' }
  ],
  default: [
    { title: 'Official Documentation', type: 'Docs', link: 'https://developer.mozilla.org/', description: 'A trusted starting point for most web technologies.' },
    { title: 'W3Schools', type: 'Tutorials', link: 'https://www.w3schools.com/', description: 'A beginner-friendly reference for many topics.' },
    { title: 'FreeCodeCamp', type: 'Practice', link: 'https://www.freecodecamp.org/', description: 'Hands-on exercises and guided projects.' }
  ]
};

// Real, topic-specific lesson content (not auto-generated filler).
// Keyed by skill -> topic id. Add more skills here using the same shape:
// { explanation, example, output, notes: [3 strings], practice }
const realLessonContent = {
  python: {
    'python-intro': {
      explanation: "Python is a high-level, interpreted, general-purpose language known for clean, readable syntax that uses indentation instead of curly braces. Code runs through an interpreter (CPython is the reference implementation), so there's no separate compile step, which is part of why it's popular for scripting, web development, data science, automation, and teaching.",
      example: `print("Hello, EduMind!")\nprint(3 + 5)`,
      output: `Hello, EduMind!\n8`,
      notes: [
        "Python was created by Guido van Rossum and first released in 1991.",
        "There's no compilation step — the interpreter runs your .py file directly.",
        "Run a script from the terminal with: python filename.py"
      ],
      practice: "Install Python from python.org, then write a script that prints your name and today's date using the datetime module."
    },
    'python-basics': {
      explanation: "Variables are created the moment you assign a value — Python is dynamically typed, so you never declare a type up front. Keywords like if, for, and def are reserved and can't be used as variable names, while identifiers are the names you choose for variables, functions, and classes.",
      example: `name = "EduMind"\nage = 3\nprint(f"{name} is {age} years old")\nage = age + 1\nprint(type(age))`,
      output: `EduMind is 3 years old\n<class 'int'>`,
      notes: [
        "A variable's type comes from its current value and can change if reassigned.",
        "Use int(), float(), str(), and bool() to explicitly convert between types.",
        "Identifiers can use letters, digits, and underscores, but can't start with a digit."
      ],
      practice: "Write a script that reads a Celsius temperature with input(), converts it to Fahrenheit, and prints the result to one decimal place."
    },
    'data-types': {
      explanation: "Python's built-in types cover numbers (int, float, complex), text (str), ordered collections (list, tuple), unique collections (set), key-value mappings (dict), and booleans. Picking the right one — a list for an ordered, changeable sequence versus a tuple for one that shouldn't change — affects both correctness and performance.",
      example: `scores = [88, 92, 79]\ninfo = ("Alice", 21)\ntags = {"python", "web", "python"}\nprofile = {"name": "Alice", "score": 88}\nprint(scores, info, tags, profile)`,
      output: `[88, 92, 79] ('Alice', 21) {'python', 'web'} {'name': 'Alice', 'score': 88}`,
      notes: [
        "Lists and dictionaries are mutable; tuples and strings are immutable.",
        "Sets automatically drop duplicate values.",
        "Use type(value) to check a variable's actual type at runtime."
      ],
      practice: "Create a dictionary for a student with a name, a list of grades, and a passed boolean, then print each value along with its type."
    },
    operators: {
      explanation: "Python has arithmetic operators (+, -, *, /, //, %, **), comparison operators (==, !=, <, >), logical operators (and, or, not), and identity/membership operators (is, in) that check object identity or collection membership rather than plain equality.",
      example: `a, b = 17, 5\nprint(a // b, a % b, a ** 2)\nprint(a > b and b > 0)\nprint(3 in [1, 2, 3])`,
      output: `3 2 289\nTrue\nTrue`,
      notes: [
        "// is floor division, % is the remainder, ** is exponentiation.",
        "== compares values while is compares object identity — use is mainly for None checks.",
        "in and not in test membership across strings, lists, tuples, sets, and dicts."
      ],
      practice: "Write a function that takes two numbers and prints the result of all six comparison operators applied to them."
    },
    conditional: {
      explanation: "Conditional statements branch based on a boolean expression using if, optional elif blocks for extra conditions, and else as the fallback. Python 3.10+ also added match/case as a more readable alternative to long if-elif chains when matching a value against several patterns.",
      example: `score = 76\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)`,
      output: `B`,
      notes: [
        "Only one branch of an if-elif-else chain runs, checked in order.",
        "Indentation (4 spaces by convention) defines a block — there are no curly braces.",
        "match/case shines when matching a value against several discrete patterns cleanly."
      ],
      practice: "Assign a letter grade (A–F) using if-elif-else, then rewrite the same logic with match-case."
    },
    loops: {
      explanation: "for loops iterate over a sequence a known number of times, while while loops repeat as long as a condition is true. break exits a loop early, continue skips to the next iteration, and pass is a no-op placeholder used when a statement is syntactically required but shouldn't do anything yet.",
      example: `total = 0\nfor i in range(1, 6):\n    if i == 4:\n        continue\n    total += i\nprint(total)\n\ncount = 0\nwhile count < 3:\n    print("tick", count)\n    count += 1`,
      output: `11\ntick 0\ntick 1\ntick 2`,
      notes: [
        "range(1, 6) generates 1 through 5 — the stop value is exclusive.",
        "continue skips only the rest of the current iteration; the loop keeps running.",
        "Always make sure a while condition can eventually become false, to avoid an infinite loop."
      ],
      practice: "Use a while loop to print the first 5 Fibonacci numbers as they're calculated."
    },
    functions: {
      explanation: "A function is defined with def, can take parameters (including default values), and sends a result back with return. Lambdas are small unnamed one-expression functions, recursion is a function calling itself on a smaller version of the problem, and scope determines where a variable is visible — local inside a function versus global outside it.",
      example: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nsquare = lambda x: x * x\nprint(factorial(5), square(6))`,
      output: `120 36`,
      notes: [
        "Every recursive function needs a base case, or it recurses forever and raises RecursionError.",
        "Default parameters (def greet(name=\"World\")) let callers omit an argument.",
        "A variable assigned inside a function is local by default; use global to modify a global one."
      ],
      practice: "Write a recursive function for the nth Fibonacci number, then an iterative version, and compare their speed for n=30 with the time module."
    },
    strings: {
      explanation: "Strings are immutable character sequences that support indexing (s[0]), slicing (s[1:4]), and many built-in methods (.upper(), .split(), .replace()). f-strings (f\"{value}\") are the modern way to format text, and the re module handles regular expressions for pattern matching.",
      example: `text = "Learn Python with EduMind"\nprint(text[:5])\nprint(text.split(" "))\nprint(f"Length: {len(text)}")\nimport re\nprint(re.findall(r"[A-Z]\\w+", text))`,
      output: `Learn\n['Learn', 'Python', 'with', 'EduMind']\nLength: 26\n['Learn', 'Python', 'EduMind']`,
      notes: [
        "Strings can't change in place — every 'change' like .upper() returns a new string.",
        "Negative indices count from the end: s[-1] is the last character.",
        "re.findall, re.search, and re.sub are the most commonly used regex functions."
      ],
      practice: "Write a function that capitalizes every word in a sentence without using the built-in .title() method."
    },
    lists: {
      explanation: "Lists are ordered, mutable sequences made with square brackets, supporting methods like .append(), .sort(), and .remove(). List comprehensions ([expr for item in iterable if condition]) build a new list compactly, and lists can nest to represent grids or tables.",
      example: `nums = [5, 2, 8, 1]\nnums.sort()\nsquares = [n * n for n in nums if n % 2 == 0]\nmatrix = [[1, 2], [3, 4]]\nprint(nums, squares, matrix[1][0])`,
      output: `[1, 2, 5, 8] [4, 64] 3`,
      notes: [
        ".sort() sorts in place and returns None; use sorted(list) for a new sorted list.",
        "List comprehensions are usually faster and more readable than an equivalent loop with .append().",
        "Slicing (nums[1:3]) returns a new list rather than modifying the original."
      ],
      practice: "Given a list of student dicts (name, score), use a list comprehension to get the names of students who scored above 80."
    },
    tuples: {
      explanation: "Tuples are ordered, immutable sequences made with parentheses, often used for fixed collections like coordinates. Packing groups values into a tuple automatically, and unpacking assigns each element to its own variable in one line.",
      example: `point = (3, 4)\nx, y = point\nperson = "Alice", 21, "Engineer"\nname, age, role = person\nprint(x, y, name, age, role)`,
      output: `3 4 Alice 21 Engineer`,
      notes: [
        "Because tuples are immutable, they're safe to use as dictionary keys, unlike lists.",
        "A single-element tuple needs a trailing comma: (5,) not (5).",
        "Functions can return multiple values by packing them into a tuple that the caller unpacks."
      ],
      practice: "Write min_max(numbers) that returns a (minimum, maximum) tuple, then unpack the result into two variables when calling it."
    },
    sets: {
      explanation: "Sets are unordered collections of unique, hashable values, made with curly braces or set(). They support union (|), intersection (&), difference (-), and symmetric difference (^), which makes them useful for comparing groups and removing duplicates.",
      example: `python_devs = {"Alice", "Bob", "Cara"}\njs_devs = {"Bob", "Dan"}\nprint(python_devs | js_devs)\nprint(python_devs & js_devs)\nprint(python_devs - js_devs)\nprint(python_devs ^ js_devs)`,
      output: `{'Alice', 'Bob', 'Cara', 'Dan'}\n{'Bob'}\n{'Alice', 'Cara'}\n{'Alice', 'Cara', 'Dan'}`,
      notes: [
        "Sets can't contain duplicates — adding an existing value has no effect.",
        "Sets are unordered, so you can't reliably index into them like a list.",
        "Converting a list to a set (set(my_list)) is a quick way to remove duplicates."
      ],
      practice: "Given two lists of emails (webinar signups and newsletter subscribers), use sets to find who did both and who did only one."
    },
    dictionaries: {
      explanation: "Dictionaries store key-value pairs, created with curly braces ({key: value}), giving fast lookup by key instead of by position. They support nesting, iteration over keys/values/items, and comprehensions for building new dictionaries concisely.",
      example: `student = {"name": "Alice", "grades": {"math": 92, "science": 88}}\nfor subject, score in student["grades"].items():\n    print(subject, score)\npassed = {k: v for k, v in student["grades"].items() if v >= 90}\nprint(passed)`,
      output: `math 92\nscience 88\n{'math': 92}`,
      notes: [
        "Use .get(key, default) to avoid a KeyError when a key might not exist.",
        ".items(), .keys(), and .values() are the standard ways to iterate over a dict.",
        "Dictionary keys must be immutable (strings, numbers, tuples) — lists can't be keys."
      ],
      practice: "Build a dictionary that counts how many times each word appears in a sentence, without using collections.Counter."
    },
    'file-handling': {
      explanation: "The built-in open() function reads and writes files, and using it with the with statement closes the file automatically even if an error occurs. The csv and json modules make it easy to read and write structured data in those common formats.",
      example: `with open("notes.txt", "w") as f:\n    f.write("Learning EduMind\\n")\n\nwith open("notes.txt", "r") as f:\n    print(f.read())\n\nimport json\ndata = {"skill": "Python", "level": "Beginner"}\nwith open("data.json", "w") as f:\n    json.dump(data, f)`,
      output: `Learning EduMind`,
      notes: [
        "Prefer with open(...) as f: over manually calling .close() — it's safer and shorter.",
        "File modes: 'r' read, 'w' write/overwrite, 'a' append, 'r+' read and write.",
        "json.dump / json.load convert directly between Python objects and JSON files."
      ],
      practice: "Read a CSV file of student scores with the csv module and print the average score."
    },
    'exception-handling': {
      explanation: "try/except blocks catch errors that would otherwise crash the program, finally runs cleanup code whether or not an error occurred, and raise lets you trigger an exception manually — including custom exception classes defined by subclassing Exception.",
      example: `class InvalidScoreError(Exception):\n    pass\n\ndef check_score(score):\n    if score < 0 or score > 100:\n        raise InvalidScoreError("Score must be between 0 and 100")\n    return score\n\ntry:\n    check_score(150)\nexcept InvalidScoreError as e:\n    print("Error:", e)\nfinally:\n    print("Validation attempt finished")`,
      output: `Error: Score must be between 0 and 100\nValidation attempt finished`,
      notes: [
        "Catch specific exception types rather than a bare except:, so you don't hide real bugs.",
        "finally always runs, making it ideal for closing files or releasing resources.",
        "Custom exceptions should inherit from Exception or a more specific built-in exception."
      ],
      practice: "Write a divide(a, b) function that handles ZeroDivisionError and TypeError with distinct, helpful messages."
    },
    oop: {
      explanation: "Object-oriented programming organizes code around classes (blueprints) and objects (instances). __init__ sets up an object's initial state, inheritance lets one class reuse and extend another's behavior, polymorphism lets different classes share a common interface, encapsulation hides internal details, and magic methods (like __str__) customize how built-ins behave on your objects.",
      example: `class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} makes a sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} barks"\n\nfor a in [Animal("Generic"), Dog("Rex")]:\n    print(a.speak())`,
      output: `Generic makes a sound\nRex barks`,
      notes: [
        "__init__ runs automatically when you create an instance with ClassName(...).",
        "Overriding a parent method in a subclass, as Dog.speak does, is polymorphism in action.",
        "A leading underscore (_balance) signals 'internal use' — Python doesn't enforce true privacy."
      ],
      practice: "Create a Shape base class with an area() method, then Circle and Rectangle subclasses that override it, and print each area from a list."
    },
    'modules-packages': {
      explanation: "A module is a .py file you import with import module_name; a package is a folder of modules with an __init__.py. Python ships with built-in modules (math, random, os), and third-party packages install via pip install package_name from the Python Package Index.",
      example: `import math\nimport random\n\nprint(math.sqrt(49))\nprint(random.choice(["heads", "tails"]))`,
      output: `7.0\nheads   (varies each run — heads or tails)`,
      notes: [
        "Use from module import name to import just one function instead of the whole module.",
        "pip install requests (for example) adds a third-party package you can then import.",
        "Group related modules into a package with an __init__.py to keep large projects organized."
      ],
      practice: "Create your own mathutils.py with an is_prime(n) function, then import and use it from a separate script."
    },
    'advanced-python': {
      explanation: "Decorators wrap a function to add behavior without changing its code, generators (yield) produce values lazily instead of building a whole list in memory, closures capture variables from an enclosing scope, context managers (with) automate setup/teardown, and asyncio enables concurrent I/O-bound code without threads.",
      example: `def timer(func):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {func.__name__}")\n        return func(*args, **kwargs)\n    return wrapper\n\n@timer\ndef greet(name):\n    return f"Hello, {name}"\n\ndef count_up_to(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nprint(greet("EduMind"))\nprint(list(count_up_to(4)))`,
      output: `Calling greet\nHello, EduMind\n[1, 2, 3, 4]`,
      notes: [
        "A generator uses yield instead of return, producing values on demand via iteration.",
        "@decorator syntax is sugar for greet = timer(greet).",
        "asyncio suits I/O-bound concurrency; multiprocessing suits CPU-bound parallelism."
      ],
      practice: "Write an @log_time decorator that prints how long a function took, using the time module, and apply it to a function that sums a large range."
    },
    'popular-libraries': {
      explanation: "NumPy provides fast array math, Pandas handles tabular data with DataFrames, Matplotlib and Seaborn create charts, Scikit-learn implements machine learning algorithms, Flask and Django build web applications, and OpenCV handles computer vision — each installed via pip and imported as needed.",
      example: `import numpy as np\nimport pandas as pd\n\narr = np.array([1, 2, 3, 4])\nprint(arr.mean())\n\ndf = pd.DataFrame({"name": ["Alice", "Bob"], "score": [92, 85]})\nprint(df[df["score"] > 90])`,
      output: `2.5\n    name  score\n0  Alice     92`,
      notes: [
        "NumPy arrays support vectorized math (arr * 2) that's much faster than looping over a list.",
        "Pandas DataFrames support SQL-like filtering, grouping, and aggregation.",
        "Flask is lightweight; Django is a full-featured 'batteries included' framework."
      ],
      practice: "Load a small CSV of sales data into a Pandas DataFrame and use .groupby() to find total sales per region."
    },
    database: {
      explanation: "Python connects to databases through driver libraries: sqlite3 is built in for lightweight local databases, mysql-connector-python or PyMySQL for MySQL, psycopg2 for PostgreSQL, and pymongo for MongoDB. Most follow the same pattern: connect, get a cursor, execute a query, then fetch or commit results.",
      example: `import sqlite3\n\nconn = sqlite3.connect(":memory:")\ncur = conn.cursor()\ncur.execute("CREATE TABLE students (name TEXT, score INTEGER)")\ncur.execute("INSERT INTO students VALUES ('Alice', 92)")\nconn.commit()\ncur.execute("SELECT * FROM students")\nprint(cur.fetchall())`,
      output: `[('Alice', 92)]`,
      notes: [
        "Always call conn.commit() after INSERT/UPDATE/DELETE, or changes won't be saved.",
        "Use parameterized queries (WHERE name = ?) to prevent SQL injection.",
        "PyMongo works with Python dicts directly since MongoDB stores documents, not rows."
      ],
      practice: "Create a SQLite books table, insert three rows, and query for books published after 2015."
    },
    testing: {
      explanation: "unittest is Python's built-in testing framework using classes that subclass TestCase, while pytest is a popular alternative with a simpler function-based style and clearer output. Mocking (via unittest.mock) replaces real dependencies, like an API call, with fake ones so tests run fast and predictably.",
      example: `def add(a, b):\n    return a + b\n\n# test_add.py (pytest style)\ndef test_add_positive():\n    assert add(2, 3) == 5\n\ndef test_add_negative():\n    assert add(-1, -1) == -2`,
      output: `2 passed in 0.01s`,
      notes: [
        "pytest auto-discovers functions starting with test_ in files named test_*.py.",
        "unittest.TestCase gives assertion methods like assertEqual, assertTrue, assertRaises.",
        "Mocking external services keeps tests fast and independent of network conditions."
      ],
      practice: "Write three pytest tests for is_palindrome(s): a normal case, an empty string, and mixed capitalization."
    },
    projects: {
      explanation: "Applying concepts to real projects is how they stick — beginner projects (a calculator, a guessing game) build fluency with syntax and control flow, intermediate projects (a to-do list with file storage) add data structures and persistence, and advanced projects (a REST API, a small ML model) combine multiple libraries and design decisions.",
      example: `import random\n\nsecret = random.randint(1, 20)\nguess = int(input("Guess a number (1-20): "))\nif guess == secret:\n    print("Correct!")\nelif guess < secret:\n    print("Too low")\nelse:\n    print("Too high")`,
      output: `Guess a number (1-20): 12\nToo low   (depends on the random secret number and your input)`,
      notes: [
        "Start projects small and working end-to-end, then add features incrementally.",
        "Use git from the first commit so you can track progress and roll back mistakes.",
        "Reading other people's project code on GitHub is a fast way to pick up idiomatic patterns."
      ],
      practice: "Build a command-line to-do app that adds, lists, and completes tasks, saving them to a JSON file between runs."
    },
    interview: {
      explanation: "Python interview prep spans multiple-choice fundamentals (data types, mutability, scope), coding questions solved under time pressure, and company-style questions that weigh both correctness and how clearly you reason about time and space complexity.",
      example: `def has_duplicate(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False\n\nprint(has_duplicate([1, 2, 3, 2]))`,
      output: `True`,
      notes: [
        "Practice explaining your approach out loud before coding — reasoning matters as much as the answer.",
        "Know common complexities: `in` is O(1) average for a set but O(n) for a list.",
        "Review frequent patterns: two pointers, sliding window, recursion, and hash maps."
      ],
      practice: "Solve 'find the first non-repeating character in a string' and state the time complexity of your solution."
    },
    cheatsheets: {
      explanation: "A good cheat sheet condenses syntax you want to recall quickly — string/list/dict methods, common built-ins, and formatting patterns — so you're not searching documentation mid-project. A personal cheat sheet, built as you learn, is often more useful than someone else's.",
      example: `len(x)          # length of a string/list/dict\nsorted(x)       # new sorted list\nenumerate(x)    # (index, value) pairs while looping\nzip(a, b)       # pair up two iterables element-wise\nf"{x:.2f}"      # format a float to 2 decimal places`,
      output: `(This is a reference snippet, not something you run for output.)`,
      notes: [
        "Keep cheat sheets to what you personally forget — shorter is more useful than exhaustive.",
        "enumerate() and zip() are underused but very handy in loops.",
        "Bookmark the official Python docs' Built-in Functions page as your canonical fallback."
      ],
      practice: "Build your own one-page cheat sheet of the 15 built-ins and string methods you use most, and keep updating it as you learn."
    }
  },
  html: {
    intro: {
      explanation: "HTML (HyperText Markup Language) structures web content using nested elements made of opening and closing tags. Every document has a root <html> element containing a <head> (metadata, not shown to visitors) and a <body> (the visible content), and elements can carry attributes like id, class, or src that provide extra information.",
      example: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1 id="welcome">Hello, EduMind!</h1>\n  </body>\n</html>`,
      output: `Renders a page titled "My First Page" in the browser tab, with a heading that reads "Hello, EduMind!"`,
      notes: [
        "<!DOCTYPE html> tells the browser to render in standards mode.",
        "Attributes go inside the opening tag: <tag attribute=\"value\">.",
        "Most elements need an opening and closing tag; a few, like <img> and <br>, are self-closing."
      ],
      practice: "Build a minimal HTML page with a title, one heading, and one paragraph, then open it in a browser and inspect it with dev tools."
    },
    text: {
      explanation: "Headings (<h1> through <h6>) establish a page's content hierarchy — they matter for accessibility and SEO, not just font size. Paragraphs (<p>) hold body text, and lists come as <ul> for unordered (bulleted) or <ol> for ordered (numbered), each containing <li> items.",
      example: `<h1>Learning HTML</h1>\n<p>HTML is the backbone of every web page.</p>\n<ul>\n  <li>Structure</li>\n  <li>Content</li>\n</ul>`,
      output: `A large heading, a paragraph below it, and a bulleted list with two items.`,
      notes: [
        "Use only one <h1> per page, and don't skip heading levels just for visual size.",
        "<ol> automatically numbers its <li> items; <ul> bullets them.",
        "Nesting a <ul> inside an <li> creates a sub-list."
      ],
      practice: "Build a recipe page with an h1 title, an h2 'Ingredients' section using a ul, and an h2 'Steps' section using an ol."
    },
    links: {
      explanation: "The <a> tag creates hyperlinks using the href attribute, and <img> embeds images using src plus a required alt attribute that describes the image for screen readers and for when it fails to load. Meaningful alt text and clear link text are two of the easiest accessibility wins in HTML.",
      example: `<a href="https://edumind.example.com" target="_blank" rel="noopener">Visit EduMind</a>\n<img src="python-logo.png" alt="Python programming language logo">`,
      output: `A clickable link labeled "Visit EduMind" that opens in a new tab, and an image with fallback alt text.`,
      notes: [
        "target=\"_blank\" opens a link in a new tab — pair it with rel=\"noopener\" for security.",
        "The alt attribute on <img> isn't optional if you care about accessibility or SEO.",
        "Relative paths (images/logo.png) point within your project; absolute URLs point elsewhere on the web."
      ],
      practice: "Build an 'about me' section with a profile image (with meaningful alt text) and links to two of your favorite sites."
    },
    forms: {
      explanation: "The <form> element collects input through fields like <input type=\"text\">, <input type=\"email\">, and <textarea>, and browsers can validate them natively using attributes like required, minlength, and pattern before submission even happens. Pairing each field with a <label> improves both usability and accessibility.",
      example: `<form>\n  <label for="email">Email</label>\n  <input type="email" id="email" required>\n  <button type="submit">Subscribe</button>\n</form>`,
      output: `A labeled email field that the browser refuses to submit if left empty or not a valid email format.`,
      notes: [
        "<label for=\"id\"> must match the input's id attribute to be properly linked.",
        "required, min, max, and pattern trigger built-in browser validation without JavaScript.",
        "Use the right input type (email, number, date) so mobile keyboards adapt automatically."
      ],
      practice: "Build a contact form with name, email, and message fields using required and appropriate input types, plus a submit button."
    },
    semantics: {
      explanation: "Semantic elements like <header>, <nav>, <main>, <section>, <article>, and <footer> describe the meaning of content rather than just its appearance, helping browsers, search engines, and assistive technology understand page structure. ARIA attributes (aria-label, role, etc.) fill gaps when semantic HTML alone isn't enough for accessibility.",
      example: `<header><h1>EduMind</h1></header>\n<nav aria-label="Main navigation">\n  <a href="/skills">Skills</a>\n</nav>\n<main>\n  <section>\n    <h2>Featured Course</h2>\n  </section>\n</main>\n<footer>© 2026 EduMind</footer>`,
      output: `A page with a clearly defined header, navigation, main content section, and footer, all identifiable to screen readers.`,
      notes: [
        "Semantic tags don't change appearance by default — that's still CSS's job.",
        "Screen readers can jump directly to <main> or <nav>, which is why semantic structure matters.",
        "Use ARIA attributes to add missing context, not to replace semantic HTML you could have used instead."
      ],
      practice: "Refactor a page built entirely with divs into one using header, nav, main, section, and footer."
    }
  },
  css: {
    selectors: {
      explanation: "CSS selectors target which HTML elements a rule applies to: type selectors match tag names (p), class selectors match a .class-name (reusable across elements), ID selectors match a unique #id, and attribute selectors match elements with a given attribute like [type=\"text\"]. Specificity determines which rule wins when multiple selectors match the same element.",
      example: `p { color: gray; }\n.highlight { color: orange; font-weight: bold; }\n#main-title { font-size: 2rem; }`,
      output: `All paragraphs turn gray, any element with class "highlight" turns bold orange, and the element with id "main-title" gets a larger font size.`,
      notes: [
        "IDs are more specific than classes, which are more specific than type selectors — this affects which style wins.",
        "A class can be reused on many elements; an ID should be unique per page.",
        "Combine selectors like .card h2 to target an h2 only inside elements with class 'card'."
      ],
      practice: "Style three product cards using a shared .card class plus a unique #featured id for one that should stand out."
    },
    box: {
      explanation: "Every element is a rectangular box made of content, padding (space inside the border), border, and margin (space outside the border) — the CSS box model. By default width/height apply only to the content area, but box-sizing: border-box makes them include padding and border too, which is usually what you actually want.",
      example: `.card {\n  width: 200px;\n  padding: 16px;\n  border: 2px solid #333;\n  margin: 12px;\n  box-sizing: border-box;\n}`,
      output: `A card exactly 200px wide total (padding and border included), with 12px of space separating it from neighboring elements.`,
      notes: [
        "Without box-sizing: border-box, padding and border add to the declared width, making elements bigger than expected.",
        "Margins between two block elements can 'collapse' into the larger of the two instead of adding together.",
        "Setting * { box-sizing: border-box; } globally is a very common reset."
      ],
      practice: "Build two 200px-wide boxes with the same padding — one with content-box (default), one with border-box — and compare their rendered sizes."
    },
    layout: {
      explanation: "Flexbox (display: flex) lays out items in a single row or column and excels at aligning and distributing space among them, while CSS Grid (display: grid) lays out items in two dimensions at once and excels at whole-page layouts. Positioning (relative, absolute, fixed, sticky) adjusts elements within or removes them from the normal document flow.",
      example: `.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`,
      output: `A navbar with items spread across the full width and vertically centered, and a grid of three equal-width columns with gaps between them.`,
      notes: [
        "Use Flexbox for one-dimensional layouts (a row of nav links); use Grid for two-dimensional ones (a photo gallery).",
        "position: sticky stays in normal flow until a scroll threshold, then 'sticks' — great for sticky headers.",
        "position: absolute removes an element from normal flow, positioning it relative to its nearest positioned ancestor."
      ],
      practice: "Rebuild a 3-column pricing table twice — once with Flexbox, once with Grid — and compare which felt more natural."
    },
    responsive: {
      explanation: "Responsive design adapts layout to different screen sizes using media queries (@media (min-width: 768px) { ... }) to apply different styles at certain breakpoints, combined with a mobile-first approach where you write base styles for small screens and add complexity for larger ones.",
      example: `.container {\n  display: flex;\n  flex-direction: column;\n}\n@media (min-width: 768px) {\n  .container {\n    flex-direction: row;\n  }\n}`,
      output: `Items stack vertically on small screens, and switch to a horizontal row once the viewport reaches 768px wide.`,
      notes: [
        "Mobile-first means writing default (no media query) styles for phones, then using min-width queries for desktop.",
        "Common breakpoints sit around 640px, 768px, 1024px, and 1280px, but should follow your content, not fixed devices.",
        "Include <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> in the head, or media queries misbehave on mobile."
      ],
      practice: "Take a 3-column layout and make it collapse to a single column below 600px using a media query."
    },
    animations: {
      explanation: "CSS transitions animate a property smoothly between two states over time (like a hover color change), while @keyframes define multiple steps of an animation that can loop, applied to an element with the animation property.",
      example: `.btn {\n  background: #3b82f6;\n  transition: background 0.3s ease;\n}\n.btn:hover { background: #2563eb; }\n\n@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}\n.badge { animation: pulse 1.5s infinite; }`,
      output: `The button smoothly fades to a darker blue on hover, and the badge continuously grows and shrinks slightly, forever.`,
      notes: [
        "transition needs a state change (like :hover) to trigger; @keyframes animations can run automatically on load.",
        "animation-iteration-count: infinite loops an animation forever; a number runs it that many times.",
        "Prefer animating transform and opacity over width/height/margin for smoother, GPU-accelerated performance."
      ],
      practice: "Add a fade-in-and-slide-up entrance animation to a card using @keyframes, triggered automatically on page load."
    }
  },
  sql: {
    intro: {
      explanation: "SQL (Structured Query Language) is how you communicate with relational databases — structured, table-based systems where data is organized into rows and columns. Databases matter because they store data persistently, enforce structure and rules like uniqueness, and let many users query and update the same data reliably at once.",
      example: `CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name TEXT,\n  score INT\n);\nINSERT INTO students VALUES (1, 'Alice', 92);\nSELECT * FROM students;`,
      output: `id | name  | score\n1  | Alice | 92`,
      notes: [
        "A PRIMARY KEY uniquely identifies each row and can't be duplicated or null.",
        "SQL keywords (SELECT, INSERT, CREATE) are conventionally uppercase, though SQL isn't case-sensitive about them.",
        "Relational databases enforce a schema — every row in a table has the same columns."
      ],
      practice: "Create a table for a small library (id, title, author, year) and insert three rows."
    },
    select: {
      explanation: "SELECT retrieves data from a table, WHERE filters which rows come back, and ORDER BY controls the result order (ASC by default, or DESC for descending). Combining these is the most common query pattern you'll write.",
      example: `SELECT name, score\nFROM students\nWHERE score >= 80\nORDER BY score DESC;`,
      output: `name  | score\nAlice | 92\nCara  | 85`,
      notes: [
        "WHERE filters rows before they're returned; comparison operators (=, >, <, LIKE) all work inside it.",
        "ORDER BY ... DESC sorts highest to lowest; leave it off or add ASC for lowest to highest.",
        "LIMIT n restricts how many rows come back, useful for pagination or 'top N' queries."
      ],
      practice: "Write a query that returns the names of all books published after 2015, sorted alphabetically by title."
    },
    joins: {
      explanation: "Joins combine rows from two or more tables based on a related column. INNER JOIN returns only rows that match in both tables, LEFT JOIN returns all rows from the left table plus matches from the right (NULL where there's no match), and GROUP BY aggregates rows that share a value, usually paired with functions like COUNT() or SUM().",
      example: `SELECT students.name, courses.title\nFROM students\nJOIN enrollments ON students.id = enrollments.student_id\nJOIN courses ON enrollments.course_id = courses.id;\n\nSELECT course_id, COUNT(*) AS enrolled\nFROM enrollments\nGROUP BY course_id;`,
      output: `name  | title\nAlice | Python Basics\n\ncourse_id | enrolled\n1         | 12`,
      notes: [
        "INNER JOIN drops rows without a match in both tables; LEFT JOIN keeps all left-table rows regardless.",
        "The ON clause defines how rows relate — usually a foreign key matching a primary key.",
        "Any non-aggregated column in SELECT must also appear in GROUP BY."
      ],
      practice: "Given students, courses, and enrollments tables, write a query showing each course's title alongside how many students are enrolled."
    },
    schema: {
      explanation: "Schema design is deciding what tables to create, what columns and types they need, and how they relate through keys and indexes. A PRIMARY KEY uniquely identifies each row, FOREIGN KEYs link tables together and enforce referential integrity, and indexes speed up lookups on columns you filter or join on frequently.",
      example: `CREATE TABLE authors (\n  id INT PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE books (\n  id INT PRIMARY KEY,\n  title TEXT NOT NULL,\n  author_id INT,\n  FOREIGN KEY (author_id) REFERENCES authors(id)\n);\nCREATE INDEX idx_books_title ON books(title);`,
      output: `Two related tables where every book must reference a valid author, and title lookups on books are indexed for speed.`,
      notes: [
        "A foreign key prevents inserting a book with an author_id that doesn't exist in the authors table.",
        "Indexes speed up reads but slightly slow down writes, since the index has to update too.",
        "NOT NULL and UNIQUE constraints enforce data quality directly at the database level."
      ],
      practice: "Design a schema for a simple blog: authors, posts, and comments, with appropriate foreign keys connecting them."
    },
    functions: {
      explanation: "Aggregate functions (COUNT, SUM, AVG, MIN, MAX) compute a single value across a group of rows, typically paired with GROUP BY. Date functions (like NOW(), DATE(), DATEDIFF()) let you work with dates and times directly in SQL rather than pulling raw data into application code.",
      example: `SELECT AVG(score) AS avg_score, MAX(score) AS top_score\nFROM students;\n\nSELECT name, DATEDIFF(NOW(), enrolled_on) AS days_enrolled\nFROM students;`,
      output: `avg_score | top_score\n85.3      | 98\n\nname  | days_enrolled\nAlice | 42`,
      notes: [
        "Aggregate functions ignore NULL values by default (e.g. AVG skips NULL scores rather than treating them as 0).",
        "Exact date function names vary slightly between databases (MySQL, PostgreSQL, SQLite each differ a bit).",
        "COUNT(*) counts all rows; COUNT(column) counts only rows where that column isn't NULL."
      ],
      practice: "Write a query returning the average score per class using GROUP BY, and another finding students enrolled more than 30 days ago."
    }
  },
  javascript: {
    'js-intro': {
      explanation: "JavaScript is a dynamically-typed, interpreted scripting language that runs natively in every web browser, powering interactivity on the web — clicking buttons, validating forms, updating content without a reload. It has since expanded beyond the browser via Node.js, and evolves through yearly ECMAScript (ES) specification updates.",
      example: `console.log("Hello, EduMind!");\nconsole.log(2 + 3);`,
      output: `Hello, EduMind!\n5`,
      notes: [
        "JavaScript runs inside a browser engine (like V8 in Chrome) or on a server via Node.js.",
        "ECMAScript is the standard JavaScript follows; ES6/ES2015 introduced let, const, arrow functions, and more.",
        "JavaScript is single-threaded but handles async work (like network requests) via an event loop."
      ],
      practice: "Open your browser's dev tools console and log your name plus the current year using new Date().getFullYear()."
    },
    'js-basics': {
      explanation: "let and const (added in ES6) replaced var for declaring variables — let allows reassignment, const doesn't, and both are block-scoped unlike var which is function-scoped. JavaScript has dynamic typing with coercion rules that can be surprising, which is why strict equality (===) is recommended over ==.",
      example: `let count = 0;\nconst name = "EduMind";\ncount = count + 1;\nconsole.log(\`\${name}: \${count}\`);\nconsole.log("5" === 5, "5" == 5);`,
      output: `EduMind: 1\nfalse true`,
      notes: [
        "const prevents reassignment of the variable itself, but an object/array it holds can still be mutated.",
        "Use === (strict equality) instead of == to avoid unexpected type coercion.",
        "\"use strict\" at the top of a file or function catches common mistakes like accidental globals."
      ],
      practice: "Declare a const array of three numbers and log their sum using a loop."
    },
    'js-control-flow': {
      explanation: "Control flow branches based on a condition — if/else if/else for general conditions, switch for comparing one value against many discrete cases, and the ternary operator (condition ? a : b) for compact single-expression choices. JavaScript treats 0, \"\", null, undefined, NaN, and false as 'falsy'; everything else is 'truthy'.",
      example: `const hour = 14;\nlet greeting;\nif (hour < 12) greeting = "Good morning";\nelse if (hour < 18) greeting = "Good afternoon";\nelse greeting = "Good evening";\nconsole.log(greeting);\nconsole.log(0 ? "yes" : "no");`,
      output: `Good afternoon\nno`,
      notes: [
        "switch compares with strict equality (===) and needs break in each case, or execution 'falls through'.",
        "The ternary operator suits simple choices — nested ternaries hurt readability fast.",
        "Falsy values: 0, \"\", null, undefined, NaN, false. Everything else, including \"0\" and [], is truthy."
      ],
      practice: "Write a function that returns a season name from a month number using a switch statement."
    },
    'js-loops': {
      explanation: "for loops repeat a known number of times, while checks a condition before each iteration, and do-while checks after (so it always runs at least once). for-in iterates over an object's keys, while for-of iterates over the values of an iterable like an array or string.",
      example: `const fruits = ["apple", "banana", "cherry"];\nfor (const fruit of fruits) {\n  if (fruit === "banana") continue;\n  console.log(fruit);\n}\nlet i = 0;\ndo { console.log("run", i); i++; } while (i < 2);`,
      output: `apple\ncherry\nrun 0\nrun 1`,
      notes: [
        "for-of gives you values directly (great for arrays); for-in gives you keys (better for plain objects).",
        "do-while guarantees the loop body runs at least once, even if the condition starts false.",
        "Avoid for-in on arrays — it iterates indices as strings and can include inherited properties."
      ],
      practice: "Use for-of to loop over an array of student objects, printing each name and score but skipping any student who failed."
    },
    'js-functions': {
      explanation: "Functions can be declared (function greet(){}), assigned as expressions, or written as arrow functions, which don't have their own `this`. Higher-order functions take or return other functions, closures let an inner function 'remember' variables from its enclosing scope even after that scope finishes, and default/rest parameters make signatures more flexible.",
      example: `function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\nconsole.log(counter(), counter(), counter());\n\nconst sum = (...nums) => nums.reduce((a, b) => a + b, 0);\nconsole.log(sum(1, 2, 3, 4));`,
      output: `1 2 3\n10`,
      notes: [
        "Arrow functions inherit `this` from where they're defined, not from how they're called.",
        "A closure forms any time an inner function references a variable from its outer function's scope.",
        "Rest parameters (...args) collect extra arguments into an array; spread does the reverse."
      ],
      practice: "Write a debounce(fn, delay) function that returns a new function which only calls fn after delay ms have passed without another call."
    },
    'js-strings': {
      explanation: "Template literals (backtick strings) support multi-line text and ${expression} interpolation directly, replacing older string concatenation with +. Common methods include .includes(), .indexOf(), .replace(), .split(), and .trim(), and the RegExp object or /pattern/ literal enables pattern matching.",
      example: `const name = "EduMind";\nconst msg = \`Welcome to \${name}!\\nStart learning today.\`;\nconsole.log(msg);\nconsole.log("a,b,c".split(",").join(" | "));\nconsole.log(/\\d+/.test("Room 42"));`,
      output: `Welcome to EduMind!\nStart learning today.\na | b | c\ntrue`,
      notes: [
        "Template literals can span multiple lines and embed any JS expression inside ${}.",
        ".replace() only replaces the first match unless you use a regex with the /g (global) flag.",
        ".split(delimiter) turns a string into an array; .join(separator) turns an array back into a string."
      ],
      practice: "Write a function that takes a comma-separated string of names and joins them with 'and' before the last one."
    },
    'js-arrays': {
      explanation: "Arrays support powerful functional methods: .map() transforms each element into a new array, .filter() keeps only elements passing a test, .reduce() folds the array into a single value, and .find()/.some()/.every() search or test elements. Destructuring pulls values out into named variables, and spread (...) expands an array's elements.",
      example: `const nums = [4, 1, 7, 3];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconst total = nums.reduce((sum, n) => sum + n, 0);\nconst [first, second] = nums;\nconsole.log(doubled, evens, total, first, second);`,
      output: `[8, 2, 14, 6] [4] 15 4 1`,
      notes: [
        ".map() and .filter() always return a new array; they never mutate the original.",
        ".reduce()'s second argument is the starting accumulator — without it, the first element becomes the start.",
        "[...array] spreads elements out, handy for copying an array or merging two: [...a, ...b]."
      ],
      practice: "Given an array of order totals, use reduce to compute both the sum and the count of orders over $100 in a single pass."
    },
    'js-objects': {
      explanation: "Objects store key-value pairs and can hold methods. Object.keys(), Object.values(), and Object.entries() extract an object's keys, values, or pairs as arrays, destructuring pulls specific properties into variables, and `this` inside a regular method refers to the object it was called on. JSON.stringify()/JSON.parse() convert between objects and JSON text.",
      example: `const student = { name: "Alice", score: 92, greet() { return \`Hi, I'm \${this.name}\`; } };\nconst { name, score } = student;\nconsole.log(student.greet());\nconsole.log(JSON.stringify({ name, score }));`,
      output: `Hi, I'm Alice\n{"name":"Alice","score":92}`,
      notes: [
        "`this` in a regular (non-arrow) method depends on how the function is called, not where it's defined.",
        "Object.entries() pairs well with for-of: for (const [k, v] of Object.entries(obj)).",
        "JSON.stringify() silently drops functions and undefined values — only plain data survives."
      ],
      practice: "Write a function that takes an object and returns a new object with all its numeric values doubled, using Object.entries and destructuring."
    },
    'js-dom': {
      explanation: "The DOM (Document Object Model) is the browser's live, tree-structured representation of an HTML page, which JavaScript can read and modify. document.querySelector()/querySelectorAll() select elements, .textContent/.innerHTML change content, .style/.classList change appearance, and createElement()/appendChild()/remove() add or remove elements dynamically.",
      example: `const heading = document.querySelector("h1");\nheading.textContent = "Updated by JS";\nheading.style.color = "purple";\n\nconst item = document.createElement("li");\nitem.textContent = "New skill";\ndocument.querySelector("ul").appendChild(item);`,
      output: `The page's h1 text changes to "Updated by JS" in purple, and a new "New skill" list item appears at the end of the ul.`,
      notes: [
        "querySelector returns the first match (or null); querySelectorAll returns all matches.",
        "innerHTML parses raw HTML (risky with untrusted input); textContent inserts plain text safely.",
        "Always check an element exists (isn't null) before calling methods on it."
      ],
      practice: "Build a button that, when clicked, adds a new list item containing the current time to a ul on the page."
    },
    'js-events': {
      explanation: "addEventListener() attaches a handler to an event (click, keydown, submit, etc.) on an element. Events bubble up from the target through its ancestors by default, and event delegation exploits bubbling by attaching one listener to a parent instead of many to individual children. preventDefault() stops a browser's default behavior, like a form actually submitting.",
      example: `document.querySelector("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  console.log("Form intercepted, not submitted");\n});\n\ndocument.querySelector("ul").addEventListener("click", (e) => {\n  if (e.target.tagName === "LI") console.log("Clicked:", e.target.textContent);\n});`,
      output: `Form intercepted, not submitted\n(clicking any li logs its text, even ones added after the listener was set up)`,
      notes: [
        "Event delegation (listening on a parent) automatically handles dynamically added children.",
        "e.preventDefault() stops default behavior; e.stopPropagation() stops the event bubbling further.",
        "The addEventListener third argument { capture: true } listens during the capturing phase instead."
      ],
      practice: "Build a to-do list where clicking any list item toggles a 'completed' class, using one delegated event listener."
    },
    'js-es6': {
      explanation: "ES6 (2015) and later introduced most of modern JavaScript's ergonomics: block-scoped let/const, arrow functions, template literals, destructuring, spread/rest, native classes, Promises, ES modules, and optional chaining (?.) for safely accessing possibly-missing nested properties.",
      example: `const user = { profile: { name: "Alice" } };\nconsole.log(user.profile?.name);\nconsole.log(user.address?.city ?? "No address on file");\n\nclass Person {\n  constructor(name) { this.name = name; }\n  greet() { return \`Hi, \${this.name}\`; }\n}\nconsole.log(new Person("Bob").greet());`,
      output: `Alice\nNo address on file\nHi, Bob`,
      notes: [
        "?. (optional chaining) returns undefined instead of throwing if a property in the chain doesn't exist.",
        "?? (nullish coalescing) falls back only for null/undefined, unlike || which also falls back for 0 or ''.",
        "Classes are syntactic sugar over JavaScript's existing prototype-based inheritance."
      ],
      practice: "Refactor an object with deeply nested, possibly-missing properties to safely read a value using ?. and ??."
    },
    'js-async': {
      explanation: "Asynchronous JavaScript lets long-running operations (like network requests) happen without blocking the rest of the program. Promises represent a value that will resolve or reject in the future, and async/await lets you write Promise-based code that reads like synchronous code, with try/catch for error handling.",
      example: `async function getUser() {\n  try {\n    const res = await fetch("https://api.example.com/user/1");\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    console.log(await res.json());\n  } catch (err) {\n    console.error("Failed to load user:", err.message);\n  }\n}\ngetUser();`,
      output: `Logs the parsed JSON user object on success, or "Failed to load user: ..." if the request fails.`,
      notes: [
        "await only works inside an async function (or at the top level of modern module files).",
        "fetch() doesn't reject on HTTP error statuses like 404 — you must check res.ok yourself.",
        "Wrap await calls in try/catch to handle network failures and rejected promises gracefully."
      ],
      practice: "Write an async function that fetches posts from https://jsonplaceholder.typicode.com/posts and logs just the first three titles."
    },
    'js-browser-apis': {
      explanation: "Browser APIs give JavaScript access to device and browser features. localStorage persists key-value string data across sessions until cleared, sessionStorage clears when the tab closes, cookies are sent with every HTTP request (often used for auth), and APIs like Geolocation, Clipboard, and Notification require explicit user permission.",
      example: `localStorage.setItem("theme", "dark");\nconsole.log(localStorage.getItem("theme"));\n\nnavigator.clipboard.writeText("Copied from EduMind!")\n  .then(() => console.log("Copied to clipboard"));`,
      output: `dark\nCopied to clipboard`,
      notes: [
        "localStorage and sessionStorage only store strings — use JSON.stringify()/JSON.parse() for objects.",
        "localStorage has no expiration and persists until explicitly cleared; cookies can have an expiry date.",
        "Permission-gated APIs (geolocation, notifications, clipboard) return Promises and can be denied by the user."
      ],
      practice: "Build a settings panel that saves a chosen theme to localStorage and reapplies it on page reload."
    },
    'js-modules': {
      explanation: "ES modules split code across files using export (to expose something) and import (to use it elsewhere). A file can have one default export (imported without curly braces) and many named exports (imported with curly braces matching the export name), and bundlers like Vite or Webpack combine modules into optimized files for the browser.",
      example: `// mathUtils.js\nexport const square = x => x * x;\nexport default function cube(x) { return x ** 3; }\n\n// main.js\nimport cube, { square } from './mathUtils.js';\nconsole.log(square(4), cube(3));`,
      output: `16 27`,
      notes: [
        "A file can have many named exports but only one default export.",
        "Import names for named exports must match the export names (or use `as` to rename them).",
        "Browsers need <script type=\"module\"> to use import/export directly without a bundler."
      ],
      practice: "Split a calculator's add/subtract/multiply/divide functions into a separate module file and import them into a main script."
    },
    'js-oop': {
      explanation: "JavaScript classes (constructor, methods, extends for inheritance) are syntax over its underlying prototype system — every object has a hidden link to a prototype it inherits methods from. extends and super() implement inheritance, letting a subclass reuse and override a parent class's behavior, which is polymorphism in action.",
      example: `class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return \`\${this.name} makes a sound\`; }\n}\nclass Dog extends Animal {\n  speak() { return \`\${this.name} barks\`; }\n}\nfor (const a of [new Animal("Generic"), new Dog("Rex")]) {\n  console.log(a.speak());\n}`,
      output: `Generic makes a sound\nRex barks`,
      notes: [
        "super() in a subclass constructor must be called before using `this`.",
        "Every object's prototype chain ends at Object.prototype, which is why all objects share methods like .toString().",
        "Overriding a method in a subclass, as Dog.speak does, demonstrates polymorphism."
      ],
      practice: "Create a Shape base class with an area() method and Circle/Rectangle subclasses that override it, then print each area from a list of instances."
    },
    'js-error-handling': {
      explanation: "try/catch catches runtime errors so they don't crash the program, finally runs regardless of whether an error occurred, and throw lets you raise your own errors — including custom error classes that extend the built-in Error class for more specific error types.",
      example: `class ValidationError extends Error {\n  constructor(message) { super(message); this.name = "ValidationError"; }\n}\nfunction checkAge(age) {\n  if (age < 0) throw new ValidationError("Age can't be negative");\n  return age;\n}\ntry {\n  checkAge(-5);\n} catch (err) {\n  console.error(\`\${err.name}: \${err.message}\`);\n} finally {\n  console.log("Validation attempt finished");\n}`,
      output: `ValidationError: Age can't be negative\nValidation attempt finished`,
      notes: [
        "Custom error classes should extend Error and call super(message) to inherit .message and .stack.",
        "finally always runs, making it useful for cleanup regardless of success or failure.",
        "Prefer catching specific, expected errors over a blanket catch that hides bugs."
      ],
      practice: "Write a parseJSON(str) function that wraps JSON.parse in try/catch and throws a custom InvalidJSONError with a helpful message on failure."
    },
    'js-advanced': {
      explanation: "Hoisting moves function and var declarations (not their values) to the top of their scope before code runs, the call stack tracks in-progress function calls, and the event loop lets JavaScript handle async callbacks without blocking, by processing them once the call stack is empty. Debouncing delays a function until input stops; throttling limits how often it can run.",
      example: `console.log(typeof hoisted);\nvar hoisted = "I'm hoisted";\n\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}`,
      output: `undefined`,
      notes: [
        "var declarations are hoisted and initialized to undefined; let/const stay in a 'temporal dead zone' until assigned.",
        "The event loop only processes the next callback once the call stack is completely empty — that's why setTimeout(fn, 0) still waits.",
        "Debouncing resets a timer on every call (fires once after input stops); throttling guarantees at most one call per interval."
      ],
      practice: "Implement a throttle(fn, interval) function and test it against rapid scroll or mousemove events, logging at most once per interval."
    },
    'js-api-integration': {
      explanation: "REST APIs expose resources over HTTP using conventional methods — GET to read, POST to create, PUT/PATCH to update, DELETE to remove. fetch() (built-in) or axios (a popular library with automatic JSON parsing) send these requests, and authenticated APIs typically require a token, often a JWT, sent in the Authorization header.",
      example: `async function createPost(title) {\n  const res = await fetch("https://api.example.com/posts", {\n    method: "POST",\n    headers: {\n      "Content-Type": "application/json",\n      Authorization: \`Bearer \${localStorage.getItem("token")}\`\n    },\n    body: JSON.stringify({ title })\n  });\n  if (!res.ok) throw new Error(\`Failed: \${res.status}\`);\n  return res.json();\n}`,
      output: `Resolves with the newly created post object on success, or throws an Error for a failed request (e.g. 401 or 500).`,
      notes: [
        "REST conventions: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).",
        "A JWT (JSON Web Token) is a signed token proving identity, typically sent as Authorization: Bearer <token>.",
        "Always check res.ok or res.status — fetch only rejects on network failure, not on HTTP error responses."
      ],
      practice: "Build GET, POST, and DELETE functions against https://jsonplaceholder.typicode.com, each with proper error handling."
    },
    'js-projects': {
      explanation: "Building complete small projects is where individual concepts — DOM manipulation, events, arrays, async fetch — come together into something real. A to-do app, for example, touches state management (the task list), persistence (localStorage), rendering (updating the DOM from that state), and user interaction (events).",
      example: `let tasks = [];\nfunction addTask(text) {\n  tasks.push({ text, done: false });\n  render();\n}\nfunction render() {\n  document.querySelector("#list").innerHTML =\n    tasks.map(t => \`<li>\${t.done ? '✅' : '⬜'} \${t.text}</li>\`).join('');\n}\naddTask("Learn JavaScript");`,
      output: `Adds a task to the tasks array and re-renders the list, showing "⬜ Learn JavaScript".`,
      notes: [
        "Separate your data (state) from your rendering logic (turning state into DOM) — it scales far better.",
        "Persist state to localStorage after every change so a page refresh doesn't lose the user's data.",
        "Start with the smallest working version, then layer on features like delete and mark-complete."
      ],
      practice: "Extend the to-do example with delete and toggle-complete functionality, and persist the tasks array to localStorage."
    },
    'js-interview': {
      explanation: "JavaScript interviews commonly test output-prediction questions (closures, hoisting, this binding), practical coding problems (array manipulation, string parsing), and scenario questions about real-world tradeoffs like debouncing a search input or handling race conditions in async code.",
      example: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// Classic interview question: what does this log, and why?`,
      output: `3\n3\n3   (var is function-scoped, so all three callbacks share the same i; using let instead would log 0, 1, 2)`,
      notes: [
        "This var/let-in-loops question is one of the most common JS interview questions — know the reasoning, not just the answer.",
        "Be ready to explain event loop order: synchronous code, then microtasks (Promises), then macrotasks (setTimeout).",
        "Practice explaining time and space complexity for any coding question, not just getting it to pass."
      ],
      practice: "Predict the output of the var/setTimeout example above, then rewrite it with let and explain why the result changes."
    },
    'js-references': {
      explanation: "Good JavaScript habits include preferring const by default, using strict equality, avoiding global variables, and keeping functions small and focused. MDN is the canonical documentation source, ESLint enforces coding standards automatically, and Prettier handles consistent formatting.",
      example: `const MAX_RETRIES = 3;\nfunction isValidEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}`,
      output: `A reusable, testable helper function following common conventions (descriptive names, single responsibility, const over let).`,
      notes: [
        "MDN (developer.mozilla.org) is the most reliable JavaScript and web API reference — bookmark it.",
        "ESLint catches bugs and enforces style rules automatically; Prettier auto-formats code consistently.",
        "Favor small, pure functions (no side effects, same input always gives same output) — they're easier to test."
      ],
      practice: "Install ESLint in a small project with the recommended config, and fix every warning it reports on an existing file."
    }
  },
  react: {
    'react-intro': {
      explanation: "React is a JavaScript library for building user interfaces out of reusable components, developed by Meta. It uses a virtual DOM to efficiently update only the parts of the page that actually changed rather than the whole page, and its declarative style means you describe what the UI should look like for a given state rather than manually manipulating the DOM.",
      example: `function App() {\n  return <h1>Hello, EduMind!</h1>;\n}\nexport default App;`,
      output: `Renders a page showing "Hello, EduMind!"`,
      notes: [
        "React apps are typically built with a tool like Vite, which handles JSX compilation and bundling.",
        "Unlike jQuery-style DOM manipulation, React re-renders components declaratively based on state changes.",
        "React is a library (just the view layer), not a full framework — routing/state management are often separate libraries."
      ],
      practice: "Set up a new React project with `npm create vite@latest my-app -- --template react` and display your name in place of the default page."
    },
    'react-jsx': {
      explanation: "JSX is a syntax extension that lets you write HTML-like markup directly in JavaScript, compiled into React.createElement() calls under the hood. Any JavaScript expression can be embedded inside curly braces {}, and JSX attributes use camelCase (className, onClick) since they map to JavaScript, not raw HTML.",
      example: `function Greeting({ name }) {\n  const hour = new Date().getHours();\n  return <h1 className="title">{hour < 12 ? "Good morning" : "Hello"}, {name}!</h1>;\n}`,
      output: `Renders "Good morning, EduMind!" or "Hello, EduMind!" depending on the time of day, styled by the 'title' class.`,
      notes: [
        "JSX must return a single root element (or a Fragment <>...</>) — you can't return two sibling elements directly.",
        "Use className instead of class, and htmlFor instead of for, since class and for are reserved JS words.",
        "Any valid JS expression works inside {}, but statements like if or for don't — use ternaries or array methods instead."
      ],
      practice: "Build a component that takes a score prop and conditionally renders 'Pass' or 'Fail' using a ternary inside the JSX."
    },
    'react-components': {
      explanation: "Functional components (plain JS functions returning JSX) are the modern standard in React, largely replacing class components. Components are meant to be reusable and composable — small, focused components combine to build larger UIs, similar to how HTML elements nest.",
      example: `function Avatar({ src, name }) {\n  return <img src={src} alt={name} className="avatar" />;\n}\nfunction UserCard({ user }) {\n  return (\n    <div className="card">\n      <Avatar src={user.avatar} name={user.name} />\n      <h3>{user.name}</h3>\n    </div>\n  );\n}`,
      output: `Renders a card containing a circular avatar image and the user's name beneath it.`,
      notes: [
        "Functional components with Hooks (useState, useEffect) can do everything class components can, with less boilerplate.",
        "Component names must start with a capital letter, or React treats them as HTML tags instead of components.",
        "Composition (nesting components like <Avatar> inside <UserCard>) is preferred over inheritance in React."
      ],
      practice: "Break a large 'profile page' component into three smaller ones — Avatar, UserInfo, UserStats — and compose them inside a ProfilePage."
    },
    'react-props': {
      explanation: "Props (short for properties) are how a parent passes data down to a child component, similar to function arguments — read-only from the child's perspective. The special `children` prop holds whatever is nested between a component's tags, and 'prop drilling' describes passing a prop through several layers that don't need it themselves, just to reach a deeply nested one.",
      example: `function Button({ label = "Click me", onClick, children }) {\n  return <button onClick={onClick}>{children || label}</button>;\n}\nfunction App() {\n  return <Button onClick={() => alert("Hi!")}>Say Hello</Button>;\n}`,
      output: `Renders a button labeled "Say Hello" that alerts "Hi!" when clicked.`,
      notes: [
        "Props flow one direction: parent to child. A child can't directly modify props it receives.",
        "Default values can be set with destructuring defaults: function Button({ label = \"Click me\" }).",
        "Deep prop drilling is often a sign you should use Context or a state management library instead."
      ],
      practice: "Build a reusable Card component that accepts a title prop and renders whatever children are passed inside it."
    },
    'react-state': {
      explanation: "State is data that changes over time and belongs to a specific component, managed with the useState Hook, which returns the current value and a setter function. Unlike props (read-only, passed from a parent), state is owned and updated by the component itself, and calling the setter triggers a re-render with the new value.",
      example: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}`,
      output: `Renders a button that starts at "Clicked 0 times" and increments by 1 on every click.`,
      notes: [
        "Never mutate state directly (count++) — always call the setter function (setCount(count + 1)).",
        "When updating based on the previous value, use the functional form: setCount(prev => prev + 1).",
        "State updates are asynchronous and batched — reading the variable right after calling its setter won't show the new value yet."
      ],
      practice: "Build a like button that toggles a filled/outline heart icon and increments a like count only when liked, not un-liked."
    },
    'react-events': {
      explanation: "React wraps native browser events in a SyntheticEvent for consistent behavior, and you attach handlers directly in JSX using camelCase props like onClick, onChange, and onKeyDown. Handlers receive the event object as their first argument, giving access to things like e.target.value for form inputs.",
      example: `function SearchBox() {\n  const [query, setQuery] = useState("");\n  const handleKeyDown = (e) => {\n    if (e.key === "Enter") console.log("Searching for:", query);\n  };\n  return (\n    <input\n      value={query}\n      onChange={(e) => setQuery(e.target.value)}\n      onKeyDown={handleKeyDown}\n    />\n  );\n}`,
      output: `Updates query as the user types, and logs "Searching for: <text>" when Enter is pressed.`,
      notes: [
        "e.target.value reads the current value of an input inside an onChange handler.",
        "To pass arguments to a handler, wrap it in an arrow function: onClick={() => handleDelete(id)}.",
        "React's SyntheticEvent normalizes behavior, but e.preventDefault() and e.stopPropagation() still work as usual."
      ],
      practice: "Build a form input that only submits when Enter is pressed and the input isn't empty, showing an error message otherwise."
    },
    'react-conditional': {
      explanation: "Conditional rendering in React uses plain JavaScript — an if statement before the return, a ternary inline in JSX for two options, or && for rendering something only when a condition is true, since false/null/undefined render nothing.",
      example: `function StatusBadge({ isOnline }) {\n  return (\n    <div>\n      {isOnline ? <span className="online">🟢 Online</span> : <span className="offline">⚪ Offline</span>}\n      {isOnline && <p>Active now</p>}\n    </div>\n  );\n}`,
      output: `Shows a green "Online" badge and "Active now" text when isOnline is true; otherwise a gray "Offline" badge with no extra text.`,
      notes: [
        "{condition && <Component />} only renders when condition is truthy — watch out for 0, which renders as the literal '0'.",
        "For 3+ branches, an if/else block above the return (or a lookup object) reads better than nested ternaries.",
        "Returning null from a component renders nothing at all — a valid, common way to conditionally hide something."
      ],
      practice: "Build a component that shows a loading spinner, an error message, or the actual data, based on loading/error/data props."
    },
    'react-lists': {
      explanation: "Lists are rendered by mapping an array to an array of JSX elements with .map(), and each resulting element needs a unique key prop so React can efficiently track which items changed, were added, or removed between renders. Filtering with .filter() before mapping is a common pattern for search or category views.",
      example: `function SkillList({ skills, query }) {\n  const visible = skills.filter(s => s.toLowerCase().includes(query.toLowerCase()));\n  return (\n    <ul>\n      {visible.map(skill => <li key={skill}>{skill}</li>)}\n    </ul>\n  );\n}`,
      output: `Renders only the skills whose name includes the search query, each as a separate list item.`,
      notes: [
        "Keys should be stable and unique (like a database id), not the array index, especially if the list can reorder.",
        "Using array index as a key can cause subtle bugs when items are inserted, removed, or reordered.",
        ".filter().map() is a common chained pattern: narrow the data first, then render what's left."
      ],
      practice: "Build a searchable list of skills that filters as the user types into a search box, using a stable key for each item."
    },
    'react-forms': {
      explanation: "A controlled component ties an input's value directly to React state via value and onChange, making React the 'single source of truth' for the value. An uncontrolled component instead reads its value from the DOM via a ref, which is simpler for basic cases but gives React less visibility into the current value.",
      example: `function SignupForm() {\n  const [email, setEmail] = useState("");\n  const [error, setError] = useState("");\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    if (!email.includes("@")) { setError("Enter a valid email"); return; }\n    setError("");\n    console.log("Submitting:", email);\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={email} onChange={(e) => setEmail(e.target.value)} />\n      {error && <p className="error">{error}</p>}\n      <button type="submit">Sign up</button>\n    </form>\n  );\n}`,
      output: `Shows "Enter a valid email" if submitted without an '@' in the email; otherwise logs "Submitting: <email>".`,
      notes: [
        "Controlled components make validation and conditional UI (like disabling submit) straightforward.",
        "Always call e.preventDefault() in onSubmit, or the browser reloads the page on submission.",
        "Use refs (useRef) for uncontrolled inputs when you only need the value on submit, not on every keystroke."
      ],
      practice: "Build a signup form with email and password fields that shows a validation error if the password is under 8 characters."
    },
    'react-hooks': {
      explanation: "Hooks let functional components use state and other React features. useState manages local state, useEffect runs side effects in response to renders, useContext reads shared context, useReducer manages complex state transitions, useRef holds a mutable value that doesn't trigger re-renders, useMemo/useCallback memoize expensive calculations or functions, and custom Hooks extract reusable stateful logic into your own functions.",
      example: `function useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener("resize", handleResize);\n    return () => window.removeEventListener("resize", handleResize);\n  }, []);\n  return width;\n}`,
      output: `Returns the current window width, and re-renders the component using it whenever the window is resized.`,
      notes: [
        "useEffect's dependency array ([]) controls when it re-runs — empty means only once, on mount.",
        "Always return a cleanup function from useEffect for anything you subscribe to (event listeners, timers, sockets).",
        "Custom Hooks are just regular functions whose name starts with 'use' and that call other Hooks inside them."
      ],
      practice: "Write a custom useLocalStorage(key, initialValue) Hook that behaves like useState but persists its value to localStorage."
    },
    'react-styling': {
      explanation: "React components can be styled with plain CSS files, CSS Modules (auto-scoped class names to avoid collisions), utility-first frameworks like Tailwind CSS, component libraries like Bootstrap or Material UI, or CSS-in-JS libraries like styled-components that write CSS directly inside JavaScript.",
      example: `function Button({ children }) {\n  return (\n    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">\n      {children}\n    </button>\n  );\n}`,
      output: `A blue, rounded button with white text that darkens slightly on hover, styled entirely through Tailwind utility classes.`,
      notes: [
        "CSS Modules (Button.module.css) generate unique class names automatically, preventing global style collisions.",
        "Tailwind trades writing custom CSS for composing small utility classes directly in your JSX.",
        "styled-components lets you write real CSS inside a JS template literal, scoped automatically to the component."
      ],
      practice: "Style the same button three ways — plain CSS, Tailwind classes, and styled-components — and compare the developer experience."
    },
    'react-router': {
      explanation: "React Router adds client-side routing, letting different URLs render different components without a full page reload. <BrowserRouter> wraps the app, <Routes>/<Route> define which component renders for each path, route parameters (like :id) capture dynamic URL segments, and useNavigate()/<Link> handle navigation.",
      example: `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";\n\nfunction SkillPage() {\n  const { skillName } = useParams();\n  return <h1>Learning: {skillName}</h1>;\n}\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Link to="/skill/python">Go to Python</Link>\n      <Routes>\n        <Route path="/skill/:skillName" element={<SkillPage />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}`,
      output: `Clicking the link navigates to /skill/python and renders "Learning: python" without a full page reload.`,
      notes: [
        "useParams() reads dynamic segments (like :skillName) from the current URL.",
        "<Link> should be used instead of <a> for internal navigation, since it avoids a full page reload.",
        "Nested <Route> elements render inside a parent route's <Outlet />, useful for shared layouts."
      ],
      practice: "Add a route with a dynamic :id parameter that displays a different skill's details based on the URL, plus a navigation link for each skill."
    },
    'react-api': {
      explanation: "Fetching data in React typically happens inside useEffect on mount, tracked with loading/error/data state so the UI can show a spinner, an error message, or the actual content at the right time. axios is a popular alternative to fetch with automatic JSON parsing.",
      example: `function SkillsList() {\n  const [skills, setSkills] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetch("/api/skills")\n      .then(res => res.json())\n      .then(setSkills)\n      .catch(() => setError("Failed to load skills"))\n      .finally(() => setLoading(false));\n  }, []);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>{error}</p>;\n  return <ul>{skills.map(s => <li key={s.id}>{s.name}</li>)}</ul>;\n}`,
      output: `Shows "Loading..." briefly, then either the list of skills or "Failed to load skills" depending on the outcome.`,
      notes: [
        "The empty dependency array ([]) in useEffect means this fetch runs once, when the component first mounts.",
        "Always handle all three states explicitly — loading, error, and success — for a good user experience.",
        "For requests triggered by user actions (not on mount), call the fetch inside an event handler instead of useEffect."
      ],
      practice: "Build a component that fetches a list of posts and shows a retry button when the fetch fails."
    },
    'react-context': {
      explanation: "Context lets you share data (like a theme or logged-in user) across many components without manually passing props through every level in between. You create it with createContext(), wrap the relevant part of the tree with a Provider, and read it in any descendant with useContext().",
      example: `const ThemeContext = createContext("light");\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Click me</button>;\n}\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <ThemedButton />\n    </ThemeContext.Provider>\n  );\n}`,
      output: `Renders a button with className "dark", read from context rather than passed as a prop.`,
      notes: [
        "Context is best for genuinely global-to-a-subtree data (theme, auth, locale) — not a replacement for all prop passing.",
        "Every component reading context re-renders when the Provider's value changes, which can affect performance in large trees.",
        "For complex global state with many updates, a state library (Redux, Zustand) often scales better than plain Context."
      ],
      practice: "Build a ThemeContext with a toggle function, and let any component switch the app between light and dark mode."
    },
    'react-redux': {
      explanation: "Redux centralizes an app's state in a single store, updated only through dispatched actions handled by pure reducer functions that return a new state. Redux Toolkit is the modern, official way to use Redux — it reduces boilerplate with createSlice, which generates action creators and reducers together.",
      example: `const counterSlice = createSlice({\n  name: "counter",\n  initialState: { value: 0 },\n  reducers: {\n    increment: (state) => { state.value += 1; }\n  }\n});\n\nfunction Counter() {\n  const count = useSelector(state => state.counter.value);\n  const dispatch = useDispatch();\n  return <button onClick={() => dispatch(counterSlice.actions.increment())}>{count}</button>;\n}`,
      output: `Renders a button showing the current count, which increments by 1 each click, updating the global store.`,
      notes: [
        "Redux Toolkit's createSlice lets you 'mutate' state directly inside reducers — it uses Immer under the hood to stay immutable.",
        "useSelector reads a slice of state and re-renders the component only when that specific slice changes.",
        "Reducers must be pure functions — no side effects, no API calls, no randomness."
      ],
      practice: "Build a Redux Toolkit slice for a shopping cart with addItem and removeItem actions, connected via useSelector/useDispatch."
    },
    'react-performance': {
      explanation: "React.memo skips re-rendering a component if its props haven't changed, useMemo caches an expensive calculation between renders, and useCallback caches a function reference so child components don't re-render unnecessarily. React.lazy() with code splitting loads parts of the app only when needed, reducing initial bundle size.",
      example: `const ExpensiveList = React.memo(function ExpensiveList({ items }) {\n  console.log("Rendering list");\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n});\n\nconst LazyDashboard = React.lazy(() => import("./Dashboard"));`,
      output: `"Rendering list" only logs when the items prop actually changes; Dashboard's code loads only when it's rendered.`,
      notes: [
        "React.memo only helps if a component actually re-renders often with the same props — profile before wrapping everything.",
        "useMemo and useCallback trade CPU cycles now for avoiding wasted renders later.",
        "Wrap React.lazy() components in a <Suspense fallback={...}> to show a loading state while the code chunk downloads."
      ],
      practice: "Wrap an expensive list component in React.memo and verify with console.log that it stops re-rendering when a sibling's unrelated state changes."
    },
    'react-auth': {
      explanation: "A typical React auth flow sends login credentials to a server, receives a JWT back, stores it, and attaches it to subsequent API requests in the Authorization header. Protected routes check whether a valid token/user exists before rendering a page, redirecting to login otherwise.",
      example: `function ProtectedRoute({ children }) {\n  const token = localStorage.getItem("token");\n  return token ? children : <Navigate to="/login" />;\n}\n\nasync function login(email, password) {\n  const res = await fetch("/api/login", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ email, password })\n  });\n  const { token } = await res.json();\n  localStorage.setItem("token", token);\n}`,
      output: `On successful login, the JWT is saved to localStorage; ProtectedRoute renders its children only if a token exists, otherwise redirects to /login.`,
      notes: [
        "Storing JWTs in localStorage is common but vulnerable to XSS; httpOnly cookies are more secure for sensitive apps.",
        "Always verify tokens on the server for protected API routes too — client-side route protection alone isn't real security.",
        "Clear the stored token and redirect on logout, and consider expiring/refreshing tokens for long sessions."
      ],
      practice: "Build a ProtectedRoute wrapper that redirects unauthenticated users to login, and a logout button that clears the token."
    },
    'react-testing': {
      explanation: "Jest is the test runner (assertions, mocking, running tests), and React Testing Library renders components in a simulated DOM and encourages testing them the way a user would interact with them — finding elements by visible text or role rather than internal implementation details.",
      example: `import { render, screen, fireEvent } from "@testing-library/react";\n\ntest("increments counter on click", () => {\n  render(<Counter />);\n  const button = screen.getByRole("button");\n  fireEvent.click(button);\n  expect(screen.getByText("Clicked 1 times")).toBeInTheDocument();\n});`,
      output: `1 passed, 0 failed  (the test confirms clicking the button updates the displayed count)`,
      notes: [
        "Testing Library encourages queries like getByRole and getByText over selecting by CSS class or test id when possible.",
        "fireEvent (or the more realistic userEvent) simulates real user interactions like clicks and typing.",
        "Good component tests assert on what the user sees, not on internal state or implementation details."
      ],
      practice: "Write a test that renders the SignupForm and confirms an error message appears when submitted with an invalid email."
    },
    'react-projects': {
      explanation: "Building complete projects is where component composition, state, effects, routing, and API calls come together. A weather app, for instance, combines a form (city input), an API call (useEffect + fetch), conditional rendering, and styling into one cohesive experience.",
      example: `function WeatherApp() {\n  const [city, setCity] = useState("");\n  const [weather, setWeather] = useState(null);\n\n  const handleSearch = async () => {\n    const res = await fetch(\`/api/weather?city=\${city}\`);\n    setWeather(await res.json());\n  };\n\n  return (\n    <div>\n      <input value={city} onChange={e => setCity(e.target.value)} />\n      <button onClick={handleSearch}>Search</button>\n      {weather && <p>{weather.temp}°C in {city}</p>}\n    </div>\n  );\n}`,
      output: `After typing a city and clicking Search, displays that city's temperature once the API responds.`,
      notes: [
        "Plan a project's component tree and state shape on paper before writing code — it prevents a lot of refactoring later.",
        "Reuse pieces across projects (a Button, a Card, a LoadingSpinner) instead of rebuilding basics each time.",
        "Deploy early, even a rough version — seeing a project live is motivating and catches deployment issues sooner."
      ],
      practice: "Extend the weather app with a loading state, error handling for an invalid city, and a search history of the last 5 cities."
    },
    'react-deployment': {
      explanation: "Deploying a React app starts with a production build (npm run build), which outputs optimized static files any static host can serve. Vercel and Netlify offer free tiers with automatic deployments from a GitHub repo, and environment variables (like API URLs) are injected at build time, needing a specific prefix (VITE_ for Vite) to be accessible in client code.",
      example: `# Build for production\nnpm run build\n\n# Deploy the /dist (Vite) folder to Vercel or Netlify,\n# or push it to a gh-pages branch for GitHub Pages`,
      output: `Produces a dist/ folder of static HTML/CSS/JS ready to upload to any static hosting provider.`,
      notes: [
        "Environment variables meant for the browser must use a specific prefix (VITE_ for Vite, REACT_APP_ for CRA) — never put secrets there.",
        "Vercel and Netlify auto-deploy on every push to your connected GitHub branch, giving you a preview URL per pull request.",
        "For client-side routing (React Router) to work on refresh, the host needs a rewrite rule sending all paths to index.html."
      ],
      practice: "Deploy a small React app to Vercel or Netlify connected to a GitHub repo, and confirm it auto-redeploys after a new commit."
    },
    'react-interview': {
      explanation: "React interviews often probe the virtual DOM and reconciliation, why keys matter in lists, the Rules of Hooks (only call them at the top level, not inside loops/conditions), and practical scenarios like preventing unnecessary re-renders or lifting state up between sibling components.",
      example: `// Classic interview question: what's wrong with this?\nfunction Bad() {\n  const [show, setShow] = useState(true);\n  if (show) {\n    const [count, setCount] = useState(0); // conditional Hook call\n  }\n  return null;\n}`,
      output: `This violates the Rules of Hooks — Hooks must be called unconditionally, in the same order, on every render.`,
      notes: [
        "Hooks must always run in the same order on every render — never call them inside if statements, loops, or nested functions.",
        "'Lifting state up' means moving shared state to the closest common ancestor of the components that need it.",
        "Be ready to explain reconciliation: React compares the new virtual DOM tree to the previous one and updates only what changed."
      ],
      practice: "Explain out loud why the Bad component above breaks the Rules of Hooks, then rewrite it correctly."
    },
    'react-references': {
      explanation: "react.dev is the official, up-to-date documentation and the best first stop for anything React-related. Best practices include keeping components small and focused, colocating state as close as possible to where it's used, and avoiding common mistakes like mutating state directly or using array indices as keys.",
      example: `// Quick reference\nuseState(initial)        // local component state\nuseEffect(fn, [deps])    // side effects tied to dependency changes\nuseContext(Context)      // read shared context\nkey={uniqueId}           // required on list items, not index\nReact.memo(Component)    // skip re-render if props are unchanged`,
      output: `(This is a reference snippet, not something you run for output.)`,
      notes: [
        "react.dev's official docs include an interactive 'Thinking in React' guide worth reading start to finish.",
        "Common mistakes: mutating state directly, missing keys in lists, and forgetting useEffect cleanup for subscriptions.",
        "Popular companion libraries: React Router (routing), Redux Toolkit or Zustand (state), React Query (server-state/caching)."
      ],
      practice: "Review one of your own components against this checklist and fix any mistakes you find — mutated state, missing keys, or missing effect cleanup."
    }
  },
  typescript: {
    types: {
      explanation: "TypeScript adds static types on top of JavaScript, letting you annotate variables, parameters, and return values with types like string, number, arrays (string[]), and custom object shapes via interfaces, catching type errors at compile time instead of at runtime.",
      example: `interface User {\n  name: string;\n  age: number;\n}\nfunction greet(user: User): string {\n  return \`Hello, \${user.name}\`;\n}\nconsole.log(greet({ name: "Alice", age: 21 }));`,
      output: `Hello, Alice`,
      notes: [
        "TypeScript is a superset of JavaScript — any valid JS is valid TS, with types added on top.",
        "interface and type both describe object shapes; type can also alias unions and primitives.",
        "Type errors are caught at compile time (tsc) — they never affect the actual runtime JavaScript output."
      ],
      practice: "Define an interface for a Product (id, name, price) and write a fully-typed function that calculates total price for an array of products."
    },
    tsconfig: {
      explanation: "tsconfig.json configures how the TypeScript compiler behaves — target (which JS version to compile down to), strict mode (enables the full set of type-checking rules), and module resolution settings. Editors and linters use this file to give real-time type-checking feedback as you write code.",
      example: `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "strict": true,\n    "module": "ESNext",\n    "outDir": "./dist"\n  }\n}`,
      output: `Configures the compiler to output modern ES2020 JavaScript with strict type checks into a dist/ folder.`,
      notes: [
        "strict: true turns on multiple checks at once (noImplicitAny, strictNullChecks, etc.) — recommended for new projects.",
        "target controls which JS features get compiled down vs left as-is, based on your minimum supported environment.",
        "Run tsc --noEmit to type-check a project without generating output files, often used in CI."
      ],
      practice: "Create a tsconfig.json with strict mode enabled, then intentionally write a function with a type error and observe the compiler catch it."
    },
    advanced: {
      explanation: "Generics let you write reusable functions or types that work with multiple types while preserving type safety. Union types (string | number) allow a value to be one of several types, and utility types like Pick<T> and Omit<T> transform existing types without rewriting them.",
      example: `function firstItem<T>(items: T[]): T | undefined {\n  return items[0];\n}\nconsole.log(firstItem([1, 2, 3]));\n\ntype User = { id: number; name: string; email: string };\ntype UserPreview = Pick<User, "id" | "name">;`,
      output: `1`,
      notes: [
        "Generics (<T>) let one function or type work correctly across many types without using `any`.",
        "Union types (A | B) require narrowing (typeof checks, etc.) before you can use type-specific properties.",
        "Pick<T, Keys> selects a subset of properties from a type; Omit<T, Keys> does the opposite, excluding them."
      ],
      practice: "Write a generic function pluck<T, K extends keyof T>(items: T[], key: K) that extracts one property from every object in an array."
    }
  },
  java: {
    syntax: {
      explanation: "Java is a statically-typed, compiled language where every variable's type is declared explicitly, and code lives inside classes even for a program's entry point (public static void main). Java compiles to bytecode that runs on the JVM, making it 'write once, run anywhere.'",
      example: `public class Main {\n    public static void main(String[] args) {\n        int age = 21;\n        String name = "EduMind";\n        System.out.println(name + " is " + age + " years old");\n    }\n}`,
      output: `EduMind is 21 years old`,
      notes: [
        "Every Java file's public class name must match the filename exactly (Main.java for class Main).",
        "main(String[] args) is the fixed entry point signature the JVM looks for when running a program.",
        "Java is statically typed — a variable's type is fixed at declaration and checked at compile time."
      ],
      practice: "Write a Java program that declares variables for a name, age, and GPA, then prints a formatted summary sentence."
    },
    oop: {
      explanation: "Java is fundamentally object-oriented — classes define objects with fields and methods, constructors initialize new objects, and extends implements inheritance so a subclass can reuse and override a parent's behavior. Access modifiers (private, public, protected) control encapsulation.",
      example: `class Animal {\n    protected String name;\n    Animal(String name) { this.name = name; }\n    String speak() { return name + " makes a sound"; }\n}\nclass Dog extends Animal {\n    Dog(String name) { super(name); }\n    @Override\n    String speak() { return name + " barks"; }\n}`,
      output: `Creating new Dog("Rex").speak() returns "Rex barks", overriding the parent's generic speak() method.`,
      notes: [
        "super(name) calls the parent class's constructor and must be the first statement in a subclass constructor.",
        "@Override is optional but recommended — it makes the compiler verify you're actually overriding a parent method.",
        "private fields are only accessible within the class itself; use public getter/setter methods to expose them safely."
      ],
      practice: "Create a Shape class with an abstract area() method, and Circle/Rectangle subclasses that implement it differently."
    },
    collections: {
      explanation: "Java's Collections Framework provides ready-made data structures: ArrayList (a resizable array), HashMap (key-value pairs), and HashSet (unique elements), all working with generics for type safety. These are far more flexible than raw arrays, since they can grow, shrink, and offer many built-in methods.",
      example: `import java.util.*;\n\nList<String> skills = new ArrayList<>();\nskills.add("Java");\nskills.add("Python");\n\nMap<String, Integer> scores = new HashMap<>();\nscores.put("Alice", 92);\n\nSystem.out.println(skills);\nSystem.out.println(scores.get("Alice"));`,
      output: `[Java, Python]\n92`,
      notes: [
        "ArrayList grows automatically as you add elements, unlike a fixed-size array.",
        "HashMap.get() returns null if a key doesn't exist — check with containsKey() or use getOrDefault().",
        "Generics (<String>, <String, Integer>) enforce type safety, preventing you from adding the wrong type."
      ],
      practice: "Build a HashMap that counts how many times each word appears in a sentence, splitting it with String.split()."
    }
  },
  c: {
    basics: {
      explanation: "C is a low-level, compiled, statically-typed language where you manage memory manually and every variable must be declared with an explicit type before use. Programs are compiled (with gcc, for example) into a binary before running, and a C program's entry point is always the main() function.",
      example: `#include <stdio.h>\n\nint main() {\n    int age = 21;\n    char name[] = "EduMind";\n    printf("%s is %d years old\\n", name, age);\n    return 0;\n}`,
      output: `EduMind is 21 years old`,
      notes: [
        "printf uses format specifiers (%d for int, %s for string, %f for float) that must match the argument types.",
        "C strings are just arrays of characters ending in a null terminator ('\\0') — there's no built-in String type.",
        "return 0; from main signals successful program execution to the operating system."
      ],
      practice: "Write a C program that declares an int, a float, and a char array, then prints all three with the correct format specifiers."
    },
    stdlib: {
      explanation: "The C standard library provides essential functions by header: stdio.h for input/output (printf, scanf), stdlib.h for memory management and conversions (malloc, atoi), and string.h for string operations (strlen, strcpy). Since C has no garbage collection, memory allocated with malloc() must be manually freed.",
      example: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *nums = malloc(3 * sizeof(int));\n    nums[0] = 10; nums[1] = 20; nums[2] = 30;\n    for (int i = 0; i < 3; i++) printf("%d\\n", nums[i]);\n    free(nums);\n    return 0;\n}`,
      output: `10\n20\n30`,
      notes: [
        "Every malloc() should have a matching free() — forgetting it causes a memory leak.",
        "scanf(\"%d\", &age) reads input into an int; the & takes the variable's memory address.",
        "strcpy/strcat operate on raw character arrays and don't check buffer sizes — a common source of bugs."
      ],
      practice: "Write a program that dynamically allocates an array for a user-specified number of integers, fills it, prints the sum, then frees the memory."
    }
  },
  cpp: {
    syntax: {
      explanation: "C++ extends C with object-oriented features (classes, inheritance) while keeping manual memory control. It compiles to a native binary, uses std::cout/std::cin for console I/O, and classes bundle data with the functions that operate on it.",
      example: `#include <iostream>\nusing namespace std;\n\nclass Student {\npublic:\n    string name;\n    int score;\n    void display() { cout << name << ": " << score << endl; }\n};\n\nint main() {\n    Student s = {"Alice", 92};\n    s.display();\n    return 0;\n}`,
      output: `Alice: 92`,
      notes: [
        "cout << uses the insertion operator to chain multiple values into one output statement.",
        "`using namespace std;` avoids needing std:: before every standard library name.",
        "Class members are private by default; the public: label makes subsequent members accessible from outside the class."
      ],
      practice: "Write a Student class with name, score, and a method that returns a letter grade, then create three instances and print each grade."
    },
    stl: {
      explanation: "The Standard Template Library (STL) provides generic, reusable data structures and algorithms: containers like vector (a resizable array), map (key-value pairs), and set (unique elements), plus algorithms like sort() and find() that work across container types.",
      example: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {5, 2, 8, 1};\n    sort(nums.begin(), nums.end());\n    for (int n : nums) cout << n << " ";\n    return 0;\n}`,
      output: `1 2 5 8`,
      notes: [
        "vector automatically resizes as you push_back() elements, unlike a fixed-size C-style array.",
        "sort() (and most STL algorithms) take iterator ranges (.begin(), .end()) rather than the container itself.",
        "map keeps its keys sorted automatically; unordered_map trades that ordering for faster average lookups."
      ],
      practice: "Use a vector and sort() to sort a list of student scores, then use a map to count how many students scored above 80 per class."
    }
  },
  nodejs: {
    intro: {
      explanation: "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets JavaScript run outside the browser. It's event-driven and non-blocking by default, meaning I/O operations (file reads, network requests) don't halt the rest of the program while waiting.",
      example: `console.log("Running in Node.js!");\nconsole.log("Node version:", process.version);`,
      output: `Running in Node.js!\nNode version: v20.x.x (varies by installed version)`,
      notes: [
        "Run a script with `node filename.js` from the terminal — no browser needed.",
        "Node's non-blocking I/O model handles many concurrent connections efficiently without spawning a thread per request.",
        "process.argv, process.env, and process.exit() are common globals for reading CLI args, environment variables, and exiting."
      ],
      practice: "Write a Node.js script that reads a file's contents asynchronously using fs.readFile and logs it."
    },
    http: {
      explanation: "Node's built-in http module lets you create a web server without any external framework — a callback runs for every incoming request, inspecting req and writing a response with res. Frameworks like Express build on top of this to add routing and middleware.",
      example: `const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello from Node.js!');\n});\n\nserver.listen(3000, () => console.log('Server running on port 3000'));`,
      output: `Server running on port 3000  (visiting http://localhost:3000 shows "Hello from Node.js!")`,
      notes: [
        "res.writeHead() sets the status code and headers before res.end() sends the body and closes the response.",
        "The callback passed to createServer runs once per incoming HTTP request.",
        "Raw http is verbose for real apps — most Node projects use Express or a similar framework for routing."
      ],
      practice: "Extend the server above to return different responses for /home and /about, based on req.url."
    },
    npm: {
      explanation: "npm installs and manages third-party packages, tracked in package.json (dependencies and scripts) and package-lock.json (exact installed versions). `npm install package-name` adds a dependency, and `npm run script-name` runs a defined script.",
      example: `// package.json\n{\n  "name": "my-app",\n  "scripts": { "start": "node index.js" },\n  "dependencies": { "express": "^4.18.0" }\n}\n\n// terminal\nnpm install\nnpm start`,
      output: `Installs express (and its dependencies) into node_modules, then runs the "start" script defined in package.json.`,
      notes: [
        "Dependencies (needed to run the app) go in \"dependencies\"; dev-only tools go in \"devDependencies\".",
        "The ^ in a version number (^4.18.0) allows automatic minor/patch updates but not major version changes.",
        "Never commit node_modules to git — it's regenerated from package.json via npm install."
      ],
      practice: "Initialize a new Node project with `npm init -y`, install express, and add a start script that runs your server file."
    }
  }
};

const buildLessonContent = (skillName, skillKey, topicTitle, subtopic) => {
  const topicLabel = topicTitle || 'Core Topic'
  const subtopicLabel = subtopic || 'Key concept'
  const normalizedKey = skillKey.toLowerCase()

  const exampleBySkill = {
    python: `name = "EduMind"\nfor i in range(3):\n    print(name, i)`,
    javascript: `const count = 3;\nfor (let i = 0; i < count; i += 1) {\n  console.log('Step', i);\n}`,
    html: `<section>\n  <h1>Hello World</h1>\n  <p>Welcome to ${skillName}</p>\n</section>`,
    css: `.card {\n  padding: 16px;\n  border-radius: 12px;\n  background: #2563eb;\n  color: white;\n}`,
    react: `function Card() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}`,
    sql: `SELECT name, score\nFROM students\nWHERE score >= 80\nORDER BY score DESC;`,
    default: `// Example for ${subtopicLabel}\nconsole.log('${skillName} learning in progress')`
  }

  const outputBySkill = {
    python: `EduMind 0\nEduMind 1\nEduMind 2`,
    javascript: `Step 0\nStep 1\nStep 2`,
    html: `<section>\n  <h1>Hello World</h1>\n  <p>Welcome to EduMind</p>\n</section>`,
    css: `A styled card with padding, rounded corners and a blue background.`,
    react: `A button that increments a counter when clicked.`,
    sql: `Returns the matching rows from the students table.`,
    default: `Runs the example and shows the expected result.`
  }

  const explanation = `In ${skillName}, ${subtopicLabel.toLowerCase()} is the building block that helps you understand ${topicLabel.toLowerCase()}. The goal is to connect the concept to a real example, then practice it until the pattern feels natural.`
  const notes = [
    `Focus on the core idea behind ${subtopicLabel}.`,
    `Break the example into smaller steps before trying a larger project.`,
    `Compare your result with the expected output and revise any mistakes.`
  ]

  return {
    explanation,
    example: exampleBySkill[normalizedKey] || exampleBySkill.default,
    output: outputBySkill[normalizedKey] || outputBySkill.default,
    notes,
    practice: `Try a mini exercise: create a small example that uses ${subtopicLabel} in a real ${skillName} project and explain your result out loud.`
  }
}

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000';

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];
const LEVEL_LABELS = {
  beginner: { icon: '🌱', label: 'Beginner', color: '#16a34a' },
  intermediate: { icon: '📈', label: 'Intermediate', color: '#2563eb' },
  advanced: { icon: '🚀', label: 'Advanced', color: '#9333ea' }
};

const normalizeSkillKey = (skill) => {
  const raw = String(skill || 'Python').trim().toLowerCase();
  const aliasMap = {
    python: 'python',
    javascript: 'javascript',
    js: 'javascript',
    java: 'java',
    react: 'react',
    html: 'html',
    css: 'css',
    sql: 'sql',
    docker: 'docker',
    'machine learning': 'machine-learning',
    'machine-learning': 'machine-learning',
    ml: 'machine-learning',
    ai: 'ai',
    'artificial intelligence': 'ai',
    'data science': 'data-science',
    'data-science': 'data-science',
    'cloud computing': 'cloud-computing',
    'cloud-computing': 'cloud-computing',
    'cyber security': 'cyber-security',
    'cyber-security': 'cyber-security',
    'node.js': 'nodejs',
    nodejs: 'nodejs',
    'c++': 'cpp',
    cpp: 'cpp',
    c: 'c',
    typescript: 'typescript',
    ts: 'typescript',
    mongodb: 'mongodb',
    mysql: 'mysql',
    git: 'git',
    github: 'github',
    linux: 'linux',
    aws: 'aws'
  };

  if (aliasMap[raw]) return aliasMap[raw];

  const slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (skillProfiles[slug]) return slug;
  return skillProfiles[raw] ? raw : 'python';
};

export default function SkillLearning() {
  const { skill } = useParams();
  const navigate = useNavigate();
  const normalizedSkill = normalizeSkillKey(skill);
  const skillProfile = skillProfiles[normalizedSkill] || skillProfiles.default;
  const skillName = skillProfile.title;
  const skillTopics = skillProfile.topics;
  const fallbackVideos = skillProfile.videos || [];

  const [activeTopic, setActiveTopic] = useState(skillTopics[0]?.id || 'intro');
  const [activeSubtopic, setActiveSubtopic] = useState(skillTopics[0]?.subtopics?.[0] || '');
  const [expandedLevels, setExpandedLevels] = useState({ beginner: true, intermediate: true, advanced: true });
  const [expandedTopic, setExpandedTopic] = useState(skillTopics[0]?.id || 'intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_completed_${normalizedSkill}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Videos state
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const requestIdRef = useRef(0);

  // Group topics by level
  const topicsByLevel = useMemo(() => {
    const grouped = { beginner: [], intermediate: [], advanced: [] };
    skillTopics.forEach(t => {
      const level = t.level || 'beginner';
      if (grouped[level]) grouped[level].push(t);
    });
    return grouped;
  }, [skillTopics]);

  const currentTopic = useMemo(
    () => skillTopics.find((t) => t.id === activeTopic),
    [activeTopic, skillTopics]
  );

  const recommendedResources = skillResourceCatalog[normalizedSkill] || skillResourceCatalog.default;

  // Uses real, hand-written content for the active topic when we have it
  // (see realLessonContent above); otherwise falls back to the generic generator.
  const lessonContent = useMemo(() => {
    const real = realLessonContent[normalizedSkill]?.[currentTopic?.id];
    if (real) return real;
    return buildLessonContent(skillName, normalizedSkill, currentTopic?.title || skillProfile.conceptTitle, activeSubtopic || currentTopic?.subtopics?.[0] || 'core concept');
  }, [activeSubtopic, currentTopic?.id, currentTopic?.subtopics, currentTopic?.title, normalizedSkill, skillName, skillProfile.conceptTitle]);

  // Filtered topics based on search
  const filteredTopicsByLevel = useMemo(() => {
    if (!searchQuery.trim()) return topicsByLevel;
    const query = searchQuery.toLowerCase();
    const result = { beginner: [], intermediate: [], advanced: [] };
    Object.entries(topicsByLevel).forEach(([level, topics]) => {
      result[level] = topics.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.subtopics.some(s => s.toLowerCase().includes(query))
      );
    });
    return result;
  }, [topicsByLevel, searchQuery]);

  // Compute effective expanded levels (auto-expand if search active)
  const effectiveExpandedLevels = useMemo(() => {
    if (searchQuery.trim()) {
      const hasAny = Object.values(filteredTopicsByLevel).some(arr => arr.length > 0);
      if (hasAny) return { beginner: true, intermediate: true, advanced: true };
    }
    return expandedLevels;
  }, [searchQuery, filteredTopicsByLevel, expandedLevels]);

  // Compute overall progress
  const totalTopics = skillTopics.length;
  const completedCount = completedTopics.size;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Find current topic index for prev/next
  const flatTopics = useMemo(() => skillTopics, [skillTopics]);
  const currentTopicIndex = useMemo(() => flatTopics.findIndex(t => t.id === activeTopic), [flatTopics, activeTopic]);

  // YouTube videos fetch
  useEffect(() => {
    const thisRequestId = ++requestIdRef.current;
    async function fetchVideosForTopic() {
      setVideosLoading(true);
      setVideosError(null);
      const query = `${skillName} ${currentTopic ? currentTopic.title : ''} tutorial`.trim();
      try {
        const res = await fetch(`${API_BASE}/api/youtube/search?query=${encodeURIComponent(query)}&max_results=4`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (thisRequestId !== requestIdRef.current) return;
        setVideos(data.videos && data.videos.length > 0 ? data.videos : []);
      } catch (err) {
        if (thisRequestId !== requestIdRef.current) return;
        setVideosError("Couldn't load live videos right now.");
        setVideos([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setVideosLoading(false);
      }
    }
    fetchVideosForTopic();
  }, [activeTopic, skillName, currentTopic]);

  useEffect(() => {
    setActiveTopic(skillTopics[0]?.id || 'intro');
    setExpandedTopic(skillTopics[0]?.id || 'intro');
    setActiveSubtopic(skillTopics[0]?.subtopics?.[0] || '');
    setCompletedTopics(new Set());
    try {
      const saved = localStorage.getItem(`edu_completed_${normalizedSkill}`);
      if (saved) setCompletedTopics(new Set(JSON.parse(saved)));
    } catch {}
  }, [skill, skillTopics, normalizedSkill]);

  // Save completed topics to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`edu_completed_${normalizedSkill}`, JSON.stringify([...completedTopics]));
    } catch {}
  }, [completedTopics, normalizedSkill]);

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const handleTopicClick = (topicId) => {
    const topic = skillTopics.find(t => t.id === topicId);
    if (!topic) return;
    setActiveTopic(topicId);
    setExpandedTopic(topicId);
    setActiveSubtopic(topic.subtopics?.[0] || '');
  };

  const handleSubtopicClick = (sub) => {
    setActiveSubtopic(sub);
  };

  const toggleCompleted = (topicId) => {
    setCompletedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) newSet.delete(topicId);
      else newSet.add(topicId);
      return newSet;
    });
  };

  const handlePrevTopic = () => {
    if (currentTopicIndex > 0) {
      const prev = flatTopics[currentTopicIndex - 1];
      handleTopicClick(prev.id);
    }
  };

  const handleNextTopic = () => {
    if (currentTopicIndex < flatTopics.length - 1) {
      const next = flatTopics[currentTopicIndex + 1];
      handleTopicClick(next.id);
    }
  };

  const handleNavigateToCompiler = () => navigate('/compiler');
  const openChallenge = (challenge) => {
    if (!challenge) return;
    const qp = `?skill=${encodeURIComponent(normalizedSkill)}&challenge=${encodeURIComponent(challenge.id)}`;
    navigate(`/compiler${qp}`);
  };

  const formatUploadDate = (video) => {
    const rawDate = video?.publishedAt || video?.upload_date || video?.uploadDate || video?.date || '';
    if (!rawDate) return 'Recently added';
    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) return rawDate;
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsedDate);
  };

  const openVideo = (video) => {
    if (!video) return;
    const rawUrl = String(video.url || '').trim();
    const fallbackSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${skillName} ${video.title}`)}`;
    if (!rawUrl || rawUrl === '#') { window.open(fallbackSearch, '_blank', 'noopener,noreferrer'); return; }
    if (rawUrl.includes('youtube.com/') || rawUrl.includes('youtu.be/')) { window.open(rawUrl, '_blank', 'noopener,noreferrer'); return; }
    const looksLikeId = /^[a-zA-Z0-9_-]{8,}$/.test(rawUrl);
    if (looksLikeId) { window.open(`https://www.youtube.com/watch?v=${rawUrl}`, '_blank', 'noopener,noreferrer'); return; }
    window.open(fallbackSearch, '_blank', 'noopener,noreferrer');
  };

  const totalTopicCount = skillTopics.length;
  const completedCountDisplay = completedTopics.size;

  return (
    <div className="gfg-learning-layout">
      {/* Mobile sidebar toggle */}
      <button className="gfg-sidebar-toggle" onClick={() => setSidebarCollapsed(prev => !prev)}>
        {sidebarCollapsed ? '☰' : '✕'} <span>Topics</span>
      </button>

      {/* Left Sidebar - GeeksforGeeks style */}
      <aside className={`gfg-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="gfg-sidebar-header">
          <span className="gfg-sidebar-icon">{skillProfile.icon}</span>
          <div className="gfg-sidebar-title-group">
            <h2>{skillName}</h2>
            <span className="gfg-sidebar-subtitle">Learning Path</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="gfg-search-wrapper">
          <span className="gfg-search-icon">🔍</span>
          <input
            type="text"
            className="gfg-search-input"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="gfg-search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Progress bar */}
        <div className="gfg-progress-mini">
          <div className="gfg-progress-mini-header">
            <span>Progress</span>
            <span className="gfg-progress-mini-count">{completedCountDisplay}/{totalTopicCount}</span>
          </div>
          <div className="gfg-progress-mini-track">
            <div className="gfg-progress-mini-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Level-based topic tree */}
        <nav className="gfg-topic-tree">
          {LEVEL_ORDER.map(level => {
            const topics = filteredTopicsByLevel[level];
            if (!topics || topics.length === 0) return null;
            const levelInfo = LEVEL_LABELS[level];
            const levelCompleted = topics.filter(t => completedTopics.has(t.id)).length;
            return (
              <div key={level} className="gfg-level-group">
                <div className="gfg-level-header" onClick={() => toggleLevel(level)}>
                  <span className="gfg-level-expand">{effectiveExpandedLevels[level] ? '▾' : '▸'}</span>
                  <span className="gfg-level-icon">{levelInfo.icon}</span>
                  <span className="gfg-level-name">{levelInfo.label}</span>
                  <span className="gfg-level-count">{levelCompleted}/{topics.length}</span>
                </div>
                {effectiveExpandedLevels[level] && (
                  <div className="gfg-level-topics">
                    {topics.map(topic => {
                      const isActive = activeTopic === topic.id;
                      const isCompleted = completedTopics.has(topic.id);
                      return (
                        <div key={topic.id} className={`gfg-topic-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                          <div className="gfg-topic-row" onClick={() => handleTopicClick(topic.id)}>
                            <span className="gfg-topic-check" onClick={(e) => { e.stopPropagation(); toggleCompleted(topic.id); }}>
                              {isCompleted ? '✅' : '⬜'}
                            </span>
                            <span className="gfg-topic-title">{topic.title}</span>
                            {isActive && <span className="gfg-topic-indicator">•</span>}
                          </div>
                          {isActive && topic.subtopics && (
                            <ul className="gfg-subtopic-list">
                              {topic.subtopics.map((sub, idx) => (
                                <li key={idx} className={`gfg-subtopic-item ${activeSubtopic === sub ? 'active' : ''}`}>
                                  <button type="button" className="gfg-subtopic-btn" onClick={() => handleSubtopicClick(sub)}>
                                    <span className="gfg-subtopic-bullet">▸</span> {sub}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content - Article style like GeeksforGeeks */}
      <main className="gfg-main-content">
        {/* Breadcrumb */}
        <div className="gfg-breadcrumb">
          <span className="gfg-breadcrumb-item" onClick={() => navigate('/skills-hub')}>Skills</span>
          <span className="gfg-breadcrumb-sep">›</span>
          <span className="gfg-breadcrumb-item">{skillName}</span>
          {currentTopic && (
            <>
              <span className="gfg-breadcrumb-sep">›</span>
              <span className="gfg-breadcrumb-item active">{currentTopic.title}</span>
            </>
          )}
        </div>

        {/* Article Title Section */}
        <div className="gfg-article-header">
          <div className="gfg-article-title-row">
            <h1 className="gfg-article-title">{skillProfile.conceptTitle}</h1>
            <div className="gfg-article-actions">
              <button
                className="gfg-back-to-hub-btn"
                onClick={() => navigate('/skills-hub')}
                title="Back to Skills Hub"
              >
                ← Back to Skills Hub
              </button>
              <button
                className={`gfg-mark-complete-btn ${completedTopics.has(activeTopic) ? 'completed' : ''}`}
                onClick={() => toggleCompleted(activeTopic)}
              >
                {completedTopics.has(activeTopic) ? '✅ Completed' : '⬜ Mark as Complete'}
              </button>
            </div>
          </div>
          <div className="gfg-article-meta">
            <span className="gfg-article-level">
              {currentTopic ? LEVEL_LABELS[currentTopic.level]?.icon : '📚'} {currentTopic ? LEVEL_LABELS[currentTopic.level]?.label : 'All Levels'}
            </span>
            <span className="gfg-article-divider">|</span>
            <span className="gfg-article-subtopic">Current: {activeSubtopic || currentTopic?.subtopics?.[0] || 'Core concept'}</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="gfg-article-progress">
          <div className="gfg-article-progress-track">
            <div className="gfg-article-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="gfg-article-progress-text">{completedCountDisplay}/{totalTopicCount} topics completed ({progressPercent}%)</span>
        </div>

        {/* Article Content */}
        <article className="gfg-article-content">
          <section className="gfg-section">
            <h2 className="gfg-section-title">What you will learn</h2>
            <div className="gfg-section-body">
              <p>{lessonContent.explanation}</p>
            </div>
          </section>

          <section className="gfg-section">
            <h2 className="gfg-section-title">Example</h2>
            <div className="gfg-code-block">
              <div className="gfg-code-header">
                <span className="gfg-code-lang">{skillName}</span>
                <button className="gfg-copy-btn" onClick={() => navigator.clipboard.writeText(lessonContent.example)}>📋 Copy</button>
              </div>
              <pre className="gfg-code-content">{lessonContent.example}</pre>
            </div>
          </section>

          <section className="gfg-section">
            <h2 className="gfg-section-title">Output</h2>
            <div className="gfg-output-block">
              <pre className="gfg-output-content">{lessonContent.output}</pre>
            </div>
          </section>

          <section className="gfg-section">
            <h2 className="gfg-section-title">Key Points</h2>
            <ul className="gfg-key-points">
              {lessonContent.notes.map((note, i) => (
                <li key={i} className="gfg-key-point">{note}</li>
              ))}
            </ul>
          </section>

          <section className="gfg-section">
            <h2 className="gfg-section-title">Practice Challenge</h2>
            <div className="gfg-practice-card">
              <p>{lessonContent.practice}</p>
              <button className="gfg-compiler-btn" onClick={handleNavigateToCompiler}>
                ⚡ Open Compiler
              </button>
            </div>
          </section>
        </article>

        {/* Previous/Next Navigation */}
        <div className="gfg-prev-next">
          <button
            className={`gfg-prev-btn ${currentTopicIndex <= 0 ? 'disabled' : ''}`}
            onClick={handlePrevTopic}
            disabled={currentTopicIndex <= 0}
          >
            ← Previous: {currentTopicIndex > 0 ? flatTopics[currentTopicIndex - 1]?.title : 'None'}
          </button>
          <button
            className={`gfg-next-btn ${currentTopicIndex >= flatTopics.length - 1 ? 'disabled' : ''}`}
            onClick={handleNextTopic}
            disabled={currentTopicIndex >= flatTopics.length - 1}
          >
            Next: {currentTopicIndex < flatTopics.length - 1 ? flatTopics[currentTopicIndex + 1]?.title : 'None'} →
          </button>
        </div>

        {/* Video Resources */}
        <section className="gfg-section gfg-video-section">
          <h2 className="gfg-section-title">Video Resources</h2>
          {videosError && <p className="gfg-video-error">{videosError}</p>}
          <div className="gfg-video-grid">
            {videosLoading && [1, 2].map(i => (
              <div key={i} className="gfg-video-skeleton">
                <div className="gfg-skeleton-thumb" />
                <div className="gfg-skeleton-line" />
              </div>
            ))}
            {!videosLoading && videos.length === 0 && (
              <p className="gfg-no-videos">No videos available for this topic.</p>
            )}
            {!videosLoading && videos.map(video => (
              <div key={video.id} className="gfg-video-card" onClick={() => openVideo(video)}>
                <div className="gfg-video-thumb">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} />
                  ) : (
                    <span className="gfg-video-play-icon">▶</span>
                  )}
                </div>
                <div className="gfg-video-info">
                  <h4>{video.title}</h4>
                  <p>{video.channel || 'Unknown'} • {formatUploadDate(video)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources & Challenges */}
        <div className="gfg-bottom-grid">
          <div className="gfg-resources-card">
            <h3>📚 Recommended Resources</h3>
            <div className="gfg-resources-list">
              {recommendedResources.map((res, i) => (
                <a key={i} className="gfg-resource-item" href={res.link} target="_blank" rel="noopener noreferrer">
                  <span className="gfg-resource-icon">📘</span>
                  <div className="gfg-resource-info">
                    <strong>{res.title}</strong>
                    <span>{res.type}</span>
                  </div>
                  <span className="gfg-resource-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
          <div className="gfg-challenges-card">
            <h3>💻 Coding Challenges</h3>
            {skillProfile.challenges && skillProfile.challenges.length > 0 ? (
              <div className="gfg-challenges-list">
                {skillProfile.challenges.map(ch => (
                  <div key={ch.id} className="gfg-challenge-item">
                    <div className="gfg-challenge-info">
                      <strong>{ch.title}</strong>
                      <span className={`gfg-challenge-diff ${ch.difficulty.toLowerCase()}`}>{ch.difficulty}</span>
                    </div>
                    <button className="gfg-challenge-btn" onClick={() => openChallenge(ch)}>Solve</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="gfg-muted">No challenges available yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}