function choosePivotIndex(leftIndex, rightIndex) {
  const index = Math.floor(
    Math.random() * (rightIndex - leftIndex + 1) + leftIndex
  );

  return index;
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
  };
}

function quickSort(input, leftIndex = 0, rightIndex = input.length) {
  if (rightIndex - leftIndex <= 1) {
    return;
  }

  const pivotIndex = choosePivotIndex(leftIndex, rightIndex - 1);

  const { partitionIndex } = partitionInput(
    input,
    leftIndex,
    rightIndex,
    pivotIndex
  );

  quickSort(input, leftIndex, partitionIndex);
  quickSort(input, partitionIndex + 1, rightIndex);
}

function parseArgs() {
  try {
    const input = JSON.parse(process.argv[2]);

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
  const { input } = parseArgs();

  quickSort(input);

  console.log("Sorted array is: ", input);
}

main();
