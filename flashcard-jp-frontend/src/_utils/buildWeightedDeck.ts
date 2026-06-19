import { IWeightCard } from "@/_interface/Interface";

// Алгоритм взвешивания колоды
function buildWeightedDeck<T extends IWeightCard>(cards: T[]): T[] {
  const result = [...cards];

  for (const card of cards) {
    for (let i = 1; i < card.weight; i++) {
      result.push(card);
    }
  }
  console.log(result)
  return result;
}

export default buildWeightedDeck;
