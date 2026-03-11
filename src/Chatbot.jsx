
import { useState } from "react";


function Chatbot() {
    const models = [
        "gpt-oss:120b-cloud",
        "gemini-3-flash-preview:cloud",
        "deepseek-v3.1:671b-cloud",
    ];

    const [model, setModel]= useState("")
    const [text, setText] = useState("")
    const [response, setResponse] = useState("")

    const send = async () => {
       console.log("clicked!", model, text)
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({model, text})
      })

      const data = await res.json()
      setResponse(data.message?.content || "")
    };

    return (

    <>
    <div className = "flex flex-col items-center justify-center min-h-screen">
      <div className="bg-zinc-800 text-primary rounded-2xl shadow-lg p-6 w-full max-w-md">
      
      <div className="flex items-center gap-4 mb-4">
        <img src="public/images/chatbot_BG.png" alt="chatbot" className="w-32 h- mb-6"/>
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

export default Chatbot;
