const MAX_COL = 999;


let block_width = 0;
let block_height = 10;
let block_pixels = 40;
let isClicked = false;
let isClickedRight = false;

let indexBlock = null;

function clickedBlock(event) {
    if (isClickedRight) {
        event.target.classList.remove('active');
    } else {
        event.target.classList.add('active');
    }
}

function blockMouseOver(event) {
    if (isClicked || isClickedRight) {
        clickedBlock(event);
    }
}

function mdown(event) {
    if (event.button == 2) {
        isClickedRight = true;
    } else {
        isClicked = true;
    }
}

function calcWidth() {
    const screenWidth = window.innerWidth;
    const new_block_width = Math.floor(screenWidth / block_pixels);

    if (new_block_width < block_width) {
        return block_width;
    }
    return new_block_width;
}

function addColumns(old_width, new_width) {
    if (new_width > MAX_COL) {
        new_width = MAX_COL;
    }

    const canvas = document.getElementById('canvas');
    const rows = canvas.querySelectorAll('.row');
    console.log(rows)
    for (let i = 0; i < block_height; i++) {
        let row = rows[i];
        for (let j = 0; j < new_width; j++) {
            if (j < old_width) {
                continue;
            }
            let block = document.createElement('div');
            block.classList.add('block');
            block.style.top = i * block_pixels + 'px';
            block.style.left = j * block_pixels + 'px';
            block.style.width = block_pixels + 'px';
            block.style.height = block_pixels + 'px';
            block.dataset.x = j;
            block.dataset.y = i;

            block.addEventListener('mouseover', blockMouseOver);
            block.addEventListener('mousedown', (event) => {
                mdown(event);
                clickedBlock(event);
            });
            console.log(row)
            row.appendChild(block);

            indexBlock = block;
        }
    }

    const numrow = document.getElementById('numrow');

    for (let j = 0; j < new_width; j++) {
        if (j < old_width) {
            continue;
        }
        let colnum = document.createElement('div');
        colnum.classList.add('colnum');
        colnum.style.left = j * block_pixels + 'px';
        colnum.style.width = block_pixels + 'px';
        colnum.innerHTML = j + 1;
        function intoview(event) {
            event.preventDefault();
            if (isClicked) {
                colnum.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });
            }

            addColumnsIfNeeded(Math.floor(calcWidth()/2));
        }
        colnum.addEventListener('click', intoview);
        colnum.addEventListener('contextmenu', intoview);
        colnum.addEventListener('mouseover', intoview);
        colnum.addEventListener('mouseenter', intoview);
        colnum.addEventListener('mousemove', intoview);
        colnum.addEventListener('mouseleave', intoview);
        numrow.appendChild(colnum);
    }

    return new_width;
}

function addColumnsIfNeeded(amount) {
    if (ifInView(indexBlock)) {
        block_width = addColumns(block_width, block_width + amount);
    }
}

function initCanvas() {
    const canvas = document.getElementById('canvas');

    canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        console.log('contextmenu');
    });

    canvas.addEventListener('mousedown', mdown);

    canvas.addEventListener('mouseup', function () {
        isClicked = false;
        isClickedRight = false;
    });

    canvas.addEventListener('mouseleave', function () {
        isClicked = false;
        isClickedRight = false;
    });

    for (let i = 0; i < block_height; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        canvas.appendChild(row);
    }

    const numrow = document.createElement('div');
    numrow.id = 'numrow';

    canvas.appendChild(numrow);

    canvas.scrollLeft = 0;

    recalcColumns();


    window.addEventListener('keydown', (event) => {
        // Enable arrows for scrolling canvas
        if (event.code == "ArrowLeft") {
            event.preventDefault();
            canvas.scrollLeft -= 1 * block_pixels;
            console.log(canvas.scrollLeft);
        }
        if (event.code == "ArrowRight") {
            event.preventDefault();
            canvas.scrollLeft += 1 * block_pixels;
            console.log(canvas.scrollLeft);
        }

        addColumnsIfNeeded(3);
    });
    window.addEventListener('resize', recalcColumns);
    // setInterval(() => {
    //     if (ifInView(indexBlock)) {
    //         addColumns(block_width, block_width + 3);
    //     }
    // }, 200);

    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            canvas.scrollLeft += 3 * block_pixels;
        } else {
            canvas.scrollLeft -= 3 * block_pixels;
        }

        addColumnsIfNeeded(6);
    });
}

function recalcColumns() {
    block_width = addColumns(block_width, calcWidth());
}

function ifInView(elem) {
    const canvas = document.getElementById('canvas');
    const canvasLeft = canvas.scrollLeft;
    const canvasViewRight = canvasLeft + canvas.offsetWidth + 3;
    const indexBlockLeft = indexBlock.offsetLeft - indexBlock.offsetWidth;
    console.log(indexBlockLeft, canvasViewRight)
    return (indexBlockLeft <= canvasViewRight) && (indexBlockLeft >= canvasLeft);
}

document.addEventListener("DOMContentLoaded", initCanvas);