type Props = {
  id: string;
  countryName: string;
  locations: string[];
};

export const countries: Props[] = [
  {
    id: "1",
    countryName: "Portugal",
    locations: ["Lisboa", "Porto", "Sintra"],
  },
  {
    id: "2",
    countryName: "Moçambique",
    locations: [
      "Maputo Cidade",
      "Maputo Província",
      "Gaza",
      "Inhambane",
      "Manica",
      "Sofala",
      "Tete",
      "Zambézia",
      "Nampula",
      "Niassa",
      "Cabo Delgado",
    ],
  },
];
