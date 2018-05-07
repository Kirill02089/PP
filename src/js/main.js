import '../css/style.sass'
import 'two.js'
import {pr, DR, positions} from './primitives';

const section = document.getElementById('s'),
    refresh = document.getElementById('refresh'),
    logList = document.querySelector('.log-list');
let svg = {};
let params = {
        fullscreen: true
    },
    context = new Two(params).appendTo(section);

svg = section.lastChild;
let triangleR = 20,
    animation = {},
    accurate = 35;

let sxr = 80,
    sxl = -41,
    syd = 45,
    sy = 21;

function reduceAccuracy() {
    triangleR = (triangleR / 2);
    accurate = (accurate / 2);
    sxr = (sxr / 2);
    sxl = (sxl / 2);
    syd = (syd / 2);
    sy = (sy / 2);
}

function coordPlaceholder(event) {
    context.clear();
    const Ox = event.clientX,
        Oy = event.clientY,
        styles = {
            opacity: 0.5,
            linewidth: 2,
            stroke: 'black'
        };

    const lines = pr.line(context, Ox, Oy, 15, styles);
    context.update();
}

function createCoordsSys(event) {
    const Ox = event.clientX,
        Oy = event.clientY,
        styles = {
            linewidth: 2,
            stroke: 'black',

        },
        styleCircle = {
            stroke: 'orangered',
            linewidth: 3,
            fill: 'none'
        };

    const lines = pr.line(context, Ox, Oy, context.width, styles);
    const circle = pr.circle(context, Ox, Oy, 300, styleCircle);
    context.makeCircle();

    context.update();

    step1();
}

function createSimplex(event) {
    const {ix, iy} = pr.getInitCoord();

    const startX = event.clientX,
        startY = event.clientY;

    animation = requestAnimationFrame(() => {
        startAnimation(startX, startY)
    });

    let turned = true;

    function startAnimation(x, y) {
        startSimplex(x, y, turned);
        turned = !turned;

        const {ix, iy} = pr.getInitCoord();

        const nextDR = positions.getDRtoCenter(x, y, triangleR, turned || true),
            rOfCenter = Math.sqrt(Math.pow(nextDR.x - ix, 2) + Math.pow(nextDR.y - iy, 2));

        if (rOfCenter < accurate) {
            cancelAnimationFrame(animation);
            reduceAccuracy();
            if (accurate > 0.00001) {
                startAnimation(x, y);
            } else {
                console.log('Last accurate:' + x.toFixed(7))
            }
        }
    }

    function startSimplex(cx, cy, turned) {
        updateLog(cx - ix, cy - iy);
        const nextDR = positions.getDRtoCenter(cx, cy, triangleR, turned || false),
            styles = {
                linewidth: 1,
                stroke: 'orange'
            };

        let stepX, stepY;

        switch (nextDR.d) {
            case DR.RIGHT: {
                stepX = sxr;
                stepY = turned ? -sy : sy;
                if (cy > iy) {
                    stepY = turned ? -sy : sy;
                }
                break;
            }
            case DR.LEFT: {
                stepX = sxl;
                stepY = turned ? -sy : sy;
                if (cy > iy) {
                    stepY = turned ? -sy : sy;
                }
                break;
            }
            case DR.DOWN: {
                stepX = 0;
                stepY = syd;
                if (cy > iy) {
                    stepY = -syd;
                }
                break;
            }
            case DR.UP: {
                stepX = 0;
                stepY = 0;
                if (cy > iy) {
                    stepY = sy;
                }
                break;
            }

        }

        const newX = cx + stepX,
            newY = cy + stepY,
            rotation = trRotation(nextDR.d, turned, cy > iy);

        const tr = pr.triangle(context, cx, cy, triangleR, styles, rotation);
        context.update();

        animation = requestAnimationFrame(() => {
            startAnimation(newX, newY)
        });
    }

    step2();
}

function updateLog(x, y) {
    const copy = logList.innerHTML;
    logList.innerHTML += `<span>x: ${x}; y: ${y}</span>`;
}

function trRotation(dr, turned, south) {
    const {ix, iy} = pr.getInitCoord();
    let r;
    switch (dr) {
        case DR.DOWN: {
            r = south ? Math.PI / 3 : (4 * Math.PI) / 6;
            break;
        }
        case DR.LEFT: {
            r = turned ? 0 : Math.PI / 3;
            break;
        }
        case DR.RIGHT: {
            r = turned ? (4 * Math.PI) / 6 : Math.PI;
            break;
        }
        case DR.UP: {
            r = 4 * Math.PI;
            break;
        }
    }
    return r;
}

function trPlaceholder() {
    clearGroup('tr');
    const Ox = event.clientX,
        Oy = event.clientY,
        styles = {
            opacity: 0.5,
            linewidth: 2,
            stroke: 'orange'
        };

    const tr = pr.triangle(context, Ox, Oy, triangleR, styles);
    context.update();
}

function step1() {
    trPlaceholder();
    svg.removeEventListener('mouseup', createCoordsSys);
    svg.onmousemove = trPlaceholder;
    svg.addEventListener('mouseup', createSimplex);
}

function step2() {
    svg.removeEventListener('mouseup', createSimplex);
    svg.onmousemove = {};
}

function clearGroup(groupId) {
    const groups = context.scene.children;
    if (groups.length > 2) {
        context.scene.children.pop();
        context.update();
    }

}


function refreshFun() {
    logList.innerHTML = '';
    context.clear();
    context.update();
    cancelAnimationFrame(animation);
    svg.addEventListener('mouseup', createCoordsSys);
    svg.onmousemove = coordPlaceholder;
    triangleR = 20;
    animation = {};
    accurate = 54;

    sxr = 35;
    sxl = -35;
    syd = 40;
    sy = 20;
}

refreshFun();

refresh.addEventListener('click', refreshFun);
window.addEventListener('keyup', (e) => {
    e.keyCode === 27 && refreshFun();
});