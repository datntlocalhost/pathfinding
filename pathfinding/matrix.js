const Matrix = function(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.initializeRowMatrix();
}

Matrix.prototype.isRowValid = function(row) {
    return row >= 0 && row < this.rows;
}

Matrix.prototype.isColumnValid = function(column) {
    return column >= 0 && column < this.columns;
}

Matrix.prototype.initializeRowMatrix = function() {
    this.matrix = Array(this.rows).fill(Array(this.columns).fill(undefined));
}


Matrix.prototype.set = function(rowIndex, columnIndex, value) {
    if (this.isRowValid(rowIndex) && this.isColumnValid(columnIndex)) {
        console.log(rowIndex, columnIndex);
        this.matrix[rowIndex][columnIndex] = value;
        return true;
    }
    return false;
}

Matrix.prototype.get = function(rowIndex, columnIndex) {
    if (this.isRowValid(rowIndex) && this.isColumnValid(columnIndex))
        return this.matrix[rowIndex][columnIndex];
    return undefined;
}

Matrix.prototype.getRow = function(rowIndex) {
    if (this.isRowValid(rowIndex)) 
        return this.matrix[rowIndex];
    return [];
}

Matrix.prototype.getColumn = function(columnIndex) {
    if (this.isColumnValid(columnIndex)) {
        let value = Array(this.rows);
        for (let row = 0; row < this.rows; row++) {
            value[i] = this.matrix[row][columnIndex];
        }
        return value;
    }
    return [];
}