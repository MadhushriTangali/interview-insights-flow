import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { NewsItem } from "@/types";
import { toast } from "sonner";

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate AI-powered job listings
  useEffect(() => {
    const fetchJobOpenings = async () => {
      try {
        setIsLoading(true);
        
        // Mock AI-generated job listings
        const mockJobListings: NewsItem[] = [
          {
            id: "1",
            title: "Senior Software Engineer - React",
            company: "Google",
            category: "Tech",
            description: "Join our team to build cutting-edge web applications with React, TypeScript, and Node.js. 5+ years of experience required.",
            url: "https://careers.google.com",
            createdAt: new Date()
          },
          {
            id: "2",
            title: "Product Manager - AI Products",
            company: "Microsoft",
            category: "Tech",
            description: "Lead the development of AI-powered products. Experience with product management and AI/ML technologies required.",
            url: "https://careers.microsoft.com",
            createdAt: new Date()
          },
          {
            id: "3",
            title: "Full Stack Developer",
            company: "Amazon",
            category: "Tech",
            description: "Build scalable applications using modern web technologies. Knowledge of AWS services is a plus.",
            url: "https://amazon.jobs",
            createdAt: new Date()
          },
          {
            id: "4",
            title: "Data Scientist",
            company: "Netflix",
            category: "Data",
            description: "Analyze user data to improve recommendation algorithms. Strong background in machine learning required.",
            url: "https://jobs.netflix.com",
            createdAt: new Date()
          },
          {
            id: "5",
            title: "UX Designer",
            company: "Apple",
            category: "Design",
            description: "Create beautiful, intuitive user experiences for Apple products. Portfolio showcasing excellent design skills required.",
            url: "https://apple.com/careers",
            createdAt: new Date()
          },
          {
            id: "6",
            title: "Marketing Manager",
            company: "Facebook",
            category: "Marketing",
            description: "Develop and execute marketing strategies for our products. 3+ years of experience in digital marketing required.",
            url: "https://meta.com/careers",
            createdAt: new Date()
          },
          {
            id: "7",
            title: "DevOps Engineer",
            company: "Spotify",
            category: "Tech",
            description: "Build and maintain our CI/CD pipelines and infrastructure. Experience with Kubernetes and AWS required.",
            url: "https://spotifyjobs.com",
            createdAt: new Date()
          },
          {
            id: "8",
            title: "iOS Developer",
            company: "Uber",
            category: "Tech",
            description: "Develop mobile applications for iOS devices. Swift programming and Apple's Human Interface Guidelines knowledge required.",
            url: "https://careers.uber.com",
            createdAt: new Date()
          },
          {
            id: "9",
            title: "Machine Learning Engineer",
            company: "IBM",
            category: "Data",
            description: "Build and deploy machine learning models to solve complex business problems. Experience with TensorFlow or PyTorch required.",
            url: "https://ibm.com/careers",
            createdAt: new Date()
          },
          {
            id: "10",
            title: "Technical Writer",
            company: "Oracle",
            category: "Content",
            description: "Create clear and concise technical documentation. Understanding of complex technical concepts required.",
            url: "https://oracle.com/careers",
            createdAt: new Date()
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setNewsItems(mockJobListings);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching job openings:", error);
        toast.error("Failed to load job openings");
        setIsLoading(false);
      }
    };
    
    fetchJobOpenings();
  }, []);
  
  // Get unique categories for filtering
  const categories = Array.from(new Set(newsItems.map(item => item.category)));
  
  // Filter news based on selected category
  const filteredNews = activeCategory === "all" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">News & Hiring</h1>
            <p className="text-muted-foreground">
              Latest hiring updates from top companies
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Category Tabs */}
              <Tabs 
                defaultValue="all" 
                className="mb-8"
                onValueChange={(value) => setActiveCategory(value)}
              >
                <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item) => (
                  <Card key={item.id} className="flex flex-col h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription className="mt-1">{item.company}</CardDescription>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 flex-grow">
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => window.open(item.url, "_blank")}
                      >
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No job openings found</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no job openings in the selected category.
                  </p>
                  <Button onClick={() => setActiveCategory("all")}>
                    View All Job Openings
                  </Button>
                </div>
              )}
            </>
          )}
          
          {/* Newsletter Subscription */}
          <Card className="mt-12">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Stay Updated</h2>
                  <p className="text-muted-foreground">
                    Subscribe to receive notifications about new job openings and hiring trends.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button>Subscribe</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NewsPage;
