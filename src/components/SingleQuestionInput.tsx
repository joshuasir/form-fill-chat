
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2 } from 'lucide-react';

interface SingleQuestionInputProps {
  onSubmit: (answer: string) => void;
  isProcessing: boolean;
}

const SingleQuestionInput = ({ onSubmit, isProcessing }: SingleQuestionInputProps) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Answer</h3>
          
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              className="min-h-[80px] resize-none transition-all focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
              autoFocus
            />
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </p>
              
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 transition-all duration-200"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Send
                    <ArrowUp className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleQuestionInput;
