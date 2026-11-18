import { useEffect, useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const rootId = "wxo-chat-root";
    const scriptId = "wxo-loader-script";

    window.wxOConfiguration = {
      orchestrationID:
        "443b09d43d5741778304bc291e5b956d_fb4d0d02-619d-4b20-8be9-70a75fbc9fe6",

      hostURL:
        "https://au-syd.watson-orchestrate.cloud.ibm.com",

      rootElementID: rootId,

      showLauncher: false,

      deploymentPlatform: "ibmcloud",

      crn:
        "crn:v1:bluemix:public:watson-orchestrate:au-syd:a/443b09d43d5741778304bc291e5b956d:fb4d0d02-619d-4b20-8be9-70a75fbc9fe6::",

      chatOptions: {
        agentId: "faae990c-ccfc-458e-b0d4-18ebec49718e",
      },
    };

    const initializeChat = () => {
      if (
        window.wxoLoader &&
        typeof window.wxoLoader.init === "function" &&
        !window.__skillBridgeWxoInitialized
      ) {
        window.wxoLoader.init();
        window.__skillBridgeWxoInitialized = true;
      }
    };

    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://au-syd.watson-orchestrate.cloud.ibm.com/wxochat/wxoLoader.js?embed=true";

      script.addEventListener("load", initializeChat);
      document.head.appendChild(script);
    } else {
      initializeChat();
    }
  }, []);

  return (
    <>
      <button
        className="chatbot-floating-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      >
        {isOpen ? <X size={25} /> : <MessageCircle size={25} />}
        {!isOpen && <span>AI</span>}
      </button>

      <div className={`chatbot-panel ${isOpen ? "chatbot-panel-open" : ""}`}>
        <div className="chatbot-panel-header">
          <div className="chatbot-title">
            <div className="chatbot-icon">
              <Bot size={23} />
            </div>

            <div>
              <h3>SkillBridge AI</h3>
              <p>Your Learning Assistant</p>
            </div>
          </div>

          <button
            className="chatbot-close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
          >
            <X size={21} />
          </button>
        </div>

        <div className="chatbot-panel-content">
          <div id="wxo-chat-root"></div>
        </div>
      </div>
    </>
  );
}

export default Chatbot;