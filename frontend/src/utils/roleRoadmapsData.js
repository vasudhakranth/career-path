// Hardcoded role roadmaps for the Roadmap page (frontend-first)

export const CAREER_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'AI / ML Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Mobile App Developer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'Software Engineer',
]

const mkStage = (n, title, description, topics) => ({
  stageNumber: n,
  stageTitle: title,
  stageDescription: description,
  stageTopics: topics,
})

const mkRole = ({
  roleTitle,
  roleOverview,
  averageSalary,
  demandRatio,
  essentialFrameworks,
  stages,
}) => ({
  roleTitle,
  roleOverview,
  averageSalary,
  demandRatio,
  essentialFrameworks,
  stages,
})

export const ROLE_ROADMAPS = {
  'Frontend Developer': mkRole({
    roleTitle: 'Frontend Developer',
    roleOverview:
      'Frontend development focuses on building user-facing graphical interfaces, ensuring responsive design, accessibility, and smooth interaction across devices.',
    averageSalary: 'Average US Salary: $70k – $125k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'HTML5 semantic markup',
      'CSS3 selectors & properties',
      'Flexbox and Grid layout systems',
      'Responsive Design & Mobile-First styling',
      'JavaScript variables, loops, types',
      'DOM manipulation principles',
      'Modern ES6+ syntax (Arrow functions, Map, Filter)',
      'Asynchronous fetch requests & APIs',
      'Git version control and GitHub',
      'NPM / Yarn package management',
    ],
    stages: [
      mkStage(
        1,
        'Stage 1: Web Foundations',
        'Establish semantic structures and styling standard controls.',
        [
          'HTML5 semantic markup',
          'CSS3 selectors & properties',
          'Flexbox and Grid layout systems',
          'Responsive Design & Mobile-First styling',
        ]
      ),
      mkStage(
        2,
        'Stage 2: Core Programming Basics',
        'Learn structural script controls and dynamic event listening.',
        [
          'JavaScript variables, loops, types',
          'DOM manipulation principles',
          'Modern ES6+ syntax options (Arrow functions, Map, Filter)',
          'Asynchronous fetch requests & APIs',
        ]
      ),
      mkStage(
        3,
        'Stage 3: Advanced Styles & Tools',
        'Accelerate custom user component generation scales.',
        [
          'Git version control and GitHub',
          'NPM / Yarn package directory rules',
          'SASS / Less preprocessors',
          'Tailwind CSS utility styling',
        ]
      ),
      mkStage(
        4,
        'Stage 4: Framework Masterclass',
        'Create component-driven scalable modern SPA architectures.',
        [
          'React JSX & component cycles',
          'State management (useState, Custom Hooks)',
          'Structured state flows (React Context / Redux)',
          'Vite fast build bundles',
          'Next.js server-side static assets',
        ]
      ),
      mkStage(
        5,
        'Stage 5: Production Optimization',
        'Prepare the client workspace for recruiter audit and test validation.',
        [
          'Web performance (Lighthouse metrics)',
          'Web accessibility standards (WCAG, WAI-ARIA)',
          'Component testing with Jest or Vitest',
          'Hosting setups (Vercel, Netlify)',
        ]
      ),
    ],
  }),

  'Backend Developer': mkRole({
    roleTitle: 'Backend Developer',
    roleOverview:
      'Backend development focuses on building robust APIs, managing databases, and ensuring secure, scalable server-side systems.',
    averageSalary: 'Average US Salary: $80k – $140k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'REST API design (endpoints, status codes, validation)',
      'Authentication & authorization (JWT/OAuth)',
      'Database modeling (SQL/NoSQL) and indexing basics',
      'Server-side frameworks (Express/FastAPI/Django/Spring)',
      'Error handling and logging',
      'Caching concepts (Redis basics)',
      'Git version control and GitHub',
      'NPM / pip / Maven / Gradle package management',
    ],
    stages: [
      mkStage(
        1,
        'Stage 1: Server Fundamentals',
        'Learn how servers handle requests, routes, and responses.',
        ['HTTP basics', 'REST concepts', 'Request/response validation', 'Auth fundamentals']
      ),
      mkStage(
        2,
        'Stage 2: Database & Data Modeling',
        'Model data and perform efficient queries.',
        ['SQL queries or MongoDB schemas', 'Indexing basics', 'Migrations', 'CRUD patterns']
      ),
      mkStage(
        3,
        'Stage 3: Build Secure APIs',
        'Add auth, permissions, and secure data access.',
        ['JWT auth', 'RBAC/permissions', 'Input sanitization', 'Rate limiting concepts']
      ),
      mkStage(
        4,
        'Stage 4: Production-Ready Services',
        'Ship reliable APIs with monitoring and testing.',
        ['Unit/integration testing', 'Structured logging', 'Caching (Redis)', 'CI/CD basics']
      ),
      mkStage(
        5,
        'Stage 5: Scalability & Systems',
        'Prepare for real-world scale and performance.',
        ['Performance profiling', 'Background jobs/queues', 'API pagination & filtering', 'Deployment (Docker)']
      ),
    ],
  }),

  'Full Stack Developer': mkRole({
    roleTitle: 'Full Stack Developer',
    roleOverview:
      'Full stack development connects frontend experiences with backend services and databases to deliver complete products.',
    averageSalary: 'Average US Salary: $90k – $155k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'Frontend frameworks (React/Vue)',
      'Backend frameworks (Node/FastAPI/Django/Spring)',
      'REST/GraphQL APIs',
      'Database basics (SQL/NoSQL)',
      'State management (Context/Redux)',
      'Authentication (JWT/Cookies)',
      'Git + GitHub',
      'Deployment fundamentals (Vercel/Render/Docker)',
    ],
    stages: [
      mkStage(1, 'Stage 1: Frontend + API Integration', 'Build UI and connect to APIs.', ['React core', 'API integration', 'Auth flows', 'Form handling']),
      mkStage(2, 'Stage 2: Backend APIs & Data', 'Create backend endpoints and persist data.', ['REST design', 'CRUD APIs', 'Database modeling', 'Validation + error handling']),
      mkStage(3, 'Stage 3: End-to-End Workflows', 'Implement features across client/server.', ['Search & filters', 'Role-based features', 'File/media handling basics', 'Pagination']),
      mkStage(4, 'Stage 4: Testing & Quality', 'Make your app reliable.', ['Unit/integration tests', 'E2E concepts', 'Logging', 'CI checks']),
      mkStage(5, 'Stage 5: Deployment & Monitoring', 'Ship production-ready full-stack apps.', ['Docker basics', 'Caching', 'Performance tuning', 'Monitoring metrics']),
    ],
  }),

  'Data Analyst': mkRole({
    roleTitle: 'Data Analyst',
    roleOverview:
      'Data analysis focuses on interpreting datasets, building dashboards, and communicating insights for better decisions.',
    averageSalary: 'Average US Salary: $60k – $105k',
    demandRatio: 'Demand Ratio: High',
    essentialFrameworks: [
      'SQL queries and joins',
      'Python for analysis',
      'Data cleaning concepts',
      'Visualization (Power BI/Tableau)',
      'Statistics fundamentals',
      'Excel for quick analysis',
      'Data storytelling',
    ],
    stages: [
      mkStage(1, 'Stage 1: Data & SQL Foundations', 'Learn how data is structured and queried.', ['SQL SELECT/JOINs', 'Aggregations', 'Data cleaning basics', 'Understanding schemas']),
      mkStage(2, 'Stage 2: Analytics with Python', 'Perform analysis and prepare datasets.', ['Pandas basics', 'Data wrangling', 'Simple modeling', 'Exporting clean results']),
      mkStage(3, 'Stage 3: Visualization & Reporting', 'Create stakeholder-ready dashboards.', ['Power BI/Tableau', 'KPI design', 'Filtering/drill-down', 'Charts best practices']),
      mkStage(4, 'Stage 4: Advanced Analysis', 'Go deeper with trends and forecasts.', ['Cohorts and retention', 'Time series basics', 'Experiment understanding', 'Model evaluation']),
      mkStage(5, 'Stage 5: Communication & Portfolio', 'Package insights into a compelling portfolio.', ['Case studies', 'Narratives', 'Presentations', 'Reproducible notebooks']),
    ],
  }),

  'Data Scientist': mkRole({
    roleTitle: 'Data Scientist',
    roleOverview:
      'Data science applies machine learning and statistical modeling to build predictive systems and actionable insights.',
    averageSalary: 'Average US Salary: $95k – $160k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'Python data stack (NumPy, Pandas)',
      'Statistics and probability',
      'Machine learning fundamentals',
      'Model evaluation metrics',
      'Feature engineering',
      'Visualization',
      'ML deployment basics',
    ],
    stages: [
      mkStage(1, 'Stage 1: Math & Data Foundations', 'Build statistical intuition.', ['Probability basics', 'Descriptive stats', 'Data preprocessing', 'Experiment design']),
      mkStage(2, 'Stage 2: Machine Learning Basics', 'Train models and understand tradeoffs.', ['Supervised learning', 'Regression/classification', 'Cross-validation', 'Feature engineering']),
      mkStage(3, 'Stage 3: Evaluation & Tuning', 'Improve performance and reliability.', ['Metrics selection', 'Hyperparameter tuning', 'Bias/variance', 'Model interpretability basics']),
      mkStage(4, 'Stage 4: End-to-End ML Projects', 'Turn models into usable products.', ['Pipelines', 'Notebook to app', 'Monitoring concepts', 'Reproducibility']),
      mkStage(5, 'Stage 5: Productionizing ML', 'Deploy and maintain models.', ['Inference endpoints', 'Batch vs real-time', 'Data drift awareness', 'Docker basics']),
    ],
  }),

  'AI / ML Engineer': mkRole({
    roleTitle: 'AI / ML Engineer',
    roleOverview:
      'AI/ML engineering builds and deploys models, focusing on performance, reliability, and production workflows.',
    averageSalary: 'Average US Salary: $120k – $210k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'Model training pipelines',
      'Deep learning basics',
      'NLP/CV fundamentals (if applicable)',
      'Experiment tracking',
      'Evaluation and robustness',
      'Deployment (API/batch)',
      'Docker and CI/CD',
      'Monitoring and retraining loops',
    ],
    stages: [
      mkStage(1, 'Stage 1: ML Foundations', 'Master core ML.', ['Python ML stack', 'Training loops', 'Loss functions', 'Evaluation']),
      mkStage(2, 'Stage 2: Feature + Data Engineering', 'Get data and features right.', ['Data pipelines', 'Preprocessing', 'Feature stores basics', 'Augmentation basics']),
      mkStage(3, 'Stage 3: Deep Learning (Optional Path)', 'Learn neural networks.', ['Neural network basics', 'Optimization', 'Regularization', 'Transfer learning']),
      mkStage(4, 'Stage 4: MLOps Workflows', 'Make it reproducible and scalable.', ['Experiment tracking', 'Model registry concepts', 'CI for ML', 'Reproducible builds']),
      mkStage(5, 'Stage 5: Deploy & Monitor', 'Production quality.', ['Inference services', 'Monitoring', 'Performance tuning', 'Retraining strategy']),
    ],
  }),

  'DevOps Engineer': mkRole({
    roleTitle: 'DevOps Engineer',
    roleOverview:
      'DevOps focuses on automating infrastructure and deployment, ensuring systems are reliable, scalable, and observable.',
    averageSalary: 'Average US Salary: $100k – $170k',
    demandRatio: 'Demand Ratio: High',
    essentialFrameworks: [
      'CI/CD concepts',
      'Infrastructure as Code (Terraform)',
      'Containers (Docker)',
      'Kubernetes basics',
      'Monitoring and logging',
      'Cloud fundamentals',
      'Git workflows',
      'Security basics (secrets, IAM)',
    ],
    stages: [
      mkStage(1, 'Stage 1: Linux + Networking', 'Build operational fundamentals.', ['Linux essentials', 'Networking basics', 'DNS/DHCP', 'SSH and permissions']),
      mkStage(2, 'Stage 2: CI/CD Pipelines', 'Automate build/test/deploy.', ['GitHub Actions/GitLab CI', 'Pipeline design', 'Artifacts and caching', 'Environment promotion']),
      mkStage(3, 'Stage 3: Containers & Runtime', 'Package and run services.', ['Dockerfiles', 'Images/volumes', 'Health checks', 'Environment variables']),
      mkStage(4, 'Stage 4: Orchestration & Scale', 'Manage multiple services.', ['Kubernetes objects', 'Ingress basics', 'Autoscaling concepts', 'Helm basics']),
      mkStage(5, 'Stage 5: Observability & Security', 'Operate production systems.', ['Metrics/logs/traces', 'Secret management', 'IAM principles', 'Incident response basics']),
    ],
  }),

  'UI/UX Designer': mkRole({
    roleTitle: 'UI/UX Designer',
    roleOverview:
      'UI/UX design creates user-centric experiences through research, interaction design, and polished visual systems.',
    averageSalary: 'Average US Salary: $65k – $120k',
    demandRatio: 'Demand Ratio: High',
    essentialFrameworks: [
      'Design thinking and user research',
      'Wireframing and prototyping',
      'Design systems and components',
      'Accessibility basics',
      'Information architecture',
      'Interaction patterns',
      'Figma / collaboration workflows',
      'Handoff to engineers',
    ],
    stages: [
      mkStage(1, 'Stage 1: Design Foundations', 'Build visual and UX basics.', ['User personas', 'Wireframes', 'Color/typography', 'Usability heuristics']),
      mkStage(2, 'Stage 2: UX Flows & IA', 'Map user journeys.', ['User flows', 'Information architecture', 'Navigation patterns', 'Content structure']),
      mkStage(3, 'Stage 3: UI Systems', 'Create reusable component libraries.', ['Design tokens', 'Components', 'Spacing grids', 'Responsive layouts']),
      mkStage(4, 'Stage 4: Prototyping & Testing', 'Validate with users.', ['Interactive prototypes', 'Usability tests', 'Iterate designs', 'Accessibility checks']),
      mkStage(5, 'Stage 5: Portfolio & Delivery', 'Ship and showcase work.', ['Case studies', 'Handoff specs', 'Collaboration', 'Metrics for UX improvements']),
    ],
  }),

  'Mobile App Developer': mkRole({
    roleTitle: 'Mobile App Developer',
    roleOverview:
      'Mobile app development builds cross-platform apps with responsive UIs, reliable data handling, and smooth performance.',
    averageSalary: 'Average US Salary: $75k – $135k',
    demandRatio: 'Demand Ratio: High',
    essentialFrameworks: [
      'Mobile UI fundamentals',
      'APIs and authentication',
      'State management',
      'Performance optimization',
      'Testing basics',
      'App store deployment',
      'Git + version control',
    ],
    stages: [
      mkStage(1, 'Stage 1: Mobile UI Foundations', 'Learn platform UI patterns.', ['Responsive layout', 'Navigation patterns', 'Forms and validation', 'Touch interactions']),
      mkStage(2, 'Stage 2: Data + API Integration', 'Connect apps to backend.', ['REST API calls', 'Auth flows', 'Caching basics', 'Error handling']),
      mkStage(3, 'Stage 3: State and Architecture', 'Structure your app.', ['State management', 'Component architecture', 'Code organization', 'Environment config']),
      mkStage(4, 'Stage 4: Performance & Testing', 'Improve reliability.', ['Profiling', 'Testing frameworks', 'Offline patterns', 'Battery/network considerations']),
      mkStage(5, 'Stage 5: Release & Maintenance', 'Ship and iterate.', ['Release checklist', 'Monitoring', 'Crash reporting', 'Feature rollout']),
    ],
  }),

  'Cloud Engineer': mkRole({
    roleTitle: 'Cloud Engineer',
    roleOverview:
      'Cloud engineering designs, deploys, and maintains cloud-based infrastructure for scalable applications.',
    averageSalary: 'Average US Salary: $105k – $185k',
    demandRatio: 'Demand Ratio: High',
    essentialFrameworks: [
      'Cloud provider basics',
      'Networking (VPC basics)',
      'Compute, storage, and IAM',
      'Security best practices',
      'Logging and monitoring',
      'Infrastructure as Code',
      'Deployment pipelines',
    ],
    stages: [
      mkStage(1, 'Stage 1: Cloud Fundamentals', 'Understand core cloud services.', ['Compute basics', 'Storage options', 'IAM basics', 'Networking concepts']),
      mkStage(2, 'Stage 2: Infrastructure as Code', 'Automate provisioning.', ['Terraform fundamentals', 'Modules', 'State management', 'Secrets basics']),
      mkStage(3, 'Stage 3: Security & Compliance', 'Build secure cloud setups.', ['Principle of least privilege', 'Network security', 'Audit logging', 'Compliance concepts']),
      mkStage(4, 'Stage 4: Observability', 'Monitor cloud systems.', ['Metrics/logs', 'Alerts', 'Tracing concepts', 'Dashboards']),
      mkStage(5, 'Stage 5: Scale & Reliability', 'Operate at production scale.', ['Auto-scaling', 'Load balancing', 'Disaster recovery basics', 'Cost optimization']),
    ],
  }),

  'Cybersecurity Analyst': mkRole({
    roleTitle: 'Cybersecurity Analyst',
    roleOverview:
      'Cybersecurity analysts protect systems by detecting vulnerabilities, analyzing threats, and improving security posture.',
    averageSalary: 'Average US Salary: $70k – $130k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'Network security fundamentals',
      'Threat modeling',
      'OWASP basics',
      'Vulnerability scanning concepts',
      'Incident response fundamentals',
      'Logging/SIEM concepts',
      'Security hardening',
      'Secure coding basics',
    ],
    stages: [
      mkStage(1, 'Stage 1: Security Fundamentals', 'Understand threats and defenses.', ['CIA triad', 'Common attack vectors', 'Network basics', 'Secure principles']),
      mkStage(2, 'Stage 2: Web & App Security', 'Secure the application layer.', ['OWASP Top 10', 'Auth/session security', 'Input validation', 'Security testing basics']),
      mkStage(3, 'Stage 3: Threat Detection', 'Detect and triage incidents.', ['Logs and alerts', 'SIEM concepts', 'Indicators of compromise', 'Triage workflows']),
      mkStage(4, 'Stage 4: Vulnerability Management', 'Find and fix weaknesses.', ['Scanning concepts', 'Patch management', 'Risk analysis', 'Mitigation strategies']),
      mkStage(5, 'Stage 5: Incident Response & Hardening', 'Improve posture and response.', ['Incident playbooks', 'Forensics basics', 'Hardening baselines', 'Lessons learned']),
    ],
  }),

  'Software Engineer': mkRole({
    roleTitle: 'Software Engineer',
    roleOverview:
      'Software engineering covers building maintainable systems through good architecture, testing, and iterative delivery.',
    averageSalary: 'Average US Salary: $90k – $160k',
    demandRatio: 'Demand Ratio: Very High',
    essentialFrameworks: [
      'Data structures & algorithms',
      'Object-oriented design principles',
      'Testing fundamentals',
      'Clean code & refactoring',
      'System design basics',
      'Git workflow',
      'APIs and integration',
    ],
    stages: [
      mkStage(1, 'Stage 1: Fundamentals', 'Learn core programming concepts.', ['Variables/types', 'Control flow', 'Data structures basics', 'Problem solving']),
      mkStage(2, 'Stage 2: Building Features', 'Practice building working software.', ['Components/modules', 'APIs integration', 'Validation', 'Edge cases']),
      mkStage(3, 'Stage 3: Engineering Quality', 'Make code reliable.', ['Testing strategies', 'Logging', 'Code reviews', 'Refactoring']),
      mkStage(4, 'Stage 4: System Design', 'Learn how large systems work.', ['Scalability concepts', 'APIs at scale', 'Caching', 'Reliability patterns']),
      mkStage(5, 'Stage 5: Career Portfolio', 'Show impact.', ['Case studies', 'Public repos', 'Collaboration stories', 'Interview practice']),
    ],
  }),
}

