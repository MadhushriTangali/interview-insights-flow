
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Briefcase, DollarSign, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  postedDate: string;
  description: string;
  requirements: string[];
  applicationUrl: string;
}

interface JobOpeningsProps {
  role: string;
  location: string;
  onRoleChange: (role: string) => void;
  onLocationChange: (location: string) => void;
}

export function JobOpenings({ role, location, onRoleChange, onLocationChange }: JobOpeningsProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Mock job data focused on Indian locations
  const mockJobs: JobOpening[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TCS",
      location: "Bangalore, India",
      salary: "₹15-25 LPA",
      type: "full-time",
      postedDate: "2024-01-15",
      description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frameworks for global clients.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "REST API integration"],
      applicationUrl: "https://careers.tcs.com"
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "Infosys",
      location: "Hyderabad, India",
      salary: "₹12-20 LPA",
      type: "full-time",
      postedDate: "2024-01-14",
      description: "Build scalable web applications from frontend to backend. Work with React, Node.js, and cloud technologies in agile environment.",
      requirements: ["React & Node.js experience", "Database knowledge", "Cloud platform familiarity"],
      applicationUrl: "https://careers.infosys.com"
    },
    {
      id: "3",
      title: "React Developer",
      company: "Wipro",
      location: "Pune, India",
      salary: "₹8-15 LPA",
      type: "full-time",
      postedDate: "2024-01-13",
      description: "Create responsive web applications with focus on user experience and performance optimization for enterprise clients.",
      requirements: ["3+ years React", "JavaScript ES6+", "CSS/SASS proficiency"],
      applicationUrl: "https://careers.wipro.com"
    },
    {
      id: "4",
      title: "Software Engineer",
      company: "HCL Technologies",
      location: "Chennai, India",
      salary: "₹10-18 LPA",
      type: "full-time",
      postedDate: "2024-01-12",
      description: "Develop enterprise-level applications using modern web technologies and agile methodologies for international projects.",
      requirements: ["JavaScript frameworks", "Version control (Git)", "Agile experience"],
      applicationUrl: "https://careers.hcltech.com"
    },
    {
      id: "5",
      title: "Frontend Engineer",
      company: "Tech Mahindra",
      location: "Mumbai, India",
      salary: "₹9-16 LPA",
      type: "full-time",
      postedDate: "2024-01-11",
      description: "Build user-facing features for our digital transformation platform used by clients across various industries.",
      requirements: ["Modern JavaScript", "React/Vue/Angular", "Testing frameworks"],
      applicationUrl: "https://careers.techmahindra.com"
    },
    {
      id: "6",
      title: "Web Developer",
      company: "Capgemini",
      location: "Noida, India",
      salary: "₹6-12 LPA",
      type: "full-time",
      postedDate: "2024-01-10",
      description: "Create innovative web solutions and applications for diverse clients across various industries in collaborative environment.",
      requirements: ["HTML/CSS/JavaScript", "Responsive design", "CMS experience"],
      applicationUrl: "https://careers.capgemini.com"
    },
    {
      id: "7",
      title: "Senior React Developer",
      company: "Accenture",
      location: "Gurgaon, India",
      salary: "₹18-30 LPA",
      type: "full-time",
      postedDate: "2024-01-09",
      description: "Lead frontend development for large-scale enterprise applications using React and modern JavaScript technologies.",
      requirements: ["6+ years React", "Team leadership", "Architecture design"],
      applicationUrl: "https://careers.accenture.com"
    },
    {
      id: "8",
      title: "Full Stack Engineer",
      company: "Cognizant",
      location: "Kolkata, India",
      salary: "₹11-19 LPA",
      type: "full-time",
      postedDate: "2024-01-08",
      description: "Develop end-to-end web applications for healthcare and finance domains using MERN stack and cloud technologies.",
      requirements: ["MERN stack", "MongoDB", "AWS/Azure"],
      applicationUrl: "https://careers.cognizant.com"
    },
    {
      id: "9",
      title: "JavaScript Developer",
      company: "IBM India",
      location: "Bangalore, India",
      salary: "₹14-22 LPA",
      type: "full-time",
      postedDate: "2024-01-07",
      description: "Work on AI-powered web applications and contribute to open-source projects in our innovation lab.",
      requirements: ["JavaScript/TypeScript", "Node.js", "AI/ML basics"],
      applicationUrl: "https://careers.ibm.com"
    },
    {
      id: "10",
      title: "Frontend Architect",
      company: "Mindtree (LTI)",
      location: "Pune, India",
      salary: "₹25-40 LPA",
      type: "full-time",
      postedDate: "2024-01-06",
      description: "Design and architect scalable frontend solutions for enterprise clients with focus on performance and maintainability.",
      requirements: ["8+ years experience", "System design", "Team leadership"],
      applicationUrl: "https://careers.ltimindtree.com"
    }
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesRole = !role || job.title.toLowerCase().includes(role.toLowerCase()) ||
                       job.description.toLowerCase().includes(role.toLowerCase());
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    return matchesRole && matchesLocation;
  });

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleApplyNow = (job: JobOpening) => {
    // Open the application URL in a new tab
    window.open(job.applicationUrl, '_blank');
    toast.success(`Redirecting to ${job.company} careers page`);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      "part-time": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      "contract": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      "remote": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Job Role</label>
          <Input
            placeholder="e.g. Frontend Developer"
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="h-12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <Input
            placeholder="e.g. Bangalore, Mumbai"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? "Searching..." : "Search Jobs"}
          </Button>
        </div>
      </div>

      {/* Job Results */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found in India
              </h3>
              <p className="text-muted-foreground">
                Showing opportunities from top Indian companies
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getTypeColor(job.type)}>
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(job.postedDate)}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {job.title}
                    </CardTitle>
                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {job.company}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {job.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Key Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">
                          {job.company}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplyNow(job)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Apply Now
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center border-2 border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 mb-6 inline-block">
              <Briefcase className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">No Jobs Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or explore different roles and locations in India.
            </p>
            <Button 
              onClick={() => {
                onRoleChange("");
                onLocationChange("");
              }}
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
