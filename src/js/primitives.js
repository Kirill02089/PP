import 'two.js';

export const DR = {
    LEFT: Symbol('LEFT'),
    UP: Symbol('UP'),
    DOWN: Symbol('DOWN'),
    RIGHT: Symbol('RIGHT')
};

export const positions = {
    getDRtoCenter: getDRtoCenter,
    getLongestVec: getLongestVec
};

export const pr = {
    line: line,
    triangle: triangle,
    getInitCoord: getInitCoord,
    circle: circle
};

let initX = 0, initY = 0;

function line(context, ox, oy, r, styles) {
    initX = ox;
    initY = oy;

    const abcess = new Two.Line(ox - r, oy, ox + r, oy),
        ordinate = new Two.Line(ox, oy - r, ox, oy + r);

    applyStyles([abcess, ordinate], styles);

    return context.makeGroup(abcess, ordinate);
}

function triangle(context, ox, oy, r, styles, rotate) {
    const triangle = new Two.Polygon(ox, oy, r, 3);
    triangle.rotation = rotate || 0;
    applyStyles([triangle], styles);
    return context.makeGroup(triangle);
}

function applyStyles(objects, styles) {
    for (let key in styles) {
        const style = styles[key];
        objects.forEach(obj => {
            obj[key] = style;
        })
    }
}

function getInitCoord() {
    return {
        ix: initX,
        iy: initY
    }
}

function getDRtoCenter(nx, ny, r, overturn) {
    const {ix, iy} = pr.getInitCoord();
    let arrOfCoords = trCoords(nx, ny, r, overturn),
        longest = getLongestVec(ix, iy, arrOfCoords),
        resultDR;


    switch (longest.d) {
        case DR.RIGHT: {
            resultDR = DR.LEFT;
            break;
        }
        case DR.LEFT: {
            resultDR = DR.RIGHT;
            break;
        }
        case DR.UP: {
            resultDR = DR.DOWN;
            break;
        }
        case DR.DOWN: {
            resultDR = DR.DOWN;
            break;
        }
    }

    longest.d = resultDR;
    return longest;
}

function getLongestVec(ix, iy, arr) {
    let maxC = 0, coord;
    arr.forEach(c => {
        const vec = Math.sqrt(Math.pow(ix - c.x, 2) + Math.pow(iy - c.y, 2));
        if (vec > maxC) {
            coord = c;
            maxC = vec;
        }
    });

    return coord;
}

function trCoords(ox, oy, r, overturn = false) {
    let coords = new Array(3);

    for (let i = 0; i < coords.length; ++i) {
        const fi = getFi(i);
        coords[i] = {
            d: fi.direction,
            x: r * Math.cos(fi.angle) + ox,
            y: r * Math.sin(fi.angle) + oy,
        }
    }

    function getFi(index) {
        let angle, direction, overturned = overturn ? Math.PI : 0;
        switch (index) {
            case 0: {
                angle = Math.PI / 2 + overturned;
                direction = overturn ? DR.DOWN : DR.UP;
                break;
            }
            case 1: {
                angle = (5 * Math.PI) / 4 + overturned;
                direction = overturn ? DR.RIGHT : DR.LEFT;
                break;
            }
            case 2: {
                angle = (7 * Math.PI) / 4 + overturned;
                direction = overturn ? DR.LEFT : DR.RIGHT;
                break;
            }
        }

        return {
            angle: angle,
            direction: direction
        };
    }

    return coords;
}

function circle(context, ox, oy, r, styles) {
    const circles = new Two.Circle(ox, oy, r);

    applyStyles([circles], styles);
    return context.makeGroup(circles);
}