import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionRequest {
  company: string;
  role: string;
  userId: string;
  page?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company, role, userId, page = 1 }: QuestionRequest = await req.json();

    if (!company || !role || !userId) {
      return new Response(
        JSON.stringify({ error: 'Company, role, and userId are required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if questions already exist for this company and role
    const { data: existingQuestions } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('user_id', userId)
      .eq('company', company)
      .eq('role', role)
      .order('created_at', { ascending: true });

    // If we have enough questions, return them
    const questionsPerPage = 10;
    const startIndex = (page - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;

    if (existingQuestions && existingQuestions.length > startIndex) {
      const pageQuestions = existingQuestions.slice(startIndex, endIndex);
      const hasMore = existingQuestions.length > endIndex;
      
      return new Response(JSON.stringify({ 
        questions: pageQuestions,
        hasMore,
        fromCache: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate new questions using OpenAI with company-specific details
    const prompt = `You are an expert interviewer creating realistic interview questions for a ${role} position at ${company}.

REQUIREMENTS:
1. Generate exactly 10 unique, challenging interview questions
2. Research ${company}'s business, products, culture, recent news, and technologies
3. Tailor questions specifically for ${role} role requirements
4. Include questions that test both general technical skills for ${role} and company-specific knowledge
5. Questions should reflect current industry trends and company priorities

Question Distribution:
- 4 technical questions (role-specific programming/technical challenges)
- 2 behavioral questions (teamwork, problem-solving, growth mindset)
- 2 company-specific questions (${company}'s products, values, challenges)
- 1 leadership/management question (if applicable to ${role})
- 1 project-based question (real-world application)

For each question provide:
- question: The interview question (specific to ${company} and ${role})
- answer: Detailed sample answer (200-300 words) with specific examples
- example: Practical scenario or project example (75-100 words)
- type: One of: technical, behavioral, company-specific, leadership, project-based

IMPORTANT: 
- Technical questions should vary based on ${role} (frontend: React/JavaScript, backend: API/databases, data scientist: ML/Python, etc.)
- Make questions company-specific when possible (mention ${company}'s products, values, or challenges)
- Consider ${company}'s tech stack, market position, and recent developments
- Ensure questions are appropriate for ${role} seniority level
- Response must be valid JSON array only, no markdown formatting

Format exactly like this:
[
  {
    "question": "How would you approach [specific challenge] at ${company}?",
    "answer": "Detailed answer with ${company} context...",
    "example": "In a previous role, I...",
    "type": "company-specific"
  }
]

Return ONLY the JSON array, no other text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert interview coach. You MUST respond with ONLY a valid JSON array. No markdown, no explanations, no code blocks - just pure JSON array starting with [ and ending with ].' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const openAIData = await response.json();
    let generatedContent = openAIData.choices[0].message.content.trim();
    
    console.log('Raw OpenAI response:', generatedContent);
    
    // Aggressive cleaning of the response
    // Remove any markdown code blocks
    generatedContent = generatedContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    // Remove any leading/trailing text that's not JSON
    const jsonStart = generatedContent.indexOf('[');
    const jsonEnd = generatedContent.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      generatedContent = generatedContent.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('Cleaned OpenAI response:', generatedContent);

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(generatedContent);
      
      // Validate the structure
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('Invalid response structure - not an array or empty');
      }
      
      console.log(`Successfully parsed ${generatedQuestions.length} questions`);
      
      // Validate each question has required fields
      generatedQuestions = generatedQuestions.map((q, index) => ({
        question: q.question || `What interests you most about working as a ${role} at ${company}? (Question ${index + 1})`,
        answer: q.answer || `Discuss your passion for the role and company values. Research ${company}'s mission and explain how your skills align with their goals.`,
        example: q.example || `Provide a specific example from your experience that demonstrates relevant skills for ${company}.`,
        type: q.type || 'general'
      }));
      
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', generatedContent);
      console.error('Parse error:', e);
      
      // Enhanced fallback with 10 company and role-specific questions
      const generateRoleSpecificQuestions = (role: string, company: string) => {
        const roleType = role.toLowerCase();
        const baseQuestions = [
          {
            question: `How would you contribute to ${company}'s mission and what specific skills make you a good fit for this ${role} position?`,
            answer: `Research ${company}'s mission, values, and recent projects. Highlight how your technical skills, experience, and personal values align with their goals. Mention specific technologies or methodologies you've used that are relevant to their work. Demonstrate knowledge of their products or services and explain how you can help improve or scale their offerings. Show enthusiasm for their industry and discuss how you stay current with trends that affect their business.`,
            example: `"I've followed ${company}'s work in [specific area] and have [relevant experience]. In my previous role, I successfully [specific achievement] using [relevant technology/approach], which directly relates to the challenges ${company} faces in [specific domain]. I'm particularly excited about [company initiative/product] because..."`,
            type: "company-specific"
          },
          {
            question: `Tell me about a time when you had to learn a new technology quickly to meet project deadlines. How do you stay current with industry trends relevant to ${company}?`,
            answer: `Describe a specific situation where you quickly learned new technology or adapted to change. Explain your learning strategy, resources used, and how you applied the knowledge effectively. Mention how you stay updated with industry trends through blogs, courses, conferences, or community involvement. Show adaptability and continuous learning mindset. Connect this to ${company}'s technology stack or industry trends affecting their business.`,
            example: `"When our team needed to migrate to [technology relevant to ${company}], I took initiative to learn it through [specific resources], built a proof of concept, and helped train other team members. I regularly follow [industry resources relevant to ${company}] to stay current with trends that impact companies like ${company}."`,
            type: "behavioral"
          },
          {
            question: `How would you handle working in a team environment at ${company}, and what's your experience with collaboration tools and methodologies?`,
            answer: `Discuss your experience with different team structures, communication styles, and collaboration tools. Mention specific methodologies you've used (Agile, Scrum, etc.) and how you adapt to different team dynamics. Highlight examples of successful cross-functional collaboration, conflict resolution, and knowledge sharing. Show understanding of ${company}'s likely work culture and how you'd contribute positively to team dynamics.`,
            example: `"In my previous role, I worked in a cross-functional team using [methodology] and tools like [specific tools]. I successfully collaborated with [different roles] to deliver [specific project]. I believe this experience would translate well to ${company}'s collaborative environment, especially for [relevant project type]."`,
            type: "behavioral"
          },
          {
            question: `What specific projects or initiatives at ${company} interest you most, and how would you approach contributing to them as a ${role}?`,
            answer: `Research ${company}'s recent projects, initiatives, or products that align with the role. Discuss specific aspects that interest you and why. Explain how your skills and experience would contribute to these initiatives. Show knowledge of their tech stack, challenges they might face, and opportunities for innovation. Demonstrate genuine interest in their business and how you'd add value from day one.`,
            example: `"I'm particularly interested in ${company}'s [specific project/initiative] because of [specific reason]. With my experience in [relevant skill/technology], I could contribute by [specific way]. I'd approach this by [specific methodology/approach] to help ${company} achieve [specific goal]."`,
            type: "project-based"
          }
        ];

        // Add role-specific technical questions
        let technicalQuestions = [];
        
        if (roleType.includes('frontend') || roleType.includes('react') || roleType.includes('ui')) {
          technicalQuestions = [
            {
              question: `How would you optimize a React application's performance for ${company}'s scale? What specific techniques would you use?`,
              answer: `Discuss performance optimization techniques like code splitting, lazy loading, memoization (React.memo, useMemo, useCallback), virtual scrolling for large lists, and bundle optimization. Mention tools like React DevTools Profiler, Lighthouse, and webpack-bundle-analyzer. Address ${company}'s specific scale challenges and how you'd implement monitoring.`,
              example: `"In my previous role, I reduced bundle size by 40% using code splitting and lazy loading for route components. I implemented React.memo for frequently re-rendering components and used the Profiler to identify performance bottlenecks."`,
              type: "technical"
            },
            {
              question: `Explain the difference between controlled and uncontrolled components in React. When would you use each approach in a ${company} application?`,
              answer: `Controlled components have their state managed by React through props and callbacks, while uncontrolled components manage their own state internally using refs. Discuss when to use each: controlled for form validation, data flow predictability, and testing; uncontrolled for simple forms or integrating with non-React libraries. Consider ${company}'s application complexity and requirements.`,
              example: `"I implemented a complex form with real-time validation using controlled components for better user experience and data consistency. For a file upload widget integrated with a third-party library, I used uncontrolled components to avoid conflicts."`,
              type: "technical"
            },
            {
              question: `How would you implement state management in a large-scale ${company} application? Compare different approaches.`,
              answer: `Compare Redux, Zustand, Context API, and newer solutions like Jotai or Valtio. Discuss when to use each: Redux for complex state with time-travel debugging, Context for component-specific state, Zustand for simpler global state. Consider ${company}'s team size, application complexity, and performance requirements.`,
              example: `"For a dashboard application, I chose Zustand over Redux for its simplicity and smaller bundle size. I used React Query for server state management and Context API for theme and user preferences."`,
              type: "technical"
            }
          ];
        } else if (roleType.includes('backend') || roleType.includes('api') || roleType.includes('server')) {
          technicalQuestions = [
            {
              question: `How would you design a scalable API architecture for ${company}'s microservices? What patterns would you implement?`,
              answer: `Discuss RESTful design principles, API versioning strategies, authentication/authorization (JWT, OAuth), rate limiting, caching layers (Redis), database optimization, and monitoring. Consider ${company}'s scale requirements, security needs, and integration complexity. Mention patterns like Circuit Breaker, Bulkhead, and API Gateway.`,
              example: `"I designed a microservices architecture with API Gateway for routing, implemented JWT authentication with refresh tokens, used Redis for caching, and set up circuit breakers to handle service failures gracefully."`,
              type: "technical"
            },
            {
              question: `Explain database optimization strategies you would use for ${company}'s high-traffic application.`,
              answer: `Discuss indexing strategies, query optimization, database normalization vs denormalization, read replicas, connection pooling, and caching strategies. Address specific database technologies (PostgreSQL, MongoDB, etc.) and how to handle concurrent access, transactions, and data consistency at ${company}'s scale.`,
              example: `"I optimized a slow-performing API by adding composite indexes, implementing query result caching with Redis, and setting up read replicas to distribute load. This reduced response time from 2s to 200ms."`,
              type: "technical"
            },
            {
              question: `How would you implement error handling and monitoring in a distributed system at ${company}?`,
              answer: `Discuss centralized logging (ELK stack, Fluentd), distributed tracing (Jaeger, Zipkin), metrics collection (Prometheus, Grafana), error aggregation (Sentry), and alerting strategies. Explain how to handle partial failures, implement retry mechanisms, and maintain system observability at ${company}'s scale.`,
              example: `"I implemented distributed tracing across microservices using Jaeger, set up Prometheus for metrics collection, and created custom dashboards in Grafana. This reduced mean time to resolution for production issues by 60%."`,
              type: "technical"
            }
          ];
        } else if (roleType.includes('data') || roleType.includes('analyst') || roleType.includes('scientist')) {
          technicalQuestions = [
            {
              question: `How would you approach building a machine learning pipeline for ${company}'s data processing needs?`,
              answer: `Discuss data collection, cleaning, feature engineering, model selection, training, validation, and deployment. Address MLOps practices, model monitoring, A/B testing, and scaling considerations. Consider ${company}'s data volume, real-time requirements, and business objectives. Mention tools like Apache Airflow, MLflow, or Kubeflow.`,
              example: `"I built an end-to-end ML pipeline using Apache Airflow for orchestration, implemented automated feature engineering, and deployed models using Docker with automated retraining based on performance metrics."`,
              type: "technical"
            },
            {
              question: `Explain how you would handle data quality and validation in ${company}'s analytics infrastructure.`,
              answer: `Discuss data profiling, schema validation, anomaly detection, data lineage tracking, and quality metrics. Address handling missing data, outliers, and data consistency across systems. Consider ${company}'s data sources, compliance requirements, and business impact of data quality issues.`,
              example: `"I implemented automated data quality checks using Great Expectations, set up alerts for data anomalies, and created data lineage documentation that reduced data debugging time by 70%."`,
              type: "technical"
            },
            {
              question: `How would you design a real-time analytics system for ${company}'s business intelligence needs?`,
              answer: `Discuss streaming data architectures (Kafka, Kinesis), real-time processing frameworks (Apache Storm, Spark Streaming), data warehousing solutions (Snowflake, BigQuery), and visualization tools. Address latency requirements, data consistency, and scalability for ${company}'s specific use cases.`,
              example: `"I designed a real-time dashboard using Kafka for data streaming, Spark Streaming for processing, and connected it to Tableau for visualization, providing business insights with sub-second latency."`,
              type: "technical"
            }
          ];
        } else {
          // Generic technical questions for other roles
          technicalQuestions = [
            {
              question: `Describe a challenging technical problem you've solved that would be relevant to a ${role} role at ${company}. How did you approach it?`,
              answer: `Choose a problem that demonstrates skills relevant to the role at ${company}. Explain your problem-solving methodology: understanding requirements, researching solutions, implementation approach, testing, and iteration. Highlight collaboration with team members, handling of constraints, and lessons learned. Focus on technologies and processes likely used at ${company}.`,
              example: `"When our system was experiencing performance issues, I analyzed bottlenecks, researched optimization techniques, implemented a solution, and achieved measurable improvements that would be applicable to ${company}'s challenges."`,
              type: "technical"
            },
            {
              question: `How do you approach testing and quality assurance in your development process for ${role} responsibilities?`,
              answer: `Discuss testing strategies appropriate for the role: unit testing, integration testing, automated testing frameworks, code review processes, and quality metrics. Address how you ensure code reliability, maintainability, and performance. Consider ${company}'s quality standards and development practices.`,
              example: `"I implemented comprehensive testing including unit tests with Jest, integration tests, and automated end-to-end testing that reduced production bugs by 80% and improved deployment confidence."`,
              type: "technical"
            },
            {
              question: `Explain your experience with version control and collaborative development workflows relevant to ${company}.`,
              answer: `Discuss Git workflows (GitFlow, feature branching), code review practices, continuous integration/deployment, and collaboration tools. Address how you handle merge conflicts, maintain code quality, and work effectively in team environments at ${company}'s scale.`,
              example: `"I've worked with GitFlow for feature development, implemented automated CI/CD pipelines, and established code review standards that improved team productivity and code quality significantly."`,
              type: "technical"
            }
          ];
        }

        return [...baseQuestions, ...technicalQuestions, {
          question: `Describe your leadership style and how you would mentor junior team members in a ${role} position at ${company}.`,
          answer: `Discuss your approach to leadership, mentoring, and knowledge sharing. Address how you handle different learning styles, provide constructive feedback, and create growth opportunities. Consider ${company}'s culture and how you'd contribute to team development and knowledge transfer.`,
          example: `"I mentor through pair programming, code reviews, and regular one-on-ones. I've helped junior developers grow by providing structured learning paths and gradually increasing responsibility while maintaining open communication."`,
          type: "leadership"
        }];
      };

      generatedQuestions = generateRoleSpecificQuestions(role, company);
    }

    // Store questions in database
    const questionsToInsert = generatedQuestions.map((q: any) => ({
      user_id: userId,
      company,
      role,
      question: q.question,
      answer: q.answer,
      example: q.example || null,
      type: q.type || 'general'
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('interview_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting questions:', insertError);
      // Still return the generated questions even if storage fails
      return new Response(JSON.stringify({ 
        questions: questionsToInsert.map((q, index) => ({ ...q, id: `temp-${index}` })),
        hasMore: false,
        fromCache: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      questions: insertedQuestions,
      hasMore: false,
      fromCache: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in generate-interview-questions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});