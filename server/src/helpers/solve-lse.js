export function solveLinearSystem(A, b) {
  // Check that the input is a valid system of linear equations
  if (!Array.isArray(A) || !Array.isArray(b) || A.length !== b.length) {
    throw new Error('Invalid input: A must be a matrix and b must be a vector!');
  }

  const n = A.length;

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find the row with the largest absolute value in the ith column
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[j][i]) > Math.abs(A[maxRow][i])) {
        maxRow = j;
      }
    }
    // Swap the ith row with the row with the largest absolute value in the ith column
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];
    // Eliminate the ith column in the remaining rows
    for (let j = i + 1; j < n; j++) {
      const factor = A[j][i] / A[i][i];
      for (let k = i + 1; k < n; k++) {
        A[j][k] -= factor * A[i][k];
      }
      b[j] -= factor * b[i];
    }
  }

  // Back-substitute to solve for the unknowns
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * x[j];
    }
    x[i] = (b[i] - sum) / A[i][i];
  }

  return x;
}
