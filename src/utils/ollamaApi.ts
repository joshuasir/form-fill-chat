
// Utility function for calling the Ollama API
export async function callOllama(prompt: string, payload: object) {
  try {
    // For development/demo, we'll use mock responses
    // In production, replace with actual API call to https://api.kudata.id/ai
    
    console.log('Ollama API call:', { prompt, payload });
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on prompt type
    if (prompt.includes('generate exactly five')) {
      return {
        questions: [
          "Could you please tell me your full name?",
          "What's the best email address to reach you at?",
          "How old are you?",
          "What do you currently do for work?",
          "On a scale of 1-10, how satisfied are you with our service?"
        ]
      };
    }
    
    if (prompt.includes('Using only the newly answered')) {
      return {
        filledState: payload,
        contradictionsFound: [],
        surveyComplete: Math.random() > 0.5 // Random completion for demo
      };
    }
    
    return { message: "Mock response from Ollama API" };
    
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}

// Function to extract form schema from Google Forms link
export async function extractFormSchema(formLink: string) {
  try {
    // In a real implementation, this would:
    // 1. Parse the Google Forms link
    // 2. Extract form structure and questions
    // 3. Return standardized schema
    
    console.log('Extracting form schema from:', formLink);
    
    // Mock schema for demo
    return {
      title: "Customer Feedback Survey",
      description: "Help us improve our service",
      questions: [
        { id: "q1", label: "Full Name", type: "shortText", required: true },
        { id: "q2", label: "Email Address", type: "email", required: true },
        { id: "q3", label: "Age", type: "number", required: false },
        { id: "q4", label: "Occupation", type: "shortText", required: false },
        { id: "q5", label: "How satisfied are you with our service?", type: "scale", required: true },
        { id: "q6", label: "Additional Comments", type: "longText", required: false }
      ]
    };
    
  } catch (error) {
    console.error('Error extracting form schema:', error);
    throw error;
  }
}

// Environment variables handling
export const getOllamaCredentials = () => {
  // In production, these would come from environment variables
  // For demo purposes, we'll use placeholder values
  return {
    username: process.env.OLLAMA_USER || 'demo_user',
    password: process.env.OLLAMA_PASS || 'demo_pass'
  };
};

// Function to create authorization header
export const createAuthHeader = () => {
  const { username, password } = getOllamaCredentials();
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
};
