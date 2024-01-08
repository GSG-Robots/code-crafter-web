const MAX_COL = 999;

let block_width = 0;
let block_height = 10;
let block_pixels = 40;
let isClicked = false;
let isClickedRight = false;

let indexBlock = null;
let selectedBlock = null;

function clickedBlock(event) {
  const isInView = checkInView(event.target);
  if (!isInView.partially) {
    console.log('scrolling', isInView);
    const canvas = document.getElementById('canvas');
    if (isInView.left_left_partially) {
      canvas.scrollBy(-(block_pixels + 2), 0);
    } else if (isInView.left_right_partially) {
      addColumnsIfNeeded(3);
      canvas.scrollBy(block_pixels + 2, 0);
    }
  }
  if (isClickedRight) {
    event.target.style.backgroundColor = 'white';
    event.target.classList.remove('active');
  } else {
    event.target.style.backgroundColor = blocks[selectedBlock]['color'];
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
    const canvas = document.getElementById('canvas');
    canvas.classList.add('rightclick');
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
        colnum.scrollIntoView({block : "center", inline : "center"});
      }

      addColumnsIfNeeded(Math.floor(calcWidth() / 2));
    }
    colnum.addEventListener('click', intoview);
    colnum.addEventListener('contextmenu', intoview);
    colnum.addEventListener('mouseover', intoview);
    colnum.addEventListener('mouseenter', intoview);
    colnum.addEventListener('mousemove', intoview);
    colnum.addEventListener('mouseleave', intoview);
    colnum.addEventListener('mouseout', intoview);
    colnum.addEventListener('mousedown', intoview);
    colnum.addEventListener('mouseup', intoview);
    numrow.appendChild(colnum);
  }

  return new_width;
}

function addColumnsIfNeeded(amount) {
  if (ifPartiallyInView(indexBlock)) {
    block_width = addColumns(block_width, block_width + amount);
  }
}

const blocks =
    {
      'wall' : {'name' : 'Wall', 'color' : 'black'},
      'other' : {'name' : 'Other', 'color' : 'red'},
      'other2' : {'name' : 'Other2', 'color' : 'blue'},
      'other3' : {'name' : 'Other3', 'color' : 'green'},
      'other4' : {'name' : 'Other4', 'color' : 'yellow'},
      'other5' : {'name' : 'Other5', 'color' : 'white'},
    }

    function initCanvas() {
      const canvas = document.getElementById('canvas');

      canvas.addEventListener('contextmenu',
                              function(event) { event.preventDefault(); });

      canvas.addEventListener('mousedown', mdown);

      canvas.addEventListener('mouseup', function() {
        isClicked = false;
        isClickedRight = false;
        canvas.classList.remove('rightclick');
      });

      canvas.addEventListener('mouseleave', function() {
        isClicked = false;
        isClickedRight = false;
        canvas.classList.remove('rightclick');
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

      const toolbar = document.getElementById('toolSelector');
      for (let block in blocks) {
        let button = document.createElement('button');
        button.classList.add('toolButton');
        button.style.backgroundColor = blocks[block]['color'];
        button.title = blocks[block]['name'];
        button.addEventListener('click', function() {
          const alltools = document.querySelectorAll('.toolButton');
          for (let i = 0; i < alltools.length; i++) {
            alltools[i].classList.remove('selected');
          }
          this.classList.add('selected');
          selectedBlock = block;
        });
        toolbar.appendChild(button);
      }

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

    function
        recalcColumns() { block_width = addColumns(block_width, calcWidth()); }

    function checkInView(elem) {
      const canvas = document.getElementById('canvas');
      const canvas_left_border = canvas.scrollLeft;
      const canvas_right_border = canvas_left_border + canvas.offsetWidth + 3;
      const block_left_border = elem.offsetLeft - elem.offsetWidth;
      const block_right_border = block_left_border + elem.offsetWidth;
      return {
        left_left_partially : block_left_border < canvas_left_border,
        left_right_partially : block_right_border > canvas_right_border,
        left_left_complete : block_right_border < canvas_left_border,
        left_right_complete : block_left_border > canvas_right_border,
        partially : (block_left_border >= canvas_left_border) &&
                        (block_right_border <= canvas_right_border),
        complete : (block_left_border <= canvas_left_border) &&
                       (block_right_border >= canvas_right_border),
      };
    }

    function ifPartiallyInView(elem) {
      const canvas = document.getElementById('canvas');
      const canvasLeft = canvas.scrollLeft;
      const canvasViewRight = canvasLeft + canvas.offsetWidth + 3;
      const indexBlockLeft = elem.offsetLeft - indexBlock.offsetWidth;
      return (indexBlockLeft <= canvasViewRight) &&
             (indexBlockLeft >= canvasLeft);
    }

    document.addEventListener("DOMContentLoaded", initCanvas);