/** 
 * @file Chatbot.jsx
 * @description AI Chatbot component supporting multiple models
 * @author Tony Nicoletti
 * @date 06/05/2026
 * @version 1.0
 * 
 * **/

// Imports reacts useState hook to manage component state
import { useState } from "react";

// Hardcoded list of AI models users can choose from
function Chatbot() {
    const API_BASE = import.meta.env.VITE_API_URL || "/api";
    const models = [
        "llama3.2:latest",
        "llama3.2",
    ];

    const [model, setModel]= useState(models[0])
    // Tracks what the user is typing in the input box
    const [text, setText] = useState("")
    // Stores the response returned from the AI to display on screen
    const [response, setResponse] = useState("")
    const[loading, setLoading] = useState(false);

    // async function triggered when the user clicks "Send"
    const send = async () => {
       console.log("clicked!", model, text)
      if (!text.trim()) return;

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}, // Tells the server we are sending JSON
        body: JSON.stringify({ model, text })
      })

      const data = await res.json()// Parses the backends JSON response into a JavaScript object
      // Extracts the AI's message content and stores it in state, falls back to any error string if missing
      setResponse(data.message?.content || data.error || "")
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


      <button className="cursor-pointer ml-3 mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded-md" onClick={send}>Send</button>
      </div>
      </div>
    </>
    
    );
}

// Exports the component so it can be used in other parts of the app
export default Chatbot;


// Algorithm .map()
// {models.map((m) => (
//     <option key={m} value={m}>
//         {m}
//     </option>
// ))}
// .map goes through every item in the models array one-by-one. 
// For each item calledm it creates and returns an <option> element.
// So if there are three models in the array, you get three <options> 
// elements back. React renders all three in the dropdown.
