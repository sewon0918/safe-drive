import React, { useState } from "react";
import { ServiceOption } from "./CallForm";
interface ServiceOptionCardProps extends ServiceOption {
  selected: boolean;
}

const ServiceOptionCard: React.FC<ServiceOptionCardProps> = ({
  label,
  name,
  description,
  onClick,
  price,
  selected,
}) => {
  return (
    <div
      className={`p-4 rounded-xl flex items-center mb-2 ${
        selected ? "bg-blue-50 border border-blue-100" : "bg-white"
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3">
        <span className="text-white text-xs">{label}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{name}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="text-lg font-bold">{price}</div>
    </div>
  );
};

export default ServiceOptionCard;
