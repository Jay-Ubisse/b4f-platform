export interface CountryProps {
  id: string;
  name: string;
  locations: LocationProps[]; //Locais ou conselhos
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocationProps {
  id: string;
  name: string;
  countryId: string;
  country: CountryProps;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type CreateCountryProps = Omit<
  CountryProps,
  "id" | "createdAt" | "updatedAt" | "locations"
>;

export type CreateLocationProps = Omit<
  LocationProps,
  "id" | "createdAt" | "updatedAt" | "country"
>;
