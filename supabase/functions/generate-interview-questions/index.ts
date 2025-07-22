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
    const questionsPerPage = 3;
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
1. Generate exactly 3 unique, challenging interview questions
2. Research ${company}'s business, products, culture, recent news, and technologies
3. Tailor questions specifically for ${role} role requirements
4. Include a mix of: technical, behavioral, and company-specific questions
5. Questions should reflect current industry trends and company priorities

For each question provide:
- question: The interview question (specific to ${company} and ${role})
- answer: Detailed sample answer (200-250 words) with specific examples
- example: Practical scenario or project example (75-100 words)
- type: One of: technical, behavioral, company-specific, leadership, project-based

IMPORTANT: 
- Make questions company-specific (mention ${company}'s products, values, or challenges)
- Consider ${company}'s tech stack, market position, and recent developments
- Ensure questions are appropriate for ${role} seniority level
- Response must be valid JSON array only, no additional text

Example format:
[
  {
    "question": "How would you approach [specific challenge] at ${company}?",
    "answer": "Detailed answer with ${company} context...",
    "example": "In a previous role, I...",
    "type": "company-specific"
  }
]`;

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
            content: 'You are an expert interview coach. Respond ONLY with valid JSON. No markdown, no explanations, no code blocks - just pure JSON array.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const openAIData = await response.json();
    let generatedContent = openAIData.choices[0].message.content.trim();
    
    // Clean up the response - remove markdown code blocks if present
    if (generatedContent.startsWith('```json')) {
      generatedContent = generatedContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (generatedContent.startsWith('```')) {
      generatedContent = generatedContent.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(generatedContent);
      
      // Validate the structure
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('Invalid response structure');
      }
      
      // Validate each question has required fields
      generatedQuestions = generatedQuestions.map(q => ({
        question: q.question || `What interests you most about working as a ${role} at ${company}?`,
        answer: q.answer || `Discuss your passion for the role and company values.`,
        example: q.example || 'Provide a specific example from your experience.',
        type: q.type || 'general'
      }));
      
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', generatedContent);
      console.error('Parse error:', e);
      
      // Enhanced fallback with company-specific questions
      generatedQuestions = [
        {
          question: `How would you contribute to ${company}'s mission and what specific skills make you a good fit for this ${role} position?`,
          answer: `Research ${company}'s mission, values, and recent projects. Highlight how your technical skills, experience, and personal values align with their goals. Mention specific technologies or methodologies you've used that are relevant to their work. Demonstrate knowledge of their products or services and explain how you can help improve or scale their offerings.`,
          example: `"I've followed ${company}'s work in [specific area] and have [relevant experience]. In my previous role, I successfully [specific achievement] using [relevant technology/approach], which directly relates to the challenges ${company} faces in [specific domain]."`,
          type: "company-specific"
        },
        {
          question: `Describe a challenging technical problem you've solved that would be relevant to a ${role} role. How did you approach it?`,
          answer: `Choose a problem that demonstrates skills relevant to the role. Explain your problem-solving methodology: understanding requirements, researching solutions, implementation approach, testing, and iteration. Highlight collaboration with team members, handling of constraints, and lessons learned. Focus on technologies and processes likely used at ${company}.`,
          example: `"When our system was experiencing performance issues with [specific technology], I analyzed bottlenecks, researched optimization techniques, implemented [specific solution], and achieved [quantifiable improvement] in performance metrics."`,
          type: "technical"
        },
        {
          question: `Tell me about a time when you had to learn a new technology or adapt to changing requirements. How do you stay current with industry trends?`,
          answer: `Describe a specific situation where you quickly learned new technology or adapted to change. Explain your learning strategy, resources used, and how you applied the knowledge. Mention how you stay updated with industry trends through blogs, courses, conferences, or community involvement. Show adaptability and continuous learning mindset.`,
          example: `"When our team needed to migrate to [technology], I took initiative to learn it through [specific resources], built a proof of concept, and helped train other team members. I regularly follow [industry resources] to stay current."`,
          type: "behavioral"
        }
      ];
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