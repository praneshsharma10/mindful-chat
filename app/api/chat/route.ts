// import { OpenAIStream, StreamingTextResponse } from 'ai'
// import { Configuration, OpenAIApi } from 'openai-edge'
// import { assessMentalHealth } from '../../utils/mentalHealthAssessment'

// // Create an OpenAI API client (that's edge friendly!)
// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// })
// const openai = new OpenAIApi(config)

// export const runtime = 'edge'

// export async function POST(req: Request) {
//   if (!process.env.OPENAI_API_KEY) {
//     return new Response("OpenAI API key not configured", { status: 500 })
//   }

//   const { messages } = await req.json()
//   const lastMessage = messages[messages.length - 1].content
//   const assessment = assessMentalHealth(lastMessage)

//   let systemMessage = `
// You are an empathetic and supportive mental health chatbot. Your role is to:
// 1. Actively listen to the user's concerns.
// 2. Provide supportive and understanding responses.
// 3. Offer general coping strategies and self-care tips.
// 4. Encourage seeking professional help when appropriate.
// 5. Maintain a warm and friendly tone throughout the conversation.

// Remember:
// - Do not attempt to diagnose specific mental health conditions.
// - If the user expresses severe distress or mentions self-harm, strongly encourage them to seek immediate professional help.
// `

//   if (assessment) {
//     systemMessage += `
// The user's message contains keywords related to ${assessment.issue}. Be particularly sensitive to this topic and tailor your response accordingly.
// `
//   }

//   const response = await openai.createChatCompletion({
//     model: 'gpt-4',
//     stream: true,
//     messages: [
//       { role: 'system', content: systemMessage },
//       ...messages,
//     ],
//   })

//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response)

//   // Respond with the stream
//   return new StreamingTextResponse(stream)
// }



import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { assessMentalHealth } from '../../utils/mentalHealthAssessment'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OpenAI API key not configured", { status: 500 })
  }

  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1].content
  const assessment = assessMentalHealth(lastMessage)

  let systemMessage = `
You are an empathetic and supportive mental health chatbot. Your role is to:
1. Actively listen to the user's concerns.
2. Provide supportive and understanding responses.
3. Offer general coping strategies and self-care tips.
4. Encourage seeking professional help when appropriate.
5. Maintain a warm and friendly tone throughout the conversation.

Remember:
- Do not attempt to diagnose specific mental health conditions.
- If the user expresses severe distress or mentions self-harm, strongly encourage them to seek immediate professional help.
`

  if (assessment) {
    systemMessage += `
The user's message contains keywords related to ${assessment.issue}. Be particularly sensitive to this topic and tailor your response accordingly.
`
  }

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
  })

  return result.toDataStreamResponse()
}

