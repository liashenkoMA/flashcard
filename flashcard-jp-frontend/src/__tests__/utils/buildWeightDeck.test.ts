import buildWeightedDeck from "@/_utils/buildWeightedDeck";

describe("buildWeightedDeck", () => {
  it("Возвращает копию массива если веса равны 1", () => {
    const cards = [
      { symbol: "あ", romaji: "a", weight: 1 },
      { symbol: "い", romaji: "i", weight: 1 },
      { symbol: "う", romaji: "u", weight: 1 },
    ];

    const result = buildWeightedDeck(cards);

    expect(result).toEqual(cards);
    expect(result).not.toBe(cards);
  });

  it("Не изменяет исходный массив", () => {
    const cards = [
      { symbol: "あ", romaji: "a", weight: 2 },
      { symbol: "い", romaji: "i", weight: 2 },
    ];

    const original = [...cards];

    buildWeightedDeck(cards);

    expect(cards).toEqual(original);
  });

  it("Карточка с большим весом появляется чаще", () => {
    const cards = [
      { symbol: "あ", romaji: "a", weight: 5 },
      { symbol: "い", romaji: "i", weight: 1 },
    ];

    const result = buildWeightedDeck(cards);

    const aCount = result.filter((card) => card.symbol === "あ").length;

    const iCount = result.filter((card) => card.symbol === "い").length;

    expect(aCount).toBe(5);
    expect(iCount).toBe(1);
  });

  it("Работает с пустым массивом", () => {
    const result = buildWeightedDeck([]);

    expect(result).toEqual([]);
  });
});
