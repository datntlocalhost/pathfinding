const Cell = function(x, y, dom) {
    this.x = x;
    this.y = y;
    this.dom = dom;
    this.setPathState();
}

Cell.prototype.setPathState = function() {
    this.state = States.PATH;
    this.dom.style.background = Colors.PATH;
    this.dom.innerHTML = BLANK;
}

Cell.prototype.setWallState = function() {
    this.state = States.WALL;
    this.dom.style.background = Colors.WALL;
    this.dom.innerHTML = BLANK;
}

Cell.prototype.setStartState = function() {
    this.state = States.START;
    this.dom.style.background = Colors.WALK;
    this.dom.innerHTML = START_ICON;
}

Cell.prototype.setEndState = function() {
    this.state = States.END;
    this.dom.style.background = Colors.WALK;
    this.dom.innerHTML = END_ICON;
}

Cell.prototype.isPathState = function() {
    return this.state === States.PATH;
}

Cell.prototype.isWallState = function() {
    return this.state === States.WALL;
}

Cell.prototype.isStartState = function() {
    return this.state === States.START;
}

Cell.prototype.isEndState = function() {
    return this.state === States.END;
}

Cell.prototype.setWalkColor = function() {
    this.dom.style.background = Colors.WALK;
}

Cell.prototype.setVisitedColor = function() {
    this.dom.style.background = Colors.VISITED;
}

Cell.prototype.setVisitingColor = function() {
    this.dom.style.background = Colors.VISITING;
}

Cell.prototype.setUnvisitedColor = function() {
    this.dom.style.background = Colors.UNVISITED;
}

Cell.prototype.setTransition = function(toggle) {
    if (toggle) {
        this.dom.style.transition = '0.5s';
    } else {
        this.dom.style.transition = 'none';
    }
    return this;
}
