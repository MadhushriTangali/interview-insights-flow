
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Search } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { InterviewQuestion, dummyQuestions } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PrepPage = () => {
  const [searchParams] = useSearchParams();
  const companyParam = searchParams.get("company");
  
  const [selectedCompany, setSelectedCompany] = useState<string>(companyParam || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [questions, setQuestions] = useState<InterviewQuestion[]>(dummyQuestions);
  
  // Extract unique company names and categories for filters
  const companies = Array.from(new Set(dummyQuestions.map(q => q.company)));
  const categories = Array.from(new Set(dummyQuestions.map(q => q.category)));
  
  // Filter questions based on search, company, and category
  const filteredQuestions = questions.filter(question => {
    const matchesCompany = !selectedCompany || question.company === selectedCompany;
    const matchesCategory = selectedCategory === "All" || question.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.exampleAnswers.some(answer => answer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCompany && matchesCategory && matchesSearch;
  });
  
  // Select company from URL parameter if provided
  useEffect(() => {
    if (companyParam) {
      setSelectedCompany(companyParam);
    }
  }, [companyParam]);
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Interview Preparation</h1>
            <p className="text-muted-foreground">
              Practice with commonly asked interview questions
            </p>
          </div>
          
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions or answers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Companies</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Questions List */}
          {filteredQuestions.length > 0 ? (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <CardTitle>{question.question}</CardTitle>
                        <CardDescription className="mt-2">
                          Company: {question.company} | Category: {question.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="answer-1">
                        <AccordionTrigger>Example Answer 1</AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2 pb-4">
                            <p className="text-muted-foreground whitespace-pre-line">
                              {question.exampleAnswers[0]}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="answer-2">
                        <AccordionTrigger>Example Answer 2</AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2 pb-4">
                            <p className="text-muted-foreground whitespace-pre-line">
                              {question.exampleAnswers[1]}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted/50 rounded-full p-6 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground h-12 w-12"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" y2="17" x2="12.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {selectedCompany 
                  ? `We don't have any ${selectedCategory !== 'All' ? selectedCategory + ' ' : ''}questions for ${selectedCompany} yet.`
                  : "Try adjusting your filters or search query to find questions."}
              </p>
              <Button onClick={() => {
                setSelectedCompany("");
                setSelectedCategory("All");
                setSearchQuery("");
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrepPage;
