function mergeAndCountInversions(left, right) {
  const mergedArray = [];

  let i = 0;
  let j = 0;
  let inversionsCount = 0;

  while (i < left.length && j < right.length) {
    if (left[i] > right[j]) {
      mergedArray.push(right[j]);
      j++;
      inversionsCount += left.length - i;
    } else {
      mergedArray.push(left[i]);
      i++;
    }
  }

  if (i !== left.length) {
    mergedArray.push(...left.slice(i));
  }

  if (j !== right.length) {
    mergedArray.push(...right.slice(j));
  }

  return {
    inversionsCount,
    mergedArray,
  };
}

function sortAndCountInversions(array) {
  if (array.length === 1) {
    return {
      inversionsCount: 0,
      sortedArray: [array[0]],
    };
  }

  const leftPart = array.slice(0, array.length / 2);
  const rightPart = array.slice(array.length / 2);

  const left = sortAndCountInversions(leftPart);
  const right = sortAndCountInversions(rightPart);

  const { inversionsCount, mergedArray } = mergeAndCountInversions(
    left.sortedArray,
    right.sortedArray
  );

  return {
    inversionsCount:
      left.inversionsCount + right.inversionsCount + inversionsCount,
    sortedArray: mergedArray,
  };
}

function countInversions(array) {
  if (array.length === 1) {
    return 0;
  }

  const { inversionsCount, sortedArray } = sortAndCountInversions(array);

  return inversionsCount;
}

function parseArgs() {
  const arrayInString = process.argv[2];

  if (!arrayInString) {
    throw new Error(
      `No array arguments given: Call with format "[1,2,3,4, ..., n]"`
    );
  }

  try {
    const array = JSON.parse(arrayInString);

    return array;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(
        `Invalid arguments given: Only call with format "[1,2,3,4, ..., n]"`
      );
    }

    throw err;
  }
}

function main() {
  const array = parseArgs();

  const inversionsCount = countInversions(array);

  console.log(`There are ${inversionsCount} inversions`);
}

main();
