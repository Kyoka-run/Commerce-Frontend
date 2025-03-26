const InputField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  value,
  placeholder,
  testId
}) => {
  return (
    <div className="flex flex-col gap-1 w-full" data-testid={`${id}-field-container`}>
      <label
        htmlFor={id}
        className={`${
          className ? className : ""
        } font-semibold text-sm text-slate-800`}
        data-testid={`${id}-label`}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`${
          className ? className : ""
        } px-2 py-2 border outline-none bg-transparent text-slate-800 rounded-md ${
          errors[id]?.message ? "border-red-500" : "border-slate-700" 
        }`}
        data-testid={testId || `${id}-input`}
        {...register(id, {
          required: {value: required, message},
          minLength: min
            ? { value: min, message: `Minimum ${min} character is required`}
            : null,
          pattern:
            type === "email"
              ? {
                value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                message: "Invalid email"
              }
              : type === "url"
              ? {
                value: /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                message: "Please enter a valid url"
              }
              : null,
        })}
      />

      {errors[id]?.message && (
        <p className="text-sm font-semibold text-red-600 mt-0" data-testid={`${id}-error`}>
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default InputField;