import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Brain, BriefcaseBusiness, CheckCircle2, ChevronLeft, ChevronRight, Cloud, Code2, Compass, Copy, Database, Download, Globe2, GraduationCap, ImagePlus, Mail, MessageCircleMore, Search, Send, Share2, Sparkles, Target, TrendingUp, Users, Wand2 } from 'lucide-react'
import AiChatModal from '../components/AiChatModal'
import './RoadmapPage.css'

const buildRoleProfile = ({
  name,
  icon,
  description,
  demand,
  salary,
  duration,
  difficulty,
  companies,
  subRoles,
  reason,
  alternatives,
  phases,
  skills,
  projects,
  applications,
  opportunities,
  certs,
  resources,
  insights,
}) => ({
  name,
  icon,
  description,
  demand,
  salary,
  duration,
  difficulty,
  companies,
  subRoles,
  reason,
  alternatives,
  phases,
  skills,
  projects,
  applications,
  opportunities,
  certs,
  resources,
  insights,
})

const roleDatabase = [
  buildRoleProfile({
    name: 'Backend Developer',
    icon: '🧠',
    description: 'Build secure, scalable APIs and server-side systems that power modern apps.',
    demand: 'Very High',
    salary: '$95k+',
    duration: '6-8 months',
    difficulty: 'Intermediate',
    companies: ['Google', 'Amazon', 'Meta', 'Stripe'],
    subRoles: ['Python Backend Developer', 'Java Backend Developer', 'Node.js Backend Developer', 'Go Backend Developer', 'Microservices Developer'],
    reason: 'Strong logical thinking and problem-solving skills make this a great fit for you.',
    alternatives: ['Full Stack Developer', 'Cloud Engineer', 'API Developer'],
    phases: [
      { title: 'Programming Fundamentals', goal: 'Build confidence with core coding concepts.', topics: ['Variables, loops, functions', 'Data structures', 'Problem solving'], concepts: ['Clean code', 'Debugging', 'Time complexity'], practice: 'Solve 30 coding problems on arrays, strings, and recursion.', project: 'Build a calculator API and a task manager API.', resources: ['Python docs', 'JavaScript basics', 'LeetCode'], duration: '4 weeks' },
      { title: 'Backend Foundations', goal: 'Learn how server-side apps are structured.', topics: ['HTTP methods', 'REST APIs', 'Authentication'], concepts: ['Middleware', 'Routing', 'Status codes'], practice: 'Create API endpoints for CRUD operations.', project: 'Build a blog API with authentication.', resources: ['MDN Web Docs', 'Express docs', 'FastAPI docs'], duration: '3 weeks' },
      { title: 'Databases & Data Modeling', goal: 'Understand how modern apps persist and retrieve data.', topics: ['SQL', 'NoSQL', 'Schema design'], concepts: ['Indexes', 'Relationships', 'Transactions'], practice: 'Design and query a small relational schema.', project: 'Create an inventory management system with PostgreSQL.', resources: ['PostgreSQL docs', 'MongoDB docs', 'SQLBolt'], duration: '3 weeks' },
      { title: 'System Design', goal: 'Think like an engineer building production services.', topics: ['Scalability', 'Caching', 'Load balancing'], concepts: ['Microservices', 'Queues', 'Rate limiting'], practice: 'Design a chat system and a notification service.', project: 'Design and document a real-time notification backend.', resources: ['System Design Primer', 'High Scalability'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Python', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '72%' },
      { name: 'SQL', difficulty: 'Beginner', importance: 'Critical', time: '3 weeks', progress: '63%' },
      { name: 'APIs', difficulty: 'Intermediate', importance: 'Critical', time: '3 weeks', progress: '68%' },
      { name: 'Databases', difficulty: 'Intermediate', importance: 'High', time: '4 weeks', progress: '58%' },
    ],
    projects: { beginner: ['Calculator API', 'Task Manager API', 'URL Shortener'], intermediate: ['Authentication System', 'Blog API', 'E-Commerce Backend'], advanced: ['Real-Time Notification System', 'Banking API', 'Inventory Management API'] },
    applications: ['E-commerce Platforms', 'Banking Systems', 'Healthcare Applications', 'Cloud Services'],
    opportunities: ['FinTech', 'Healthcare', 'EdTech', 'Startups', 'MNCs'],
    certs: ['AWS Certified Developer', 'Microsoft Azure Developer', 'Google Associate Cloud Engineer'],
    resources: { docs: ['FastAPI Docs', 'Express Docs', 'Django Docs'], videos: ['The Net Ninja', 'freeCodeCamp backend series'], courses: ['Backend Development Bootcamp', 'Node.js API Masterclass'], practice: ['LeetCode', 'HackerRank', 'Codewars'], books: ['Designing Data-Intensive Applications', 'Clean Code'], websites: ['Roadmap.sh', 'Exercism'] },
    insights: { salary: '$95k - $140k', demand: 'Very High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Frontend Developer',
    icon: '🎨',
    description: 'Craft beautiful, responsive user experiences and modern interfaces.',
    demand: 'High',
    salary: '$85k+',
    duration: '5-7 months',
    difficulty: 'Beginner',
    companies: ['Adobe', 'Netflix', 'Spotify', 'Shopify'],
    subRoles: ['React Developer', 'Vue Developer', 'UI Engineer', 'Design Systems Engineer'],
    reason: 'Your creative thinking and eye for detail make this role a strong match.',
    alternatives: ['UI/UX Designer', 'Full Stack Developer', 'Product Designer'],
    phases: [
      { title: 'Programming Fundamentals', goal: 'Build a strong foundation for web interfaces.', topics: ['HTML5', 'CSS3', 'Responsive design'], concepts: ['Accessibility', 'Visual hierarchy', 'Design systems'], practice: 'Recreate landing pages from reference designs.', project: 'Build a polished portfolio website.', resources: ['MDN', 'CSS Tricks', 'Frontend Mentor'], duration: '3 weeks' },
      { title: 'JavaScript & DOM', goal: 'Make interfaces interactive and dynamic.', topics: ['DOM', 'Events', 'Async JS'], concepts: ['State', 'Promises', 'APIs'], practice: 'Build interactive forms and small widgets.', project: 'Create a weather dashboard.', resources: ['JavaScript.info', 'freeCodeCamp'], duration: '3 weeks' },
      { title: 'React Ecosystem', goal: 'Scale into modern component-based development.', topics: ['Components', 'Hooks', 'Routing'], concepts: ['State management', 'Testing', 'Performance'], practice: 'Build a dashboard with reusable UI blocks.', project: 'Ship a SaaS dashboard UI.', resources: ['React docs', 'Vite docs', 'Tailwind docs'], duration: '4 weeks' },
      { title: 'Advanced Frontend', goal: 'Deliver production-ready experiences.', topics: ['Accessibility', 'Animation', 'Optimisation'], concepts: ['Build systems', 'Design tokens', 'Deployment'], practice: 'Refine Lighthouse and accessibility metrics.', project: 'Create a design-system-powered product page.', resources: ['Web.dev', 'A11y project'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'HTML/CSS', difficulty: 'Beginner', importance: 'Critical', time: '3 weeks', progress: '81%' },
      { name: 'JavaScript', difficulty: 'Beginner', importance: 'Critical', time: '4 weeks', progress: '74%' },
      { name: 'React', difficulty: 'Intermediate', importance: 'High', time: '4 weeks', progress: '66%' },
      { name: 'UI Design', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '59%' },
    ],
    projects: { beginner: ['Landing Page', 'Portfolio Website', 'Todo App'], intermediate: ['Weather Dashboard', 'E-commerce UI', 'Dashboard Redesign'], advanced: ['SaaS Product UI', 'Design System Library', 'Realtime Collaboration UI'] },
    applications: ['SaaS Products', 'E-commerce Stores', 'Social Platforms', 'FinTech Apps'],
    opportunities: ['Startups', 'Product Companies', 'Agencies', 'MNCs'],
    certs: ['Meta Front-End Developer', 'Google UX Design', 'Microsoft Frontend Fundamentals'],
    resources: { docs: ['React Docs', 'MDN Docs', 'Tailwind Docs'], videos: ['The Net Ninja', 'Traversy Media'], courses: ['Frontend Developer Path', 'React Masterclass'], practice: ['Frontend Mentor', 'CodePen', 'CSSBattle'], books: ['You Don’t Know JS', 'Refactoring UI'], websites: ['roadmap.sh/front-end', 'Exercism'] },
    insights: { salary: '$85k - $120k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Full Stack Developer',
    icon: '🧩',
    description: 'Bridge frontend experiences with robust backend systems and databases.',
    demand: 'Very High',
    salary: '$90k+',
    duration: '7-9 months',
    difficulty: 'Intermediate',
    companies: ['Spotify', 'Stripe', 'Shopify', 'Notion'],
    subRoles: ['Product Engineer', 'Web Engineer', 'App Engineer', 'Platform Engineer'],
    reason: 'Your curiosity across UI and systems makes you a strong fit for this path.',
    alternatives: ['Backend Developer', 'Frontend Developer', 'Software Engineer'],
    phases: [
      { title: 'Programming Fundamentals', goal: 'Build a strong programming foundation.', topics: ['Programming Basics', 'Variables & Data Types', 'Operators', 'Conditions', 'Loops', 'Functions', 'Arrays', 'Strings', 'OOP', 'Exception Handling', 'File Handling', 'Problem Solving'], concepts: ['Clean code', 'Debugging', 'Data structures'], practice: 'Solve daily coding challenges and build small command-line apps.', project: 'Calculator and student management system.', resources: ['CS50', 'freeCodeCamp'], duration: '4 weeks' },
      { title: 'Frontend Development', goal: 'Create polished user experiences.', topics: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design', 'JavaScript', 'DOM', 'Events', 'Fetch API', 'Async/Await', 'React', 'Components', 'Props', 'State', 'Hooks', 'React Router', 'Tailwind CSS'], concepts: ['UI patterns', 'Accessibility', 'State management'], practice: 'Build reusable components and responsive screens.', project: 'Portfolio, todo app and weather app.', resources: ['React docs', 'MDN', 'Tailwind docs'], duration: '5 weeks' },
      { title: 'Backend Development', goal: 'Ship APIs and business logic.', topics: ['Node.js', 'Express.js', 'REST APIs', 'CRUD', 'Middleware', 'JWT', 'Authentication', 'Authorization', 'Password Hashing', 'Postman', 'Environment Variables'], concepts: ['Server architecture', 'Validation', 'Secure coding'], practice: 'Create modular API services and test them thoroughly.', project: 'Notes API and authentication system.', resources: ['Express docs', 'Node docs', 'FastAPI docs'], duration: '5 weeks' },
      { title: 'Database & Integrations', goal: 'Connect data layers and third-party services.', topics: ['MySQL', 'PostgreSQL', 'MongoDB', 'Mongoose', 'Database Design', 'CRUD', 'Joins', 'Aggregation', 'Axios', 'Third-party APIs'], concepts: ['Schema design', 'Transactions', 'Caching'], practice: 'Build data-backed apps with search and filters.', project: 'Library management and blog backend.', resources: ['MongoDB docs', 'PostgreSQL docs'], duration: '4 weeks' },
      { title: 'Deployment & Product Skills', goal: 'Launch real products confidently.', topics: ['React + Node Integration', 'Authentication Flow', 'Role Based Access', 'File Upload', 'Vercel', 'Render', 'MongoDB Atlas', 'Docker Basics', 'CI/CD Basics', 'Performance Optimization'], concepts: ['DevOps basics', 'Observability', 'Deployment pipelines'], practice: 'Deploy a full stack app and monitor performance.', project: 'Blog platform and job portal.', resources: ['Vercel docs', 'Render docs', 'Docker docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'React', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '74%' },
      { name: 'Node.js', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '70%' },
      { name: 'Databases', difficulty: 'Intermediate', importance: 'High', time: '4 weeks', progress: '68%' },
      { name: 'Deployment', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '61%' },
    ],
    projects: { beginner: ['Todo App', 'Weather App', 'Notes API'], intermediate: ['Blog Platform', 'E-commerce UI', 'Task Manager API'], advanced: ['Job Portal', 'Learning Management System', 'Ecommerce Website'] },
    applications: ['SaaS Products', 'Marketplace Apps', 'Internal Tools', 'Student Platforms'],
    opportunities: ['Startups', 'Product Companies', 'Agencies', 'Scaleups'],
    certs: ['Meta Full Stack', 'AWS Cloud Practitioner', 'Microsoft Azure Fundamentals'],
    resources: { docs: ['React Docs', 'Express Docs', 'MongoDB Docs'], videos: ['Codecademy', 'The Net Ninja'], courses: ['Full Stack Open', 'The Odin Project'], practice: ['LeetCode', 'Frontend Mentor'], books: ['Eloquent JavaScript', 'Clean Architecture'], websites: ['roadmap.sh/full-stack', 'Exercism'] },
    insights: { salary: '$90k - $145k', demand: 'Very High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Python Developer',
    icon: '🐍',
    description: 'Create automation, APIs, and data-driven applications with Python.',
    demand: 'High',
    salary: '$90k+',
    duration: '6-8 months',
    difficulty: 'Beginner',
    companies: ['Dropbox', 'Spotify', 'JP Morgan', 'Instacart'],
    subRoles: ['Backend Python Developer', 'Automation Engineer', 'Data Engineer', 'Machine Learning Engineer'],
    reason: 'Python is a strong match if you enjoy clean logic and rapid prototyping.',
    alternatives: ['Backend Developer', 'Data Scientist', 'Automation Engineer'],
    phases: [
      { title: 'Python Basics', goal: 'Learn the language and core syntax.', topics: ['Variables', 'Control flow', 'Functions', 'Data structures'], concepts: ['OOP', 'Modules', 'Packaging'], practice: 'Write scripts for everyday tasks.', project: 'Expense tracker CLI.', resources: ['Python docs', 'Automate the Boring Stuff'], duration: '3 weeks' },
      { title: 'Web & API Development', goal: 'Build services and endpoints.', topics: ['Flask', 'FastAPI', 'REST APIs', 'Requests'], concepts: ['Validation', 'Error handling', 'Authentication'], practice: 'Create a mini API with CRUD.', project: 'Task manager backend.', resources: ['FastAPI docs', 'Flask docs'], duration: '4 weeks' },
      { title: 'Automation & Data', goal: 'Use Python for analysis and scripts.', topics: ['File handling', 'CSV/JSON', 'Pandas', 'Automation'], concepts: ['ETL basics', 'Parsing', 'Regex'], practice: 'Automate a repetitive workflow.', project: 'Invoice generator and scraper.', resources: ['Pandas docs', 'Real Python'], duration: '4 weeks' },
      { title: 'Testing & Deployment', goal: 'Ship reliable Python applications.', topics: ['pytest', 'Docker', 'Virtual environments', 'CI/CD'], concepts: ['Testing', 'Packaging', 'Deployment'], practice: 'Set up a small production-ready service.', project: 'Deploy a FastAPI app.', resources: ['pytest docs', 'Docker docs'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Python', difficulty: 'Beginner', importance: 'Critical', time: '4 weeks', progress: '78%' },
      { name: 'APIs', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '71%' },
      { name: 'Data Handling', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '66%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '60%' },
    ],
    projects: { beginner: ['CLI Calculator', 'File Organizer', 'To-do CLI'], intermediate: ['Task API', 'Scraper', 'Expense Tracker'], advanced: ['FastAPI SaaS', 'Automation Dashboard', 'Microservice Platform'] },
    applications: ['Automation', 'Analytics Tools', 'Backend Services', 'Data Pipelines'],
    opportunities: ['Startups', 'FinTech', 'HealthTech', 'Data Teams'],
    certs: ['PCAP', 'AWS Cloud Practitioner', 'Azure Fundamentals'],
    resources: { docs: ['Python Docs', 'FastAPI Docs'], videos: ['Corey Schafer', 'freeCodeCamp'], courses: ['Python for Everybody', 'Backend with FastAPI'], practice: ['Exercism', 'LeetCode'], books: ['Fluent Python', 'Automate the Boring Stuff'], websites: ['realpython.com', 'roadmap.sh/python'] },
    insights: { salary: '$90k - $135k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Java Developer',
    icon: '☕',
    description: 'Build enterprise applications, APIs, and large-scale systems with Java.',
    demand: 'High',
    salary: '$95k+',
    duration: '7-9 months',
    difficulty: 'Intermediate',
    companies: ['Oracle', 'SAP', 'Bank of America', 'IBM'],
    subRoles: ['Spring Boot Developer', 'Enterprise Java Engineer', 'Microservices Developer'],
    reason: 'If you enjoy structure and long-term maintainability, Java is a strong fit.',
    alternatives: ['Backend Developer', 'Software Engineer', 'Cloud Engineer'],
    phases: [
      { title: 'Java Core', goal: 'Understand the language and object model.', topics: ['Syntax', 'Collections', 'OOP', 'Exceptions'], concepts: ['Memory basics', 'Interfaces', 'Generics'], practice: 'Build console tools and algorithms.', project: 'Library inventory CLI.', resources: ['Oracle Java docs', 'Baeldung'], duration: '4 weeks' },
      { title: 'Spring Framework', goal: 'Build production-ready services.', topics: ['Spring Boot', 'Dependency Injection', 'REST APIs', 'Validation'], concepts: ['MVC', 'ORM', 'Profiles'], practice: 'Create modular web services.', project: 'Order management API.', resources: ['Spring docs', 'Spring Guides'], duration: '4 weeks' },
      { title: 'Databases & Messaging', goal: 'Connect services to resilient data layers.', topics: ['JPA', 'Hibernate', 'SQL', 'Kafka basics'], concepts: ['Transactions', 'Caching', 'Queues'], practice: 'Design and query relational models.', project: 'Employee management system.', resources: ['Hibernate docs', 'Kafka docs'], duration: '4 weeks' },
      { title: 'Testing & Deployment', goal: 'Ship enterprise systems with confidence.', topics: ['JUnit', 'Mockito', 'Docker', 'CI/CD'], concepts: ['Testing strategies', 'Monitoring', 'Logging'], practice: 'Automate tests and deploy a service.', project: 'Deploy a Spring Boot app.', resources: ['JUnit docs', 'Docker docs'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Java', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '73%' },
      { name: 'Spring Boot', difficulty: 'Intermediate', importance: 'High', time: '4 weeks', progress: '69%' },
      { name: 'Databases', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '64%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '60%' },
    ],
    projects: { beginner: ['Banking CLI', 'Student Portal', 'Inventory App'], intermediate: ['Order API', 'Employee Portal', 'Quiz System'], advanced: ['Microservices Platform', 'HR System', 'Billing Service'] },
    applications: ['Banking', 'ERP Systems', 'Healthcare', 'Enterprise Software'],
    opportunities: ['FinTech', 'Consulting', 'Large Enterprises', 'Government'],
    certs: ['Oracle Certified Associate', 'Spring Professional', 'AWS Developer'],
    resources: { docs: ['Java Docs', 'Spring Docs'], videos: ['Java Brains', 'Tech Primers'], courses: ['Java Programming and Software Engineering', 'Spring Boot Masterclass'], practice: ['LeetCode', 'HackerRank'], books: ['Effective Java', 'Spring in Action'], websites: ['baeldung.com', 'roadmap.sh/java'] },
    insights: { salary: '$95k - $145k', demand: 'High', future: 'Excellent', remote: 'Medium', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'React Developer',
    icon: '⚛️',
    description: 'Create interactive and scalable single-page applications with React.',
    demand: 'High',
    salary: '$90k+',
    duration: '5-7 months',
    difficulty: 'Beginner',
    companies: ['Meta', 'Airbnb', 'Shopify', 'Stripe'],
    subRoles: ['Frontend Engineer', 'UI Engineer', 'Component Developer'],
    reason: 'React is ideal if you enjoy building modern interfaces and reusable components.',
    alternatives: ['Frontend Developer', 'Vue Developer', 'Angular Developer'],
    phases: [
      { title: 'React Foundations', goal: 'Learn component-driven UI building.', topics: ['JSX', 'Props', 'State', 'Events'], concepts: ['Component lifecycle', 'Hooks', 'Conditional rendering'], practice: 'Build small component trees.', project: 'Todo app.', resources: ['React docs', 'freeCodeCamp'], duration: '3 weeks' },
      { title: 'Routing & Data', goal: 'Build multi-screen experiences.', topics: ['React Router', 'Forms', 'Fetch API', 'Context'], concepts: ['Routing', 'Data fetching', 'Error states'], practice: 'Connect UI to external APIs.', project: 'Weather dashboard.', resources: ['React Router docs', 'JSONPlaceholder'], duration: '3 weeks' },
      { title: 'Production Patterns', goal: 'Handle larger apps with confidence.', topics: ['Custom hooks', 'State management', 'Testing', 'Performance'], concepts: ['Memoization', 'Code splitting', 'Accessibility'], practice: 'Refactor UI into reusable modules.', project: 'Admin dashboard.', resources: ['Testing Library', 'Vite docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'React', difficulty: 'Beginner', importance: 'Critical', time: '4 weeks', progress: '76%' },
      { name: 'JavaScript', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '71%' },
      { name: 'State Management', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '67%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '59%' },
    ],
    projects: { beginner: ['Todo App', 'Counter App', 'Landing Page'], intermediate: ['Weather App', 'Dashboard', 'Blog UI'], advanced: ['SaaS Admin', 'Commerce Platform', 'Design System'] },
    applications: ['Dashboards', 'Web Apps', 'eCommerce', 'SaaS Products'],
    opportunities: ['Startups', 'Product Teams', 'Agencies', 'MNCs'],
    certs: ['Meta Front-End Developer', 'React Certification'],
    resources: { docs: ['React Docs', 'Vite Docs'], videos: ['The Net Ninja', 'Codevolution'], courses: ['React Basics', 'Advanced React'], practice: ['Frontend Mentor', 'CodeSandbox'], books: ['Learning React', 'React Patterns'], websites: ['beta.reactjs.org', 'roadmap.sh/react'] },
    insights: { salary: '$90k - $130k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Angular Developer',
    icon: '🅰️',
    description: 'Build enterprise web applications with Angular and TypeScript.',
    demand: 'Medium',
    salary: '$85k+',
    duration: '5-7 months',
    difficulty: 'Intermediate',
    companies: ['Google', 'Microsoft', 'Accenture', 'ThoughtWorks'],
    subRoles: ['Frontend Engineer', 'Enterprise Web Developer'],
    reason: 'Angular suits people who like structure, typing, and scalable architecture.',
    alternatives: ['React Developer', 'Frontend Developer', 'Software Engineer'],
    phases: [
      { title: 'Angular Foundations', goal: 'Master the framework basics.', topics: ['Components', 'Templates', 'Directives', 'Services'], concepts: ['Dependency injection', 'Routing', 'Forms'], practice: 'Build a modular app skeleton.', project: 'Dashboard shell.', resources: ['Angular docs', 'TypeScript docs'], duration: '3 weeks' },
      { title: 'State & Architecture', goal: 'Structure enterprise-scale applications.', topics: ['RxJS', 'Observables', 'State management', 'Modules'], concepts: ['Signals', 'Shared services', 'Lazy loading'], practice: 'Add data flows and reusable services.', project: 'Admin portal.', resources: ['RxJS docs', 'Angular guides'], duration: '4 weeks' },
      { title: 'Testing & Deployment', goal: 'Ship polished applications.', topics: ['Unit tests', 'E2E testing', 'CI/CD', 'Performance'], concepts: ['Accessibility', 'Build optimisation', 'Deployment strategies'], practice: 'Create production-ready test coverage.', project: 'Role-based dashboard.', resources: ['Angular testing', 'Vercel docs'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Angular', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '68%' },
      { name: 'TypeScript', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '73%' },
      { name: 'RxJS', difficulty: 'Advanced', importance: 'High', time: '3 weeks', progress: '61%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '57%' },
    ],
    projects: { beginner: ['Dashboard UI', 'Todo App', 'Contact Manager'], intermediate: ['Admin Portal', 'Event Planner', 'User Management'], advanced: ['Enterprise CRM', 'Analytics Suite', 'Billing Console'] },
    applications: ['Enterprise Apps', 'Internal Tools', 'Admin Panels', 'B2B Portals'],
    opportunities: ['Consulting', 'Finance', 'Enterprise Teams', 'Product Companies'],
    certs: ['Angular Certification', 'TypeScript Certification'],
    resources: { docs: ['Angular Docs', 'TypeScript Docs'], videos: ['Angular University', 'Decode'], courses: ['Angular Basics', 'Advanced Angular'], practice: ['Frontend Mentor', 'Codewars'], books: ['Angular in Action', 'Pro Angular'], websites: ['angular.io', 'roadmap.sh/angular'] },
    insights: { salary: '$85k - $125k', demand: 'Medium', future: 'Good', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Vue Developer',
    icon: '💚',
    description: 'Build elegant and performant web apps with Vue.js.',
    demand: 'Medium',
    salary: '$80k+',
    duration: '4-6 months',
    difficulty: 'Beginner',
    companies: ['GitLab', 'Grammarly', 'Nintendo', 'Upwork'],
    subRoles: ['Frontend Engineer', 'Component Developer', 'UI Engineer'],
    reason: 'Vue is a great fit if you enjoy clean abstractions and approachable tooling.',
    alternatives: ['React Developer', 'Frontend Developer', 'Angular Developer'],
    phases: [
      { title: 'Vue Essentials', goal: 'Learn the core framework patterns.', topics: ['Templates', 'Directives', 'Components', 'Props'], concepts: ['Reactivity', 'Lifecycle', 'State'], practice: 'Create small interactive components.', project: 'Task tracker app.', resources: ['Vue docs', 'Vue Mastery'], duration: '3 weeks' },
      { title: 'Routing & API Integration', goal: 'Build multi-view apps with data.', topics: ['Vue Router', 'Forms', 'Composition API', 'Fetch'], concepts: ['State management', 'Lifecycle hooks', 'Error handling'], practice: 'Create a data-driven interface.', project: 'Movie discovery app.', resources: ['Pinia docs', 'Vue Router docs'], duration: '3 weeks' },
      { title: 'Product Delivery', goal: 'Ship polished and tested applications.', topics: ['Pinia', 'Testing', 'Performance', 'Deployment'], concepts: ['Accessibility', 'Bundle size', 'SEO basics'], practice: 'Optimize and deploy a demo app.', project: 'Product landing and dashboard.', resources: ['Vite docs', 'Vitest docs'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Vue.js', difficulty: 'Beginner', importance: 'Critical', time: '3 weeks', progress: '75%' },
      { name: 'JavaScript', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '71%' },
      { name: 'Composition API', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '64%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '57%' },
    ],
    projects: { beginner: ['Task Tracker', 'Counter App', 'Landing Page'], intermediate: ['Movie App', 'Dashboard', 'Inventory UI'], advanced: ['Team Hub', 'Admin Portal', 'E-commerce UI'] },
    applications: ['Web Apps', 'Dashboards', 'Portfolio Sites', 'Internal Tools'],
    opportunities: ['Startups', 'Product Companies', 'Agencies', 'Open Source'],
    certs: ['Vue Certification', 'Frontend Development'],
    resources: { docs: ['Vue Docs', 'Pinia Docs'], videos: ['Vue Mastery', 'Academind'], courses: ['Vue.js Course', 'Vue 3 Essentials'], practice: ['Frontend Mentor', 'Codewars'], books: ['The Vue Handbook', 'Vue.js Up and Running'], websites: ['vuejs.org', 'roadmap.sh/vue'] },
    insights: { salary: '$80k - $120k', demand: 'Medium', future: 'Good', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Flutter Developer',
    icon: '📱',
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart.',
    demand: 'High',
    salary: '$85k+',
    duration: '5-7 months',
    difficulty: 'Intermediate',
    companies: ['Google', 'BMW', 'Alibaba', 'Dream11'],
    subRoles: ['Mobile App Developer', 'Cross-platform Engineer', 'UI Engineer'],
    reason: 'If you enjoy building polished mobile experiences quickly, Flutter is a strong fit.',
    alternatives: ['Android Developer', 'iOS Developer', 'React Native Developer'],
    phases: [
      { title: 'Dart & UI Basics', goal: 'Learn the language and core layout system.', topics: ['Dart syntax', 'Widgets', 'Layouts', 'Stateful UI'], concepts: ['Composition', 'Styling', 'Animation basics'], practice: 'Recreate small screens.', project: 'Onboarding screen and profile page.', resources: ['Flutter docs', 'Dart docs'], duration: '3 weeks' },
      { title: 'Navigation & Data', goal: 'Connect screens and external services.', topics: ['Routes', 'Forms', 'APIs', 'State management'], concepts: ['Persistence', 'Asynchronous programming', 'Error states'], practice: 'Build a data-driven app flow.', project: 'Notes app with local storage.', resources: ['Flutter cookbook', 'Riverpod docs'], duration: '4 weeks' },
      { title: 'Release & Performance', goal: 'Ship polished apps for production.', topics: ['Animations', 'Testing', 'Firebase', 'App release'], concepts: ['Performance', 'Platform integration', 'CI/CD'], practice: 'Create and package a full app.', project: 'E-commerce shopping app.', resources: ['Firebase docs', 'Flutter testing'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Flutter', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '72%' },
      { name: 'Dart', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '69%' },
      { name: 'State Management', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '64%' },
      { name: 'Firebase', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '58%' },
    ],
    projects: { beginner: ['Profile UI', 'Weather App', 'Calculator App'], intermediate: ['Notes App', 'Book Tracker', 'Chat UI'], advanced: ['Shopping App', 'Food Delivery UI', 'Social Feed'] },
    applications: ['Mobile Apps', 'Startups', 'Retail Apps', 'Education Apps'],
    opportunities: ['Product Teams', 'Agencies', 'Startups', 'B2C Brands'],
    certs: ['Flutter Certification', 'Google Mobile Development'],
    resources: { docs: ['Flutter Docs', 'Dart Docs'], videos: ['Flutter Europe', 'Code With Andrea'], courses: ['Flutter Development Bootcamp', 'Dart for Flutter'], practice: ['Flutter Samples', 'Exercism'], books: ['Beginning Flutter', 'Flutter Apprentice'], websites: ['flutter.dev', 'roadmap.sh/flutter'] },
    insights: { salary: '$85k - $125k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Android Developer',
    icon: '🤖',
    description: 'Build native Android applications with Kotlin and Jetpack.',
    demand: 'High',
    salary: '$90k+',
    duration: '6-8 months',
    difficulty: 'Intermediate',
    companies: ['Google', 'Samsung', 'Uber', 'Spotify'],
    subRoles: ['Kotlin Developer', 'Mobile Engineer', 'Android UI Engineer'],
    reason: 'Android development fits people who enjoy mobile interfaces and platform constraints.',
    alternatives: ['Flutter Developer', 'iOS Developer', 'Mobile App Developer'],
    phases: [
      { title: 'Kotlin Basics', goal: 'Learn the Android programming language.', topics: ['Kotlin syntax', 'Functions', 'Classes', 'Collections'], concepts: ['Null safety', 'Coroutines', 'OOP'], practice: 'Build small utility apps.', project: 'Task list app.', resources: ['Android docs', 'Kotlin docs'], duration: '3 weeks' },
      { title: 'UI & Jetpack', goal: 'Create native Android experiences.', topics: ['Compose', 'Activities', 'Fragments', 'Navigation'], concepts: ['Material Design', 'State holders', 'Lifecycle'], practice: 'Design a polished screen flow.', project: 'Weather app.', resources: ['Jetpack docs', 'Compose docs'], duration: '4 weeks' },
      { title: 'Data & Release', goal: 'Ship reliable mobile products.', topics: ['Room', 'Retrofit', 'WorkManager', 'Play Store'], concepts: ['Offline support', 'Background tasks', 'Testing'], practice: 'Build a data-backed app and publish it.', project: 'E-commerce app.', resources: ['Room docs', 'Play Console docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Kotlin', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '72%' },
      { name: 'Jetpack Compose', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '68%' },
      { name: 'Networking', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '63%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '59%' },
    ],
    projects: { beginner: ['Calculator App', 'Task Manager', 'Notes App'], intermediate: ['Weather App', 'Fitness Tracker', 'Shopping List'], advanced: ['Food Delivery App', 'Chat App', 'E-commerce Android App'] },
    applications: ['Mobile Utilities', 'Social Apps', 'Shopping Apps', 'Productivity Apps'],
    opportunities: ['Mobile Startups', 'Product Companies', 'Consumer Tech', 'Gaming'],
    certs: ['Associate Android Developer', 'Google Mobile Development'],
    resources: { docs: ['Android Docs', 'Kotlin Docs'], videos: ['Philipp Lackner', 'Android Developers'], courses: ['Android Basics', 'Jetpack Compose'], practice: ['Kotlin Koans', 'LeetCode'], books: ['Head First Android Development', 'Kotlin in Action'], websites: ['developer.android.com', 'roadmap.sh/android'] },
    insights: { salary: '$90k - $140k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'iOS Developer',
    icon: '📱',
    description: 'Design and build native iPhone and iPad experiences.',
    demand: 'High',
    salary: '$95k+',
    duration: '6-8 months',
    difficulty: 'Intermediate',
    companies: ['Apple', 'Spotify', 'Uber', 'Airbnb'],
    subRoles: ['Swift Developer', 'Mobile Engineer', 'UI Engineer'],
    reason: 'iOS development fits people who value polished design and strong platform conventions.',
    alternatives: ['Android Developer', 'Flutter Developer', 'Mobile App Developer'],
    phases: [
      { title: 'Swift Fundamentals', goal: 'Build native mobile logic.', topics: ['Swift syntax', 'Optionals', 'Collections', 'Classes'], concepts: ['Protocols', 'Closures', 'Error handling'], practice: 'Create simple command-line and app examples.', project: 'Habit tracker app.', resources: ['Apple docs', 'Swift docs'], duration: '3 weeks' },
      { title: 'UIKit & SwiftUI', goal: 'Create polished mobile interfaces.', topics: ['SwiftUI', 'UIKit', 'Navigation', 'Layouts'], concepts: ['State management', 'Animations', 'Accessibility'], practice: 'Recreate popular app screens.', project: 'Weather app.', resources: ['SwiftUI tutorials', 'Hacking with Swift'], duration: '4 weeks' },
      { title: 'Data & App Store', goal: 'Ship and maintain a full app.', topics: ['Core Data', 'Networking', 'Testing', 'App Store'], concepts: ['Persistence', 'Offline support', 'CI/CD'], practice: 'Build and publish a production-ready app.', project: 'E-commerce app.', resources: ['Apple developer docs', 'TestFlight docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Swift', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '72%' },
      { name: 'SwiftUI', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '68%' },
      { name: 'Networking', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '63%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '58%' },
    ],
    projects: { beginner: ['Habit Tracker', 'Weather App', 'Calculator'], intermediate: ['Recipe App', 'Notes App', 'Fitness App'], advanced: ['Chat App', 'Social Feed', 'E-commerce App'] },
    applications: ['Consumer Apps', 'Productivity Apps', 'Lifestyle Tools', 'FinTech'],
    opportunities: ['Startups', 'Consumer Tech', 'Product Companies', 'Design Studios'],
    certs: ['Apple Developer', 'Swift Certification'],
    resources: { docs: ['Apple Docs', 'Swift Docs'], videos: ['Hacking with Swift', 'CodeWithChris'], courses: ['SwiftUI Essentials', 'iOS Developer Bootcamp'], practice: ['Exercism', 'LeetCode'], books: ['Swift Programming', 'iOS Apprentice'], websites: ['developer.apple.com', 'roadmap.sh/ios'] },
    insights: { salary: '$95k - $145k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'DevOps Engineer',
    icon: '⚙️',
    description: 'Automate infrastructure, delivery pipelines, and reliable deployments.',
    demand: 'High',
    salary: '$100k+',
    duration: '7-9 months',
    difficulty: 'Advanced',
    companies: ['Amazon', 'Google', 'Microsoft', 'Datadog'],
    subRoles: ['Platform Engineer', 'Site Reliability Engineer', 'Release Engineer'],
    reason: 'If you enjoy systems, automation, and reliability, this path fits well.',
    alternatives: ['Cloud Engineer', 'SRE', 'Platform Engineer'],
    phases: [
      { title: 'Linux & Networking', goal: 'Understand the operating systems and networks behind modern products.', topics: ['Linux essentials', 'Networking', 'DNS', 'SSH'], concepts: ['Permissions', 'Processes', 'Troubleshooting'], practice: 'Provision and debug a server.', project: 'Deploy a simple web server.', resources: ['Linux Journey', 'Cloudflare Learning'], duration: '3 weeks' },
      { title: 'Automation & CI/CD', goal: 'Build pipelines and automation workflows.', topics: ['GitHub Actions', 'Pipelines', 'Testing', 'Deployments'], concepts: ['Artifacts', 'Environments', 'Secrets'], practice: 'Automate a build and deploy flow.', project: 'Build a CI pipeline for a sample app.', resources: ['GitHub Actions docs', 'Jenkins docs'], duration: '4 weeks' },
      { title: 'Containers & Orchestration', goal: 'Package and scale services.', topics: ['Docker', 'Kubernetes', 'Helm', 'Infrastructure'], concepts: ['Volumes', 'Ingress', 'Scaling'], practice: 'Run a multi-service app in containers.', project: 'Deploy a microservices demo.', resources: ['Docker docs', 'Kubernetes docs'], duration: '4 weeks' },
      { title: 'Observability & Security', goal: 'Operate robust systems in production.', topics: ['Monitoring', 'Logs', 'Prometheus', 'IAM'], concepts: ['Alerting', 'Incident response', 'Secrets'], practice: 'Add dashboards and secure access to services.', project: 'Create an observability stack.', resources: ['Prometheus docs', 'HashiCorp'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Linux', difficulty: 'Intermediate', importance: 'Critical', time: '3 weeks', progress: '71%' },
      { name: 'Docker', difficulty: 'Intermediate', importance: 'Critical', time: '3 weeks', progress: '70%' },
      { name: 'CI/CD', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '68%' },
      { name: 'Kubernetes', difficulty: 'Advanced', importance: 'High', time: '4 weeks', progress: '62%' },
    ],
    projects: { beginner: ['Set up a Linux server', 'Deploy a static site', 'Create a simple CI workflow'], intermediate: ['Dockerize a web app', 'Deploy with GitHub Actions', 'Monitor a service'], advanced: ['Kubernetes cluster', 'Blue-green deployment', 'Autoscaling stack'] },
    applications: ['Cloud Platforms', 'SaaS', 'Infrastructure', 'High Availability Systems'],
    opportunities: ['Cloud Companies', 'Startups', 'SRE Teams', 'Platform Teams'],
    certs: ['AWS DevOps Engineer', 'Google Cloud DevOps', 'Azure DevOps'],
    resources: { docs: ['Docker Docs', 'Kubernetes Docs'], videos: ['DevOps Toolkit', 'TechWorld with Nana'], courses: ['DevOps Bootcamp', 'Kubernetes Basics'], practice: ['KataCoda', 'Linux Journey'], books: ['The DevOps Handbook', 'Site Reliability Engineering'], websites: ['devopsroadmap.io', 'roadmap.sh/devops'] },
    insights: { salary: '$100k - $160k', demand: 'High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'Cloud Engineer',
    icon: '☁️',
    description: 'Design, deploy, and manage resilient cloud-native systems.',
    demand: 'High',
    salary: '$105k+',
    duration: '6-8 months',
    difficulty: 'Intermediate',
    companies: ['AWS', 'Microsoft', 'Google', 'Oracle'],
    subRoles: ['Cloud Architect', 'Cloud Platform Engineer', 'Infrastructure Engineer'],
    reason: 'Cloud engineering is a strong fit if you enjoy automation and scaling systems.',
    alternatives: ['DevOps Engineer', 'Platform Engineer', 'Solutions Architect'],
    phases: [
      { title: 'Cloud Foundations', goal: 'Understand core cloud services and architecture.', topics: ['Compute', 'Storage', 'Networking', 'IAM'], concepts: ['Regions', 'Availability zones', 'Security'], practice: 'Provision simple cloud resources.', project: 'Deploy a static site on cloud.', resources: ['AWS docs', 'Azure docs'], duration: '3 weeks' },
      { title: 'Infrastructure as Code', goal: 'Automate cloud environments.', topics: ['Terraform', 'CloudFormation', 'Modules', 'State'], concepts: ['Versioning', 'Secrets', 'Provisioning'], practice: 'Create reusable infrastructure templates.', project: 'Deploy a database-backed app.', resources: ['Terraform docs', 'HashiCorp'], duration: '4 weeks' },
      { title: 'Security & Reliability', goal: 'Build safe and resilient systems.', topics: ['Monitoring', 'Backups', 'Disaster recovery', 'Load balancing'], concepts: ['Least privilege', 'Alerts', 'Scaling'], practice: 'Set up a resilient service.', project: 'Design a multi-tier architecture.', resources: ['Cloud security docs', 'SRE books'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Cloud Services', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '70%' },
      { name: 'Terraform', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '67%' },
      { name: 'Networking', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '64%' },
      { name: 'Security', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '61%' },
    ],
    projects: { beginner: ['Static Website', 'Serverless Function', 'Storage Setup'], intermediate: ['Infrastructure Templates', 'Monitoring Stack', 'Load Balanced App'], advanced: ['Multi-Region Architecture', 'Resilient Platform', 'Cost-Optimized Cloud'] },
    applications: ['Cloud SaaS', 'Data Platforms', 'Startups', 'Enterprise Systems'],
    opportunities: ['Cloud Providers', 'Consulting', 'Enterprises', 'Platform Teams'],
    certs: ['AWS Solutions Architect', 'Azure Administrator', 'Google Cloud Engineer'],
    resources: { docs: ['AWS Docs', 'Azure Docs', 'GCP Docs'], videos: ['Cloud Resume Challenge', 'FreeCodeCamp Cloud'], courses: ['Cloud Computing Basics', 'Terraform for DevOps'], practice: ['Cloud Quest', 'KataCoda'], books: ['Terraform Up & Running', 'Cloud Native Patterns'], websites: ['roadmap.sh/cloud'] },
    insights: { salary: '$105k - $165k', demand: 'High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'Cyber Security Analyst',
    icon: '🔐',
    description: 'Protect systems by identifying vulnerabilities and responding to threats.',
    demand: 'Very High',
    salary: '$80k+',
    duration: '6-8 months',
    difficulty: 'Intermediate',
    companies: ['CrowdStrike', 'Microsoft', 'IBM', 'Cisco'],
    subRoles: ['SOC Analyst', 'Threat Analyst', 'Security Operations Engineer'],
    reason: 'If you enjoy investigation, patterns, and protecting systems, this is a strong fit.',
    alternatives: ['Cloud Engineer', 'Network Engineer', 'Software Engineer'],
    phases: [
      { title: 'Security Foundations', goal: 'Understand core security principles.', topics: ['CIA triad', 'Networking', 'Threats', 'Vulnerabilities'], concepts: ['Attack vectors', 'Risk basics', 'Secure design'], practice: 'Analyze common vulnerability examples.', project: 'Create a threat map.', resources: ['OWASP', 'TryHackMe'], duration: '3 weeks' },
      { title: 'Web & Application Security', goal: 'Learn how apps are attacked and defended.', topics: ['OWASP Top 10', 'Auth', 'Injection', 'Encryption'], concepts: ['Secure coding', 'Input validation', 'Logging'], practice: 'Review sample code vulnerabilities.', project: 'Fix a vulnerable web app.', resources: ['OWASP docs', 'Portswigger'], duration: '4 weeks' },
      { title: 'Detection & Response', goal: 'Investigate incidents and monitor systems.', topics: ['Logs', 'SIEM', 'Incident response', 'Threat hunting'], concepts: ['Indicators of compromise', 'Triage', 'Mitigation'], practice: 'Interpret sample alerts and write playbooks.', project: 'Create an incident report.', resources: ['Splunk docs', 'Elastic docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Networking', difficulty: 'Intermediate', importance: 'Critical', time: '3 weeks', progress: '69%' },
      { name: 'Security Basics', difficulty: 'Intermediate', importance: 'Critical', time: '3 weeks', progress: '72%' },
      { name: 'Log Analysis', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '66%' },
      { name: 'Incident Response', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '61%' },
    ],
    projects: { beginner: ['Security Checklist', 'Threat Mapping', 'Secure Config Review'], intermediate: ['Vulnerability Lab', 'Log Analysis Report', 'Phishing Simulation'], advanced: ['SOC Playbook', 'Detection Rules', 'Threat Hunt Dashboard'] },
    applications: ['Security Operations', 'Compliance', 'Threat Intelligence', 'Cloud Security'],
    opportunities: ['Security Teams', 'Consulting', 'Finance', 'Government'],
    certs: ['CompTIA Security+', 'Certified SOC Analyst', 'EC-Council CEH'],
    resources: { docs: ['OWASP Docs', 'NIST Docs'], videos: ['The Cyber Mentor', 'John Hammond'], courses: ['Security+ Prep', 'SOC Analyst Path'], practice: ['TryHackMe', 'Hack The Box'], books: ['The Web Application Hacker’s Handbook', 'Practical Malware Analysis'], websites: ['owasp.org', 'roadmap.sh/cybersecurity'] },
    insights: { salary: '$80k - $125k', demand: 'Very High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Data Analyst',
    icon: '📊',
    description: 'Turn raw data into business insights and decisions.',
    demand: 'High',
    salary: '$80k+',
    duration: '5-7 months',
    difficulty: 'Beginner',
    companies: ['Google', 'Amazon', 'Microsoft', 'Uber'],
    subRoles: ['Business Analyst', 'BI Analyst', 'Reporting Analyst'],
    reason: 'This path fits people who enjoy patterns, storytelling, and evidence-based decisions.',
    alternatives: ['Data Scientist', 'Business Analyst', 'Product Analyst'],
    phases: [
      { title: 'SQL & Spreadsheet Foundations', goal: 'Learn the data basics that power every analysis workflow.', topics: ['Excel', 'SQL', 'Data cleaning', 'Aggregations'], concepts: ['Joins', 'Filtering', 'Grouping'], practice: 'Work with sample business data.', project: 'Sales dashboard.', resources: ['SQLBolt', 'Excel docs'], duration: '3 weeks' },
      { title: 'Statistics & Insights', goal: 'Make sense of trends and distributions.', topics: ['Descriptive statistics', 'Probability', 'A/B testing basics', 'Correlations'], concepts: ['Hypothesis testing', 'Bias', 'Sampling'], practice: 'Interpret datasets and communicate findings.', project: 'Marketing performance report.', resources: ['Khan Academy', 'StatQuest'], duration: '3 weeks' },
      { title: 'Visualization & Storytelling', goal: 'Present insights clearly to stakeholders.', topics: ['Power BI', 'Tableau', 'Dashboard design', 'KPIs'], concepts: ['Data storytelling', 'Dashboard layouts', 'Interactivity'], practice: 'Create a polished executive dashboard.', project: 'Executive KPI dashboard.', resources: ['Power BI docs', 'Tableau docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'SQL', difficulty: 'Beginner', importance: 'Critical', time: '3 weeks', progress: '78%' },
      { name: 'Excel', difficulty: 'Beginner', importance: 'High', time: '2 weeks', progress: '74%' },
      { name: 'Statistics', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '67%' },
      { name: 'Visualization', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '64%' },
    ],
    projects: { beginner: ['Sales Report', 'Student Performance Analysis', 'Customer Survey Dashboard'], intermediate: ['Marketing Analytics', 'Retention Dashboard', 'Operations KPI Report'], advanced: ['Executive Business Dashboard', 'Cohort Analysis', 'Forecasting Model'] },
    applications: ['Business Intelligence', 'Operations', 'Marketing', 'Finance'],
    opportunities: ['Analytics Teams', 'Consulting', 'Startups', 'Enterprises'],
    certs: ['Google Data Analytics', 'Microsoft PL-300'],
    resources: { docs: ['SQLBolt', 'Power BI Docs'], videos: ['Data Professor', 'freeCodeCamp'], courses: ['Google Data Analytics', 'Tableau Essentials'], practice: ['Kaggle', 'Mode Analytics'], books: ['Storytelling with Data', 'Practical Statistics'], websites: ['kaggle.com', 'roadmap.sh/data-analyst'] },
    insights: { salary: '$80k - $120k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Data Scientist',
    icon: '🧪',
    description: 'Apply statistics and machine learning to solve complex business problems.',
    demand: 'Very High',
    salary: '$100k+',
    duration: '8-10 months',
    difficulty: 'Advanced',
    companies: ['Google', 'Amazon', 'Meta', 'Uber'],
    subRoles: ['ML Scientist', 'Applied Scientist', 'Analytics Scientist'],
    reason: 'This role is a strong fit if you enjoy experimentation, mathematics, and modeling.',
    alternatives: ['Machine Learning Engineer', 'Data Analyst', 'AI Engineer'],
    phases: [
      { title: 'Python & Statistics', goal: 'Build firm statistical foundations.', topics: ['Python', 'Probability', 'Hypothesis testing', 'Descriptive stats'], concepts: ['Sampling', 'Bias', 'Distributions'], practice: 'Analyze public datasets and explain findings.', project: 'Customer churn analysis.', resources: ['Khan Academy', 'Python docs'], duration: '4 weeks' },
      { title: 'Data Wrangling', goal: 'Prepare data for analysis and modeling.', topics: ['Pandas', 'NumPy', 'Cleaning', 'Feature engineering'], concepts: ['Outliers', 'Missing values', 'Encoding'], practice: 'Clean messy datasets.', project: 'Housing dataset pipeline.', resources: ['Pandas docs', 'Scikit-learn docs'], duration: '4 weeks' },
      { title: 'Machine Learning', goal: 'Train and evaluate predictive models.', topics: ['Regression', 'Classification', 'Clustering', 'Model selection'], concepts: ['Overfitting', 'Cross-validation', 'Metrics'], practice: 'Train multiple models and compare results.', project: 'Loan default prediction.', resources: ['Scikit-learn docs', 'Hands-On ML'], duration: '4 weeks' },
      { title: 'Deployment & Communication', goal: 'Turn insights into business value.', topics: ['Model deployment', 'Dashboards', 'Communication', 'Experiment design'], concepts: ['Monitoring', 'Bias', 'Business impact'], practice: 'Package your model and explain it clearly.', project: 'Model-backed recommendation tool.', resources: ['MLOps docs', 'Dash docs'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Python', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '74%' },
      { name: 'Statistics', difficulty: 'Advanced', importance: 'Critical', time: '4 weeks', progress: '71%' },
      { name: 'Machine Learning', difficulty: 'Advanced', importance: 'High', time: '4 weeks', progress: '66%' },
      { name: 'Communication', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '61%' },
    ],
    projects: { beginner: ['Churn Analysis', 'House Price Predictor', 'Survey Insights'], intermediate: ['Loan Default Model', 'Recommendation System', 'Customer Segmentation'], advanced: ['Forecasting Platform', 'Production ML Service', 'AutoML Dashboard'] },
    applications: ['Healthcare', 'Finance', 'Marketing', 'Operations'],
    opportunities: ['Research Labs', 'Big Tech', 'Startups', 'Consulting'],
    certs: ['Google Data Analytics', 'AWS ML Specialty', 'IBM Data Science'],
    resources: { docs: ['Scikit-learn Docs', 'Pandas Docs'], videos: ['StatQuest', 'Data School'], courses: ['Machine Learning Specialization', 'Data Science Bootcamp'], practice: ['Kaggle', 'Driven Data'], books: ['Hands-On Machine Learning', 'Practical Statistics'], websites: ['kaggle.com', 'roadmap.sh/data-scientist'] },
    insights: { salary: '$100k - $160k', demand: 'Very High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'Data Engineer',
    icon: '🗄️',
    description: 'Design and build reliable data pipelines and storage systems.',
    demand: 'High',
    salary: '$105k+',
    duration: '7-9 months',
    difficulty: 'Advanced',
    companies: ['Airbnb', 'Netflix', 'Palantir', 'Stripe'],
    subRoles: ['Pipeline Engineer', 'Platform Engineer', 'Analytics Engineer'],
    reason: 'This path suits people who enjoy building systems, data modeling, and throughput.',
    alternatives: ['Data Scientist', 'Backend Developer', 'Software Engineer'],
    phases: [
      { title: 'Data Foundations', goal: 'Understand how data is stored and moved.', topics: ['SQL', 'ETL basics', 'File formats', 'Data modeling'], concepts: ['Schemas', 'Partitions', 'Batch vs streaming'], practice: 'Create simple data pipelines.', project: 'CSV to warehouse pipeline.', resources: ['SQLBolt', 'dbt docs'], duration: '3 weeks' },
      { title: 'Warehouse & Querying', goal: 'Work with analytical databases and transformations.', topics: ['PostgreSQL', 'BigQuery', 'Spark basics', 'Data warehousing'], concepts: ['Indexes', 'Views', 'Transformations'], practice: 'Build query-heavy workflows.', project: 'Sales analytics pipeline.', resources: ['BigQuery docs', 'Spark docs'], duration: '4 weeks' },
      { title: 'Streaming & Reliability', goal: 'Handle real-time and large-scale data flows.', topics: ['Kafka', 'Airflow', 'Streaming', 'Monitoring'], concepts: ['Backfills', 'Idempotency', 'Latency'], practice: 'Create a streaming workflow.', project: 'Event processing pipeline.', resources: ['Kafka docs', 'Airflow docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'SQL', difficulty: 'Intermediate', importance: 'Critical', time: '3 weeks', progress: '72%' },
      { name: 'ETL', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '69%' },
      { name: 'Spark', difficulty: 'Advanced', importance: 'High', time: '4 weeks', progress: '63%' },
      { name: 'Airflow', difficulty: 'Advanced', importance: 'Medium', time: '3 weeks', progress: '58%' },
    ],
    projects: { beginner: ['Data Pipeline', 'CSV ETL', 'Warehouse Report'], intermediate: ['Sales Pipeline', 'Streaming Demo', 'DBT Transformations'], advanced: ['Real-Time Data Platform', 'Lakehouse Pipeline', 'Analytics Service'] },
    applications: ['Analytics Platforms', 'Streaming', 'Retail', 'Finance'],
    opportunities: ['Data Teams', 'Product Companies', 'FinTech', 'Big Tech'],
    certs: ['Google Data Engineer', 'AWS Data Analytics'],
    resources: { docs: ['Spark Docs', 'dbt Docs'], videos: ['Data Engineering Zoomcamp', 'DataTalksClub'], courses: ['Data Engineering Bootcamp', 'BigQuery Essentials'], practice: ['Kaggle', 'Mode'], books: ['Designing Data-Intensive Applications', 'Fundamentals of Data Engineering'], websites: ['dataengineeringproject.com', 'roadmap.sh/data-engineer'] },
    insights: { salary: '$105k - $155k', demand: 'High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'Machine Learning Engineer',
    icon: '🧠',
    description: 'Bring machine learning models into production systems.',
    demand: 'High',
    salary: '$120k+',
    duration: '8-10 months',
    difficulty: 'Advanced',
    companies: ['OpenAI', 'Google', 'Amazon', 'NVIDIA'],
    subRoles: ['ML Platform Engineer', 'Applied ML Engineer', 'MLOps Engineer'],
    reason: 'This role combines modeling expertise with software engineering and deployment skills.',
    alternatives: ['AI Engineer', 'Data Scientist', 'Software Engineer'],
    phases: [
      { title: 'ML Foundations', goal: 'Learn core concepts behind training and evaluation.', topics: ['Linear regression', 'Classification', 'Loss functions', 'Optimization'], concepts: ['Bias/variance', 'Training loops', 'Metrics'], practice: 'Train and compare several models.', project: 'Predict house prices.', resources: ['Scikit-learn docs', 'Machine Learning Specialization'], duration: '4 weeks' },
      { title: 'Feature Engineering', goal: 'Prepare data for reliable models.', topics: ['Feature pipelines', 'Encoding', 'Scaling', 'Validation'], concepts: ['Preprocessing', 'Missing values', 'Data leakage'], practice: 'Build reusable preprocessing steps.', project: 'Customer segmentation pipeline.', resources: ['Pandas docs', 'Feature Engineering'], duration: '4 weeks' },
      { title: 'Production ML', goal: 'Deploy and monitor models safely.', topics: ['FastAPI', 'Docker', 'MLOps', 'Model registries'], concepts: ['Monitoring', 'Retraining', 'Versioning'], practice: 'Serve a model through an API.', project: 'Deploy a recommendation API.', resources: ['MLflow docs', 'FastAPI docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Machine Learning', difficulty: 'Advanced', importance: 'Critical', time: '4 weeks', progress: '71%' },
      { name: 'Python', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '74%' },
      { name: 'MLOps', difficulty: 'Advanced', importance: 'High', time: '3 weeks', progress: '63%' },
      { name: 'Deployment', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '60%' },
    ],
    projects: { beginner: ['House Price Predictor', 'Spam Classifier', 'Sentiment Analysis'], intermediate: ['Recommendation System', 'Fraud Detection', 'Image Classifier'], advanced: ['A/B Platform', 'Real-Time Prediction API', 'ML Pipeline'] },
    applications: ['Insurance', 'Healthcare', 'E-commerce', 'Search'],
    opportunities: ['AI Labs', 'Big Tech', 'Product Companies', 'Research'],
    certs: ['AWS ML Specialty', 'Google ML Engineer'],
    resources: { docs: ['Scikit-learn Docs', 'MLflow Docs'], videos: ['DeepLearning.ai', 'StatQuest'], courses: ['Machine Learning Engineering', 'MLOps Basics'], practice: ['Kaggle', 'Weights & Biases'], books: ['Hands-On Machine Learning', 'Designing Machine Learning Systems'], websites: ['mlops.community', 'roadmap.sh/machine-learning'] },
    insights: { salary: '$120k - $180k', demand: 'High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'AI Engineer',
    icon: '🤖',
    description: 'Design intelligent systems using AI models, pipelines, and automation.',
    demand: 'High',
    salary: '$120k+',
    duration: '8-12 months',
    difficulty: 'Advanced',
    companies: ['OpenAI', 'Google', 'Microsoft', 'NVIDIA'],
    subRoles: ['Generative AI Engineer', 'Prompt Engineer', 'ML Engineer'],
    reason: 'Curiosity, experimentation, and analytical thinking fit this path very well.',
    alternatives: ['Machine Learning Engineer', 'Data Scientist', 'Prompt Engineer'],
    phases: [
      { title: 'Python & Math for AI', goal: 'Build the foundation behind modern AI systems.', topics: ['Python', 'Linear algebra', 'Statistics'], concepts: ['Vectors', 'Probability', 'Optimization'], practice: 'Complete mini exercises for data handling and math.', project: 'Build a recommendation engine.', resources: ['NumPy docs', 'Khan Academy'], duration: '4 weeks' },
      { title: 'Machine Learning Basics', goal: 'Learn how models learn from data.', topics: ['Regression', 'Classification', 'Clustering'], concepts: ['Loss functions', 'Training', 'Evaluation'], practice: 'Train and compare basic ML models.', project: 'Predict house prices from tabular data.', resources: ['scikit-learn docs', 'Coursera'], duration: '4 weeks' },
      { title: 'Deep Learning & LLMs', goal: 'Explore neural networks and generative AI.', topics: ['Neural networks', 'Transformers', 'Prompt engineering'], concepts: ['Embeddings', 'Fine-tuning', 'Inference'], practice: 'Experiment with an LLM workflow.', project: 'Build a chatbot with RAG.', resources: ['Hugging Face', 'PyTorch docs'], duration: '5 weeks' },
      { title: 'AI Product Delivery', goal: 'Turn AI prototypes into user-facing systems.', topics: ['APIs', 'Evaluation', 'Guardrails', 'Deployment'], concepts: ['Observability', 'User feedback', 'Safety'], practice: 'Turn your prototype into a working app.', project: 'Deploy an AI assistant.', resources: ['LangChain docs', 'OpenAI docs'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Python', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '70%' },
      { name: 'ML Theory', difficulty: 'Advanced', importance: 'Critical', time: '5 weeks', progress: '54%' },
      { name: 'Data Analysis', difficulty: 'Intermediate', importance: 'High', time: '4 weeks', progress: '61%' },
      { name: 'LLM APIs', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '57%' },
    ],
    projects: { beginner: ['House Price Predictor', 'Sentiment Analyzer', 'Chatbot'], intermediate: ['Recommendation System', 'Image Classifier', 'RAG Assistant'], advanced: ['Multimodal AI App', 'Fine-Tuned LLM', 'AI Copilot'] },
    applications: ['Healthcare AI', 'Customer Support', 'Education Tools', 'Automation'],
    opportunities: ['AI Startups', 'Research Labs', 'Product Companies', 'Cloud Platforms'],
    certs: ['AWS ML Specialty', 'Google ML Engineer', 'Microsoft Azure AI Engineer'],
    resources: { docs: ['PyTorch Docs', 'scikit-learn Docs', 'Hugging Face Docs'], videos: ['Andrej Karpathy', 'DeepLearning.ai'], courses: ['Machine Learning Specialization', 'Generative AI with LLMs'], practice: ['Kaggle', 'Weights & Biases'], books: ['Hands-On Machine Learning', 'Deep Learning'], websites: ['fast.ai', 'OpenML'] },
    insights: { salary: '$120k - $170k', demand: 'High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
  buildRoleProfile({
    name: 'UI/UX Designer',
    icon: '🎨',
    description: 'Create meaningful, accessible, and delightful digital experiences.',
    demand: 'High',
    salary: '$75k+',
    duration: '5-7 months',
    difficulty: 'Beginner',
    companies: ['Adobe', 'Figma', 'Dropbox', 'Spotify'],
    subRoles: ['Product Designer', 'Interaction Designer', 'Visual Designer'],
    reason: 'This path suits people who enjoy research, empathy, and polished interfaces.',
    alternatives: ['Frontend Developer', 'Product Designer', 'Brand Designer'],
    phases: [
      { title: 'Design Foundations', goal: 'Understand user needs and visual principles.', topics: ['User research', 'Wireframes', 'Color theory', 'Typography'], concepts: ['Accessibility', 'Hierarchy', 'Usability'], practice: 'Create a simple user flow.', project: 'Mobile app onboarding flow.', resources: ['Figma docs', 'NN/g'], duration: '3 weeks' },
      { title: 'Experience Mapping', goal: 'Design clear journeys and interactions.', topics: ['User flows', 'Information architecture', 'Prototyping', 'Micro-interactions'], concepts: ['Navigation', 'Interaction design', 'Feedback'], practice: 'Prototype a task-based experience.', project: 'Food delivery app experience.', resources: ['Google Design', 'UX Planet'], duration: '4 weeks' },
      { title: 'Systems & Delivery', goal: 'Build scalable visual systems.', topics: ['Design systems', 'Components', 'Design tokens', 'Hand-off'], concepts: ['Consistency', 'Accessibility', 'Collaboration'], practice: 'Create a reusable design system.', project: 'SaaS dashboard design system.', resources: ['Figma community', 'Adobe XD'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'User Research', difficulty: 'Beginner', importance: 'Critical', time: '3 weeks', progress: '75%' },
      { name: 'Wireframing', difficulty: 'Beginner', importance: 'High', time: '2 weeks', progress: '72%' },
      { name: 'Prototyping', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '69%' },
      { name: 'Design Systems', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '64%' },
    ],
    projects: { beginner: ['Landing Page Redesign', 'Mobile Onboarding', 'Dashboard Wireframe'], intermediate: ['Food Delivery Flow', 'E-commerce Redesign', 'User Research Case Study'], advanced: ['SaaS Design System', 'Immersive Product Prototype', 'Accessibility Audit'] },
    applications: ['Product Design', 'B2B SaaS', 'Consumer Apps', 'Brand Systems'],
    opportunities: ['Design Agencies', 'Startups', 'Product Firms', 'Enterprises'],
    certs: ['Google UX Design', 'Figma Advanced'],
    resources: { docs: ['Figma Docs', 'Google Design'], videos: ['DesignCourse', 'AJ&Smart'], courses: ['Google UX Design', 'Interaction Design Specialization'], practice: ['UX Challenges', 'Figma Community'], books: ['Don’t Make Me Think', 'Refactoring UI'], websites: ['uxdesign.cc', 'roadmap.sh/uiux'] },
    insights: { salary: '$75k - $120k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'QA Engineer',
    icon: '✅',
    description: 'Ensure quality, reliability, and user confidence through testing.',
    demand: 'High',
    salary: '$75k+',
    duration: '4-6 months',
    difficulty: 'Beginner',
    companies: ['Microsoft', 'Amazon', 'Adobe', 'Slack'],
    subRoles: ['Automation Engineer', 'Manual QA', 'Test Analyst'],
    reason: 'This role suits people who enjoy detail, consistency, and improving products.',
    alternatives: ['Software Engineer', 'Automation Engineer', 'Product Manager'],
    phases: [
      { title: 'Testing Basics', goal: 'Understand the testing lifecycle and quality mindset.', topics: ['Manual testing', 'Test cases', 'Bug reporting', 'Test plans'], concepts: ['Regression', 'Reproduction', 'Priority'], practice: 'Write and execute test cases.', project: 'Test a simple web app.', resources: ['ISTQB', 'Testing docs'], duration: '2 weeks' },
      { title: 'Automation Fundamentals', goal: 'Add repeatable test automation to your workflow.', topics: ['Selenium', 'Playwright', 'Assertions', 'Page objects'], concepts: ['Locators', 'Waits', 'Flaky tests'], practice: 'Automate smoke tests.', project: 'Automate a login flow.', resources: ['Playwright docs', 'Selenium docs'], duration: '3 weeks' },
      { title: 'Quality Systems', goal: 'Scale quality practices for real products.', topics: ['API testing', 'CI integration', 'Performance testing', 'Accessibility'], concepts: ['Test strategy', 'Reporting', 'Coverage'], practice: 'Create a full regression suite.', project: 'Build a testing pipeline.', resources: ['Postman docs', 'Cypress docs'], duration: '3 weeks' },
    ],
    skills: [
      { name: 'Testing', difficulty: 'Beginner', importance: 'Critical', time: '3 weeks', progress: '78%' },
      { name: 'Automation', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '70%' },
      { name: 'API Testing', difficulty: 'Intermediate', importance: 'High', time: '2 weeks', progress: '66%' },
      { name: 'CI/CD', difficulty: 'Intermediate', importance: 'Medium', time: '2 weeks', progress: '60%' },
    ],
    projects: { beginner: ['Bug Report', 'Test Case Suite', 'Smoke Test'], intermediate: ['Automation Script', 'Cross-browser Testing', 'API Regression'], advanced: ['End-to-End Test Framework', 'Performance Suite', 'Release Quality Dashboard'] },
    applications: ['Web Apps', 'Mobile Apps', 'E-commerce', 'SaaS'],
    opportunities: ['Product Companies', 'QA Teams', 'Startups', 'Enterprises'],
    certs: ['ISTQB Foundation', 'Playwright Certification'],
    resources: { docs: ['Playwright Docs', 'Selenium Docs'], videos: ['Automation Step by Step', 'TestAutomation University'], courses: ['Software Testing Bootcamp', 'QA Automation'], practice: ['Test Automation University', 'BrowserStack'], books: ['Lessons Learned in Software Testing', 'The Art of Software Testing'], websites: ['testautomationu.applitools.com', 'roadmap.sh/qa'] },
    insights: { salary: '$75k - $115k', demand: 'High', future: 'Excellent', remote: 'High', experience: '0-2 years' },
  }),
  buildRoleProfile({
    name: 'Software Engineer',
    icon: '💻',
    description: 'Build maintainable systems through engineering best practices.',
    demand: 'Very High',
    salary: '$100k+',
    duration: '8-10 months',
    difficulty: 'Intermediate',
    companies: ['Google', 'Microsoft', 'Amazon', 'Stripe'],
    subRoles: ['Backend Engineer', 'Platform Engineer', 'Full Stack Engineer'],
    reason: 'This path fits people who enjoy solving technical problems across the stack.',
    alternatives: ['Full Stack Developer', 'Backend Developer', 'DevOps Engineer'],
    phases: [
      { title: 'Programming & Data Structures', goal: 'Strengthen the fundamentals of software construction.', topics: ['Data structures', 'Algorithms', 'OOP', 'System design basics'], concepts: ['Complexity', 'Debugging', 'Modularity'], practice: 'Solve coding challenges weekly.', project: 'Build a CLI tool.', resources: ['LeetCode', 'CS50'], duration: '4 weeks' },
      { title: 'Application Engineering', goal: 'Create scalable and maintainable applications.', topics: ['APIs', 'Testing', 'Architecture', 'Git'], concepts: ['Design patterns', 'Refactoring', 'Code reviews'], practice: 'Ship a small service or app.', project: 'Task management app.', resources: ['Refactoring Guru', 'Clean Code'], duration: '4 weeks' },
      { title: 'Systems & Reliability', goal: 'Handle real-world complexity and scale.', topics: ['Concurrency', 'Databases', 'Caching', 'Performance'], concepts: ['Observability', 'Security', 'Continuous delivery'], practice: 'Stress-test and optimize an app.', project: 'Build a resilient service.', resources: ['System Design Primer', 'High Scalability'], duration: '4 weeks' },
    ],
    skills: [
      { name: 'Algorithms', difficulty: 'Intermediate', importance: 'Critical', time: '4 weeks', progress: '73%' },
      { name: 'System Design', difficulty: 'Advanced', importance: 'High', time: '4 weeks', progress: '67%' },
      { name: 'Testing', difficulty: 'Intermediate', importance: 'High', time: '3 weeks', progress: '69%' },
      { name: 'Architecture', difficulty: 'Advanced', importance: 'High', time: '3 weeks', progress: '61%' },
    ],
    projects: { beginner: ['CLI Utility', 'Notes App', 'Quiz Game'], intermediate: ['Task Manager', 'Blog Platform', 'Inventory App'], advanced: ['Scalable Service', 'Real-Time App', 'Marketplace Backend'] },
    applications: ['Product Engineering', 'Enterprise Software', 'APIs', 'Platforms'],
    opportunities: ['Big Tech', 'Startups', 'Consulting', 'FinTech'],
    certs: ['AWS Developer', 'Microsoft Azure Fundamentals'],
    resources: { docs: ['MDN', 'System Design Primer'], videos: ['Gaurav Sen', 'freeCodeCamp'], courses: ['CS50', 'Software Engineering Bootcamp'], practice: ['LeetCode', 'HackerRank'], books: ['Clean Code', 'Designing Data-Intensive Applications'], websites: ['roadmap.sh/software-engineer'] },
    insights: { salary: '$100k - $160k', demand: 'Very High', future: 'Excellent', remote: 'High', experience: '1-3 years' },
  }),
]

const roleThemeMap = {
  backend: { primary: '#2563eb', secondary: '#38bdf8', surface: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
  frontend: { primary: '#7c3aed', secondary: '#f472b6', surface: 'linear-gradient(135deg, #fdf2f8, #f5e7ff)' },
  full: { primary: '#0f766e', secondary: '#2dd4bf', surface: 'linear-gradient(135deg, #ecfeff, #ccfbf1)' },
  python: { primary: '#ea580c', secondary: '#fb923c', surface: 'linear-gradient(135deg, #fff7ed, #ffedd5)' },
  java: { primary: '#b45309', secondary: '#f59e0b', surface: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
  react: { primary: '#2563eb', secondary: '#60a5fa', surface: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
  angular: { primary: '#dc2626', secondary: '#fb7185', surface: 'linear-gradient(135deg, #fef2f2, #ffe4e6)' },
  vue: { primary: '#16a34a', secondary: '#4ade80', surface: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
  flutter: { primary: '#0284c7', secondary: '#22d3ee', surface: 'linear-gradient(135deg, #ecfeff, #cffafe)' },
  android: { primary: '#16a34a', secondary: '#84cc16', surface: 'linear-gradient(135deg, #f7fee7, #ecfccb)' },
  ios: { primary: '#7c3aed', secondary: '#8b5cf6', surface: 'linear-gradient(135deg, #faf5ff, #ede9fe)' },
  devops: { primary: '#4338ca', secondary: '#818cf8', surface: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
  cloud: { primary: '#0f766e', secondary: '#34d399', surface: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
  cyber: { primary: '#1d4ed8', secondary: '#60a5fa', surface: 'linear-gradient(135deg, #eff6ff, #bfdbfe)' },
  data: { primary: '#7c2d12', secondary: '#f59e0b', surface: 'linear-gradient(135deg, #fff7ed, #ffedd5)' },
  ai: { primary: '#7c3aed', secondary: '#a78bfa', surface: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' },
  ui: { primary: '#be185d', secondary: '#f472b6', surface: 'linear-gradient(135deg, #fdf2f8, #fce7f3)' },
  qa: { primary: '#15803d', secondary: '#4ade80', surface: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
  software: { primary: '#334155', secondary: '#94a3b8', surface: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' },
}

const getRoleTheme = (roleName = '') => {
  const lowerName = roleName.toLowerCase()
  const match = Object.entries(roleThemeMap).find(([key]) => lowerName.includes(key))
  return match ? match[1] : roleThemeMap.software
}

const getRoadmapPhases = (role) => {
  const basePhases = Array.isArray(role?.phases) ? role.phases : []
  const roleName = role?.name || ''
  const lowerName = roleName.toLowerCase()

  const rolePillars = lowerName.includes('frontend') || lowerName.includes('react') || lowerName.includes('angular') || lowerName.includes('vue')
    ? ['Responsive UI', 'Accessibility', 'Design systems', 'Performance', 'Testing', 'Delivery']
    : lowerName.includes('backend') || lowerName.includes('java') || lowerName.includes('python')
      ? ['APIs', 'Security', 'Databases', 'Caching', 'Scaling', 'Reliability']
      : lowerName.includes('full')
        ? ['Integration', 'Deployment', 'Authentication', 'Monitoring', 'Product thinking', 'Optimization']
        : lowerName.includes('devops') || lowerName.includes('cloud')
          ? ['Automation', 'CI/CD', 'Containers', 'Observability', 'Security', 'Reliability']
          : lowerName.includes('data') || lowerName.includes('scientist') || lowerName.includes('analyst') || lowerName.includes('engineer')
            ? ['Analytics', 'Data modeling', 'Visualization', 'Automation', 'Storytelling', 'Delivery']
            : lowerName.includes('ai') || lowerName.includes('ml')
              ? ['Models', 'Data preparation', 'Evaluation', 'Prompting', 'Deployment', 'Safety']
              : lowerName.includes('ui') || lowerName.includes('ux') || lowerName.includes('design')
                ? ['Research', 'Wireframes', 'Prototyping', 'Systems', 'Accessibility', 'Handoff']
                : lowerName.includes('qa')
                  ? ['Testing strategy', 'Automation', 'Regression', 'CI', 'Performance', 'Reporting']
                  : ['Fundamentals', 'Execution', 'Architecture', 'Delivery', 'Leadership', 'Launch']

  const fallbackPhases = [
    {
      title: basePhases[0]?.title || 'Foundation & Core Concepts',
      goal: basePhases[0]?.goal || `Build the fundamentals behind ${roleName}.`,
      topics: basePhases[0]?.topics?.length ? basePhases[0].topics : ['Core concepts', 'Hands-on practice', 'Small exercises'],
      concepts: basePhases[0]?.concepts?.length ? basePhases[0].concepts : ['Problem solving', 'Debugging', 'Iteration'],
      practice: basePhases[0]?.practice || 'Complete guided exercises and note your learnings.',
      project: basePhases[0]?.project || `Create a starter project for ${roleName}.`,
      resources: basePhases[0]?.resources?.length ? basePhases[0].resources : ['Official docs', 'Beginner tutorials'],
      duration: basePhases[0]?.duration || '3 weeks',
    },
    {
      title: basePhases[1]?.title || 'Build the Core Workflow',
      goal: basePhases[1]?.goal || `Learn the practical workflow used in ${roleName} projects.`,
      topics: basePhases[1]?.topics?.length ? basePhases[1].topics : ['Core tools', 'Workflow', 'Collaboration'],
      concepts: basePhases[1]?.concepts?.length ? basePhases[1].concepts : ['Best practices', 'Code quality', 'Version control'],
      practice: basePhases[1]?.practice || 'Practice the workflow through repeatable exercises.',
      project: basePhases[1]?.project || `Build a focused project that uses the core workflow.`,
      resources: basePhases[1]?.resources?.length ? basePhases[1].resources : ['Guided labs', 'Reference projects'],
      duration: basePhases[1]?.duration || '3 weeks',
    },
    {
      title: basePhases[2]?.title || 'Create a Strong Portfolio Piece',
      goal: basePhases[2]?.goal || `Apply what you have learned in a meaningful project.`,
      topics: basePhases[2]?.topics?.length ? basePhases[2].topics : [...rolePillars.slice(0, 3)],
      concepts: basePhases[2]?.concepts?.length ? basePhases[2].concepts : ['Execution', 'Refinement', 'Documentation'],
      practice: basePhases[2]?.practice || 'Build a polished mini-project and share it publicly.',
      project: basePhases[2]?.project || `Ship a complete project that reflects ${roleName}.`,
      resources: basePhases[2]?.resources?.length ? basePhases[2].resources : ['Portfolio examples', 'Case studies'],
      duration: basePhases[2]?.duration || '3 weeks',
    },
    {
      title: basePhases[3]?.title || 'Strengthen Reliability & Quality',
      goal: basePhases[3]?.goal || `Make your work production ready and dependable.`,
      topics: basePhases[3]?.topics?.length ? basePhases[3].topics : [...rolePillars.slice(3, 6)],
      concepts: basePhases[3]?.concepts?.length ? basePhases[3].concepts : ['Testing', 'Review', 'Optimization'],
      practice: basePhases[3]?.practice || 'Improve your project with testing, feedback, and polish.',
      project: basePhases[3]?.project || `Refine your project for reliability and readability.`,
      resources: basePhases[3]?.resources?.length ? basePhases[3].resources : ['Quality benchmarks', 'Code reviews'],
      duration: basePhases[3]?.duration || '3 weeks',
    },
    {
      title: `${roleName} Specialization`,
      goal: `Go beyond the basics with advanced ${roleName.toLowerCase()} techniques.`,
      topics: [rolePillars[0], rolePillars[1], rolePillars[2], 'Advanced workflows', 'Mentored practice'],
      concepts: ['Optimization', 'Trade-offs', 'Scalability'],
      practice: `Work on a challenge that mirrors a real ${roleName} task.`,
      project: `Create an advanced showcase project with deeper functionality.`,
      resources: ['Advanced tutorials', 'Architecture guides'],
      duration: '3 weeks',
    },
    {
      title: 'Career Readiness & Launch',
      goal: `Turn your roadmap into a portfolio-ready story for hiring.`,
      topics: ['Resume story', 'Interview prep', 'Portfolio refinement', 'Networking', 'Application strategy'],
      concepts: ['Communication', 'Showcase value', 'Career positioning'],
      practice: 'Prepare your projects, resume, and talking points for interviews.',
      project: `Package your learning journey into a hiring-ready portfolio.`,
      resources: ['Interview prep', 'Hiring guides'],
      duration: '2 weeks',
    },
  ]

  return fallbackPhases.map((phase, index) => ({
    ...phase,
    title: basePhases[index]?.title || phase.title,
    goal: basePhases[index]?.goal || phase.goal,
    topics: basePhases[index]?.topics?.length ? basePhases[index].topics : phase.topics,
    concepts: basePhases[index]?.concepts?.length ? basePhases[index].concepts : phase.concepts,
    practice: basePhases[index]?.practice || phase.practice,
    project: basePhases[index]?.project || phase.project,
    resources: basePhases[index]?.resources?.length ? basePhases[index].resources : phase.resources,
    duration: basePhases[index]?.duration || phase.duration,
  }))
}

const popularRoles = [
  { name: 'Software Engineer', description: 'Build robust applications and real-world software products.', demand: 'Very High', salary: '$100k+' },
  { name: 'Frontend Developer', description: 'Create elegant, interactive, and polished web interfaces.', demand: 'High', salary: '$85k+' },
  { name: 'Backend Developer', description: 'Develop scalable APIs, databases, and server logic.', demand: 'Very High', salary: '$95k+' },
  { name: 'Full Stack Developer', description: 'Bridge the gap between frontend and backend systems.', demand: 'High', salary: '$90k+' },
  { name: 'Python Developer', description: 'Build automation, APIs, and data-driven products with Python.', demand: 'High', salary: '$90k+' },
  { name: 'React Developer', description: 'Create modern, interactive user interfaces with React.', demand: 'High', salary: '$90k+' },
  { name: 'DevOps Engineer', description: 'Automate delivery pipelines and reliable infrastructure.', demand: 'High', salary: '$100k+' },
  { name: 'Data Scientist', description: 'Use statistics and machine learning to solve complex problems.', demand: 'Very High', salary: '$100k+' },
  { name: 'AI Engineer', description: 'Build next-generation AI experiences and automation tools.', demand: 'High', salary: '$120k+' },
  { name: 'Data Analyst', description: 'Turn raw data into business insights and decisions.', demand: 'High', salary: '$80k+' },
  { name: 'UI/UX Designer', description: 'Design accessible and delightful digital experiences.', demand: 'High', salary: '$75k+' },
  { name: 'QA Engineer', description: 'Strengthen quality through thoughtful testing and automation.', demand: 'High', salary: '$75k+' },
]

const companyCards = [
  { name: 'Google', logoUrl: new URL('../assets/google logpp.png', import.meta.url).toString(), roles: 'Software Engineer, Cloud Engineer', tech: 'Go, Python, Kubernetes', description: 'Work on large-scale infrastructure and AI-powered products.' },
  { name: 'Microsoft', logoUrl: new URL('../assets/microsoft logo.png', import.meta.url).toString(), roles: 'Backend Engineer, AI Engineer', tech: 'Azure, C#, Python', description: 'Shape developer tools, cloud platforms, and intelligent services.' },
  { name: 'Amazon', logoUrl: new URL('../assets/amazon.png', import.meta.url).toString(), roles: 'Backend Engineer, DevOps Engineer', tech: 'Java, AWS, Python', description: 'Build distributed systems powering global commerce.' },
  { name: 'Meta', logoUrl: new URL('../assets/meta logo.png', import.meta.url).toString(), roles: 'Frontend Engineer, Platform Engineer', tech: 'React, GraphQL, Python', description: 'Create immersive products and internal platform tooling.' },
  { name: 'Apple', logoUrl: new URL('../assets/apple logo.jpeg', import.meta.url).toString(), roles: 'iOS Engineer, UX Engineer', tech: 'Swift, SwiftUI, Metal', description: 'Design elegant consumer products and software experiences.' },
  { name: 'Tesla', logoUrl: new URL('../assets/tesla logo.png', import.meta.url).toString(), roles: 'Embedded Engineer, Robotics Engineer', tech: 'C++, Python, ROS', description: 'Build autonomous vehicle systems and next-gen energy solutions.' },
  { name: 'Netflix', logoUrl: new URL('../assets/Netflix logo.png', import.meta.url).toString(), roles: 'Frontend Engineer, Data Engineer', tech: 'React, AWS, Python', description: 'Deliver fast, personalized streaming experiences worldwide.' },
  { name: 'IBM', logoUrl: new URL('../assets/IBM logo.png', import.meta.url).toString(), roles: 'Cloud Engineer, AI Engineer', tech: 'Watson, Kubernetes, Java', description: 'Create enterprise AI systems and cloud-first business platforms.' },
]

export default function RoadmapPage() {
  const [query, setQuery] = useState('')
  const [activeRole, setActiveRole] = useState('Backend Developer')
  const [view, setView] = useState('discovery')
  const [openPhase, setOpenPhase] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [askOpen, setAskOpen] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [shareFeedback, setShareFeedback] = useState('')
  const rolesCarouselRef = useRef(null)
  const companyCarouselRef = useRef(null)

  const selectedRole = useMemo(() => roleDatabase.find((role) => role.name === activeRole) || roleDatabase[0], [activeRole])
  const roadmapPhases = useMemo(() => getRoadmapPhases(selectedRole), [selectedRole])
  const roadmapTheme = useMemo(() => getRoleTheme(selectedRole.name), [selectedRole.name])

  useEffect(() => {
    setOpenPhase(-1)
  }, [selectedRole.name])

  const scrollByCard = (carouselRef, direction) => {
    if (!carouselRef.current) return

    const firstCard = carouselRef.current.querySelector('article')
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320
    const gap = 16
    const scrollDistance = cardWidth + gap

    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollDistance : scrollDistance,
      behavior: 'smooth',
    })
  }

  const scrollRoles = (direction) => scrollByCard(rolesCarouselRef, direction)
  const scrollCompanies = (direction) => scrollByCard(companyCarouselRef, direction)

  const suggestions = useMemo(() => {
    const value = query.toLowerCase().trim()
    if (!value) {
      return roleDatabase.map((role) => role.name).slice(0, 12)
    }

    return roleDatabase
      .map((role) => role.name)
      .filter((name) => name.toLowerCase().includes(value))
      .slice(0, 8)
  }, [query])

  const handleGenerate = (roleName) => {
    setActiveRole(roleName)
    setView('generated')
    setShowSuggestions(false)
    setActiveSuggestionIndex(0)
    setQuery(roleName)
  }

  const generateRoadmapSummary = (role) => {
    const phaseLines = role.phases.map((phase, index) => [
      `Phase ${index + 1}: ${phase.title}`,
      `  Goal: ${phase.goal}`,
      `  Duration: ${phase.duration}`,
      `  Topics: ${phase.topics.join(', ')}`,
      `  Concepts: ${phase.concepts.join(', ')}`,
      `  Practice: ${phase.practice}`,
      `  Project: ${phase.project}`,
      `  Resources: ${phase.resources.join(', ')}`,
    ].join('\n'))

    const skillLines = role.skills.map((skill) => `- ${skill.name}: ${skill.difficulty}, ${skill.importance}, ${skill.progress}`)
    const projectLines = Object.entries(role.projects).flatMap(([level, items]) => [`${level[0].toUpperCase() + level.slice(1)} projects:`, ...items.map((item) => `- ${item}`)])

    return [
      `${role.name} Roadmap`,
      role.description,
      '',
      'Phases:',
      ...phaseLines,
      '',
      'Skills:',
      ...skillLines,
      '',
      'Recommended Projects:',
      ...projectLines,
      '',
      'Learn more at EduMind.',
    ].join('\n')
  }

  const handleDownloadRoadmap = () => {
    const content = generateRoadmapSummary(selectedRole)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${selectedRole.name.replace(/\s+/g, '-').toLowerCase()}-roadmap.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(link.href)
  }

  const buildShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.href : 'https://edumind.app/roadmap'
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}role=${encodeURIComponent(selectedRole.name)}`
  }

  const handleNativeShare = async () => {
    const shareData = {
      title: `${selectedRole.name} Roadmap`,
      text: `Explore the ${selectedRole.name} roadmap from EduMind.`,
      url: buildShareUrl(),
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setShareFeedback('Shared successfully.')
        return
      } catch {
        setShareFeedback('Sharing cancelled. You can still copy the link manually.')
      }
    }

    try {
      await navigator.clipboard.writeText(buildShareUrl())
      setShareFeedback('Share link copied to clipboard.')
    } catch {
      setShareFeedback('Unable to share automatically. Please copy the link manually.')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl())
      setShareFeedback('Roadmap link copied to clipboard.')
    } catch {
      setShareFeedback('Unable to copy share link.')
    }
  }

  const handleShareToSocial = (platform) => {
    const shareText = `Explore the ${selectedRole.name} roadmap from EduMind.`
    const url = buildShareUrl()

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n${url}`)}`,
      email: `mailto:?subject=${encodeURIComponent(`${selectedRole.name} Roadmap`)}&body=${encodeURIComponent(`${shareText}\n${url}`)}`,
    }

    window.open(links[platform], '_blank', 'noopener,noreferrer')
    setShareFeedback(`Opened ${platform === 'whatsapp' ? 'WhatsApp' : platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'X' : 'email'} share.`)
  }

  const handleDownloadImage = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
        <rect width="100%" height="100%" rx="32" fill="#0f172a" />
        <rect x="40" y="40" width="1320" height="820" rx="28" fill="#111827" stroke="#4f46e5" stroke-width="2" />
        <text x="80" y="120" fill="#f8fafc" font-size="42" font-family="Arial, sans-serif">${selectedRole.name} Roadmap</text>
        <text x="80" y="165" fill="#cbd5e1" font-size="24" font-family="Arial, sans-serif">${selectedRole.description}</text>
        ${selectedRole.phases.slice(0, 5).map((phase, index) => `
          <rect x="80" y="${220 + index * 120}" width="1240" height="90" rx="18" fill="#111827" stroke="#334155" />
          <circle cx="120" cy="${265 + index * 120}" r="16" fill="#4f46e5" />
          <text x="150" y="${272 + index * 120}" fill="#f8fafc" font-size="24" font-family="Arial, sans-serif">Phase ${index + 1}: ${phase.title}</text>
          <text x="150" y="${300 + index * 120}" fill="#94a3b8" font-size="18" font-family="Arial, sans-serif">${phase.goal}</text>
        `).join('')}
      </svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedRole.name.replace(/\s+/g, '-').toLowerCase()}-roadmap.svg`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setShareFeedback('Roadmap image downloaded.')
  }

  const handleKeyDown = (event) => {
    if (!showSuggestions && event.key === 'ArrowDown') {
      setShowSuggestions(true)
      setActiveSuggestionIndex(0)
      return
    }

    if (!suggestions.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveSuggestionIndex((index) => (index + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestionIndex((index) => (index - 1 + suggestions.length) % suggestions.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const selectedName = suggestions[activeSuggestionIndex] || suggestions[0]
      if (selectedName) {
        handleGenerate(selectedName)
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleShareRoadmap = async () => {
    setShowShareMenu((value) => !value)
    setShareFeedback('')
  }

  return (
    <div className="roadmap-page">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-pill">
            <Sparkles size={16} />
            AI Career Mentor
          </div>
          <h1>Find Your Perfect Career Path</h1>
          <p>
            Confused about which role suits you? Search any career path and let EduMind generate a personalized roadmap with the right skills, projects, and guidance.
          </p>

          <form
            className="search-shell"
            onSubmit={(event) => {
              event.preventDefault()
              const chosenRole = query.trim() || activeRole
              handleGenerate(chosenRole)
            }}
          >
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveSuggestionIndex(0)
                setShowSuggestions(true)
              }}
              onFocus={() => {
                setShowSuggestions(true)
                setActiveSuggestionIndex(0)
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 140)}
              onKeyDown={handleKeyDown}
              placeholder="Search your dream role..."
            />
            <button type="submit">Generate</button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-box" role="listbox" aria-label="Role suggestions">
                {suggestions.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={index === activeSuggestionIndex ? 'suggestion-active' : ''}
                    onMouseDown={() => handleGenerate(item)}
                  >
                    <Search size={14} />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="example-tags">
            <span>Software Engineer</span>
            <span>Backend Developer</span>
            <span>AI Engineer</span>
            <span>Data Analyst</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="mentor-card">
            <div className="mentor-avatar">✦</div>
            <div>
              <h3>AI Mentor</h3>
              <p>Personalized advice for your next career move.</p>
            </div>
          </div>

        </div>
      </section>

      {view === 'discovery' ? (
        <>
          <section className="section-block">
            <div className="section-header">
              <div>
                <p className="eyebrow">Popular Career Roles</p>
                <h2>Choose a role to start your roadmap</h2>
              </div>
            </div>
            <div className="role-carousel-wrapper">
              <button className="carousel-arrow carousel-arrow-left" type="button" onClick={() => scrollRoles('left')}>
                <ChevronLeft size={18} />
              </button>
              <div className="role-carousel" ref={rolesCarouselRef}>
                {popularRoles.map((role) => (
                  <article key={role.name} className="role-card role-carousel-item">
                    <div className="role-card-top">
                      <div className="role-badge">{role.name === 'AI Engineer' ? '🤖' : role.name === 'Frontend Developer' ? '🎨' : role.name === 'Backend Developer' ? '⚙️' : '💡'}</div>
                      <div>
                        <h3>{role.name}</h3>
                        <p>{role.description}</p>
                      </div>
                    </div>
                    <div className="card-meta">
                      <span>Demand: {role.demand}</span>
                      <span>Salary: {role.salary}</span>
                    </div>
                    <button type="button" onClick={() => handleGenerate(role.name)}>
                      Generate Roadmap
                      <ArrowRight size={16} />
                    </button>
                  </article>
                ))}
              </div>
              <button className="carousel-arrow carousel-arrow-right" type="button" onClick={() => scrollRoles('right')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className="section-block">
            <div className="section-header">
              <div>
                <p className="eyebrow">Top Hiring Companies</p>
                <h2>Where your next role could be</h2>
              </div>
            </div>
            <div className="company-carousel-wrapper">
              <button className="carousel-arrow carousel-arrow-left" type="button" onClick={() => scrollCompanies('left')}>
                <ChevronLeft size={18} />
              </button>
              <div className="company-carousel" ref={companyCarouselRef}>
                {companyCards.map((company) => (
                  <article key={company.name} className="company-card company-carousel-item">
                    <div className="company-logo">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={`${company.name} logo`} />
                      ) : (
                        company.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3>{company.name}</h3>
                      <p>{company.description}</p>
                      <div className="company-pill-row">
                        <span>{company.roles}</span>
                      </div>
                      <div className="company-pill-row">
                        <span>{company.tech}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button className="carousel-arrow carousel-arrow-right" type="button" onClick={() => scrollCompanies('right')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className="section-block">
            <div className="recommendation-panel">
              <div className="section-header">
                <div>
                  <p className="eyebrow">AI Career Recommendation</p>
                  <h2>Recommended for you</h2>
                </div>
              </div>
              <div className="recommendation-card">
                <div className="recommendation-head">
                  <div className="recommendation-badge"><Brain size={18} /></div>
                  <div>
                    <h3>Recommended Role: {selectedRole.name}</h3>
                    <p>{selectedRole.reason}</p>
                  </div>
                </div>
                <div className="recommendation-list">
                  <div>
                    <strong>Alternative Roles</strong>
                    <ul>
                      {selectedRole.alternatives.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Why it fits</strong>
                    <ul>
                      <li>Strong problem-solving focus</li>
                      <li>High demand in startups and MNCs</li>
                      <li>Excellent project-based learning path</li>
                    </ul>
                  </div>
                </div>
                <button type="button" onClick={() => handleGenerate(selectedRole.name)}>
                  Explore Roadmap
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="roadmap-view">
          <div className="roadmap-header">
            <div>
              <p className="eyebrow">Generated Roadmap</p>
              <h2>{selectedRole.name} Roadmap</h2>
              <p>{selectedRole.description}</p>
            </div>
            <div className="roadmap-actions">
              <button type="button" className="ghost-btn" onClick={() => setView('discovery')}>
                Back to Discovery
              </button>
              <button type="button" className="primary-btn" onClick={handleDownloadRoadmap}>
                <Download size={16} />
                Download 
              </button>
              <div className="share-menu-wrapper">
                <button type="button" className="ghost-btn" onClick={handleShareRoadmap}>
                  <Share2 size={16} />
                  Share 
                </button>
                {showShareMenu && (
                  <div className="share-menu">
                    <button type="button" onClick={handleNativeShare}><Share2 size={15} />Native Share</button>
                    <button type="button" onClick={handleCopyLink}><Copy size={15} />Copy Link</button>
                    <button type="button" onClick={handleDownloadImage}><ImagePlus size={15} />Download Image</button>
                    <button type="button" onClick={() => handleShareToSocial('whatsapp')}><MessageCircleMore size={15} />WhatsApp</button>
                    <button type="button" onClick={() => handleShareToSocial('linkedin')}><Globe2 size={15} />LinkedIn</button>
                    <button type="button" onClick={() => handleShareToSocial('twitter')}><Send size={15} />X / Twitter</button>
                    <button type="button" onClick={() => handleShareToSocial('email')}><Mail size={15} />Email</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <ClockIcon />
              <div>
                <strong>Estimated Duration</strong>
                <span>{selectedRole.duration}</span>
              </div>
            </div>
            <div className="stat-card">
              <Target size={18} />
              <div>
                <strong>Difficulty</strong>
                <span>{selectedRole.difficulty}</span>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp size={18} />
              <div>
                <strong>Average Salary</strong>
                <span>{selectedRole.salary}</span>
              </div>
            </div>
            <div className="stat-card">
              <BriefcaseBusiness size={18} />
              <div>
                <strong>Demand</strong>
                <span>{selectedRole.demand}</span>
              </div>
            </div>
          </div>

          <div className="roadmap-sections">
            <div className="phases-section">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Roadmap Phases</p>
                  <h2>Expandable learning path</h2>
                </div>
              </div>
              <div className="phase-list">
                {roadmapPhases.map((phase, index) => {
                  const isOpen = openPhase === index
                  return (
                    <article key={`${phase.title}-${index}`} className={`phase-card ${isOpen ? 'open' : ''}`}>
                      <button type="button" className="phase-toggle" onClick={() => setOpenPhase((current) => (current === index ? -1 : index))}>
                        <div>
                          <p>Phase {index + 1}</p>
                          <h3>{phase.title}</h3>
                        </div>
                        <div className="phase-toggle-actions">
                          <span className="phase-toggle-icon">{isOpen ? '−' : '+'}</span>
                          <span className="phase-toggle-label">{isOpen ? 'Close' : 'Open'}</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="phase-body">
                          <div className="phase-meta">
                            <div><strong>Objective</strong><p>{phase.goal}</p></div>
                            <div><strong>Estimated Duration</strong><p>{phase.duration}</p></div>
                          </div>
                          <div className="phase-columns">
                            <div>
                              <strong>Complete Topics</strong>
                              <ul>{phase.topics.map((item) => <li key={item}>{item}</li>)}</ul>
                            </div>
                            <div>
                              <strong>Concepts</strong>
                              <ul>{phase.concepts.map((item) => <li key={item}>{item}</li>)}</ul>
                            </div>
                          </div>
                          <div className="phase-columns">
                            <div>
                              <strong>Practice</strong>
                              <p>{phase.practice}</p>
                            </div>
                            <div>
                              <strong>Mini Project</strong>
                              <p>{phase.project}</p>
                            </div>
                          </div>
                          <div>
                            <strong>Resources</strong>
                            <div className="resource-tags">{phase.resources.map((item) => <span key={item}>{item}</span>)}</div>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>

            <div className="panel-card roadmap-banner-card">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Role-Based Roadmap</p>
                  <h2>Phase-by-phase growth path</h2>
                </div>
              </div>
              <div className="roadmap-visual" style={{ '--roadmap-accent': roadmapTheme.primary, '--roadmap-accent-2': roadmapTheme.secondary, '--roadmap-surface': roadmapTheme.surface }}>
                <div className="roadmap-visual-start">
                  <span>🏁</span>
                  <strong>START</strong>
                </div>
                <div className="roadmap-track">
                  {roadmapPhases.map((phase, index) => (
                    <div key={`${phase.title}-${index}`} className="roadmap-node-wrap">
                      <div className="roadmap-node">
                        <div className="roadmap-marker">{index === roadmapPhases.length - 1 ? '🏆' : index === 0 ? '🚀' : '📍'}</div>
                        <div className="roadmap-node-copy">
                          <div className="roadmap-pill">Phase {index + 1}</div>
                          <h3>{phase.title}</h3>
                          <p>{phase.goal}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="roadmap-visual-finish">
                  <span>🏆</span>
                  <strong>FINISH</strong>
                  <p>{selectedRole.name}</p>
                </div>
              </div>
            </div>

            <div className="panel-card">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Recommended Projects</p>
                  <h2>Resume-worthy ideas</h2>
                </div>
              </div>
              <div className="project-sections">
                {Object.entries(selectedRole.projects).map(([level, items]) => (
                  <div key={level}>
                    <h3>{level[0].toUpperCase() + level.slice(1)}</h3>
                    <ul>
                      {items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="panel-card">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Real World Applications</p>
                  <h2>Where this role matters</h2>
                </div>
              </div>
              <div className="chip-list">
                {selectedRole.applications.map((item) => <span key={item}>{item}</span>)}
              </div>
              <p className="panel-copy">Backend and platform engineers power online services, data pipelines, cloud products, and customer-facing systems that modern companies depend on daily.</p>
            </div>

            <div className="panel-card">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Career Opportunities</p>
                  <h2>Industries hiring now</h2>
                </div>
              </div>
              <div className="chip-list">
                {selectedRole.opportunities.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="panel-card">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Certification Recommendations</p>
                  <h2>Boost your credibility</h2>
                </div>
              </div>
              <div className="chip-list">
                {selectedRole.certs.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className="panel-card">
              <div className="section-header compact">
                <div>
                  <p className="eyebrow">Learning Resources</p>
                  <h2>Everything you need</h2>
                </div>
              </div>
              <div className="resource-pill-list">
                <div><strong>Official docs</strong><p>{selectedRole.resources.docs.join(', ')}</p></div>
                <div><strong>Video tutorials</strong><p>{selectedRole.resources.videos.join(', ')}</p></div>
                <div><strong>Practice platforms</strong><p>{selectedRole.resources.practice.join(', ')}</p></div>
                <div><strong>Books</strong><p>{selectedRole.resources.books.join(', ')}</p></div>
              </div>
            </div>
          </div>

          <div className="insight-card-large">
            <div className="section-header compact">
              <div>
                <p className="eyebrow">Career Insights</p>
                <h2>What to expect next</h2>
              </div>
            </div>
            <div className="insight-stats">
              <div><strong>Average Salary</strong><p>{selectedRole.insights.salary}</p></div>
              <div><strong>Demand</strong><p>{selectedRole.insights.demand}</p></div>
              <div><strong>Future Scope</strong><p>{selectedRole.insights.future}</p></div>
              <div><strong>Remote Jobs</strong><p>{selectedRole.insights.remote}</p></div>
              <div><strong>Required Experience</strong><p>{selectedRole.insights.experience}</p></div>
            </div>
            <div className="cta-row">
              <button type="button" className="primary-btn"><GraduationCap size={16} />Start Learning</button>
              <button type="button" className="ghost-btn" onClick={() => setAskOpen(true)}><MessageCircleMore size={16} />Ask AI</button>
            </div>
          </div>
        </section>
      )}
      <AiChatModal open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  )
}

function ClockIcon() {
  return <div className="icon-bubble"><BookOpen size={18} /></div>
}
