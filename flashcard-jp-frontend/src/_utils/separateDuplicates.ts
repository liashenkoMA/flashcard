import shuffle from "./shuffle";

type ItemId = { _id: string };

function separateDuplicatesShuffleCards<T extends ItemId>(arr: T[]): T[] {
  // Перемешиваем входящий массив алгоритмом Фишера-Йетса
  const result = shuffle<T>(arr);

  // Проверка возможности перестановки карточек без создания новых дублей
  function canSwap(i: number, j: number): boolean {
    const moving = result[j];
    const replace = result[i];

    const iLeft = result[i - 1]?._id;
    const iRight = result[i + 1]?._id;

    const jLeft = result[j - 1]?._id;
    const jRight = result[j + 1]?._id;

    return (
      iLeft !== moving._id &&
      iRight !== moving._id &&
      jLeft !== replace._id &&
      jRight !== replace._id
    );
  }

  for (let i = 1; i < result.length; i++) {
    if (result[i]._id !== result[i - 1]._id) continue;

    let swapIndex = -1;

    // Проверка вправо от нашей карточки
    for (let j = i + 1; j < result.length; j++) {
      if (canSwap(i, j)) {
        swapIndex = j;
        break;
      }
    }

    // Если не нашли вправо, ищем влево от нашей карточки
    if (swapIndex === -1) {
      for (let j = i - 1; j >= 0; j--) {
        if (canSwap(i, j)) {
          swapIndex = j;
          break;
        }
      }
    }

    if (swapIndex !== -1) {
      [result[i], result[swapIndex]] = [result[swapIndex], result[i]];
    }
  }

  return result;
}

export default separateDuplicatesShuffleCards;
