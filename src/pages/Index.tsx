
import React, { useState } from 'react';
import FormLinkScreen from '@/components/FormLinkScreen';
import ChatScreen from '@/components/ChatScreen';
import SummaryScreen from '@/components/SummaryScreen';

type AppState = 'form-input' | 'chat' | 'summary';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('form-input');
  const [formLink, setFormLink] = useState('');
  const [completedSurvey, setCompletedSurvey] = useState<any>(null);

  const handleFormSubmit = (link: string) => {
    setFormLink(link);
    setCurrentState('chat');
  };

  const handleSurveyComplete = (filledState: any) => {
    setCompletedSurvey(filledState);
    setCurrentState('summary');
  };

  const handleRestart = () => {
    setCurrentState('form-input');
    setFormLink('');
    setCompletedSurvey(null);
  };

  return (
    <div className="min-h-screen">
      {currentState === 'form-input' && (
        <FormLinkScreen onFormSubmit={handleFormSubmit} />
      )}
      
      {currentState === 'chat' && (
        <ChatScreen 
          formLink={formLink} 
          onComplete={handleSurveyComplete}
        />
      )}
      
      {currentState === 'summary' && (
        <SummaryScreen 
          filledState={completedSurvey}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
