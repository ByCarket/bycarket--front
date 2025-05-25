"use client";

import React from "react";
import { toast, Toaster } from "sonner";

export const NotificationsProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          backgroundColor: "white",
          color: "#103663",
          border: "1px solid #4a77a8",
          fontFamily: "var(--font-be-vietnam)",
        },
        classNames: {
          success: "bg-[#f0f7ff] border-[#4a77a8] text-[#103663]",
          error: "bg-[#fff0f0] border-[#ff4a4a] text-[#631010]",
          warning: "bg-[#fffbf0] border-[#ffc14a] text-[#634310]",
          info: "bg-[#f0f7ff] border-[#4a77a8] text-[#103663]",
          loading: "bg-[#f0f7ff] border-[#4a77a8] text-[#103663]",
        },
      }}
      closeButton
      richColors
      expand
      duration={4000}
    />
  );
};

type ToastOptions = {
  description?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  id?: string | number;
  [key: string]: any;
};

export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description: description,
      icon: "✅",
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description: description,
      icon: "❌",
    });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description: description,
      icon: "⚠️",
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description: description,
      icon: "ℹ️",
      style: {
        backgroundColor: "#f0f7ff",
        border: "1px solid #4a77a8",
        color: "#103663",
      },
    });
  },
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description: description,
      icon: "⏳",
    });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
  custom: (message: string, options?: ToastOptions) => {
    return toast(message, options);
  },
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};

export default notify;
