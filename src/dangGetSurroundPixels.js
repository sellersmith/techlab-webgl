const matrix = Array(3)
  .fill(null)
  .map(() => Array(3).fill({}));

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    matrix[i][j] = { x: j, y: i };
  }
}

const startPoint = { x: 1, y: 1 };

const answer = solve(startPoint, matrix);
console.log({ answer });

function solve(point, matrix) {
  const answer = [];
  const visited = new Set();
  visited.add(`${point.x},${point.y}`);

  function isStored(point) {
    return visited.has(`${point.x},${point.y}`);
  }

  function explore(point) {
    const dX = [0, 0, 1, 1, 1, -1, -1, -1];
    const dY = [1, -1, 1, -1, 0, 1, -1, 0];
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const x = point.x + dX[i];
      const y = point.y + dY[i];
      if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length)
        continue;
      if (!isStored({ x, y })) {
        arr.push({ x, y });
        visited.add(`${x},${y}`);
      }
    }
    if (arr.length) answer.push(arr);
    arr.forEach((nextPoint) => explore(nextPoint));
  }

  explore(point);
  return answer;
}
