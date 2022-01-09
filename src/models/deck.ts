export type CardSuit = "c" | "d" | "h" | "s";
export type CardValue =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "j"
  | "q"
  | "k"
  | "a";

export type Card = {
  suit: CardSuit;
  value: CardValue;
};
