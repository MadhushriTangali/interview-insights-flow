
import { useState, useEffect } from "react";
import { Calendar, Search, Tag, Building, Globe, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface NewsItem {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  url: string;
  createdAt: Date; // Added required createdAt field
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching news/jobs from an AI API
    const fetchNewsAndJobs = async () => {
      setIsLoading(true);
      
      // Simulating API delay
      setTimeout(() => {
        const mockNews: NewsItem[] = [
          {
            id: "1",
            title: "Senior Frontend Developer",
            company: "Google",
            category: "Tech",
            description: "Google is hiring senior frontend developers with expertise in React, Angular, or Vue. Join our team to build cutting-edge web applications.",
            url: "https://careers.google.com",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            id: "2",
            title: "Data Scientist",
            company: "Microsoft",
            category: "Tech",
            description: "Microsoft is looking for data scientists with experience in machine learning and artificial intelligence to join our growing team.",
            url: "https://careers.microsoft.com",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            id: "3",
            title: "Product Manager",
            company: "Apple",
            category: "Product",
            description: "Apple is seeking experienced product managers to lead the development of innovative products that will shape the future.",
            url: "https://jobs.apple.com",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            id: "4",
            title: "DevOps Engineer",
            company: "Amazon",
            category: "Tech",
            description: "Amazon Web Services is hiring DevOps engineers to help build and maintain our cloud infrastructure.",
            url: "https://amazon.jobs",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
          },
          {
            id: "5",
            title: "UX/UI Designer",
            company: "Meta",
            category: "Design",
            description: "Meta is looking for talented UX/UI designers to create engaging and intuitive user experiences for our platforms.",
            url: "https://careers.meta.com",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          },
          {
            id: "6",
            title: "Backend Developer",
            company: "Netflix",
            category: "Tech",
            description: "Netflix is seeking backend developers with experience in distributed systems to join our engineering team.",
            url: "https://jobs.netflix.com",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            id: "7",
            title: "Marketing Manager",
            company: "Salesforce",
            category: "Marketing",
            description: "Salesforce is hiring marketing managers to drive growth and build brand awareness for our cloud products.",
            url: "https://careers.salesforce.com",
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
          },
          {
            id: "8",
            title: "Software Engineer",
            company: "LinkedIn",
            category: "Tech",
            description: "LinkedIn is looking for software engineers to help build and scale our professional networking platform.",
            url: "https://careers.linkedin.com",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            id: "9",
            title: "HR Specialist",
            company: "IBM",
            category: "HR",
            description: "IBM is seeking HR specialists to support our global workforce and implement innovative HR practices.",
            url: "https://careers.ibm.com",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            id: "10",
            title: "Cloud Architect",
            company: "Oracle",
            category: "Tech",
            description: "Oracle Cloud Infrastructure is hiring experienced cloud architects to design and implement robust cloud solutions.",
            url: "https://oracle.com/careers",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          }
        ];
        
        setNews(mockNews);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchNewsAndJobs();
  }, []);

  // Filter news based on search query and category
  const filteredNews = news.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(news.map(item => item.category)))];

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">News & Hiring</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest job openings and industry news
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Input
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* News List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="space-y-6">
              {filteredNews.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-card p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="mr-4">{item.company}</span>
                          <Tag className="h-4 w-4 mr-1" />
                          <span>{item.category}</span>
                        </div>
                      </div>
                      <Badge>{new Date(item.createdAt).toLocaleDateString()}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Apply Now
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted/50 rounded-full p-6 inline-flex mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NewsPage;
