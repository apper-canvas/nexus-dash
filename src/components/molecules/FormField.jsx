import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  id, 
  error, 
  type = "text",
  component = "input",
  children,
  required,
  ...props 
}) => {
  const Component = component === "select" ? Select : component === "textarea" ? Textarea : Input;
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <Component id={id} error={error} {...props}>
        {children}
      </Component>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;