import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Brain, Target, Lightbulb } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";

interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  type: string;
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
  
  useEffect(() => {
    if (companyParam && roleParam) {
      handleSearch();
    }
  }, [companyParam, roleParam]);
  
  const handleSearch = async () => {
    if (!company.trim() && !role.trim()) {
      toast.error("Please enter a company name or job role");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Generate AI-powered interview questions
      // In a real app, this would call an AI API endpoint
      
      // For now, we'll use a more sophisticated mock that feels like AI
      setTimeout(() => {
        const companyName = company || "the company";
        const jobRole = role || "the position";
        
        const questionTypes = ["technical", "behavioral", "general", "company-specific"];
        
        const generateQuestionSet = () => {
          // Technical questions
          const technicalQuestions = [
            {
              id: `tech-1-${Date.now()}`,
              question: `What technologies and frameworks are you most experienced with for ${jobRole}?`,
              answer: `Focus on technologies mentioned in the job description for ${companyName}. Explain your experience level with each, provide specific examples of projects where you've used them, and highlight any measurable outcomes.`,
              type: "technical"
            },
            {
              id: `tech-2-${Date.now()}`,
              question: `Explain how you would design a scalable system for high traffic applications.`,
              answer: `Discuss concepts like load balancing, caching strategies, database optimization, and horizontal scaling. Mention specific examples from your experience where you improved system performance.`,
              type: "technical"
            },
            {
              id: `tech-3-${Date.now()}`,
              question: `How do you ensure code quality and maintainability in your projects?`,
              answer: `Mention practices like code reviews, automated testing (unit, integration, e2e), CI/CD pipelines, documentation, and adherence to coding standards. If ${companyName} is known for specific engineering practices, align your answer accordingly.`,
              type: "technical"
            },
            {
              id: `tech-4-${Date.now()}`,
              question: `Describe your approach to debugging a complex issue in a production environment.`,
              answer: `Outline a systematic approach: analyzing logs, reproducing the issue in controlled environments, using monitoring tools, isolating components, implementing fixes, and validating solutions. Provide a specific example if possible.`,
              type: "technical"
            },
            {
              id: `tech-5-${Date.now()}`,
              question: `How do you stay updated with the latest trends and technologies in your field?`,
              answer: `Mention specific resources like technical blogs, conferences, online courses, community involvement, side projects, and professional networks. If ${companyName} uses cutting-edge technologies, emphasize your interest in those areas.`,
              type: "technical"
            }
          ];
          
          // Behavioral questions
          const behavioralQuestions = [
            {
              id: `behav-1-${Date.now()}`,
              question: "Tell me about a time you faced a significant challenge in a project and how you overcame it.",
              answer: "Use the STAR method (Situation, Task, Action, Result) to structure your response. Choose a relevant example that showcases skills needed for the role at " + companyName + ". Focus on your problem-solving approach and the positive outcome.",
              type: "behavioral"
            },
            {
              id: `behav-2-${Date.now()}`,
              question: "Describe a situation where you had to work with a difficult team member.",
              answer: "Focus on how you managed the relationship constructively. Highlight communication skills, empathy, and conflict resolution. Emphasize the positive outcome for the team and project, avoiding negative characterizations of the colleague.",
              type: "behavioral"
            },
            {
              id: `behav-3-${Date.now()}`,
              question: "Give an example of when you had to make a difficult decision with limited information.",
              answer: "Describe your decision-making process, how you gathered what information was available, assessed risks, and made a calculated decision. Explain the outcome and what you learned from the experience.",
              type: "behavioral"
            },
            {
              id: `behav-4-${Date.now()}`,
              question: "Tell me about a time you received constructive criticism and how you responded to it.",
              answer: "Choose an example that shows your growth mindset. Explain how you actively listened to the feedback, avoided defensiveness, implemented changes, and ultimately improved your performance or skills as a result.",
              type: "behavioral"
            },
            {
              id: `behav-5-${Date.now()}`,
              question: "Describe a situation where you had to prioritize multiple important tasks with competing deadlines.",
              answer: "Explain your prioritization methodology, how you communicated with stakeholders, delegated if appropriate, and managed your time effectively. Highlight your organizational skills and ability to work under pressure.",
              type: "behavioral"
            }
          ];
          
          // General questions
          const generalQuestions = [
            {
              id: `gen-1-${Date.now()}`,
              question: "Why are you interested in this position?",
              answer: `Connect your career goals and skills to the specific role at ${companyName}. Show that you've researched the position by referencing key responsibilities from the job description and explaining why they excite you.`,
              type: "general"
            },
            {
              id: `gen-2-${Date.now()}`,
              question: "What are your greatest strengths and areas for development?",
              answer: `For strengths, choose 2-3 that are directly relevant to the ${jobRole} position. For development areas, mention genuine areas for growth but frame them positively by explaining how you're actively working to improve them.`,
              type: "general"
            },
            {
              id: `gen-3-${Date.now()}`,
              question: "Where do you see yourself professionally in 5 years?",
              answer: `Outline realistic career goals that show ambition while aligning with potential growth paths at ${companyName}. Research career progression within the company if possible. Show commitment to developing deeper expertise in relevant areas.`,
              type: "general"
            },
            {
              id: `gen-4-${Date.now()}`,
              question: "What's your ideal work environment?",
              answer: `Research ${companyName}'s culture before answering. Describe elements that both match their known environment and genuinely help you thrive. Consider mentioning team dynamics, management style, and work-life balance factors.`,
              type: "general"
            },
            {
              id: `gen-5-${Date.now()}`,
              question: "What are your salary expectations?",
              answer: `Research the market rate for ${jobRole} positions in your area and at ${companyName} specifically if possible. Prepare to give a range rather than a specific number, and emphasize that you're flexible and more interested in the overall opportunity.`,
              type: "general"
            }
          ];
          
          // Company-specific questions
          const companySpecificQuestions = [
            {
              id: `comp-1-${Date.now()}`,
              question: `What do you know about ${companyName} and why do you want to work here?`,
              answer: `Research ${companyName}'s mission, values, products/services, recent news, and culture. Demonstrate genuine interest by connecting their mission to your personal values and career aspirations. Mention specific aspects of the company that appeal to you.`,
              type: "company-specific"
            },
            {
              id: `comp-2-${Date.now()}`,
              question: `How do you think you can contribute to ${companyName}'s goals and success?`,
              answer: `Connect your specific skills and experiences to the company's known challenges or objectives. Reference any industry knowledge you have and how your background would add value to their specific business context.`,
              type: "company-specific"
            },
            {
              id: `comp-3-${Date.now()}`,
              question: `What excites you most about the products/services that ${companyName} offers?`,
              answer: `Show that you've used or researched their products/services. Share specific features or aspects you admire and why they matter to users. If relevant, compare to competitors and highlight what makes ${companyName}'s offerings stand out.`,
              type: "company-specific"
            },
            {
              id: `comp-4-${Date.now()}`,
              question: `How would you improve our product/service?`,
              answer: `Offer constructive, well-reasoned suggestions based on your understanding of ${companyName}'s products and target audience. Balance praise with thoughtful ideas for enhancement. This shows analytical thinking without being overly critical.`,
              type: "company-specific"
            },
            {
              id: `comp-5-${Date.now()}`,
              question: `What challenges do you think ${companyName} faces in the current market?`,
              answer: `Research industry trends and ${companyName}'s position in the market. Mention 1-2 potential challenges but also discuss how these could be opportunities, showing strategic thinking and business awareness.`,
              type: "company-specific"
            }
          ];
          
          return [
            ...technicalQuestions, 
            ...behavioralQuestions,
            ...generalQuestions,
            ...companySpecificQuestions
          ];
        };
        
        setQuestions(generateQuestionSet());
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error generating interview questions:", error);
      toast.error("Failed to generate interview questions");
      setIsLoading(false);
    }
  };
  
  const categoryLabels: Record<string, string> = {
    "all": "All Questions",
    "technical": "Technical",
    "behavioral": "Behavioral",
    "general": "General",
    "company-specific": "Company Specific"
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
              Master your interviews with AI-powered questions and expert answers tailored to your target company and role.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Curated Questions</h3>
                <p className="text-sm text-muted-foreground">Industry-specific content</p>
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
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Expert Insights</h3>
                <p className="text-sm text-muted-foreground">Professional guidance</p>
              </div>
            </div>
          </div>
          
          {/* Search Section */}
          <Card className="mb-12 border-gradient-to-r from-purple-200/50 via-blue-200/50 to-indigo-200/50 dark:from-purple-800/50 dark:via-blue-800/50 dark:to-indigo-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Generate Custom Questions
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Enter your target company and role to get personalized interview questions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
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
            </CardContent>
          </Card>
          
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
                    {filteredQuestions.length} expertly crafted questions to boost your confidence
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
                <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-2 h-14 p-1 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="flex-1 md:flex-none text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white px-6 py-3"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {filteredQuestions.map((q) => (
                    <AccordionItem 
                      key={q.id} 
                      value={q.id}
                      className="border-2 border-purple-200/50 dark:border-purple-800/50 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                    >
                      <AccordionTrigger className="text-left py-6 hover:no-underline">
                        <div className="flex items-start justify-between w-full">
                          <span className="mr-4 text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{q.question}</span>
                          <Badge 
                            variant="outline" 
                            className="ml-auto shrink-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold px-3 py-1"
                          >
                            {q.type.charAt(0).toUpperCase() + q.type.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/30 dark:border-purple-800/30 mt-4">
                          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{q.answer}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-12 text-center">
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
                  </CardContent>
                </Card>
              )}
              
            </>
          )}
          
          {!isLoading && questions.length === 0 && (
            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Start Your Interview Preparation
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Enter a company name and job role to get customized interview questions and expert guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center py-12">
                  <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 mb-6">
                    <Search className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                    Ready to Ace Your Interview?
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
                    Generate personalized interview questions and get expert tips tailored to your dream job and company.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-purple-600 to-blue-600 border-t-transparent"></div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrepPage;
