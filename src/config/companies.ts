export type RegisteredCompany = {
  nameKey?: string;
  name?: string;
  roleKey?: string;
  registrations: string;
  locationKey: string;
};

export const registeredCompanies: RegisteredCompany[] = [
  {
    nameKey: 'personalCompany',
    roleKey: 'personalRole',
    registrations: 'NIP: 9930677569',
    locationKey: 'warsawPoland',
  },
  {
    nameKey: 'tdbCompany',
    roleKey: 'tdbRole',
    registrations: 'NIP: 1133040074 · KRS: 0000919623',
    locationKey: 'warsawPoland',
  },
  {
    name: 'The Digital Bunch Australia PTY LTD',
    registrations: 'ACN: 679 174 215',
    locationKey: 'sydneyAustralia',
  },
  {
    name: 'The Digital Bunch - Riyadh',
    registrations: 'VAT: 313009388400003 · CR: 7050098826',
    locationKey: 'riyadhSaudi',
  },
];
