import React from 'react';

const toastStyles = {
  success: {
    wrapper: 'border-green-200 bg-green-50 text-green-700',
    icon: 'bg-green-100 text-green-600',
    title: 'Thanh cong',
  },
  error: {
    wrapper: 'border-red-200 bg-red-50 text-red-700',
    icon: 'bg-red-100 text-red-600',
    title: 'That bai',
  },
};

const Toast = ({ show, message, type = 'success', onClose }) => {
  const style = toastStyles[type] || toastStyles.success;

  React.useEffect(() => {
    if (!show) return undefined;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div className={`fixed top-5 right-5 z-[9999] transition-all duration-300 ease-out ${show ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
      <div className={`min-w-[280px] max-w-[360px] rounded-xl border px-4 py-3 shadow-lg ${style.wrapper}`}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${style.icon}`}>
            {type === 'error' ? '!' : '✓'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-5">{style.title}</p>
            <p className="mt-0.5 text-sm leading-5">{message}</p>
          </div>
          <button type="button" onClick={onClose} className="text-base leading-none opacity-70 hover:opacity-100">×</button>
        </div>
      </div>
    </div>
  );
};

export default Toast;