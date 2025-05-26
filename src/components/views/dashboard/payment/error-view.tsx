export default function ErrorView() {
  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-principal-blue px-8 py-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Pago Rechazado</h1>
        <p className="text-blue-200 text-sm">
          Tu transacción no pudo ser procesada
        </p>
      </div>

      <div className="px-8 py-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-secondary-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Problema con el Pago
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            No pudimos procesar tu compra del vehículo. Esto puede deberse a
            fondos insuficientes, datos incorrectos o problemas temporales.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Posibles causas:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Fondos insuficientes en la tarjeta</li>
            <li>• Información de pago incorrecta</li>
            <li>• Límite de transacción excedido</li>
            <li>• Problema temporal del banco</li>
          </ul>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="space-y-3">
          <button className="w-full bg-secondary-blue hover:bg-principal-blue text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
            Intentar Nuevamente
          </button>

          <button className="w-full border-2 border-secondary-blue text-secondary-blue hover:bg-secondary-blue hover:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
            Cambiar Método de Pago
          </button>

          <button className="w-full text-gray-600 hover:text-principal-blue font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Volver al Catálogo
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-2">¿Necesitas ayuda?</p>
          <button className="text-secondary-blue hover:text-principal-blue text-sm font-medium transition-colors duration-200">
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  );
}
