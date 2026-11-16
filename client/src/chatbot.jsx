import { useEffect } from "react";
import "./Chatbot.css";

function Chatbot() {
  useEffect(() => {
    const rootId = "wxo-chat-root";
    const scriptId = "wxo-loader-script";

    window.wxOConfiguration = {
      orchestrationID:
        "443b09d43d5741778304bc291e5b956d_fb4d0d02-619d-4b20-8be9-70a75fbc9fe6",

      hostURL:
        "https://au-syd.watson-orchestrate.cloud.ibm.com",

      rootElementID: rootId,

      deploymentPlatform: "ibmcloud",

      crn:
        "crn:v1:bluemix:public:watsonx-orchestrate:au-syd:a/443b09d43d5741778304bc291e5b956d:fb4d0d02-619d-4b20-8be9-70a75fbc9fe6::",

      chatOptions: {
        agentId: "faae990c-ccfc-458e-b0d4-18ebec49718e",
      },
    };

    let script = document.getElementById(scriptId);

    const initializeChat = () => {
      if (window.wxoLoader) {
        window.wxoLoader.init();
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://au-syd.watson-orchestrate.cloud.ibm.com/wxochat/wxoLoader.js?embed=true";

      script.onload = initializeChat;
      document.head.appendChild(script);
    } else {
      initializeChat();
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <div>
          <h1>SkillBridge AI Assistant</h1>
          <p>
            Your personal AI learning assistant. Ask questions,
            understand concepts and improve your skills.
          </p>
        </div>
      </div>

      <div className="chatbot-container">
        <div id="wxo-chat-root"></div>
      </div>
    </div>
  );
}

export default Chatbot;