// All portfolio content lives here. The page and the /api/chat route both read it,
// so the "Ask my resume" bot always answers from the same facts the page shows.
import {
  Github, Linkedin, Mail, Server, Brain, Cloud, Database, Layout, ShieldCheck, Workflow,
} from "lucide-react";

export const EMAIL = "mohanreddykondreddy75@gmail.com";

export const PROFILE = {
  name: "Mohanreddy Kondreddy",
  firstName: "Mohanreddy",
  title: "Java Full Stack Developer",
  location: "Mechanicsburg, PA · Open to relocate",
  tagline:
    "I build reliable Java backends, event-driven systems, and GenAI features for healthcare and financial services.",
  roles: ["Java Full Stack Developer", "Spring Boot Engineer", "Microservices & Kafka", "GenAI · Spring AI · RAG"],
  summary:
    "Java Full Stack Developer with 5+ years building enterprise systems in healthcare, financial services, and retail. I build Java 17 / Spring Boot microservices, REST APIs, and React applications on Oracle, DB2, and PostgreSQL, with event pipelines on Kafka and deployments on AWS, Docker, and Kubernetes. Currently, I work on Illinois's Medicaid/SNAP/TANF eligibility platform, handling production root-cause analysis and modernizing legacy J2EE components into Spring Boot services. Previously, I built lending and credit-risk services and a GenAI policy assistant (Spring AI, RAG) for Morgan Stanley, and migrated 35,000+ eligibility rules to Drools for California healthcare at Deloitte. MS in Computer Science and Information Systems, Saint Louis University.",
  avatar: "/avatar.jpg",
  resume: "/MohanreddyKondreddy_Resume.pdf",
  socials: [
    { label: "GitHub", icon: Github, href: "https://github.com/mohanreddyit6" },
    { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/mohanreddy-kondreddy-7b445b391" },
    { label: "Email", icon: Mail, href: `mailto:${EMAIL}` },
  ],
};

// Update these whenever you like — they show in the "Currently" strip.
export const CURRENTLY = {
  building: "This portfolio, including a resume bot you can quiz (bottom-right 👇)",
  learning: "AI — slowly turning into a robot 🤖",
  reading: "Designing Data-Intensive Applications",
  robotProgress: 37, // % human → robot
};

export const STATS = [
  { value: 5, suffix: "+", label: "Years building enterprise software" },
  { value: 35, suffix: "K+", label: "Business rules migrated to Drools" },
  { value: 35, suffix: "K", label: "Kafka events processed per day" },
  { value: 32, suffix: "%", label: "p95 latency reduction" },
];

export const TOP_SKILLS = ["Java 17", "Spring Boot", "Microservices", "Kafka", "AWS", "React", "Kubernetes", "Spring AI / RAG"];

export const SKILL_GROUPS = [
  { name: "Backend", icon: Server, items: ["Java 17", "Spring Boot", "Spring MVC", "Spring Data JPA", "Hibernate", "J2EE", "Microservices", "RESTful APIs", "GraphQL", "SOAP Web Services"] },
  { name: "Generative AI", icon: Brain, items: ["Spring AI", "LLM Integration", "RAG", "Vector Databases", "Prompt Engineering", "GitHub Copilot"] },
  { name: "Cloud & DevOps", icon: Cloud, items: ["AWS (EC2/S3/RDS/Lambda/EKS)", "Azure", "Docker", "Kubernetes", "OpenShift", "Terraform", "Jenkins", "GitHub Actions", "CI/CD"] },
  { name: "Data & Streaming", icon: Database, items: ["Oracle", "IBM DB2", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Kafka", "Schema Registry"] },
  { name: "Frontend", icon: Layout, items: ["React.js", "Redux Toolkit", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Responsive UI"] },
  { name: "Security & Observability", icon: ShieldCheck, items: ["Spring Security", "OAuth2", "JWT", "Splunk", "Prometheus", "Grafana", "ELK Stack", "CloudWatch"] },
  { name: "Rules, Testing & Practice", icon: Workflow, items: ["Drools", "Oracle Policy Automation", "Corticon", "JUnit 5", "SoapUI", "Postman", "SonarQube", "Agile/Scrum", "Root Cause Analysis", "Code Reviews", "Git"] },
];

export type Project = {
  title: string;
  tag: string;
  blurb: string;
  stack: string[];
  link: string;
  repo: string;
  image: string;
  featured?: boolean;
  metrics?: { label: string; value: number }[];
  demo?: "uhap" | "dlp"; // interactive preview with sample data
  flow?: string; // id in ARCHITECTURES
  audioDemo?: {
    src: string;
    species: string;
    scientific: string;
    credit: string;
    creditHref: string;
  };
};

export const PROJECTS: Project[] = [
  {
    title: "Bird Voice Detection",
    tag: "Machine Learning · B.E. Final Year",
    flow: "bird",
    blurb:
      "Classifies bird species from xeno-canto field recordings. Extracted 13 MFCC features per audio frame with Librosa, then trained and compared SVM, Random Forest, and XGBoost on 8,600+ frames across 60+ species. SVM performed best at 97.3% frame-level accuracy (macro F1 97.2%).",
    stack: ["Python", "Librosa", "Pandas", "R", "scikit-learn", "SVM", "Random Forest", "XGBoost", "caret"],
    link: "",
    repo: "",
    image: "/bird.jpg",
    featured: true,
    metrics: [
      { label: "SVM", value: 97.3 },
      { label: "Random Forest", value: 94.7 },
      { label: "XGBoost (F1)", value: 87.6 },
    ],
    audioDemo: {
      src: "/bird-call.mp3",
      species: "Willow Tit",
      scientific: "Poecile montanus",
      credit: "Recording XC164926 by Buhl Johannes, xeno-canto · CC BY-NC-SA 3.0",
      creditHref: "https://xeno-canto.org/164926",
    },
  },
  {
    title: "UHAP – Healthcare Analytics Dashboard",
    tag: "Academic",
    blurb:
      "Web dashboard for real-time visualization of patient visit trends and operational workflows, giving stakeholders access to patient history, provider performance, and inventory tracking.",
    stack: ["Java 17", "Java Servlets", "MySQL", "Bootstrap", "JavaScript", "jQuery", "JUnit"],
    link: "",
    repo: "",
    image: "/index7.png",
    featured: true,
    demo: "uhap",
    flow: "uhap",
  },
  {
    title: "Data Loss Prevention Monitor",
    tag: "Internship",
    blurb:
      "Web application that monitors data transactions across departments, flags unusual activity, and sends real-time alerts to prevent unauthorized data transfer.",
    stack: ["Java 8", "Java Servlets", "MySQL", "PHP", "JavaScript"],
    link: "",
    repo: "",
    image: "/dl.jpg",
    featured: true,
    demo: "dlp",
    flow: "dlp",
  },
];

export type Job = {
  company: string;
  location: string;
  title: string;
  domain: string;
  period: string;
  current?: boolean;
  tech: string[];
  points: string[];
  architectures?: string[]; // ids in ARCHITECTURES
};

export const EXPERIENCE: Job[] = [
  {
    company: "Deloitte",
    location: "USA",
    title: "Java Developer",
    domain: "Government Healthcare · State of Illinois IES",
    period: "May 2026 – Present",
    current: true,
    tech: ["Java 17", "Spring Boot", "EJB", "DB2", "Corticon", "SoapUI"],
    architectures: ["ies"],
    points: [
      "Own root-cause analysis for production defects in the Medicaid, SNAP, and TANF eligibility system serving millions of Illinois residents.",
      "Refactor legacy J2EE/EJB components into Java 17 / Spring Boot REST services.",
      "Fix Java/EJB batch defects and correct DB2 data with targeted SQL without interrupting live runs.",
      "Use GitHub Copilot and Claude to map legacy code, document business rules, and generate unit tests.",
      "Author RCA reports; update Corticon decision tables; validate fixes end to end with SoapUI.",
    ],
  },
  {
    company: "Morgan Stanley",
    location: "USA",
    title: "Full Stack Developer",
    domain: "Financial Services · Lending & Credit Risk",
    period: "Apr 2025 – Apr 2026",
    tech: ["Spring Boot", "Spring AI", "Kafka", "AWS", "Terraform", "React"],
    architectures: ["kafka", "rag"],
    points: [
      "Built a GenAI policy assistant using Spring AI, OpenAI LLMs, RAG, and a vector database.",
      "Built Java 17 / Spring Boot microservices and REST APIs for loan origination and credit risk.",
      "Engineered Kafka pipelines with Schema Registry and idempotent consumers processing ~35K events/day.",
      "Automated AWS provisioning (EKS, EC2, RDS, S3) with Terraform, cutting setup from 2 hours to 12 minutes.",
      "Built React / Redux screens for loan analysts; reduced p95 latency 32% through PostgreSQL and Redis tuning.",
    ],
  },
  {
    company: "Deloitte",
    location: "India",
    title: "Analyst",
    domain: "Healthcare · Covered California (CalHEERS)",
    period: "Jul 2021 – Jul 2023",
    tech: ["Java", "Drools", "Spring Boot", "PostgreSQL", "Jenkins", "Kubernetes"],
    architectures: ["drools"],
    points: [
      "Migrated 35,000+ business rules from Oracle Policy Automation to RedHat Drools for California healthcare (CalHEERS).",
      "Built Spring Boot REST microservices deployed on AWS EC2 for healthcare benefits and compliance integrations.",
      "Migrated Oracle workloads to PostgreSQL, redesigning schemas, queries, and indexes.",
      "Automated deployments with Jenkins, Docker, and Kubernetes; monitored production with ELK, CloudWatch, and OpenShift.",
      "Conducted code reviews and supported junior developers in an Agile team.",
    ],
  },
  {
    company: "KPIT",
    location: "India",
    title: "Software Engineer",
    domain: "Retail Commerce",
    period: "May 2020 – Jun 2021",
    tech: ["Java", "Spring Boot", "React", "Kafka", "Azure DevOps"],
    points: [
      "Built Java / Spring Boot services and React features for a retail platform with 50K+ SKUs.",
      "Cut average API response time by 22% through REST API and query optimization.",
      "Integrated Kafka for real-time order, payment, and inventory events.",
      "Automated CI/CD with Azure DevOps, Maven, and Git, shortening deployments by 30%.",
    ],
  },
  {
    company: "TechCiti Technologies",
    location: "India",
    title: "Software Developer Intern",
    domain: "Data Security",
    period: "Jun 2019 – Aug 2019",
    tech: ["Java", "PHP", "MySQL"],
    points: [
      "Built a data loss prevention web app that tracks data transactions, flags unusual activity, and sends real-time alerts.",
      "Designed core modules and database connectivity using Java, PHP, and MySQL.",
    ],
  },
];

// Animated system diagrams. Nodes render left → right with data flowing between them.
export const ARCHITECTURES: Record<string, { title: string; caption: string; nodes: { label: string; sub: string }[] }> = {
  kafka: {
    title: "Loan event pipeline",
    caption: "~35K events/day · Schema Registry enforces contracts · idempotent consumers make retries safe",
    nodes: [
      { label: "Loan Service", sub: "Spring Boot producer" },
      { label: "Kafka", sub: "topics + Schema Registry" },
      { label: "Risk Consumer", sub: "idempotent, Spring Boot" },
      { label: "PostgreSQL + Redis", sub: "store + cache" },
      { label: "React UI", sub: "loan analysts" },
    ],
  },
  rag: {
    title: "GenAI policy assistant",
    caption: "Answers grounded in lending and compliance documents, with sources cited",
    nodes: [
      { label: "Analyst question", sub: "React chat" },
      { label: "Spring AI", sub: "orchestration" },
      { label: "Vector DB", sub: "retrieve policy chunks" },
      { label: "OpenAI LLM", sub: "grounded answer" },
      { label: "Cited answer", sub: "back to analyst" },
    ],
  },
  drools: {
    title: "Rules engine migration",
    caption: "35,000+ eligibility rules moved off Oracle Policy Automation",
    nodes: [
      { label: "Oracle Policy Automation", sub: "legacy rules" },
      { label: "Rule translation", sub: "Java tooling" },
      { label: "RedHat Drools", sub: "rule engine" },
      { label: "Spring Boot APIs", sub: "eligibility services" },
      { label: "CalHEERS", sub: "California healthcare" },
    ],
  },
  bird: {
    title: "Audio classification pipeline",
    caption: "Each recording becomes thousands of labeled MFCC frames; three models compared on a held-out split",
    nodes: [
      { label: "xeno-canto", sub: "field recordings" },
      { label: "Resample", sub: "8 kHz, Librosa" },
      { label: "MFCC", sub: "13 features / frame" },
      { label: "SVM · RF · XGBoost", sub: "train + compare" },
      { label: "Species", sub: "predicted label" },
    ],
  },
  uhap: {
    title: "Dashboard architecture",
    caption: "Classic Java web stack: servlets serve JSON to a Bootstrap + jQuery dashboard",
    nodes: [
      { label: "Browser", sub: "Bootstrap + jQuery" },
      { label: "Java Servlets", sub: "controllers" },
      { label: "DAO / JDBC", sub: "queries" },
      { label: "MySQL", sub: "patients, visits, stock" },
      { label: "Charts", sub: "trends + alerts" },
    ],
  },
  dlp: {
    title: "Monitoring flow",
    caption: "Every transfer is logged, checked against rules, and alerted on in real time",
    nodes: [
      { label: "Departments", sub: "file transfers" },
      { label: "Activity logger", sub: "Java / PHP" },
      { label: "Rule checks", sub: "size, time, destination" },
      { label: "MySQL", sub: "audit trail" },
      { label: "Alerts", sub: "dashboard + email" },
    ],
  },
  ies: {
    title: "Legacy modernization",
    caption: "Production defect → root cause → fix, without interrupting live batch runs",
    nodes: [
      { label: "Prod defect", sub: "eligibility ticket" },
      { label: "RCA", sub: "Java/EJB + DB2 SQL" },
      { label: "Fix", sub: "code / Corticon / data" },
      { label: "Spring Boot", sub: "refactored service" },
      { label: "SoapUI", sub: "end-to-end validation" },
    ],
  },
};

// Education is shown as a journey (oldest → newest).
// Drop your own campus photos into /public with these names; until then a styled placeholder shows.
export const EDUCATION = [
  {
    school: "Saint Louis University",
    short: "SLU",
    place: "St. Louis, MO, USA",
    city: "St. Louis",
    flag: "🇺🇸",
    degree: "M.S. in Computer Science and Information Systems",
    detail: "GPA 3.84",
    gpa: 3.84,
    period: "Aug 2023 – May 2025",
    image: "/slu.jpg",
    accent: "from-blue-700 to-sky-500",
    highlights: ["Graduated May 2025", "Project: UHAP healthcare analytics dashboard"],
  },
  {
    school: "Alliance University",
    short: "AU",
    place: "Bangalore, India",
    city: "Bangalore",
    flag: "🇮🇳",
    degree: "B.E. in Computer Science and Engineering",
    detail: "GPA 3.4",
    gpa: 3.4,
    period: "Aug 2016 – Aug 2020",
    image: "/alliance.jpg",
    accent: "from-amber-600 to-rose-500",
    highlights: ["Final-year project: Bird Voice Detection (97.3% SVM accuracy)"],
  },
];

export const CERTIFICATIONS = [
  { name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services" },
  { name: "Docker Certified Associate (DCA)", issuer: "Docker" },
  { name: "Automation with Drools", issuer: "Coursera" },
];

// Add real recommendations only (e.g. copied from LinkedIn, with permission).
// The section stays hidden while this list is empty.
export const RECOMMENDATIONS: { quote: string; name: string; role: string }[] = [
  // { quote: "Mohan owned our toughest production defects...", name: "Full Name", role: "Manager, Deloitte" },
];

// Notes / blog. Set href when a post is published; until then it shows as "Coming soon".
export const NOTES: { title: string; summary: string; tags: string[]; href?: string }[] = [
  {
    title: "Migrating 35,000 rules from Oracle Policy Automation to Drools",
    summary: "What broke, what we automated, and how we proved the new rules matched the old ones.",
    tags: ["Drools", "Java", "Migration"],
  },
  {
    title: "Building a RAG assistant with Spring AI",
    summary: "Chunking, retrieval, and keeping answers grounded in source documents.",
    tags: ["Spring AI", "RAG", "LLM"],
  },
  {
    title: "Idempotent Kafka consumers in Spring Boot",
    summary: "Why retries create duplicates, and the patterns that make them safe.",
    tags: ["Kafka", "Spring Boot"],
  },
];
