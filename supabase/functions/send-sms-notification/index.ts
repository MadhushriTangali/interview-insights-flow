
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, message, interviewDetails } = await req.json()

    if (!phone || !message) {
      throw new Error('Phone number and message are required')
    }

    // For now, we'll log the SMS notification
    // In production, you would integrate with SMS providers like Twilio, AWS SNS, etc.
    console.log(`SMS Notification:`)
    console.log(`To: ${phone}`)
    console.log(`Message: ${message}`)
    console.log(`Interview Details:`, interviewDetails)

    // Simulate SMS sending success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'SMS notification logged (would be sent in production)' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
