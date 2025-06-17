
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bot, User, ArrowUp, CheckCircle } from 'lucide-react';
import ChatBubble from './ChatBubble';
import SingleQuestionInput from './SingleQuestionInput';
import { callOllama } from '../utils/ollamaApi';

interface SurveySchema {
  title: string;
  questions: Array<{
    id: string;
    label: string;
    type: string;
    required?: boolean;
  }>;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'question' | 'loading';
  content: string;
  timestamp: Date;
}

interface ChatScreenProps {
  formLink: string;
  onComplete: (filledState: any) => void;
}

const ChatScreen = ({ formLink, onComplete }: ChatScreenProps) => {
  const [surveySchema, setSurveySchema] = useState<SurveySchema | null>(null);
  const [filledState, setFilledState] = useState<any>({});
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [iterationCount, setIterationCount] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock form extraction - in real implementation, this would parse the Google Form
    const mockSchema: SurveySchema = {
      title: "Customer Feedback Survey",
      questions: [
        { id: "q1", label: "Full Name", type: "shortText", required: true },
        { id: "q2", label: "Email Address", type: "email", required: true },
        { id: "q3", label: "Age", type: "number", required: false },
        { id: "q4", label: "Occupation", type: "shortText", required: false },
        { id: "q5", label: "How satisfied are you with our service?", type: "scale", required: true },
        { id: "q6", label: "Additional Comments", type: "longText", required: false }
      ]
    };
    
    setSurveySchema(mockSchema);
    setIsLoading(false);
    generateInitialQuestions(mockSchema);
  }, [formLink]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const generateInitialQuestions = async (schema: SurveySchema) => {
    setIsProcessing(true);
    
    try {
      // Add welcome message
      setChatHistory([{
        id: Date.now().toString(),
        type: 'bot',
        content: "Hi! I'm here to help you fill out your survey. I'll ask you a few questions one at a time to gather the information needed. Let's get started!",
        timestamp: new Date()
      }]);

      // Mock Ollama response - replace with real API call
      const mockQuestions = [
        "Could you please tell me your full name?",
        "What's the best email address to reach you at?",
        "How old are you?",
        "What do you currently do for work?",
        "On a scale of 1-10, how satisfied are you with our service?"
      ];
      
      setCurrentQuestions(mockQuestions);
      setCurrentAnswers(new Array(mockQuestions.length).fill(''));
      
      // Ask the first question
      setTimeout(() => {
        askNextQuestion(mockQuestions, 0);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const askNextQuestion = (questions: string[], index: number) => {
    if (index < questions.length) {
      setChatHistory(prev => [...prev, {
        id: Date.now().toString(),
        type: 'question',
        content: questions[index],
        timestamp: new Date()
      }]);
      setWaitingForAnswer(true);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    if (!answer.trim()) return;

    setWaitingForAnswer(false);
    
    // Add user answer to chat
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: answer,
      timestamp: new Date()
    }]);

    // Store the answer
    const newAnswers = [...currentAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setCurrentAnswers(newAnswers);

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    // Check if we've completed 5 questions
    if (nextIndex >= currentQuestions.length) {
      // Process the batch of 5 answers
      await processBatchAnswers(newAnswers);
    } else {
      // Ask the next question after a short delay
      setTimeout(() => {
        askNextQuestion(currentQuestions, nextIndex);
      }, 1000);
    }
  };

  const processBatchAnswers = async (answers: string[]) => {
    setIsProcessing(true);
    
    // Add loading message
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      type: 'loading',
      content: "Let me process your answers and see what else I need to know...",
      timestamp: new Date()
    }]);

    try {
      // Mock validation response - replace with real API call
      const mockValidationResult = {
        filledState: {
          q1: answers[0] || '',
          q2: answers[1] || '',
          q3: answers[2] ? parseInt(answers[2]) : null,
          q4: answers[3] || '',
          q5: answers[4] ? parseInt(answers[4]) : null
        },
        contradictionsFound: [],
        surveyComplete: Math.random() > 0.3 // Higher chance of completion for demo
      };

      setFilledState(mockValidationResult.filledState);
      
      if (mockValidationResult.surveyComplete) {
        setChatHistory(prev => [...prev.slice(0, -1), {
          id: Date.now().toString(),
          type: 'bot',
          content: "Perfect! I have all the information I need to complete your survey. Let me show you the summary.",
          timestamp: new Date()
        }]);
        
        setTimeout(() => {
          onComplete(mockValidationResult.filledState);
        }, 2000);
      } else {
        // Generate next round of questions
        setIterationCount(prev => prev + 1);
        
        // Mock next questions
        const nextQuestions = [
          "Could you provide any additional comments about your experience?",
          "Is there anything specific you'd like us to improve?",
          "Would you recommend our service to others?",
          "How did you first hear about us?",
          "Any final thoughts you'd like to share?"
        ];
        
        setCurrentQuestions(nextQuestions);
        setCurrentAnswers(new Array(nextQuestions.length).fill(''));
        setCurrentQuestionIndex(0);
        
        // Remove loading message and continue
        setChatHistory(prev => [...prev.slice(0, -1), {
          id: Date.now().toString(),
          type: 'bot',
          content: "Thanks for those answers! I have a few more questions to make sure I capture everything accurately.",
          timestamp: new Date()
        }]);
        
        setTimeout(() => {
          askNextQuestion(nextQuestions, 0);
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing answers:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateProgress = () => {
    if (!surveySchema) return 0;
    const totalQuestions = surveySchema.questions.length;
    const filledQuestions = Object.values(filledState).filter(value => value !== '' && value !== null).length;
    return (filledQuestions / totalQuestions) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-800">
                  {surveySchema?.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Iteration {iterationCount + 1} • Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">Progress</div>
                <div className="w-32">
                  <Progress value={calculateProgress()} className="h-2" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(calculateProgress())}% complete
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Area */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {chatHistory.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div ref={chatEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        {waitingForAnswer && !isProcessing && (
          <SingleQuestionInput
            onSubmit={handleAnswerSubmit}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
