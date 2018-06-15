const gameState = {
  rows : null,
  columns : null,
  running : false
}

function createTable() {
  const table = $('.table')
  gameState.rows = parseInt($('#rows').val())
  gameState.columns = parseInt($('#columns').val())

  buildTable(table, gameState.rows, gameState.columns)

  $('.tableSetup').hide()
  $('.gameButton').show()
}

function buildTable(table, rows, columns) {
  for (let i = 1; i <= rows; i++) {
    const row = $('<tr></tr>')

    for (let j = 1; j <= columns; j++) {
      const cell = $('<td></td>')
      const id = i.toString() + j.toString()

      cell.attr('id', id)

      cell.click(function() {
        $('#' + id).addClass('selected')
      })

      row.append(cell)
    }

    table.append(row)
  }
}

function runGame() {
  gameState.running = true
  gameOn()
}

function gameOn() {
  if (gameState.running) {
    game()
    setTimeout(gameOn, 1000)
  }
}

function game() {
  const currentBoardState = getBoardState()

  for (let i_index = 0; i_index <= gameState.rows - 1; i_index++) {
    for (let j_index = 0; j_index <= gameState.columns - 1; j_index++) {
      const surroundingCellsAlive = currentBoardState[i_index][j_index]
      const newCellState = liveOrDie(surroundingCellsAlive, i_index + 1, j_index + 1)
      setCellState(newCellState, i_index + 1, j_index + 1)
    }
  }
}

function setCellState(newCellState, i, j) {
  const currentCell = $('#' + i + j)

  if (currentCell.hasClass('selected') && newCellState === false) {
    currentCell.removeClass('selected')
  } else if (!currentCell.hasClass('selected') && newCellState === true) {
    currentCell.addClass('selected')
  }
}

function liveOrDie(surroundingCellsAlive, row, column) {
  const currentCellState = checkCellState(row, column)

  if (currentCellState === true && surroundingCellsAlive < 2) {
    return false
  }

  else if (currentCellState === true && (surroundingCellsAlive === 2 || surroundingCellsAlive === 3)) {
    return true
  }

  else if (currentCellState === true && surroundingCellsAlive > 3) {
    return false
  }

  else if (currentCellState === false && surroundingCellsAlive === 3) {
    return true
  }
}

function checkCellState(row, column) {
  if ( $('#' + row + column).hasClass('selected') ) {
    return true
  } else {
    return false
  }
}

function getBoardState() {
  const currentBoardState = []

  for (let i = 1; i <= gameState.rows; i++) {
    const row = []

    for (let j = 1; j <= gameState.columns; j++) {
      const currntCellId = '#' + i + j
      const numberOfLiveNeighbors = checkLiveNeighbors(i, j)
      row.push(numberOfLiveNeighbors)
    }

    currentBoardState.push(row)
  }

  return currentBoardState
}

function checkLiveNeighbors(row, column) {
  const surroundingCells = [[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]]
  const selectedCells = []

  surroundingCells.forEach(place => {
    const rowIndex = row + place[0]
    const columnIndex = column + place[1]
    const neighborRow = findRow(rowIndex)
    const neighborColumn = findColumn(columnIndex)


    if ( $('#' + neighborRow + neighborColumn).hasClass('selected') ) {
      selectedCells.push(true)
    } else {
      selectedCells.push(false)
    }
  })

  return selectedCells.filter(cell => {
    return cell === true
  }).length
}

function findRow(rowIndex) {
  if (rowIndex < 1) {
    return gameState.rows
  } else if (rowIndex > gameState.rows) {
    return 1
  } else {
    return rowIndex
  }
}

function findColumn(columnIndex) {
  if (columnIndex < 1) {
    return gameState.columns
  } else if (columnIndex > gameState.columns) {
    return 1
  } else {
    return columnIndex
  }
}

function pauseGame() {
  gameState.running = false
}
