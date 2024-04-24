const boxes = []
for (let x=0; x<10; x++) {
	for (let y=0; y<10; y++) {
		if (!boxes[x]) boxes[x] = []
		boxes[x][y] = {x,y}
	}
}

//
// return [
//	[{}],
//	[{},{},{},{},{},{},{},{}],
//	[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
// ]
export function getSurroundPixels(arr, x, y, r = 2) {
	const output = [
		[arr[x][y]]
	]
	for (let d=1; d<=r; d++) {
		output[d] = []
		const 
			minX = x - d,
			minY = y - d,
			maxX = x + d,
			maxY = y + d
		// get top & bottom row
		for (let rt = minX; rt <= maxX; rt++) {
			const ot = arr[rt][minY]
			const ob = arr[rt][maxY]
			if (!output[d].includes(ot)) output[d].push(ot)
			if (!output[d].includes(ob)) output[d].push(ob)
		}
		// get left & right col
		for (let ct = minY; ct <= maxY; ct++) {
			const ol = arr[minX][ct]
			const or = arr[maxX][ct]
			if (!output[d].includes(ol)) output[d].push(ol)
			if (!output[d].includes(or)) output[d].push(or)
		}
	}
	return output
}

// console.log(getSurroundPixels(boxes, 5,5,2))