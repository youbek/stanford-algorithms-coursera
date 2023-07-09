/**
 * ============================
 * Inversions counter algorithm
 * ============================
 *
 * You can use integers-list.txt file to test the algorithm
 * The file contains all of the 100,000 integers between 1 and 100,000 (inclusive)
 * in some order, with no integer repeated.
 */
const fs = require("fs");

function isPathFile(path) {
  const pathStats = fs.statSync(path);

  return pathStats.isFile();
}

function extractArrayIntegersFromFile(filePath) {
  /**
   * File should contain lines with a single integer
   */
  const file = fs.readFileSync(filePath, "utf8");

  return file.split("\n").map((line) => parseInt(line, 10));
}

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
  const integersString = process.argv[2];

  if (!integersString) {
    throw new Error(
      `No array arguments given: Call with format "[1,2,3,4, ..., n]" or pass path to file that contains integer per line`
    );
  }

  try {
    if (isPathFile(integersString)) {
      return extractArrayIntegersFromFile(integersString);
    }

    const array = JSON.parse(integersString);

    return array;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(
        `Invalid arguments given: Only call with format "[1,2,3,4, ..., n]" or pass path to file that contains integer per line`
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
