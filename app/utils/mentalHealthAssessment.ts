const keywords = {
    depression: ['sad', 'hopeless', 'depressed', 'unmotivated', 'tired', 'worthless', 'guilty', 'empty'],
    anxiety: ['worried', 'anxious', 'nervous', 'panic', 'fear', 'restless', 'tense', 'uneasy'],
    stress: ['overwhelmed', 'stressed', 'pressure', 'burnout', 'exhausted', 'overworked', 'frustrated'],
    anger: ['angry', 'irritated', 'furious', 'rage', 'annoyed', 'resentful', 'hostile'],
    loneliness: ['lonely', 'isolated', 'alone', 'disconnected', 'abandoned', 'rejected'],
  }
  
  export function assessMentalHealth(message: string): { issue: string; score: number } | null {
    const lowercaseMessage = message.toLowerCase()
    let highestScore = 0
    let detectedIssue = ''
  
    for (const [issue, words] of Object.entries(keywords)) {
      const score = words.reduce((count, word) => 
        lowercaseMessage.includes(word) ? count + 1 : count, 0
      )
      if (score > highestScore) {
        highestScore = score
        detectedIssue = issue
      }
    }
  
    return highestScore > 0 ? { issue: detectedIssue, score: highestScore } : null
  }
  
  