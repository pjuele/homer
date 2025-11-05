export const TEMPERATURE_UNITS = {
  CELSIUS: "celsius",
  FAHRENHEIT: "fahrenheit",
} as const;

export type TemperatureUnit = typeof TEMPERATURE_UNITS[keyof typeof TEMPERATURE_UNITS];
