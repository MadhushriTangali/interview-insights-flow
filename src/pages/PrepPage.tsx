
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Brain, Target, Lightbulb } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { QuestionGenerator } from "@/components/prep/question-generator";
import { toast } from "sonner";

interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  type: string;
  example?: string;
}

const PrepPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyParam = queryParams.get('company');
  const roleParam = queryParams.get('role');
  
  const [company, setCompany] = useState(companyParam || "");
  const [role, setRole] = useState(roleParam || "");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (companyParam && roleParam) {
      handleSearch();
    }
  }, [companyParam, roleParam]);
  
  const generateQuestionsForPage = (page: number, companyName: string, jobRole: string) => {
    const questionSets = [
      // Page 1 - Core Questions
      [
        {
          id: `tech-${page}-1`,
          question: `What programming languages and frameworks are you most proficient in for ${jobRole} roles?`,
          answer: `Discuss the technologies mentioned in the job description. Highlight your strongest languages first, then mention frameworks you've used in production. Be specific about years of experience and mention any certifications.`,
          type: "technical",
          example: `"I have 4 years of experience with JavaScript and React, having built 8 production applications. I'm also proficient in Node.js for backend development and have worked with PostgreSQL databases. Recently, I've been exploring TypeScript which I used in my last project at [previous company]."`
        },
        {
          id: `behav-${page}-1`,
          question: "Tell me about your greatest professional achievement.",
          answer: "Use the STAR method. Choose an achievement relevant to the role that demonstrates key skills like leadership, problem-solving, or technical expertise. Quantify the impact with specific metrics.",
          type: "behavioral",
          example: `"At my previous company, I led the development of a new user dashboard that increased customer engagement by 35%. I coordinated with 3 teams, resolved 15 technical challenges, and delivered the project 2 weeks ahead of schedule, saving the company $50,000 in development costs."`
        },
        {
          id: `comp-${page}-1`,
          question: `What do you know about ${companyName} and why do you want to work here?`,
          answer: `Research the company's mission, recent news, products, and culture. Connect their values to your career goals. Mention specific projects or initiatives that excite you.`,
          type: "company-specific",
          example: `"I'm impressed by ${companyName}'s commitment to innovation in [industry]. Your recent [specific product/initiative] aligns with my passion for [relevant area]. I particularly admire how you [specific company value/action]."`
        }
      ],
      // Page 2 - Advanced Questions
      [
        {
          id: `tech-${page}-2`,
          question: `How would you handle scaling issues in a ${jobRole} project?`,
          answer: `Discuss specific scaling strategies like caching, load balancing, database optimization, and microservices. Mention tools and technologies you've used for scaling.`,
          type: "technical",
          example: `"I'd start by identifying bottlenecks through monitoring tools like New Relic. Then implement caching strategies with Redis, optimize database queries, and consider horizontal scaling with container orchestration using Docker and Kubernetes."`
        },
        {
          id: `behav-${page}-2`,
          question: "Describe a time when you had to learn a new technology quickly.",
          answer: "Show your learning agility and adaptability. Explain your learning process, resources used, and how you applied the knowledge successfully.",
          type: "behavioral",
          example: `"When our team needed to migrate to React Hooks, I spent weekends studying documentation and building practice projects. I created a learning guide for my team and successfully refactored our main component library within 3 weeks."`
        },
        {
          id: `gen-${page}-2`,
          question: "What's your approach to code review and maintaining code quality?",
          answer: "Discuss your experience with code reviews, testing practices, and quality assurance. Mention specific tools and processes you follow.",
          type: "general",
          example: `"I believe in constructive code reviews focusing on logic, security, and maintainability. I use tools like SonarQube for static analysis and ensure 80%+ test coverage. I also advocate for pair programming for complex features."`
        }
      ],
      // Page 3 - Situational Questions
      [
        {
          id: `behav-${page}-3`,
          question: "How do you handle disagreements with team members or stakeholders?",
          answer: "Show your communication and conflict resolution skills. Emphasize listening, finding common ground, and focusing on project goals.",
          type: "behavioral",
          example: `"I focus on understanding different perspectives through active listening. I present data-driven arguments and suggest compromise solutions. In my last role, I resolved a design disagreement by creating a prototype that combined both approaches."`
        },
        {
          id: `tech-${page}-3`,
          question: `What's your experience with testing in ${jobRole} projects?`,
          answer: `Discuss different types of testing (unit, integration, e2e), testing frameworks you've used, and your approach to test-driven development.`,
          type: "technical",
          example: `"I practice test-driven development using Jest for unit tests and Cypress for end-to-end testing. I maintain 85% code coverage and have implemented automated testing pipelines in CI/CD workflows."`
        },
        {
          id: `comp-${page}-3`,
          question: `How would you contribute to ${companyName}'s engineering culture?`,
          answer: `Research their engineering practices and values. Mention specific ways you can add value based on your experience and skills.`,
          type: "company-specific",
          example: `"I'd bring my experience in mentoring junior developers and organizing tech talks. I could contribute to your open-source initiatives and help establish coding standards based on industry best practices."`
        }
      ],
      // Additional pages with more questions...
      [
        {
          id: `proj-${page}-1`,
          question: "Walk me through a challenging project you've worked on recently.",
          answer: "Choose a project that showcases multiple skills. Explain the problem, your approach, challenges faced, and the outcome. Focus on your specific contributions.",
          type: "project-based",
          example: `"I led the development of a real-time analytics dashboard for our sales team. The challenge was processing 10M+ data points with sub-second latency. I implemented a streaming architecture using Apache Kafka and built the frontend with React and WebSockets."`
        },
        {
          id: `tech-${page}-4`,
          question: "How do you stay updated with the latest technology trends?",
          answer: "Mention specific resources, communities, and practices. Show continuous learning mindset and how you evaluate new technologies.",
          type: "technical",
          example: `"I follow industry leaders on Twitter, read tech blogs like Hacker News and Dev.to, attend local meetups, and take online courses. I also contribute to open-source projects to stay hands-on with new technologies."`
        },
        {
          id: `lead-${page}-1`,
          question: "Describe your experience with leading or mentoring other developers.",
          answer: "Share specific examples of leadership, mentoring, or knowledge sharing. Highlight the impact on team productivity and individual growth.",
          type: "leadership",
          example: `"I've mentored 3 junior developers over the past 2 years. I created a structured onboarding program and held weekly 1:1s. Two of them received promotions within 18 months, and team productivity increased by 25%."`
        }
      ]
    ];

    return questionSets[page - 1] || [];
  };
  
  const handleSearch = async () => {
    if (!company.trim() && !role.trim()) {
      toast.error("Please enter a company name or job role");
      return;
    }
    
    setIsLoading(true);
    setCurrentPage(1);
    setQuestions([]);
    
    // Simulate API call delay
    setTimeout(() => {
      const companyName = company || "the company";
      const jobRole = role || "this position";
      
      const newQuestions = generateQuestionsForPage(1, companyName, jobRole);
      setQuestions(newQuestions);
      setHasMore(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    // Simulate API call delay
    setTimeout(() => {
      const companyName = company || "the company";
      const jobRole = role || "this position";
      
      const newQuestions = generateQuestionsForPage(nextPage, companyName, jobRole);
      
      if (newQuestions.length > 0) {
        setQuestions(prev => [...prev, ...newQuestions]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < 4); // Limit to 4 pages for demo
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const categoryLabels: Record<string, string> = {
    "all": "All Questions",
    "technical": "Technical",
    "behavioral": "Behavioral",
    "general": "General",
    "company-specific": "Company Specific",
    "project-based": "Project Based",
    "leadership": "Leadership"
  };
  
  // Filter questions based on search and category
  const filteredQuestions = questions
    .filter(q => 
      (activeCategory === "all" || q.type === activeCategory) &&
      (searchQuery === "" || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
        <div className="container px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white shadow-xl">
                <Brain className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Interview Preparation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master your interviews with real-time questions, expert answers, and practical examples tailored to your target company and role.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Real-time Questions</h3>
                <p className="text-sm text-muted-foreground">Fresh, relevant content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Targeted Practice</h3>
                <p className="text-sm text-muted-foreground">Company & role specific</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Expert Examples</h3>
                <p className="text-sm text-muted-foreground">Real-world examples</p>
              </div>
            </div>
          </div>
          
          {/* Search Section */}
          <div className="mb-12 p-8 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl border border-purple-200/50 dark:border-purple-800/50">
            <div className="text-center pb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Generate Custom Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Enter your target company and role to get personalized interview questions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Company Name</label>
                <Input 
                  placeholder="e.g. Google, Microsoft, Apple" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-12 text-base rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 focus:border-purple-500 dark:focus:border-purple-400"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Job Role</label>
                <Input 
                  placeholder="e.g. Frontend Developer, Data Scientist" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-12 text-base rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 focus:border-purple-500 dark:focus:border-purple-400"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate Questions"}
                  {!isLoading && <Search className="ml-3 h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Questions Section */}
          {questions.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                    Interview Questions
                    {company && role 
                      ? ` for ${role} at ${company}` 
                      : company 
                        ? ` at ${company}` 
                        : role 
                          ? ` for ${role} position` 
                          : ''}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {filteredQuestions.length} expertly crafted questions with detailed answers and examples
                  </p>
                </div>
                
                <div className="mt-6 md:mt-0 w-full md:w-auto">
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-[300px] h-12 text-base rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 focus:border-purple-500 dark:focus:border-purple-400"
                  />
                </div>
              </div>
              
              <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
                <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:flex-row gap-2 h-14 p-1 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
                  {Object.entries(categoryLabels).slice(0, 6).map(([key, label]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="flex-1 md:flex-none text-sm md:text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white px-4 md:px-6 py-3"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              {filteredQuestions.length > 0 ? (
                <QuestionGenerator
                  questions={filteredQuestions}
                  onLoadMore={handleLoadMore}
                  isLoading={isLoading}
                  hasMore={hasMore && activeCategory === "all" && searchQuery === ""}
                />
              ) : (
                <div className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl p-12 text-center">
                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">No questions found matching your search.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-3 text-base font-semibold rounded-xl"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
          
          {!isLoading && questions.length === 0 && (
            <div className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl rounded-xl p-12 text-center">
              <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 mb-6 inline-block">
                <Search className="h-16 w-16 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                Ready to Ace Your Interview?
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Generate personalized interview questions with detailed answers and real-world examples tailored to your dream job and company.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrepPage;
