// Input.jsx — labeled input with icon slot and error handling

const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helper = '',
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl border py-2.5 text-gray-900 placeholder-gray-400
            text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            ${error
              ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
            ${inputClassName}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-xs text-gray-400">{helper}</p>
      )}
    </div>
  );
};

export default Input;
