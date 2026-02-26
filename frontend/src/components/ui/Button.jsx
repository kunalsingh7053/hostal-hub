import clsx from 'clsx'

const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:outline-primary',
  secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus-visible:outline-gray-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-200',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = ({ children, variant = 'primary', size = 'md', className, as: Component = 'button', ...props }) => {
  const componentProps = { ...props }
  if (Component === 'button' && !componentProps.type) {
    componentProps.type = 'button'
  }

  return (
    <Component className={clsx(baseStyles, variants[variant], sizes[size], className)} {...componentProps}>
      {children}
    </Component>
  )
}

export default Button
