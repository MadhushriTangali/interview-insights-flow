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

    // Generate new questions using OpenAI
    const prompt = `Generate 3 realistic interview questions for a ${role} position at ${company}. 
    Include technical, behavioral, and company-specific questions.
    
    For each question, provide:
    1. The question text
    2. A detailed suggested answer (150-200 words)
    3. A practical example (50-75 words)
    4. The question type (technical, behavioral, general, company-specific, project-based, or leadership)

    Make the questions challenging but realistic for the role level.
    Research the company and include specific details about their products, culture, or recent developments.
    
    Format the response as a JSON array with objects containing: question, answer, example, type`;

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
            content: 'You are an expert interview coach who creates realistic interview questions. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const openAIData = await response.json();
    const generatedContent = openAIData.choices[0].message.content;

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(generatedContent);
    } catch (e) {
      // Fallback if JSON parsing fails
      console.error('Failed to parse OpenAI response as JSON:', generatedContent);
      generatedQuestions = [
        {
          question: `What programming languages and frameworks are you most proficient in for ${role} roles at ${company}?`,
          answer: `Discuss the technologies mentioned in the job description. Highlight your strongest languages first, then mention frameworks you've used in production. Be specific about years of experience and mention any certifications.`,
          example: `"I have 4 years of experience with JavaScript and React, having built 8 production applications. I'm also proficient in Node.js for backend development and have worked with PostgreSQL databases."`,
          type: "technical"
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