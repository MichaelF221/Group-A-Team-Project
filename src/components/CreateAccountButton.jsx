import { useNavigate } from 'react-router-dom';

export const CreateAccount = ({ className = "", size = "md", children }) => {
  const navigate = useNavigate();
  
  const baseClasses = "bg-blue-600 focus-visible:ring-2 focus:outline-none focus-visible:ring-blue-400 rounded-full relative overflow-hidden font-medium hover:bg-blue-700 shadow-lg shadow-blue-400/40 cursor-pointer transition-all duration-200"
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;
  
  const handleClick = () => {
    navigate('/create-account');
  };
  
  return (
    <button className={classes} onClick={handleClick}>
      <span className="flex items-center relative gap-3 justify-center">
        {children}
      </span>
    </button>
  );
};

    /*const baseClasses = "bg-primary focus-visible:ring- focus:outline-none focus-visible:ring-2 rounded-full relative overflow-hidden font-medium hover:bg-primary/80 shadow-lg shadow-primary/40"
    
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
>>>>>>> 8787b2ba7bf7402aafa473bdb1bd620b633e4fa3*/
