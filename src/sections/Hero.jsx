export const Hero = () => {
    return (
         <section> 
        <div className="absolute inset-0 ">
        <img 
         src="/images/orange-bg.png" 
         alt="Orang Background" 
         className="w-full h-full object-cover opacity-35"></img>
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
      </div>

      {/* Specs of Dust */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(40)].map((_, i) =>(
              <div 
              className="absolute w-2 h-2 opacity-60 rounded-full blur-[2px]" 
               style={{
                backgroundColor: "#FF8C00",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `slow-drift ${20 + Math.random() * 15}s ease-in-out infinite`,
               }}
            />
           ))}
        </div>

           {/* Hero Section Content */}
           <div className="container mx-auto px-9 pt-32 pb-20 relative z-10">
            <div className="grid lg:grid-cols-1 gap-12 items-center">
                <h1 className="text-6xl text-center py-40">
                    Study <span className="text-primary">Flow</span>
                    <br />
                    Built for
                    <br />
                    <span className="font-serif italic font-normal text-white">
                        Students
                    </span>

                </h1>
            </div>
           </div>
           <footer />
    </section> 
 );
};
    