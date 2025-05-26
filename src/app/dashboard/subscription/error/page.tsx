"use client";

import ErrorView from "@/components/views/dashboard/payment/error-view";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <ErrorView />
    </div>
  );
}
