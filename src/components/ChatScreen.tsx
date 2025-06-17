
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bot, User, ArrowUp, CheckCircle } from 'lucide-react';
import ChatBubble from './ChatBubble';
import UserInput from './UserInput';
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
  type: 'bot' | 'user' | 'questions';
  content: string | string[];
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
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      // Mock Ollama response - replace with real API call
      const mockQuestions = [
        "Could you please tell me your full name?",
        "What's the best email address to reach you at?",
        "How old are you?",
        "What do you currently do for work?",
        "On a scale of 1-10, how satisfied are you with our service?"
      ];
      
      setCurrentQuestions(mockQuestions);
      setChatHistory([{
        id: Date.now().toString(),
        type: 'questions',
        content: mockQuestions,
        timestamp: new Date()
      }]);
      
      setUserAnswers(new Array(mockQuestions.length).fill(''));
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnswersSubmit = async (answers: string[]) => {
    setIsProcessing(true);
    setUserAnswers(answers);
    
    // Add user answers to chat
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: answers.join('\n'),
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
        surveyComplete: false
      };

      setFilledState(mockValidationResult.filledState);
      
      if (mockValidationResult.surveyComplete) {
        onComplete(mockValidationResult.filledState);
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
        setChatHistory(prev => [...prev, {
          id: Date.now().toString(),
          type: 'questions',
          content: nextQuestions,
          timestamp: new Date()
        }]);
        
        setUserAnswers(new Array(nextQuestions.length).fill(''));
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
                  Iteration {iterationCount + 1} • Answer thoughtfully and completely
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
        {currentQuestions.length > 0 && (
          <UserInput
            questions={currentQuestions}
            answers={userAnswers}
            onAnswersChange={setUserAnswers}
            onSubmit={handleAnswersSubmit}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
