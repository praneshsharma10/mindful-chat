'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@app/components/ui/button"
import { Input } from "@app/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card"

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [mood, setMood] = useState('neutral')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleMoodChange = (newMood: string) => {
    setMood(newMood)
    const moodMessage = `I'm feeling ${newMood} today.`
    handleSubmit({ preventDefault: () => {}, target: { elements: { mood: { value: moodMessage } } } } as unknown as React.FormEvent<HTMLFormElement>)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="h-[60vh] overflow-y-auto">
          {messages.map(m => (
            <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {m.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="mb-4">
            <p className="mb-2">How are you feeling today? {mood !== 'neutral' && `You selected: ${mood}`}</p>
            <div className="flex space-x-2">
              <Button onClick={() => handleMoodChange('happy')} variant="outline">😊 Happy</Button>
              <Button onClick={() => handleMoodChange('sad')} variant="outline">😢 Sad</Button>
              <Button onClick={() => handleMoodChange('anxious')} variant="outline">😰 Anxious</Button>
              <Button onClick={() => handleMoodChange('angry')} variant="outline">😠 Angry</Button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 mr-2"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Send'}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}





