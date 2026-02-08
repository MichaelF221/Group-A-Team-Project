// Change the export name from Login to CreateAccount
export const CreateAccount = ({ className = "", size = "md", children }) => {
    const baseClasses = "bg-blue-600 focus-visible:ring-2 focus:outline-none focus-visible:ring-blue-400 rounded-full relative overflow-hidden font-medium hover:bg-blue-700 shadow-lg shadow-blue-400/40"
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };
    
    const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;
    
    return (
      <button className={classes}>
        <span className="flex items-center relative gap-3 justify-center">
          {children}
        </span>
      </button>
    );
  };