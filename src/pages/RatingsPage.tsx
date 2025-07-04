
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { RatingVisualization } from "@/components/dashboard/rating-visualization";
import { useRatings } from "@/hooks/useRatings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BarChart3 } from "lucide-react";

const RatingsPage = () => {
  const { ratings, loading, hasRatings, overallAverage } = useRatings();

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
        <div className="container px-4 md:px-6 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white shadow-xl">
                <BarChart3 className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Performance Analytics
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Analyze your interview performance and track your improvement over time with detailed insights and visualizations.
            </p>
          </div>

          {/* Content */}
          <RatingVisualization ratings={ratings} />

          {/* Recent Feedback */}
          {hasRatings && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>Your latest self-evaluation notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ratings.slice(0, 3).map((rating, index) => (
                      <div key={rating.id} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-lg">
                            Rating #{ratings.length - index}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2">
                          Overall: {rating.overall_rating.toFixed(1)}/5
                        </div>
                        {rating.feedback && (
                          <p className="text-muted-foreground">{rating.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RatingsPage;
