
// Define types for our application
export type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
};

export type JobApplication = {
  id: string;
  userId: string;
  companyName: string;
  role: string;
  salaryLPA: string;
  interviewDate: Date;
  interviewTime: string;
  status: 'upcoming' | 'completed' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InterviewRating = {
  id: string;
  jobApplicationId: string;
  technical: number;
  managerial: number;
  projects: number;
  selfIntroduction: number;
  hrRound: number;
  dressup: number;
  communication: number;
  bodyLanguage: number;
  punctuality: number;
  overallRating: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InterviewQuestion = {
  id: string;
  company: string;
  question: string;
  exampleAnswers: string[];
  category: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'feedback' | 'system';
  isRead: boolean;
  createdAt: Date;
};

export type NewsItem = {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  url: string;
  createdAt: Date;
};

// Dummy data to be replaced with actual data from backend
export const dummyJobs: JobApplication[] = [
  {
    id: "job1",
    userId: "user1",
    companyName: "Google",
    role: "Frontend Developer",
    salaryLPA: "18",
    interviewDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    interviewTime: "10:00 AM",
    status: "upcoming",
    notes: "Prepare for React questions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "job2",
    userId: "user1",
    companyName: "Microsoft",
    role: "Software Engineer",
    salaryLPA: "20",
    interviewDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
    interviewTime: "2:00 PM",
    status: "completed",
    notes: "Asked about data structures",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "job3",
    userId: "user1",
    companyName: "Amazon",
    role: "Full Stack Developer",
    salaryLPA: "22",
    interviewDate: new Date(Date.now() - 86400000 * 7), // 7 days ago
    interviewTime: "11:30 AM",
    status: "rejected",
    notes: "Need to improve on system design",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "job4",
    userId: "user1",
    companyName: "Meta",
    role: "React Developer",
    salaryLPA: "25",
    interviewDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    interviewTime: "3:30 PM",
    status: "upcoming",
    notes: "Review React hooks",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const dummyQuestions: InterviewQuestion[] = [
  {
    id: "q1",
    company: "Google",
    question: "What is the virtual DOM in React and how does it work?",
    exampleAnswers: [
      "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a virtual DOM to render UI components and compare changes with the actual DOM, applying only necessary updates. This improves performance by reducing direct DOM manipulations.",
      "Virtual DOM is React's programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM. This process is called reconciliation. The Virtual DOM works by comparing the current state of the virtual DOM with a previous version, computing the difference, and updating the actual DOM only with what has changed."
    ],
    category: "Technical"
  },
  {
    id: "q2",
    company: "Google",
    question: "Explain your approach to responsive web design.",
    exampleAnswers: [
      "I use a mobile-first approach with CSS frameworks like Tailwind CSS. I define breakpoints for different screen sizes and test on various devices. I also use flexible layouts, relative units, and media queries to ensure the design adapts to any screen size.",
      "My approach includes flexible grids, responsive images, and CSS media queries. I start designing for mobile devices first, then progressively enhance the layout for larger screens. I use tools like Chrome DevTools to test responsiveness and ensure a consistent user experience across all devices."
    ],
    category: "Technical"
  },
  {
    id: "q3",
    company: "Microsoft",
    question: "How do you handle state management in large React applications?",
    exampleAnswers: [
      "For large applications, I prefer Redux for global state management combined with React's Context API for component-specific state. I organize the Redux store into slices for better maintainability and use middleware like Redux Thunk for asynchronous actions.",
      "I use a combination of tools depending on the application's complexity. For simpler apps, React's built-in Context API and useReducer hook are sufficient. For more complex applications, I implement Redux or Zustand with a well-structured state architecture, separating UI state from domain data."
    ],
    category: "Technical"
  },
];

export const dummyNews: NewsItem[] = [
  {
    id: "n1",
    title: "Google Opens 500 Positions for Fresh Graduates",
    company: "Google",
    description: "Google has announced 500 new positions for fresh graduates in software development and data science roles across their India offices.",
    category: "IT",
    url: "https://example.com/google-hiring",
    createdAt: new Date()
  },
  {
    id: "n2",
    title: "Amazon's Annual Recruitment Drive Begins",
    company: "Amazon",
    description: "Amazon has started their annual recruitment drive with focus on engineering and product management roles.",
    category: "IT",
    url: "https://example.com/amazon-hiring",
    createdAt: new Date()
  },
  {
    id: "n3",
    title: "TCS NQT Registrations Open",
    company: "TCS",
    description: "Tata Consultancy Services has opened registrations for their National Qualifier Test for 2025 batch graduates.",
    category: "IT",
    url: "https://example.com/tcs-nqt",
    createdAt: new Date()
  },
  {
    id: "n4",
    title: "IBM Hiring for Customer Support Executives",
    company: "IBM",
    description: "IBM is hiring for customer support executives across multiple locations in India.",
    category: "BPO",
    url: "https://example.com/ibm-support",
    createdAt: new Date()
  }
];
