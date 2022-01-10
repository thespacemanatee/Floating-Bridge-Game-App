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

export interface Card {
  suit: CardSuit;
  value: CardValue;
  imageUri: string;
}

export interface PlayedCard extends Card {
  playedBy: string;
}

export const deck = {
  c2: {
    suit: "c",
    value: "2",
    imageUri: require("../../assets/images/cards/CLUB-2.svg"),
  },
  c3: {
    suit: "c",
    value: "3",
    imageUri: require("../../assets/images/cards/CLUB-3.svg"),
  },
  c4: {
    suit: "c",
    value: "4",
    imageUri: require("../../assets/images/cards/CLUB-4.svg"),
  },
  c5: {
    suit: "c",
    value: "5",
    imageUri: require("../../assets/images/cards/CLUB-5.svg"),
  },
  c6: {
    suit: "c",
    value: "6",
    imageUri: require("../../assets/images/cards/CLUB-6.svg"),
  },
  c7: {
    suit: "c",
    value: "7",
    imageUri: require("../../assets/images/cards/CLUB-7.svg"),
  },
  c8: {
    suit: "c",
    value: "8",
    imageUri: require("../../assets/images/cards/CLUB-8.svg"),
  },
  c9: {
    suit: "c",
    value: "9",
    imageUri: require("../../assets/images/cards/CLUB-9.svg"),
  },
  c10: {
    suit: "c",
    value: "10",
    imageUri: require("../../assets/images/cards/CLUB-10.svg"),
  },
  cj: {
    suit: "c",
    value: "j",
    imageUri: require("../../assets/images/cards/CLUB-11-JACK.svg"),
  },
  cq: {
    suit: "c",
    value: "q",
    imageUri: require("../../assets/images/cards/CLUB-12-QUEEN.svg"),
  },
  ck: {
    suit: "c",
    value: "k",
    imageUri: require("../../assets/images/cards/CLUB-13-KING.svg"),
  },
  ca: {
    suit: "c",
    value: "a",
    imageUri: require("../../assets/images/cards/CLUB-1.svg"),
  },
  d2: {
    suit: "d",
    value: "2",
    imageUri: require("../../assets/images/cards/DIAMOND-2.svg"),
  },
  d3: {
    suit: "d",
    value: "3",
    imageUri: require("../../assets/images/cards/DIAMOND-3.svg"),
  },
  d4: {
    suit: "d",
    value: "4",
    imageUri: require("../../assets/images/cards/DIAMOND-4.svg"),
  },
  d5: {
    suit: "d",
    value: "5",
    imageUri: require("../../assets/images/cards/DIAMOND-5.svg"),
  },
  d6: {
    suit: "d",
    value: "6",
    imageUri: require("../../assets/images/cards/DIAMOND-6.svg"),
  },
  d7: {
    suit: "d",
    value: "7",
    imageUri: require("../../assets/images/cards/DIAMOND-7.svg"),
  },
  d8: {
    suit: "d",
    value: "8",
    imageUri: require("../../assets/images/cards/DIAMOND-8.svg"),
  },
  d9: {
    suit: "d",
    value: "9",
    imageUri: require("../../assets/images/cards/DIAMOND-9.svg"),
  },
  d10: {
    suit: "d",
    value: "10",
    imageUri: require("../../assets/images/cards/DIAMOND-10.svg"),
  },
  dj: {
    suit: "d",
    value: "j",
    imageUri: require("../../assets/images/cards/DIAMOND-11-JACK.svg"),
  },
  dq: {
    suit: "d",
    value: "q",
    imageUri: require("../../assets/images/cards/DIAMOND-12-QUEEN.svg"),
  },
  dk: {
    suit: "d",
    value: "k",
    imageUri: require("../../assets/images/cards/DIAMOND-13-KING.svg"),
  },
  da: {
    suit: "d",
    value: "a",
    imageUri: require("../../assets/images/cards/DIAMOND-1.svg"),
  },
  h2: {
    suit: "h",
    value: "2",
    imageUri: require("../../assets/images/cards/HEART-2.svg"),
  },
  h3: {
    suit: "h",
    value: "3",
    imageUri: require("../../assets/images/cards/HEART-3.svg"),
  },
  h4: {
    suit: "h",
    value: "4",
    imageUri: require("../../assets/images/cards/HEART-4.svg"),
  },
  h5: {
    suit: "h",
    value: "5",
    imageUri: require("../../assets/images/cards/HEART-5.svg"),
  },
  h6: {
    suit: "h",
    value: "6",
    imageUri: require("../../assets/images/cards/HEART-6.svg"),
  },
  h7: {
    suit: "h",
    value: "7",
    imageUri: require("../../assets/images/cards/HEART-7.svg"),
  },
  h8: {
    suit: "h",
    value: "8",
    imageUri: require("../../assets/images/cards/HEART-8.svg"),
  },
  h9: {
    suit: "h",
    value: "9",
    imageUri: require("../../assets/images/cards/HEART-9.svg"),
  },
  h10: {
    suit: "h",
    value: "10",
    imageUri: require("../../assets/images/cards/HEART-10.svg"),
  },
  hj: {
    suit: "h",
    value: "j",
    imageUri: require("../../assets/images/cards/HEART-11-JACK.svg"),
  },
  hq: {
    suit: "h",
    value: "q",
    imageUri: require("../../assets/images/cards/HEART-12-QUEEN.svg"),
  },
  hk: {
    suit: "h",
    value: "k",
    imageUri: require("../../assets/images/cards/HEART-13-KING.svg"),
  },
  ha: {
    suit: "h",
    value: "a",
    imageUri: require("../../assets/images/cards/HEART-1.svg"),
  },
  s2: {
    suit: "s",
    value: "2",
    imageUri: require("../../assets/images/cards/SPADE-2.svg"),
  },
  s3: {
    suit: "s",
    value: "3",
    imageUri: require("../../assets/images/cards/SPADE-3.svg"),
  },
  s4: {
    suit: "s",
    value: "4",
    imageUri: require("../../assets/images/cards/SPADE-4.svg"),
  },
  s5: {
    suit: "s",
    value: "5",
    imageUri: require("../../assets/images/cards/SPADE-5.svg"),
  },
  s6: {
    suit: "s",
    value: "6",
    imageUri: require("../../assets/images/cards/SPADE-6.svg"),
  },
  s7: {
    suit: "s",
    value: "7",
    imageUri: require("../../assets/images/cards/SPADE-7.svg"),
  },
  s8: {
    suit: "s",
    value: "8",
    imageUri: require("../../assets/images/cards/SPADE-8.svg"),
  },
  s9: {
    suit: "s",
    value: "9",
    imageUri: require("../../assets/images/cards/SPADE-9.svg"),
  },
  s10: {
    suit: "s",
    value: "10",
    imageUri: require("../../assets/images/cards/SPADE-10.svg"),
  },
  sj: {
    suit: "s",
    value: "j",
    imageUri: require("../../assets/images/cards/SPADE-11-JACK.svg"),
  },
  sq: {
    suit: "s",
    value: "q",
    imageUri: require("../../assets/images/cards/SPADE-12-QUEEN.svg"),
  },
  sk: {
    suit: "s",
    value: "k",
    imageUri: require("../../assets/images/cards/SPADE-13-KING.svg"),
  },
  sa: {
    suit: "s",
    value: "a",
    imageUri: require("../../assets/images/cards/SPADE-1.svg"),
  },
};
