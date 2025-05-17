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
import { Search } from "lucide-react";
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
      setTimeout(() => {
        const questionTypes = ["technical", "behavioral", "general", "company-specific"];
        
        const mockQuestions: InterviewQuestion[] = [
          {
            id: "1",
            question: "What do you know about our company culture?",
            answer: `Research shows that ${company || 'this company'} values innovation and teamwork. Mention specific values from their website and how they align with your personal values.`,
            type: "company-specific"
          },
          {
            id: "2",
            question: "Why are you interested in this position?",
            answer: `Explain how your skills align specifically with the ${role || 'this role'} position and what attracts you to work with ${company || 'this company'}.`,
            type: "general"
          },
          {
            id: "3",
            question: "Describe a challenging project you worked on.",
            answer: "Choose a relevant project that showcases skills needed for this role. Describe the challenge, your approach, and the outcome.",
            type: "behavioral"
          },
          {
            id: "4",
            question: "How do you handle tight deadlines?",
            answer: "Demonstrate your time management skills with a specific example of how you prioritized tasks to meet an important deadline.",
            type: "behavioral"
          },
          {
            id: "5",
            question: "What are your salary expectations?",
            answer: "Research the market rates for this role and be prepared to give a range that aligns with your experience and the company's typical compensation.",
            type: "general"
          },
          {
            id: "6",
            question: "Tell me about a time you failed and what you learned.",
            answer: "Choose a genuine failure that wasn't catastrophic. Focus on what you learned and how it improved your subsequent work.",
            type: "behavioral"
          },
          {
            id: "7",
            question: "How do you stay updated with industry trends?",
            answer: "Mention specific blogs, communities, conferences, or courses you follow to stay updated with the latest technologies and methodologies.",
            type: "general"
          },
          {
            id: "8",
            question: `What do you know about ${company || 'our'} products/services?`,
            answer: `Research ${company || 'the company'}'s main products or services. Be specific about features you admire and how they solve problems for customers.`,
            type: "company-specific"
          },
          {
            id: "9",
            question: "How would you improve our product?",
            answer: "Research their product beforehand. Suggest realistic improvements that show you understand their market and customers.",
            type: "company-specific"
          },
          {
            id: "10",
            question: "What's your approach to debugging a complex issue?",
            answer: "Outline your systematic approach: reproducing the issue, isolating components, using debugging tools, and documenting the solution.",
            type: "technical"
          },
          {
            id: "11",
            question: "How do you handle disagreements with team members?",
            answer: "Describe a specific situation where you had a disagreement, how you approached it professionally, and how you reached a resolution.",
            type: "behavioral"
          },
          {
            id: "12",
            question: "What are your greatest strengths and weaknesses?",
            answer: "For strengths, focus on relevant skills for the role. For weaknesses, mention genuine areas of improvement and steps you're taking to address them.",
            type: "general"
          },
          {
            id: "13",
            question: "Explain a complex technical concept in simple terms.",
            answer: "Choose a concept relevant to the role and explain it without jargon, using analogies or examples that a non-technical person would understand.",
            type: "technical"
          },
          {
            id: "14",
            question: "How do you prioritize tasks when you have multiple deadlines?",
            answer: "Explain your methodology for prioritization (urgency vs importance matrix, impact assessment) and give a specific example of when you handled multiple deadlines.",
            type: "behavioral"
          },
          {
            id: "15",
            question: "What questions do you have for us?",
            answer: "Prepare thoughtful questions about the role, team structure, challenges, or growth opportunities that demonstrate your serious interest in the position.",
            type: "general"
          },
          {
            id: "16",
            question: `What challenges do you think ${company || 'our company'} faces in the current market?`,
            answer: `Research ${company || 'the company'}'s market position and competitors. Identify realistic challenges they might face and potential solutions.`,
            type: "company-specific"
          },
          {
            id: "17",
            question: "Describe your ideal work environment.",
            answer: "Align your answer with what you know about the company culture, but be honest about what helps you be productive.",
            type: "general"
          },
          {
            id: "18",
            question: "How do you handle feedback and criticism?",
            answer: "Describe how you actively seek feedback, listen without defensiveness, evaluate it objectively, and use it for improvement.",
            type: "behavioral"
          },
          {
            id: "19",
            question: "What are your career goals for the next 5 years?",
            answer: "Outline realistic goals that show ambition but also commitment to the company and role you're applying for.",
            type: "general"
          },
          {
            id: "20",
            question: "How would your colleagues describe you?",
            answer: "Choose 3-4 positive traits that are relevant to teamwork and the role, with brief examples of how you've demonstrated these traits.",
            type: "behavioral"
          }
        ];
        
        setQuestions(mockQuestions);
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
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Interview Preparation</h1>
            <p className="text-muted-foreground">
              Find questions and answers to prepare for your upcoming interviews
            </p>
          </div>
          
          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input 
                    placeholder="e.g. Google, Microsoft" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">Job Role</label>
                  <Input 
                    placeholder="e.g. Frontend Developer" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button 
                    className="w-full" 
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? "Generating..." : "Generate Questions"}
                    {!isLoading && <Search className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Questions Section */}
          {questions.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Top Questions
                    {company && role 
                      ? ` for ${role} at ${company}` 
                      : company 
                        ? ` at ${company}` 
                        : role 
                          ? ` for ${role} position` 
                          : ''}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredQuestions.length} questions to help you prepare
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 w-full md:w-auto">
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-[250px]"
                  />
                </div>
              </div>
              
              <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveCategory}>
                <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <TabsTrigger key={key} value={key} className="flex-1 md:flex-none">
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredQuestions.map((q) => (
                    <AccordionItem key={q.id} value={q.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start">
                          <span className="mr-2">{q.question}</span>
                          <Badge variant="outline" className="ml-auto">
                            {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-muted/30 rounded-md">
                          {q.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="mb-2">No questions found matching your search.</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Want more personalized preparation help?
                </p>
                <Button>Get AI Interview Coach</Button>
              </div>
            </>
          )}
          
          {!isLoading && questions.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Start Your Interview Preparation</CardTitle>
                <CardDescription>
                  Enter a company name and job role to get customized interview questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center py-6">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No Questions Generated Yet
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Enter a company name or job role above to get AI-generated interview questions
                    and preparation tips.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrepPage;
