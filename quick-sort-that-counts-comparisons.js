/**
 * This is a quick sort algorithm that counts the number of comparisons
 * made during the sorting process.
 *
 * It is made for the Programming Assignment of the course
 */
const fs = require("fs");

function choosePivotIndex(input, leftIndex, rightIndex, mode = "first") {
  if (rightIndex - leftIndex <= 1) {
    return leftIndex;
  }

  if (mode === "first") {
    return leftIndex;
  }

  if (mode === "last") {
    return rightIndex - 1;
  }

  if (mode === "median") {
    const inputLength = rightIndex - leftIndex;
    const middleIndex = Math.ceil(inputLength / 2) - 1 + leftIndex;
    const firstItem = input[leftIndex];
    const middleItem = input[middleIndex];
    const lastItem = input[rightIndex - 1];

    const candidates = {
      [firstItem]: leftIndex,
      [middleItem]: middleIndex,
      [lastItem]: rightIndex - 1,
    };

    const items = Object.entries(candidates)
      .map(([key]) => Number(key))
      .sort((a, b) => a - b);

    const median = items[1];

    return candidates[median];
  }

  return leftIndex;
}

function partitionInput(input, leftIndex, rightIndex, pivotIndex) {
  let pivot = input[pivotIndex];
  let firstItem = input[leftIndex];
  let partitionIndex;

  input[pivotIndex] = firstItem;
  input[leftIndex] = pivot;

  for (let i = leftIndex, j = i; j < rightIndex; j++) {
    let item = input[j];

    if (pivot > item) {
      const isFirstSwitch = j - 1 === leftIndex;
      if (isFirstSwitch) {
        i++;
      } else {
        let firstRightPart = input[i + 1];

        input[i + 1] = item;
        input[j] = firstRightPart;
        i++;
      }
    }

    const isEndOfLoop = j === rightIndex - 1;
    if (isEndOfLoop) {
      partitionIndex = i;
    }
  }

  input[leftIndex] = input[partitionIndex];
  input[partitionIndex] = pivot;

  return {
    partitionIndex,
    comparisonsAmount: rightIndex - leftIndex - 1,
  };
}

function quickSortThatCountsComparisons(
  input,
  leftIndex = 0,
  rightIndex = input.length
) {
  if (rightIndex - leftIndex <= 1) {
    return 0;
  }

  const pivotIndex = choosePivotIndex(input, leftIndex, rightIndex, "median");

  const { partitionIndex, comparisonsAmount } = partitionInput(
    input,
    leftIndex,
    rightIndex,
    pivotIndex
  );

  let leftComparisons = quickSortThatCountsComparisons(
    input,
    leftIndex,
    partitionIndex
  );
  let rightComparisions = quickSortThatCountsComparisons(
    input,
    partitionIndex + 1,
    rightIndex
  );

  return leftComparisons + rightComparisions + comparisonsAmount;
}

function readInputFile() {
  try {
    let input = fs.readFileSync("./quick-sort-integers-list.txt", "utf8");

    input = input
      .split("\n")
      .map((line) => parseInt(line, 10))
      .filter((number) => !isNaN(number));

    return { input };
  } catch (err) {
    if (
      err instanceof SyntaxError &&
      err.message.includes("is not valid JSON")
    ) {
      throw new Error(
        `Invalid arguments: Only valid array are allowed!\nFor example: [2, 3, 1, 5, 4] `
      );
    }

    throw err;
  }
}

function main() {
  // const { input } = {
  //   input: [8, 2, 4, 5, 7, 1],
  // };

  const { input } = readInputFile();

  const numberOfComparisons = quickSortThatCountsComparisons(input);

  console.log("Sorted array is: ", input);
  console.log("Number of comparisons: ", numberOfComparisons);
}

main();
