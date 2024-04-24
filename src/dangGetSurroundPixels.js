
const matrix = Array(3).fill(null).map(() => Array(3))
for(let i = 0; i < 3; i++){
  for(let j = 0; j < 3; j++){
    matrix[i][j] ={x:j, y:i}
  }
}

console.log({
  matrix
})

const answer = []
const startPoint = {x:1, y:1}

function isStored(point){
for(let i = 0; i < answer.length; i++){
  for(let j = 0; j < answer[i].length; j++) {
     if(point.x === answer[i][j].x && point.y === answer[i][j].y) return true
  }
}
return startPoint.x === point.x && startPoint.y === point.y
}

function solve(point, matrix) {
  const dX = [0, 0, 1, 1, 1, -1, -1, -1]
  const dY = [1, -1, 1, -1, 0, 1, -1, 0]
  const arr = []
  for(let i = 0; i < 8; i++){
    const x = point.x + dX[i]
    const y = point.y + dY[i]
    if(x < 0 || x >= matrix.length) continue
    if(y < 0 || y >= matrix[0].length) continue
    if (matrix[x][y] && !isStored({x, y})) arr.push({x, y})
  }
if(arr.length)
  answer.push(arr);
  for(let i = 0; i < arr.length; i++){
    solve(arr[i], matrix)
  }
}

solve(startPoint, matrix)
console.log({
  answer
})