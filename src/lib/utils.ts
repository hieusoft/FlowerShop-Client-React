import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWhole(number: number, decimalPlaces: number = 0) {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  })
}

export function formatSignificant(number: number, precision: number = 2) {
  return number.toLocaleString("en-US", {
    minimumSignificantDigits: precision,
    maximumSignificantDigits: precision
  })
}

export type FormattableUnit = "unit" | "currency/vnd";

export function formatUnit(number: number, unit: FormattableUnit) {
  switch (unit) {
    case "unit": return formatWhole(number);
    case "currency/vnd": return formatWhole(number) + "₫";
  }
}