export type AuthStackParamList = {
  Start: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Ticket: undefined;
  Transaction: undefined;
  Wallet: undefined;
  Settings: undefined;
  Car: undefined;
  Map: undefined;
  UserProfile: undefined;
  Ekran1: { title: string };
  Ekran2: { title: string };
  Ekran3: { title: string };
  Ekran4: { title: string };
  Ekran5: { title: string };
  Ekran6: { title: string };
  Ekran7: { title: string };
  Ekran8: { title: string };
};

// Alias zachowujący kompatybilność z wcześniejszymi importami.
export type RootStackParamList = AuthStackParamList & MainTabParamList;
