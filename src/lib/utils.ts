import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAffiliateLinks(city: string, country: string) {
  if (country.toLowerCase() === "thailand") {
    return {
      viator: "https://www.viator.com/Thailand/d20-ttd?pid=P00218939&mcid=42383&medium=link",
      label: "Explore Thailand Tours"
    };
  }
  
  const searchParam = encodeURIComponent(`${city} tours`);
  return {
    viator: `https://www.viator.com/search/${searchParam}?pid=P00218939&mcid=42383&medium=link`,
    label: `Best Tours in ${city}`
  };
}

export const GLOBAL_AVERAGES = {
  meal: 15,
  beer: 5,
  taxi: 3.5,
  hotel: 120
};
