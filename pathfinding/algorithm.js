const Algorithm = function() {};

Algorithm.prototype.dijstraPathFinding = async function(grid, start, end, dragFlg) {
    if (!grid || !start || !end) {
        return;
    }

    let cameFrom = new Map();
    let distances = new Map();
    let unvisited = [];
    let visited = [];
    let isDone = false;

    unvisited.push(start);
    distances.set(start, 0);

    while (unvisited.length > 0) {

        const current = this.getUnvisitCellHasLowestCost(unvisited, distances);

        unvisited.splice(unvisited.indexOf(current), 1);

        if (visited.includes(current)) {
            continue;
        }        

        if (current === end) {
            isDone = true;
            break;
        }

        if (current !== start && current !== end) {
            current.setTransition(false).setVisitingColor();
            if (!dragFlg) await sleep(0);
        }

        visited.push(current);


        let neighbors = this.getNeighbors(grid, current);

        for (let neighbor of neighbors) {
            if (visited.includes(neighbor)) {
                continue;
            }

            let tentativeDistance = distances.get(current) + this.heuristic(current, neighbor);

            if (!unvisited.includes(neighbor)) {
                unvisited.push(neighbor);
            } else if (tentativeDistance >= distances.get(neighbor)) {
                continue;
            }

            cameFrom.set(neighbor, current);
            distances.set(neighbor, tentativeDistance);

            if (neighbor !== start && neighbor !== end) {
                neighbor.setTransition(!dragFlg).setUnvisitedColor();
            }
        }

        if (current !== start && current !== end) {
            current.setTransition(!dragFlg).setVisitedColor();
        }

        if (!dragFlg) {
            await sleep(0);
        }
    }

    if (isDone) {
        let walk = cameFrom.get(end);
        while (walk) {
            walk.setTransition(!dragFlg).setWalkColor();
            walk = cameFrom.get(walk);
        }
    }

}

Algorithm.prototype.aStartPathFinding = async function(grid, start, end, dragFlg) {

    if (!grid || !start || !end) {
        return;
    }

    let cameFrom = new Map();
    let distances = new Map();
    let costs = new Map();
    let unvisited = [];
    let visited = [];
    let isDone = false;

    unvisited.push(start);
    distances.set(start, 0);
    costs.set(start, this.heuristic(start, end));

    while (unvisited.length > 0) {

        const current = this.getUnvisitCellHasLowestCost(unvisited, costs);

        unvisited.splice(unvisited.indexOf(current), 1);

        if (visited.includes(current)) {
            continue;
        }        

        if (current === end) {
            isDone = true;
            break;
        }

        if (current !== start && current !== end) {
            current.setTransition(false).setVisitingColor();
            if (!dragFlg) await sleep(100);
        }

        visited.push(current);


        let neighbors = this.getNeighbors(grid, current);

        for (let neighbor of neighbors) {
            if (visited.includes(neighbor)) {
                continue;
            }

            let tentativeDistance = distances.get(current) + this.heuristic(current, neighbor);

            if (!unvisited.includes(neighbor)) {
                unvisited.push(neighbor);
            } else if (tentativeDistance >= distances.get(neighbor)) {
                continue;
            }

            cameFrom.set(neighbor, current);
            distances.set(neighbor, tentativeDistance);
            costs.set(neighbor, tentativeDistance + this.heuristic(current, end));

            if (neighbor !== start && neighbor !== end) {
                neighbor.setTransition(!dragFlg).setUnvisitedColor();
            }
        }

        if (current !== start && current !== end) {
            current.setTransition(!dragFlg).setVisitedColor();
        }

        if (!dragFlg) {
            await sleep(0);
        }
    }

    if (isDone) {
        let walk = cameFrom.get(end);
        while (walk) {
            walk.setTransition(!dragFlg).setWalkColor();
            walk = cameFrom.get(walk);
        }
    }
};

Algorithm.prototype.getUnvisitCellHasLowestCost = function(unvisited, costs) {
        let min = Infinity;
        let cell;
        for (let [key, value] of costs.entries()) {
            if (unvisited.includes(key) && value < min) {
                min = value;
                cell = key;
            }
        }
        return cell;
};

