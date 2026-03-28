export interface CityPrice {
  item_name: string;
  average_price: number;
  lowest_price: number;
  highest_price: number;
}

export interface NumbeoResponse {
  prices: CityPrice[];
  name: string;
  currency: string;
}

export interface BudgetBreakdown {
  food: number;
  accommodation: number;
  transport: number;
  entertainment: number;
}

export interface BudgetPersona {
  name: string;
  description: string;
  dailyTotal: number;
  breakdown: BudgetBreakdown;
}

export interface TourData {
  title: string;
  image: string;
  price: string;
  rating: number;
  url: string;
}

export interface FlightData {
  title: string;
  price: string;
  url: string;
}

export interface HotelData {
  name: string;
  image: string;
  price: string;
  rating: number;
  url: string;
}

export interface CityCostRecord {
  id?: string;
  city_name: string;
  country: string;
  currency: string;
  budget_data: {
    budget: BudgetPersona;
    midRange: BudgetPersona;
    luxury: BudgetPersona;
  };
  daily_total: number;
  last_updated: string;
}
