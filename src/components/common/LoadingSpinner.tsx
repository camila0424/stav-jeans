interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={[
        'border-4 border-[var(--color-gray-light)] border-t-[var(--color-navy)] rounded-full animate-spin',
        sizeMap[size],
        className,
      ].join(' ')}
    />
  );
}

export default LoadingSpinner;
