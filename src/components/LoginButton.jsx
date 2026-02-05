export const Login = ({ className = "", size = "md", children }) => {
  const baseClasses = "bg-primary focus-visible:ring- focus:outline-none focus-visible:ring-2 rounded-full relative overflow-hidden font-medium hover:bg-primary/80 shadow-lg shadow-primary/40" /* Button design */
  
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: " px-8 py-4 text-lg",
  };
  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`; {/* String templating */}
  return (
  <button className={classes}>
    <span className="flex items-center relative gap-3 justify-center">
        {children}
     </span>
   </button>
 );
};