/**
 * ========================
 * Karatsuba Multiplication
 * ========================
 */

function countDigits(n) {
  let count = 0;

  while (n > 0) {
    n /= 10n; // divide by BigInt 10
    count++;
  }

  return count;
}

const pow = (base, exponent) => BigInt(base ** exponent);

function multiply(x, y) {
  if (x < 10 && y < 10) {
    return x * y;
  }

  const xLength = countDigits(x);
  const yLength = countDigits(x);
  const size = xLength > yLength ? xLength : yLength;
  const n = BigInt(Math.ceil(size / 2));
  const p = pow(10n, n);

  const a = BigInt(x / p);
  const b = BigInt(x % p);
  const c = BigInt(y / p);
  const d = BigInt(y % p);

  const ac = multiply(a, c);
  const bd = multiply(b, d);
  const e = multiply(a + b, c + d) - ac - bd;

  console.log(a, b, c, d);

  return pow(10n, 2n * n) * ac + pow(10n, n) * e + bd;
}

function parseArgs() {
  try {
    const a = BigInt(process.argv[2]);
    const b = BigInt(process.argv[3]);

    return [a, b];
  } catch (err) {
    if (err instanceof SyntaxError && err.message.includes("BigInt")) {
      throw new Error(
        `Invalid arguments: Only integers are allowed for <a> and <b>!`
      );
    }

    throw err;
  }
}

function main() {
  const [a, b] = parseArgs();

  const sum = multiply(a, b);
  console.log("Sum is: ", sum);
}

main();
