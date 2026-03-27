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
    const models = [
        "llama3.2",
        "gemini-3-flash-preview:cloud",
        "deepseek-v3.1:671b-cloud",
    ];

    // Tracks which AI model the user has selected
    const [model, setModel]= useState("llama3.2")
    // Tracks what the user is typing in the input box
    const [text, setText] = useState("")
    // Stores the response returned from the AI to display on screen
    const [response, setResponse] = useState("")
    const[loading, setLoading] = useState(false); 

    // async function triggered when the user clicks "Send"
    const send = async () => {
      // Logs the current model and text to the console for debugging
       console.log("clicked!", model, text) // Sends a POST request to the backend with the selected model and user's text
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, // Tells the server we are sending JSON
        body: JSON.stringify({ model, text })
      })
      const data = await res.json()// Parses the backends JSON response into a JavaScript object
      // Extracts the AI's message content and stores it in state, falls back to empty string if missing
      setResponse(data.message?.content || "")
    };

    return (

    <>
    <div className = "flex flex-col items-center justify-center min-h-screen">
      <div className="bg-zinc-800 text-primary rounded-2xl shadow-lg p-6 w-full max-w-md">
      
      <div className="flex items-center gap-4 mb-4">
      <img src="/images/chatbot_BG.png" alt="chatbot" className="w-32 h-32 mb-6"/>
        <h2 className="text-xl font-bold mb-0 text-center">Welcome to Chatbot!</h2>
      </div>
      <h2 className="text-xl font-bold mb-10 text-center">Ask me anything</h2>
      
      <div className="flex flex-col gap-3 mt-3">
  <p className="bg-zinc-700 p-3 rounded-md">{response}</p>
</div>

      
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
