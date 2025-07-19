import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, User, ArrowUp, CheckCircle } from "lucide-react";
import ChatBubble from "./ChatBubble";
import SingleQuestionInput from "./SingleQuestionInput";
import { callOllama } from "../utils/ollamaApi";

interface ConvoSchema {
  title: string;
  questions: Array<{
    id: string;
    label: string;
    type: string;
    required?: boolean;
    answer?: string;
    intent?: string;
    des?: string;
  }>;
}

interface SurveySchema {
  title: string;
  questions: Array<{
    id: string;
    label: string;
    type: string;
    required?: boolean;
    answer?: string;
  }>;
  isFilled?:boolean;
}

interface ChatMessage {
  id: string;
  type: "bot" | "user" | "question" | "loading";
  content: string;
  timestamp: Date;
}

interface ChatScreenProps {
  formLink: string;
  onComplete: (filledState: any) => void;
  googleToken?: string | null;
}

const ChatScreen = ({ formLink, onComplete, googleToken }: ChatScreenProps) => {
  const [surveySchema, setSurveySchema] = useState<SurveySchema | null>(null);
  const [convoSchema, setConvoSchema] = useState<ConvoSchema | null>(null);
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

  useEffect(()=>{
    if(!surveySchema) return;
    console.log(convoSchema)
   

    if(surveySchema?.isFilled){
      setChatHistory((prev) => [
          ...prev.slice(0, -1),
          {
            id: Date.now().toString(),
            type: "bot",
            content:
              "Perfect! I have all the information I need to complete your survey. Let me show you the summary.",
            timestamp: new Date(),
          },
        ]);

        setTimeout(() => {
          onComplete(surveySchema.questions.map(q=>({question:q.label, answer:q.answer})));
        }, 2000);
    }else{
      
      setCurrentAnswers(new Array(5).fill(""));
      setCurrentQuestionIndex(0);
      
      // Remove loading message and continue
      if(!convoSchema){
        setChatHistory([
          {
            id: Date.now().toString(),
            type: "bot",
            content:
            "Hi! I'm here to help you fill out your survey. I'll ask you a few questions one at a time to gather the information needed. Let's get started!",
            timestamp: new Date(),
          },
        ]);
      }else{
        setIterationCount((prev) => prev + 1);
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          {
            id: Date.now().toString(),
            type: "bot",
            content:
              "Thanks for those answers! I have a few more questions to make sure I capture everything accurately.",
            timestamp: new Date(),
          },
        ]);
      }
     
      generateQuestions(surveySchema);
    }
  },[surveySchema])

  const formatChoiceOptions = (options) =>{
    return options.map(o=>o.value).join(', ');
  }

  const formatScaleQuestion = (question) => {
    return (question.low +' as '+question.lowLabel+ ' - '+question.high +' as '+question.highLabel)
  }
  useEffect(() => {
    async function fetchFormSchema() {
      if (!googleToken) return;
      setIsLoading(true);
      try {
        // Extract the form ID from the formLink
        const match =
          formLink.match(/\/d\/e\/([a-zA-Z0-9_-]+)/) ||
          formLink.match(/\/forms\/d\/([a-zA-Z0-9_-]+)/);
        const formId = match ? match[1] : null;
        if (!formId) throw new Error("Invalid Google Form link");
        // Fetch the form schema from your backend server endpoint
        const response = await fetch(
          `http://localhost:4000/api/google/forms/${formId}?access_token=${googleToken}`
        );
        if (!response.ok) throw new Error("Failed to fetch form schema");
        const data = await response.json();
         
        const formSchema = {
          title: data.info.title || "Survey",
          questions: (data.items || []).filter((item:any)=>item.questionItem).map((item: any, idx: number) => ({
            id: item.questionItem?.question?.questionId || `q${idx + 1}`,
            label:
              item.title ||
              item.questionItem?.question?.title 
              // + (item.questionItem?.question?.choiceQuestion ? formatChoiceOptions(item.questionItem?.question?.choiceQuestion.options):'') 
              // + (item.questionItem?.question?.scaleQuestion ? formatScaleQuestion(item.questionItem?.question?.scaleQuestion):'') 
              ||
              `Question ${idx + 1}`,
            type: (item.questionItem?.question?.choiceQuestion || item.questionItem?.question?.scaleQuestion) ? "options" : "shortText",
            required: item.questionItem?.question?.required || false,
            options : item.questionItem?.question?.choiceQuestion ?? item.questionItem?.question?.scaleQuestion

          })),
        }
        setSurveySchema(formSchema)
        
      } catch (err) {
        setIsLoading(false);
        setConvoSchema(null);
        setChatHistory([
          {
            id: Date.now().toString(),
            type: "bot",
            content:
              "Failed to load form schema. Please check your link and try again.",
            timestamp: new Date(),
          },
        ]);
      }
    }
    if (formLink && googleToken) {
      fetchFormSchema();
    }
  }, [formLink, googleToken]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
/**
 * Extract the first well‑formed JSON object that appears after a ```json
 * fence (or after the first “{” if no fence exists), then parse it.
 */
function extractQuestions(raw: string) {
  // Try to find a JSON string inside triple backticks
  const fenced = raw.match(/```json\s*([\s\S]*?)\s*```/i);

  let jsonText: string;
  if (fenced) {
    jsonText = fenced[1];
  } else {
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first === -1 || last === -1) {
      throw new Error('No JSON object found');
    }
    jsonText = raw.slice(first, last + 1);
  }

  let parsed: any;

  try {
    console.log(jsonText)
    parsed = JSON.parse(jsonText); // Try once
  } catch (e1) {
    try {
      // If first parse fails, it's probably a stringified string — parse twice
      parsed = JSON.parse(JSON.parse(`"${jsonText}"`));
    } catch (e2) {
      console.error('Failed to parse JSON', { e1, e2, raw: jsonText });
      throw e2;
    }
  }

  if (!Array.isArray(parsed.questions)) {
    throw new Error('No "questions" array in parsed JSON');
  }

  return parsed.questions;
}

  const validateAnswer = async (convoSchema: ConvoSchema, surveySchema: SurveySchema) => {
    setIsProcessing(true);

    try {
      // Call the hosted Ollama server with Basic Auth
      const ollamaRes = await fetch("http://localhost:4000/api/validate_answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convoSchema,surveySchema }),
      });
      const rawText = await ollamaRes.text();

      // 🔍 Extract and map
      let questions: any[] = [];
      try {
        questions = extractQuestions(rawText);
      } catch (err) {
        console.error('Failed to parse questions', err);
      }
      
      setSurveySchema({
        title: surveySchema.title,
        questions: questions.map((q: any) => ({
          id: q.id,
          label: q.label,
          type: q.type,
          required: q.required,
          answer: q.answer
        })),
        isFilled:questions.filter(q=>!q.answer).length==0
      });
      setIsLoading(false);

    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  const generateQuestions = async (surveySchema: SurveySchema) => {
    setIsProcessing(true);

    try {
      // Call the hosted Ollama server with Basic Auth
      const ollamaRes = await fetch("http://localhost:4000/api/generate_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          surveySchema:{
            ...surveySchema,
            questions:surveySchema.questions.filter(q=>!q.answer)
          }
         }),
      });
      const rawText = await ollamaRes.text();

      // 🔍 Extract and map
      let questions: any[] = [];
      try {
        questions = extractQuestions(rawText);
      } catch (err) {
        console.error('Failed to parse questions', err);
      }
      // Set the survey schema based on Ollama's result
      setConvoSchema({
        title: surveySchema.title,
        questions: questions.map((q: any) => ({
          id: q.id,
          label: q.label,
          type: q.type,
          required: q.required,
          intent: q.intent,
          des: q.des,
        })),
      });
      setCurrentQuestions(questions.map((q: any) => q.label));
      setCurrentAnswers(new Array(questions.length).fill(""));
      setIsLoading(false);

      // Ask the first question
      setTimeout(() => {
        askNextQuestion(
          questions.map((q: any) => q.label),
          0
        );
      }, 1000);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const askNextQuestion = (questions: string[], index: number) => {
    if (index < questions.length) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "question",
          content: questions[index],
          timestamp: new Date(),
        },
      ]);
      setWaitingForAnswer(true);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    if (!answer.trim()) return;

    setWaitingForAnswer(false);

    // Add user answer to chat
    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: answer,
        timestamp: new Date(),
      },
    ]);

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
    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "loading",
        content:
          "Let me process your answers and see what else I need to know...",
        timestamp: new Date(),
      },
    ]);

    try {
      validateAnswer(
        {...convoSchema,
          questions:convoSchema.questions.map((c,idx)=>({
        ...c,
        answer:answers[idx]
      }))},surveySchema)
    } catch (error) {
      console.error("Error processing answers:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateProgress = () => {
    if (!surveySchema) return 0;
    const totalQuestions = surveySchema.questions.length;
    const filledQuestions = Object.values(filledState).filter(
      (value) => value !== "" && value !== null
    ).length;
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
                  Iteration {iterationCount + 1} • Question{" "}
                  {currentQuestionIndex + 1} of {currentQuestions.length}
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
