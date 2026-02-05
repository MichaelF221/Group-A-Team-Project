export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-13 border-t border-border">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <a href="#" className="text-xl font-bold tracking-tight">
                    Study Flow <span className="text-primary">.</span>
                  </a>
                 </div>
                 <p className="text-md text-muted text-center lg:text-center">
                    @ { currentYear } All rights reserved.

                 </p>
                </div>
              </div>
        </footer>
    )

}