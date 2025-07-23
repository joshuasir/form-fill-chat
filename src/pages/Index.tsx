import React, { useEffect, useState } from "react";
import FormLinkScreen from "@/components/FormLinkScreen";
import ChatScreen from "@/components/ChatScreen";
import SummaryScreen from "@/components/SummaryScreen";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "@/declarations/frontend";
import { canisterId } from "@/declarations/backend";
import { canisterId as iiCanisterId } from "@/declarations/internet_identity";

type AppState = "form-input" | "chat" | "summary";
const identityProvider = `http://${iiCanisterId}.localhost:4943`;

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("form-input");
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Whoami" to see your principal ID'
  });

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
    const isAuthenticated = await authClient.isAuthenticated();
 
    setState((prev) => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated,
      principal:principal.toText()
    }));
  };

  const loginCanister = async () => {
    await state.authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  };

  const logout = async () => {
    await state.authClient.logout();
    updateActor();
  };

  

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
      { currentState === "form-input" && (
        <FormLinkScreen 
        onFormSubmit={handleFormSubmit} 
        isAuthenticated={state.isAuthenticated}
        login={loginCanister}
        />
      )}

      {state.isAuthenticated && currentState === "chat" && (
        <ChatScreen
          formLink={formLink}
          onComplete={handleSurveyComplete}
          googleToken={googleToken}
        />
      )}

      {state.isAuthenticated && currentState === "summary" && (
        <SummaryScreen
          surveyData={completedSurvey}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
