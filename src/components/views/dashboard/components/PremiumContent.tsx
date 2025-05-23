"use client";

import { useState } from "react";

export default function PremiumPricing() {
	const [selectedPlan, setSelectedPlan] = useState("monthly");

	const plans = [
		{
			id: "monthly",
			name: "Mensual",
			price: 29,
			period: "mes",
			popular: false,
		},
		{
			id: "quarterly",
			name: "Trimestral",
			price: 75,
			period: "3 meses",
			popular: true,
			savings: "Ahorra $12",
		},
		{
			id: "annual",
			name: "Anual",
			price: 290,
			period: "año",
			popular: false,
			savings: "Ahorra $58",
		},
	];

	return (
		<div className='min-h-screen bg-white py-16 px-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-16'>
					<h1
						className='text-5xl font-bold mb-4'
						style={{ color: "#103663" }}>
						Premium
					</h1>
					<p className='text-xl' style={{ color: "#4a77a8" }}>
						Elige el plan que mejor se adapte a tus necesidades
					</p>
				</div>

				<div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
					{plans.map((plan) => (
						<div
							key={plan.id}
							className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
								selectedPlan === plan.id
									? "shadow-2xl border-2"
									: "shadow-lg border border-gray-200 hover:shadow-xl"
							}`}
							style={{
								backgroundColor:
									selectedPlan === plan.id
										? "#103663"
										: "white",
								borderColor:
									selectedPlan === plan.id
										? "#103663"
										: "#e5e7eb",
							}}
							onClick={() => setSelectedPlan(plan.id)}>
							{plan.popular && (
								<div
									className='absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white text-sm font-semibold'
									style={{ backgroundColor: "#4a77a8" }}>
									Más Popular
								</div>
							)}

							<div className='text-center'>
								<h3
									className={`text-2xl font-bold mb-2 ${
										selectedPlan === plan.id
											? "text-white"
											: ""
									}`}
									style={{
										color:
											selectedPlan === plan.id
												? "white"
												: "#103663",
									}}>
									{plan.name}
								</h3>

								<div className='mb-6'>
									<span
										className={`text-5xl font-bold ${
											selectedPlan === plan.id
												? "text-white"
												: ""
										}`}
										style={{
											color:
												selectedPlan === plan.id
													? "white"
													: "#103663",
										}}>
										${plan.price}
									</span>
									<span
										className={`text-lg ml-2 ${
											selectedPlan === plan.id
												? "text-gray-200"
												: ""
										}`}
										style={{
											color:
												selectedPlan === plan.id
													? "#e5e7eb"
													: "#4a77a8",
										}}>
										USD / {plan.period}
									</span>
								</div>

								{plan.savings && (
									<div
										className='inline-block px-3 py-1 rounded-full text-sm font-medium mb-6'
										style={{
											backgroundColor:
												selectedPlan === plan.id
													? "#4a77a8"
													: "#f0f9ff",
											color:
												selectedPlan === plan.id
													? "white"
													: "#4a77a8",
										}}>
										{plan.savings}
									</div>
								)}

								<div className='space-y-4 mb-8'>
									{[
										"Ventaja 1",
										"Ventaja 2",
										"Ventaja 3",
										"Ventaja 4",
										"Ventaja 5",
									].map((feature, index) => (
										<div
											key={index}
											className='flex items-center justify-center'>
											<svg
												className='w-5 h-5 mr-3 flex-shrink-0'
												fill='currentColor'
												viewBox='0 0 20 20'
												style={{
													color:
														selectedPlan === plan.id
															? "#4a77a8"
															: "#10b981",
												}}>
												<path
													fillRule='evenodd'
													d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
													clipRule='evenodd'
												/>
											</svg>
											<span
												className={`text-sm ${
													selectedPlan === plan.id
														? "text-gray-200"
														: ""
												}`}
												style={{
													color:
														selectedPlan === plan.id
															? "#e5e7eb"
															: "#4a77a8",
												}}>
												{feature}
											</span>
										</div>
									))}
								</div>

								<button
									className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 ${
										selectedPlan === plan.id
											? "text-white hover:opacity-90"
											: "text-white hover:opacity-90"
									}`}
									style={{
										backgroundColor:
											selectedPlan === plan.id
												? "#4a77a8"
												: "#103663",
									}}>
									Consiguelo ya!
								</button>
							</div>
						</div>
					))}
				</div>

				<div className='text-center mt-12'>
					<p className='text-sm' style={{ color: "#4a77a8" }}>
						Procesamiento seguro con Stripe • Cancela en cualquier
						momento
					</p>
				</div>
			</div>
		</div>
	);
}
