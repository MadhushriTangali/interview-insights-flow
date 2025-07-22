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
    const questionsPerPage = 5;
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
1. Generate exactly 5 unique, challenging interview questions
2. Research ${company}'s business, products, culture, recent news, and technologies
3. Tailor questions specifically for ${role} role requirements
4. Include a mix of: technical, behavioral, company-specific, leadership, and project-based questions
5. Questions should reflect current industry trends and company priorities

For each question provide:
- question: The interview question (specific to ${company} and ${role})
- answer: Detailed sample answer (200-300 words) with specific examples
- example: Practical scenario or project example (75-100 words)
- type: One of: technical, behavioral, company-specific, leadership, project-based

IMPORTANT: 
- Make questions company-specific (mention ${company}'s products, values, or challenges)
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
      
      // Enhanced fallback with 5 company-specific questions
      generatedQuestions = [
        {
          question: `How would you contribute to ${company}'s mission and what specific skills make you a good fit for this ${role} position?`,
          answer: `Research ${company}'s mission, values, and recent projects. Highlight how your technical skills, experience, and personal values align with their goals. Mention specific technologies or methodologies you've used that are relevant to their work. Demonstrate knowledge of their products or services and explain how you can help improve or scale their offerings. Show enthusiasm for their industry and discuss how you stay current with trends that affect their business.`,
          example: `"I've followed ${company}'s work in [specific area] and have [relevant experience]. In my previous role, I successfully [specific achievement] using [relevant technology/approach], which directly relates to the challenges ${company} faces in [specific domain]. I'm particularly excited about [company initiative/product] because..."`,
          type: "company-specific"
        },
        {
          question: `Describe a challenging technical problem you've solved that would be relevant to a ${role} role at ${company}. How did you approach it?`,
          answer: `Choose a problem that demonstrates skills relevant to the role at ${company}. Explain your problem-solving methodology: understanding requirements, researching solutions, implementation approach, testing, and iteration. Highlight collaboration with team members, handling of constraints, and lessons learned. Focus on technologies and processes likely used at ${company}. Discuss scalability considerations and how you measured success.`,
          example: `"When our system was experiencing performance issues with [specific technology relevant to ${company}], I analyzed bottlenecks, researched optimization techniques, implemented [specific solution], and achieved [quantifiable improvement] in performance metrics. This experience would be directly applicable to ${company}'s [relevant challenge/product]."`,
          type: "technical"
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