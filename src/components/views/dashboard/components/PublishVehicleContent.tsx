"use client";

import React from "react";
import PublishVehicleForm from "./PublishVehicleForm";

const PublishVehicleContent: React.FC = () => {
	return (
		<div>
			<h1 className='text-3xl font-bold text-principal-blue mb-6'>
				Publicar Vehículo
			</h1>
			<PublishVehicleForm />
		</div>
	);
};

export default PublishVehicleContent;
