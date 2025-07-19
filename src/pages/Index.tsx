import React, { useState } from "react";
import FormLinkScreen from "@/components/FormLinkScreen";
import ChatScreen from "@/components/ChatScreen";
import SummaryScreen from "@/components/SummaryScreen";
import { useGoogleLogin } from "@react-oauth/google";

type AppState = "form-input" | "chat" | "summary";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("form-input");
  const [formLink, setFormLink] = useState("");
  const [completedSurvey, setCompletedSurvey] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/forms.body.readonly",
    onSuccess: async (tokenResponse) => {
      // Send code to backend
      const res = await fetch(
        "http://localhost:4000/api/google/exchange-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: tokenResponse.code }),
        }
      );
      const { access_token } = await res.json();
      setGoogleToken(access_token);
      setCurrentState("chat");
    },
    onError: () => {
      alert("Google login failed. Please try again.");
    },
    flow: "auth-code",
  });

  const handleFormSubmit = (link: string) => {
    setFormLink(link);
    if (googleToken) {
      setCurrentState("chat");
    } else {
      login();
    }
  };

  const handleSurveyComplete = (filledState: any) => {
    setCompletedSurvey(filledState);
    setCurrentState("summary");
  };

  const handleRestart = () => {
    setCurrentState("form-input");
    setFormLink("");
    setCompletedSurvey(null);
  };

  return (
    <div className="min-h-screen">
      {currentState === "form-input" && (
        <FormLinkScreen onFormSubmit={handleFormSubmit} />
      )}

      {currentState === "chat" && (
        <ChatScreen
          formLink={formLink}
          onComplete={handleSurveyComplete}
          googleToken={googleToken}
        />
      )}

      {currentState === "summary" && (
        <SummaryScreen
          surveyData={completedSurvey}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
