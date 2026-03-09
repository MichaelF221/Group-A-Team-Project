import { useState } from "react";
export const About = () => {

    return(

    <div className="flex items-center justify-center min-h-screen">
        <div className="bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-lg">
           <h2 className="text-3xl font-bold text-orange-500 text-center mb-2">
        About Study Flow
    </h2>
            <p className="text-zinc-400 text-center mb-6">
                Your all-in-one study companion
            </p>
            
            <div className="border-t border-zinc-600 my-4"/>
                <p className="text-white text-justify leading-relaxed">
                    Study low is a productivity platform designed for students.
                    Manage your tasks and projects with our Kanban board, 
                    get instant answers from or AI Chatbot, and 
                    stay on top of your studies all in one place. 
                </p>

                <div className="border-t border-zinc-600 my-4"/>
                
                <div className="flex justify-center gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-orange-500 text-xl font-bold">AI</p>
                      <p className="text-sinc-400 text-sm">Chatbot</p>
                    </div>
                    <div className="text-center">
                      <p className="text-orange-500 text-xl font-bold">Kanban</p>
                      <p className="text-sinc-400 text-sm">Task Board</p>
                    </div>
                    <div className="text-center">
                      <p className="text-orange-500 text-xl font-bold">Fast</p>
                      <p className="text-sinc-400 text-sm">& Responsive</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

