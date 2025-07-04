
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RatingData {
  technical: number;
  managerial: number;
  projects: number;
  self_introduction: number;
  hr_round: number;
  dressup: number;
  communication: number;
  body_language: number;
  punctuality: number;
  overall_rating: number;
  feedback?: string;
}

interface RatingVisualizationProps {
  ratings: RatingData[];
}

const COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#6366F1', '#84CC16', '#F97316', '#14B8A6'
];

export function RatingVisualization({ ratings }: RatingVisualizationProps) {
  if (!ratings || ratings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>No ratings available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Complete your first interview rating to see your performance analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average ratings
  const avgRatings = ratings.reduce((acc, rating) => {
    Object.keys(rating).forEach(key => {
      if (key !== 'feedback' && key !== 'overall_rating') {
        acc[key] = (acc[key] || 0) + rating[key as keyof RatingData];
      }
    });
    return acc;
  }, {} as Record<string, number>);

  Object.keys(avgRatings).forEach(key => {
    avgRatings[key] = avgRatings[key] / ratings.length;
  });

  const barData = [
    { name: 'Technical', value: avgRatings.technical, fullName: 'Technical Skills' },
    { name: 'Managerial', value: avgRatings.managerial, fullName: 'Managerial Skills' },
    { name: 'Projects', value: avgRatings.projects, fullName: 'Project Explanation' },
    { name: 'Introduction', value: avgRatings.self_introduction, fullName: 'Self Introduction' },
    { name: 'HR Round', value: avgRatings.hr_round, fullName: 'HR Round' },
    { name: 'Appearance', value: avgRatings.dressup, fullName: 'Professional Appearance' },
    { name: 'Communication', value: avgRatings.communication, fullName: 'Communication Skills' },
    { name: 'Body Language', value: avgRatings.body_language, fullName: 'Body Language' },
    { name: 'Punctuality', value: avgRatings.punctuality, fullName: 'Punctuality' },
  ];

  const pieData = barData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  const overallAverage = ratings.reduce((sum, rating) => sum + rating.overall_rating, 0) / ratings.length;

  return (
    <div className="space-y-6">
      {/* Overall Rating Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Overall Performance
          </CardTitle>
          <div className="flex items-center justify-center mt-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {overallAverage.toFixed(1)}
            </div>
            <div className="ml-2 text-2xl text-muted-foreground">/5</div>
          </div>
          <CardDescription className="text-lg mt-2">
            Based on {ratings.length} interview{ratings.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>
                Your average ratings across different interview aspects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        borderColor: "#e2e8f0",
                      }}
                      formatter={(value, name, props) => [
                        `${Number(value).toFixed(1)}/5`,
                        props.payload.fullName
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Skills Distribution</CardTitle>
              <CardDescription>
                Visual breakdown of your performance across all areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, value}) => `${name}: ${value.toFixed(1)}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}/5`, 'Rating']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
