const BLANK = '';
const START_ICON = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
const END_ICON   = '<i class="fa fa-dot-circle-o" aria-hidden="true"></i>';

const Element = {
    TABLE: 'table',
    ROW: 'tr',
    COLUMN: 'td',
    ICON: 'i'
}

const Orientation = {
    VERTICAL: 0,
    HORIZONTAL: 1
};

const States = {
    PATH: 0,
    WALL: 1,
    START: 2,
    END: 3,
}

const Colors = {
    PATH: '#fff',
    WALL: '#000',
    WALK: '#f1c40f',
    VISITING: '#e0091f',
    VISITED: '#5dade2',
    UNVISITED: '#d6eaf8'
}

const AlgorithmType = {
    ASTART: 0,
    DIJKSTRA: 1
}
