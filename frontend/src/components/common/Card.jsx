// Card.jsx — base card with hover and gradient border variants

const Card = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  padding = true,
  onClick,
}) => {
  const base = 'bg-white rounded-2xl border border-gray-100 shadow-sm';
  const hoverClass = hover
    ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
    : '';
  const gradientClass = gradient
    ? 'ring-1 ring-emerald-100'
    : '';
  const paddingClass = padding ? 'p-6' : '';

  return (
    <div
      className={`${base} ${hoverClass} ${gradientClass} ${paddingClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const GradientCard = ({ children, className = '', ...props }) => (
  <Card
    gradient
    className={`bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-emerald-100 ${className}`}
    {...props}
  >
    {children}
  </Card>
);

export default Card;
