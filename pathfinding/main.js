var width = 1100;
var height = 450;
var cellSize = 25;
var mouseDragToggle = false;
var mouseDragStartPosToggle = false;
var mouseDragEndPosToggle = false;
var grid;
var start;
var end;
var fromCell;
var currentCell;
var isProcessing = false;
var isProcessed = false;

var algorithm = new Algorithm();
var algorithmType = AlgorithmType.ASTART;

/* main load */
window.onload = function() {
    generateGrid();
    registerMouseEventListener();
    setStartAndEndPosition();
}

/* Render */
const generateGrid = function() {
    let rows = Math.floor(height / cellSize);
    let cols = Math.floor(width  / cellSize);

    rows = isEvenNumber(rows - 2) ? rows - 1 : rows;
    cols = isEvenNumber(cols - 2) ? cols - 1 : cols;

    grid = [];

    const container = document.getElementById('grid');
    const table     = document.createElement(Element.TABLE);

    container.style.width  = (cols * cellSize) + 'px';
    container.style.height = (rows * cellSize) + 'px';

    for (let row = 0; row < rows; row++) {
        const rowValues = [];
        const tr =  document.createElement(Element.ROW);
        for (let col = 0; col < cols; col++) {
            const cell = generateCell(row, col);
            setCellEvent(cell);
            tr.appendChild(cell.dom);
            rowValues.push(cell);
        }
        table.appendChild(tr);
        grid.push(rowValues);
    }
    container.appendChild(table);
}

const generateCell = function(row, col) {
    const dom = document.createElement(Element.COLUMN);
    dom.style.width  = cellSize + 'px';
    dom.style.height = cellSize + 'px';
    return new Cell(row, col, dom);
}

const setCellEvent = function(cell) {
    cell.dom.addEventListener('mousedown', function(event) {
        event.preventDefault();

        if (isProcessing) {
            return;
        }

        if (event.ctrlKey) {
            if (cell.isPathState()) {
                cell.setWallState();
                clearVisitedAndUnvisitedState();
                reProcessFinding();
            }
        } else if (event.altKey) {
            if (cell.isWallState()) {
                cell.setPathState();
                clearVisitedAndUnvisitedState();
                reProcessFinding();
            }
        } else if (cell.isStartState()) {
            fromCell = cell;
            cell.setPathState();
            mouseDragStartPosToggle = true;
        } else if (cell.isEndState()) {
            fromCell = cell;
            cell.setPathState();
            mouseDragEndPosToggle = true;
        }
        
        mouseDragToggle = true;
    });

    cell.dom.addEventListener('mouseenter', function(event) {
        currentCell = cell;

        if (isProcessing) {
            return;
        }

        if (mouseDragStartPosToggle) {
            clearVisitedAndUnvisitedState();
            if (cell.isPathState()) {
                start = cell;
                cell.setStartState();
                reProcessFinding();
            } else {
                start = null;
            }
        } else if (mouseDragEndPosToggle) {
            clearVisitedAndUnvisitedState();
            if (cell.isPathState()) {
                end = cell;
                cell.setEndState();
                reProcessFinding();
            } else {
                end = null;
            }
        } else if (mouseDragToggle && event.ctrlKey) {
            if (cell.isPathState()) {
                cell.setWallState();
                clearVisitedAndUnvisitedState();
                reProcessFinding();
            }
        } else if (mouseDragToggle && event.altKey) {
            if (cell.isWallState()) {
                cell.setPathState();
                clearVisitedAndUnvisitedState();
                reProcessFinding();
            }
        }
    });

    cell.dom.addEventListener('mouseleave', function(event) {

        if (isProcessing) {
            return;
        }

        if (mouseDragStartPosToggle && cell.isStartState()) {
            cell.setPathState();
        } else if (mouseDragEndPosToggle && cell.isEndState()) {
            cell.setPathState();
        }
    });
};

const registerMouseEventListener = function() {
    document.addEventListener('mouseup', function(event) {

        if (isProcessing) {
            return;
        }

        if (mouseDragStartPosToggle && currentCell && !currentCell.isStartState()) {
            start = fromCell;
            fromCell.setStartState();
            reProcessFinding();
        } else if (mouseDragEndPosToggle && currentCell && !currentCell.isEndState()) {
            end = fromCell;
            fromCell.setEndState();
            reProcessFinding();
        }
        mouseDragToggle = false;
        mouseDragStartPosToggle = false;
        mouseDragEndPosToggle = false;
    });
}

const setStartAndEndPosition = function() {
    start = grid[8][8];
    start.setTransition(true).setStartState();
    end = grid[grid.length - 9][grid[0].length - 9];
    end.setTransition(true).setEndState();
}

const clearVisitedAndUnvisitedState = function() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            let cell = grid[row][col];
            if (!cell.isWallState() &&
                !cell.isStartState() && !cell.isEndState()) {
                cell.setTransition(false).setPathState();
            }
        }
    }
}

const clearWallState = function() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            let cell = grid[row][col];
            if (cell.isWallState()) {
                cell.setTransition(false).setPathState();
            }
        }
    }
}

const processFinding = async function() {
    isProcessing = true;
    if (algorithmType === AlgorithmType.ASTART) {
        await algorithm.aStartPathFinding(grid, start, end, false);
    } else if (algorithmType === AlgorithmType.DIJKSTRA) {
        await algorithm.dijstraPathFinding(grid, start, end, false);
    }
    isProcessing = false;
    isProcessed = true;
}

const reProcessFinding = function() {
    if (isProcessed) {
        if (algorithmType === AlgorithmType.ASTART) {
            algorithm.aStartPathFinding(grid, start, end, true);
        } else if (algorithmType === AlgorithmType.DIJKSTRA) {
            algorithm.dijstraPathFinding(grid, start, end, true);
        }
    }
}

/* Button click event */

const btnStartFindingClick = function() {
    if (start && end) {
        clearVisitedAndUnvisitedState();
        processFinding();
    }
}

const btnClearPathClick = function() {
    if (!isProcessing && isProcessed) {
        clearVisitedAndUnvisitedState();
        isProcessed = false;
    }
}

const btnClearWallClick = function() {
    if (!isProcessing) {
        clearWallState();
        if (isProcessed) {
            clearVisitedAndUnvisitedState();
            reProcessFinding();
        }
    }
}

const btnClearGridClick = function() {
    if (!isProcessing) {
        clearWallState();
        clearVisitedAndUnvisitedState();
        isProcessed = false;
    }
}

const btnMazeGeneratorClick = async function(type) {
    if (isProcessing) {
        return;
    }

    isProcessing = true;
    isProcessed = false;
    clearWallState();
    clearVisitedAndUnvisitedState();
    await algorithm.drawBorder(grid);
    await algorithm.recursiveDivistion(grid, grid[1][1], grid[1][grid[0].length - 2], grid[grid.length - 2][1]);
    isProcessing = false;
}

const btnAlgorithmClick = function(type) {
    if (isProcessing) {
        return;
    }

    algorithmType = type;
    if (algorithmType === AlgorithmType.ASTART) {
        document.getElementById('algorithm-name').innerHTML = 'A*';
    } else if (algorithmType === AlgorithmType.DIJKSTRA) {
        document.getElementById('algorithm-name').innerHTML = "Dijkstra's";
    }
}