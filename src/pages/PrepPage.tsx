
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
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
  
  const handleSearch = async () => {
    if (!company.trim() && !role.trim()) {
      toast.error("Please enter a company name or job role");
      return;
    }

    if (!user) {
      toast.error("Please log in to generate questions");
      return;
    }
    
    setIsLoading(true);
    setCurrentPage(1);
    setQuestions([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
        body: {
          company: company.trim(),
          role: role.trim(),
          userId: user.id,
          page: 1
        }
      });

      if (error) throw error;

      if (data.questions) {
        setQuestions(data.questions);
        setHasMore(data.hasMore);
        if (data.fromCache) {
          toast.success("Questions loaded from your saved collection");
        } else {
          toast.success("New questions generated successfully!");
        }
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || !user) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
        body: {
          company: company.trim(),
          role: role.trim(),
          userId: user.id,
          page: nextPage
        }
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        setQuestions(prev => [...prev, ...data.questions]);
        setCurrentPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more questions:', error);
      toast.error("Failed to load more questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
