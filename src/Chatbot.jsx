
import { useState } from "react";


function Chatbot() {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const models = [
        "llama3.2:latest",
        "llama3.2",
    ];

    const [model, setModel]= useState(models[0])
    const [text, setText] = useState("")
    const [response, setResponse] = useState("")
    const [isSending, setIsSending] = useState(false);

    const send = async () => {
       console.log("clicked!", model, text)
      if (!text.trim()) return;
      try {
        setIsSending(true);
        setResponse("");
        const res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({model, text})
        });

        const data = await res.json();
        const answer = data.message?.content || data.error || data.details || "No response returned.";
        setResponse(answer);
      } catch (error) {
        setResponse(`Request failed: ${error.message}`);
      } finally {
        setIsSending(false);
      }
    };

    return (

    <>
    <div className = "flex flex-col items-center justify-center min-h-screen">
      <div className="bg-zinc-800 text-primary rounded-2xl shadow-lg p-6 w-full max-w-md">
      
      <div className="flex items-center gap-4 mb-4">
        <img src="/images/chatbot_BG.png" alt="chatbot" className="w-24 h-24 mb-6 object-cover"/>
        <h2 className="text-xl font-bold mb-0 text-center">Welcome to Chatbot!</h2>
      </div>
      <h2 className="text-xl font-bold mb-10 text-center">Ask me anything</h2>
      
      <div className="flex flex-col gap-3 mt-3">{response}</div>
    <select className="w-full p-2 rounded-md mt-3" value={model} onChange={(e) => {setModel(e.target.value)}}>
        {models.map((m) => (
          <option key={m} value={m}>
           {m}
          </option>
        ))}
    </select>

    <input className="flex-1 p-3 w-70 rounded-md border-zinc-500 bg-zinc-600 text-white" type="text" value={text} onChange={(e) => {setText(e.target.value)}}/>


      <button
        className="cursor-pointer ml-3 mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded-md disabled:opacity-60"
        onClick={send}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
      </div>
      </div>
    </>
    
    );
}

export default Chatbot;
