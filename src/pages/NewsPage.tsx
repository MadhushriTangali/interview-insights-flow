
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ExternalLink, 
  Calendar, 
  TrendingUp, 
  Briefcase, 
  Users, 
  DollarSign,
  Globe,
  Filter,
  Clock
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: "hiring" | "industry" | "salary" | "remote";
  source: string;
  publishedAt: string;
  url: string;
  featured?: boolean;
}

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock news data - in a real app, this would come from an API
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: "Tech Giants Announce Massive Hiring Plans for 2024",
      description: "Major technology companies including Google, Microsoft, and Amazon have announced plans to hire over 100,000 new employees across various roles in 2024, with a focus on AI and cloud computing positions.",
      category: "hiring",
      source: "TechCrunch",
      publishedAt: "2024-01-15T10:00:00Z",
      url: "#",
      featured: true
    },
    {
      id: "2",
      title: "Remote Work Trends: 85% of Companies Offer Flexible Options",
      description: "New survey reveals that remote and hybrid work options have become standard, with most companies offering flexible arrangements to attract top talent in the competitive job market.",
      category: "remote",
      source: "Harvard Business Review",
      publishedAt: "2024-01-14T14:30:00Z",
      url: "#"
    },
    {
      id: "3",
      title: "Software Engineer Salaries Reach All-Time High",
      description: "Average software engineer salaries have increased by 15% this year, with senior positions commanding $180,000+ in major tech hubs. AI and machine learning specialists see even higher compensation.",
      category: "salary",
      source: "Stack Overflow",
      publishedAt: "2024-01-13T09:15:00Z",
      url: "#",
      featured: true
    },
    {
      id: "4",
      title: "The Rise of AI in Recruitment: What Job Seekers Need to Know",
      description: "Companies are increasingly using AI tools for initial candidate screening. Learn how to optimize your resume and interview skills for AI-powered hiring processes.",
      category: "industry",
      source: "Forbes",
      publishedAt: "2024-01-12T16:45:00Z",
      url: "#"
    },
    {
      id: "5",
      title: "Startup Ecosystem Sees 40% Increase in Job Openings",
      description: "Despite economic uncertainties, startup companies are actively hiring, offering competitive packages and equity options to attract talent from established corporations.",
      category: "hiring",
      source: "Venture Beat",
      publishedAt: "2024-01-11T11:20:00Z",
      url: "#"
    },
    {
      id: "6",
      title: "Work-Life Balance Becomes Top Priority for Job Seekers",
      description: "Recent studies show that 78% of professionals prioritize work-life balance over salary when choosing their next role, reshaping how companies structure their benefits packages.",
      category: "industry",
      source: "LinkedIn",
      publishedAt: "2024-01-10T13:00:00Z",
      url: "#"
    }
  ];

  useEffect(() => {
    // Simulate loading news
    setIsLoading(true);
    setTimeout(() => {
      setNewsItems(mockNews);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = {
    all: { label: "All News", icon: Globe, count: mockNews.length },
    hiring: { label: "Hiring Trends", icon: Users, count: mockNews.filter(n => n.category === "hiring").length },
    industry: { label: "Industry News", icon: TrendingUp, count: mockNews.filter(n => n.category === "industry").length },
    salary: { label: "Salary Insights", icon: DollarSign, count: mockNews.filter(n => n.category === "salary").length },
    remote: { label: "Remote Work", icon: Briefcase, count: mockNews.filter(n => n.category === "remote").length }
  };

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      hiring: "bg-gradient-to-r from-green-500 to-emerald-500",
      industry: "bg-gradient-to-r from-blue-500 to-indigo-500",
      salary: "bg-gradient-to-r from-purple-500 to-pink-500",
      remote: "bg-gradient-to-r from-orange-500 to-red-500"
    };
    return colors[category as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-slate-500";
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
        <div className="container px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white shadow-xl">
                <TrendingUp className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              News & Hiring Trends
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stay ahead of the curve with the latest industry news, hiring trends, and career insights to supercharge your job search.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search news and trends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 focus:border-purple-500 dark:focus:border-purple-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-2 h-auto p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
              {Object.entries(categories).map(([key, { label, icon: Icon, count }]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-3 px-6 py-4 text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                    {count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Featured News Section */}
          {selectedCategory === "all" && featuredNews.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                Featured Stories
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((item) => (
                  <Card key={item.id} className="group border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${getCategoryColor(item.category)} text-white font-semibold px-3 py-1`}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.publishedAt)}
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-muted-foreground leading-relaxed mb-6">
                        {item.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {item.source}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold rounded-lg group-hover:border-purple-600 transition-all duration-300"
                        >
                          Read More
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular News Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              {selectedCategory === "all" ? "Latest News" : `${categories[selectedCategory as keyof typeof categories]?.label}`}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-purple-600 to-blue-600 border-t-transparent"></div>
              </div>
            ) : regularNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.map((item) => (
                  <Card key={item.id} className="group border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getCategoryColor(item.category)} text-white font-medium px-2 py-1 text-xs`}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.publishedAt)}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-tight line-clamp-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          {item.source}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium p-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 mb-6 inline-block">
                    <Search className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">No Articles Found</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    {searchQuery 
                      ? "Try adjusting your search terms or explore different categories."
                      : "No articles available in this category at the moment."}
                  </p>
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery("")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 text-base font-semibold rounded-xl"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NewsPage;
