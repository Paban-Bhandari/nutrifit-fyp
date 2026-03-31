import { useState } from 'react';
import { AlertCircle, CheckCircle, X, Info } from 'lucide-react';

const types = {
  error:   { icon: AlertCircle,    bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     icon_color: 'text-red-500' },
  success: { icon: CheckCircle,    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon_color: 'text-emerald-500' },
  info:    { icon: Info,           bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',    icon_color: 'text-blue-500' },
  warning: { icon: AlertCircle,    bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   icon_color: 'text-amber-500' },
};

const AlertMessage = ({ type = 'error', message, dismissible = true, onDismiss, className = '' }) => {
  const [visible, setVisible] = useState(true);
  if (!message || !visible) return null;

  const { icon: Icon, bg, border, text, icon_color } = types[type] || types.error;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${bg} ${border} animate-fade-in ${className}`} role="alert">
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${icon_color}`} />
      <p className={`text-sm flex-1 font-medium ${text}`}>{message}</p>
      {dismissible && (
        <button onClick={handleDismiss} className={`flex-shrink-0 ${icon_color} hover:opacity-75 transition-opacity`} aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// Convenience exports
export const ErrorMessage   = (props) => <AlertMessage type="error"   {...props} />;
export const SuccessMessage = (props) => <AlertMessage type="success" {...props} />;
export const InfoMessage    = (props) => <AlertMessage type="info"    {...props} />;
export const WarningMessage = (props) => <AlertMessage type="warning" {...props} />;

export default AlertMessage;
