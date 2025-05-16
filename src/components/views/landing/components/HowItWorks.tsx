export default function HowItWorks() {
  const steps = [
    {
      title: "1. Registrate gratis",
      description: "Creá tu cuenta como particular o empresa en solo minutos.",
    },
    {
      title: "2. Publicá tu auto",
      description:
        "Subí fotos, descripción, precio y empezá a recibir visitas.",
    },
    {
      title: "3. Vendé sin complicaciones",
      description: "Conectá con compradores interesados de todo el país.",
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          ¿Cómo funciona?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
