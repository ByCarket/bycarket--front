import { toast, ToastContainer, ToastOptions, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notifications.css';
import { ReactNode } from "react";

const toastBaseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  className: 'custom-toast',
};

const toastIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'i',
  default: '•',
};

const ToastContent = ({
  message,
  type = 'default',
  onClose,
}: {
  message: string;
  type?: TypeOptions;
  onClose: () => void;
}) => (
  <div className="flex items-start">
    <span className="toast-icon">{toastIcons[type]}</span>
    <div className="toast-content">
      <p className="toast-message">{message}</p>
    </div>
    <button 
      className="toast-close"
      onClick={onClose}
      aria-label="Cerrar"
    >
      &times;
    </button>
  </div>
);

export const showSuccess = (message: string, options: ToastOptions = {}) => {
  toast(
    ({ closeToast }) => (
      <ToastContent message={message} type="success" onClose={closeToast!} />
    ),
    {
      ...toastBaseOptions,
      className: `${toastBaseOptions.className} toast-success`,
      ...options,
    }
  );
};

export const showError = (message: string, options: ToastOptions = {}) => {
  toast(
    ({ closeToast }) => (
      <ToastContent message={message} type="error" onClose={closeToast!} />
    ),
    {
      ...toastBaseOptions,
      className: `${toastBaseOptions.className} toast-error`,
      ...options,
    }
  );
};

export const showWarning = (message: string, options: ToastOptions = {}) => {
  toast(
    ({ closeToast }) => (
      <ToastContent message={message} type="warning" onClose={closeToast!} />
    ),
    {
      ...toastBaseOptions,
      className: `${toastBaseOptions.className} toast-warning`,
      ...options,
    }
  );
};

export const showInfo = (message: string, options: ToastOptions = {}) => {
  toast(
    ({ closeToast }) => (
      <ToastContent message={message} type="info" onClose={closeToast!} />
    ),
    {
      ...toastBaseOptions,
      className: `${toastBaseOptions.className} toast-info`,
      ...options,
    }
  );
};

export const showConfirm = (
  message: ReactNode,
  onYes: () => void,
  onNo?: () => void,
  options: ToastOptions = {}
) => {
  const handleYes = () => {
    onYes();
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  const handleNo = () => {
    onNo?.();
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  const toastId = toast(
    <div className="confirm-dialog">
      <div className="confirm-message">{message}</div>
      <div className="confirm-buttons">
        <button
          onClick={handleNo}
          className="confirm-button confirm-no"
        >
          No
        </button>
        <button
          onClick={handleYes}
          className="confirm-button confirm-yes"
        >
          Sí
        </button>
      </div>
    </div>,
    {
      ...toastBaseOptions,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      className: `${toastBaseOptions.className} confirm-toast`,
      ...options,
    }
  );
};

export const NotificationsContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={4000}
    hideProgressBar
    newestOnTop
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss={false}
    draggable={false}
    pauseOnHover
    closeButton={false}
    className="!p-0"
    toastClassName="!m-0 !p-0 !bg-transparent !shadow-none !rounded-none !min-h-0"
    style={{
      width: 'auto',
      maxWidth: '100%',
      padding: 0,
      margin: 0,
    }}
  />
);