Algorithm.prototype.getNeighbors = function(grid, current) {
    let neighbors = [];
    for (let row = current.x - 1; row <= current.x + 1; row++) {
        for (let col = current.y - 1; col <= current.y + 1; col++) {
            if (row === current.x && col === current.y ||
                row < 0 || row >= grid.length ||
                col < 0 || col >= grid[0].length) {
                continue;
            }
            let neighbor = grid[row][col];
            if (neighbor && !neighbor.isWallState()) {
                neighbors.push(neighbor);
            }
        }
    }
    return neighbors;
}

Algorithm.prototype.heuristic = function(start, end) {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}

Algorithm.prototype.recursiveDivistion = async function(grid, leftTop, rightTop, leftBottom) {
    
    if (leftTop.x === leftBottom.x && leftTop.y === rightTop.y) {
        return;
    }

    let orientation = chooseOrientation(rightTop.y - leftTop.y + 1, leftBottom.x - leftTop.x + 1);

    let leftTopFirstSide;
    let rightTopFirstSide;
    let leftBottomFirstSide;

    let leftTopSecondSide;
    let rightTopSecondSide;
    let leftBottomSecondSide;

    if (orientation === Orientation.VERTICAL) {
        let wall = randomEvenNumber(leftTop.y, rightTop.y);
        let passage = [];
        passage.push(randomOddNumber(leftTop.x, leftBottom.x));
        passage.push(randomOddNumber(leftTop.x, leftBottom.x));
        passage.push(randomOddNumber(leftTop.x, leftBottom.x));

        for (let row = leftTop.x; row < leftBottom.x; row++) {
            if (passage.includes(row) ||
                grid[row][wall].isStartState() || grid[row][wall].isEndState()) {
                continue;
            }
            grid[row][wall].setTransition(true).setWallState();
            await sleep(10);
        }

        leftTopFirstSide = leftTop;
        rightTopFirstSide = grid[rightTop.x][wall - 1];
        leftBottomFirstSide = leftBottom;

        leftTopSecondSide = grid[leftTop.x][wall + 1];
        rightTopSecondSide = rightTop;
        leftBottomSecondSide = grid[leftBottom.x][wall + 1];

    } else if (orientation === Orientation.HORIZONTAL) {
        let wall = randomEvenNumber(leftTop.x, leftBottom.x);
        let passage = [];
        passage.push(randomOddNumber(leftTop.y, rightTop.y));
        passage.push(randomOddNumber(leftTop.y, rightTop.y));
        passage.push(randomOddNumber(leftTop.y, rightTop.y));

        for (let col = leftTop.y; col < rightTop.y; col++) {
            if (passage.includes(col) ||
                grid[wall][col].isStartState() || grid[wall][col].isEndState()) {
                continue;
            }
            grid[wall][col].setTransition(true).setWallState();
            await sleep(10);
        }

        leftTopFirstSide = leftTop;
        rightTopFirstSide = rightTop;
        leftBottomFirstSide = grid[wall - 1][leftBottom.y];

        leftTopSecondSide = grid[wall + 1][leftTop.y];
        rightTopSecondSide = grid[wall + 1][rightTop.y];
        leftBottomSecondSide = leftBottom;
    }

    await this.recursiveDivistion(grid, leftTopFirstSide, rightTopFirstSide, leftBottomFirstSide);
    await this.recursiveDivistion(grid, leftTopSecondSide, rightTopSecondSide, leftBottomSecondSide);
}

Algorithm.prototype.drawBorder = async function(grid) {
    let rows = grid.length;
    let cols = grid[0].length;

    for (let col = 0; col < cols; col++) {
        grid[0][col].setTransition(true).setWallState();
        await sleep(10);
    }
    for (let row = 0; row < rows; row++) {
        grid[row][cols - 1].setTransition(true).setWallState();
        await sleep(10);
    }
    for (let col = cols - 1; col >= 0; col--) {
        grid[rows - 1][col].setTransition(true).setWallState();
        await sleep(10);
    }
    for (let row = rows - 1; row >= 0; row--) {
        grid[row][0].setTransition(true).setWallState();
        await sleep(10);
    }
}