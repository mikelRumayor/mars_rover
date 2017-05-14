const FORWARD = 'f'
const BACKWARD = 'b'
const LEFT = 'l'
const RIGHT = 'r'

const NORTH = 'N'
const EAST = 'E'
const SOUTH = 'S'
const WEST = 'W'

class Obstacle {
	
	constructor (id, position) {
		this.className = 'obstacle'
		this.id = id
		this.position = position
	}
}

class Rover {
	
	constructor (id, position, direction) {
		this.className = 'rover'
		this.id = id
		this.position = position,
		this.direction = direction
		this.arrowPosition = []
	}
	
	moveRover (grid, command) {
		if (command === RIGHT || command === LEFT) {
			this.changeDirection(command)
		}
		else if (command === FORWARD || command === BACKWARD) {
			this.changePosition(grid, command)
		}
		grid.removeRoverFromMarsGrid(this.id)
		grid.drawRoverInMarsGrid(this)
		grid.drawDirectionForRover(this)
	}

	changeDirection (command) {
		switch(this.direction) {
			case NORTH:
				command === RIGHT ? this.direction = EAST : this.direction = WEST
				break;
			case EAST:
				command === RIGHT ? this.direction = SOUTH : this.direction = NORTH
				break;
			case SOUTH:
				command === RIGHT ? this.direction = WEST : this.direction = EAST
				break;
			case WEST:
				command === RIGHT ? this.direction = NORTH : this.direction = SOUTH
				break;
	  }
	}

	changeGridPosition (grid, rover, axis, command) {
		if(command === FORWARD) {
			if (rover.position[axis] < grid.gridHeightUpperLimit && grid.checkFreeGrid(rover, command)) {
				rover.position[axis]++
			}
		} else if (command === BACKWARD) {
			if (rover.position[axis] > grid.gridHeightLowerLimit && grid.checkFreeGrid(rover, command)) {
				rover.position[axis]--
			}
		}
	}

	changeGridPositionInverse (grid, rover, axis, command) {
		if(command === FORWARD) {
			if (rover.position[axis] > grid.gridHeightLowerLimit && grid.checkFreeGrid(rover, command)) {
				rover.position[axis]--
			}
		} else if (command === BACKWARD) {
			if (rover.position[axis] < grid.gridHeightUpperLimit && grid.checkFreeGrid(rover, command)) {
				rover.position[axis]++
			}
		}
	}
	
	changePosition (grid, command) {
		switch(this.direction) {
			case NORTH:
				this.changeGridPositionInverse(grid, this, 0, command)
				break;
			case EAST:
				this.changeGridPosition(grid, this, 1, command)
				break;
			case SOUTH:
				this.changeGridPosition(grid, this, 0, command)
				break;
			case WEST:
				this.changeGridPositionInverse(grid, this, 1, command)
				break; 
		}
		console.log("New Rover Position: [" + this.position[0] + ", " + this.position[1] + "]")
	}
}

class MarsGrid {
	constructor (gridWidth, gridHeight) {
		this.grid = []
		this.gridWidth = gridWidth
		this.gridHeight = gridHeight
		this.gridWidthLowerLimit = gridWidth - gridWidth
		this.gridWidthUpperLimit = gridWidth - 1
		this.gridHeightLowerLimit = gridHeight - gridHeight
		this.gridHeightUpperLimit = gridHeight - 1
		this.elementsPositionsInGrid = []
		this.elementsFuturePositionsInGrid = {}
		this.elementsFuturePositionsInGridBackward = {}
	}
		
	createMarsGrid (obstacles) {
		this.grid = new Array(this.gridWidth).fill(new Array(this.gridHeight).fill(0))
		let gridTable = document.createElement("table")

		gridTable.id = "gridTable"

		this.grid.map((row, rowIndex) => {
			var rowGrid = document.createElement('tr')
			rowGrid.id = 'row' + rowIndex
			row.map((column, columnIndex) => {
				var columnGrid = document.createElement('td')
				columnGrid.className = 'col' +columnIndex
				columnGrid.style.width = "60px"
				columnGrid.style.height = "60px"
				columnGrid.style.border = "1px solid"
				rowGrid.append(columnGrid)
			})
			gridTable.append(rowGrid)
		})
		
		this.placeObstaclesInMars(obstacles)
			
		var backForwardInstructions = document.createElement('h4');
		backForwardInstructions.innerHTML = 'Use f, b to move the rover' 
		document.body.append(backForwardInstructions)
		
		var leftRightInstructions = document.createElement('h4');
		leftRightInstructions.innerHTML = 'Use r, l to change the direction of the rover' 
		document.body.append(leftRightInstructions)
		
		var sequenceTitle = document.createElement('h4');
		sequenceTitle.innerHTML = 'Enter the sequence of instructions that you want to simulate' 
		sequenceTitle.style.display = 'inline'

		document.body.append(sequenceTitle)
		
		var sequenceValue = document.createElement('input');
		sequenceValue.id = 'sequence'
		sequenceValue.style.marginLeft = '10px'

		document.body.append(sequenceValue)
		
		var sequenceButton = document.createElement('button');
		sequenceButton.innerHTML = 'simulate' 
		sequenceButton.onclick = executeSequence
		sequenceButton.style.marginLeft = '10px'

		document.body.append(sequenceButton)
		
		let gridDiv = document.createElement('div')
		gridDiv.id = 'gridDiv'
		gridDiv.tabIndex = '1'
		// gridDiv.style.outline = 'none'
		gridDiv.append(gridTable)
		gridDiv.addEventListener('keypress', chooseDirectionForRover, false)

		document.body.append(gridDiv)
	}

	
	initRoverInMars (rovers) {
		rovers.map((rover) => {
			this.drawRoverInMarsGrid(rover)
			this.drawDirectionForRover(rover, rover.direction)
		})
	}
	
	placeObstaclesInMars (obstacles) {
		this.obstacles = obstacles
	}
	
	drawRoverInMarsGrid (rover) {
		let currentPosition = document.getElementById('row' + rover.position[0]).getElementsByClassName('col' + rover.position[1])
		let roverElement = document.createElement('img')
		roverElement.id = rover.id
		roverElement.className = rover.className

		roverElement.src= 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRSv1LKptY9fxQElU816wXsYNEf4-rNXJU1Pzc13DTMYL4Tn36G'
		roverElement.style.width = '50px'
		currentPosition[0].append(roverElement)
	}
	
	drawDirectionForRover (rover) {
		let arrowPosition = rover.position.slice(0)
		let arrowRotation = 0
		let roverRotation = 0
		
		let backwardArrowPosition = rover.position.slice(0)

		switch (rover.direction) {
			case NORTH:
				arrowPosition[0]--
				backwardArrowPosition[0]++
				arrowRotation = 270
				roverRotation = 270
				break;
			case EAST:
				arrowPosition[1]++
				backwardArrowPosition[1]--
				arrowRotation = 0
				roverRotation = 0
				break;
			case SOUTH:
				arrowPosition[0]++
				backwardArrowPosition[0]--
				arrowRotation = 90
				roverRotation = 90
				break;
			case WEST:
				arrowPosition[1]--
				backwardArrowPosition[1]++
				arrowRotation = 180
				roverRotation = 180
				break;
		}
		var currentRow = document.getElementById('row' + arrowPosition[0])
		this.removeDirectionArrowFromMarsGrid('directionArrow_' + rover.id)

		rover.arrowPosition = arrowPosition
		rover.backwardArrowPosition = backwardArrowPosition
		
		this.elementsFuturePositionsInGrid[rover.id] = rover.position.toString()
		this.elementsFuturePositionsInGrid[rover.id + '_arrow_position'] = rover.arrowPosition.toString()
		
		this.elementsFuturePositionsInGridBackward[rover.id] = rover.position.toString()
		this.elementsFuturePositionsInGrid[rover.id + '_arrow_position'] = rover.backwardArrowPosition.toString()

		
		if (currentRow) {
			if (currentRow.getElementsByClassName('col' + arrowPosition[1]).length) {

				if (!this.checkObstacle(rover)) {
					var currentPosition = currentRow.getElementsByClassName('col' + arrowPosition[1])
					var arrowElement = document.createElement('img')
					arrowElement.id = 'directionArrow_' + rover.id
					arrowElement.className = 'directionArrow'

					arrowElement.src= 'http://www.animatedimages.org/data/media/111/animated-arrow-image-0103.gif'
					arrowElement.style.width = '50px'
					arrowElement.style.webkitTransform = 'rotate(' + arrowRotation + 'deg)'
					arrowElement.style.MozTransform = 'rotate(' + arrowRotation + 'deg)'
					arrowElement.style.msTransform = 'rotate(' + arrowRotation + 'deg)'
					arrowElement.style.OTransform = 'rotate(' + arrowRotation + 'deg)'
					arrowElement.style.transform = 'rotate(' + arrowRotation + 'deg)'

					currentPosition[0].append(arrowElement)
				} else {
					console.log("Obstacle found by " + rover.id + " at Position: [" + rover.arrowPosition[0] + ", " + rover.arrowPosition[1] + "]")
				}
				
				var roverElement = document.getElementById(rover.id)
				roverElement.style.webkitTransform = 'rotate(' + roverRotation + 'deg)'
				roverElement.style.MozTransform = 'rotate(' + roverRotation + 'deg)'
				roverElement.style.msTransform = 'rotate(' + roverRotation + 'deg)'
				roverElement.style.OTransform = 'rotate(' + roverRotation + 'deg)'
				roverElement.style.transform = 'rotate(' + roverRotation + 'deg)'
			}
		}
	
	}
	
	removeRoverFromMarsGrid (roverId) {
		let roverElement = document.getElementById(roverId)
		if(roverElement) {
			var roverElementParent = roverElement.parentNode
			roverElementParent.removeChild(roverElement)
		}
	}
	
	removeDirectionArrowFromMarsGrid (arrowId) {
		let arrowElement = document.getElementById(arrowId)
		if (arrowElement) { 
			var directionArrowElementParent = arrowElement.parentNode
			directionArrowElementParent.removeChild(arrowElement)
		}
	}
	
	drawObstaclesInMarsGrid () {
		this.obstacles.map((obstacle) => {
			this.drawObstacleInMarsGrid(obstacle)
		})
	}
	
	drawObstacleInMarsGrid (obstacle) {
		let currentPosition = document.getElementById('row' + obstacle.position[0]).getElementsByClassName('col' + obstacle.position[1])
		let obstacleElement = document.createElement('img')
		obstacleElement.id = obstacle.id
		obstacleElement.className = obstacle.className

		obstacleElement.src = 'http://img11.deviantart.net/6ac8/i/2013/012/f/f/rock_02_png___by_alzstock-d5r85eg.png'
		obstacleElement.style.width = '50px'
		currentPosition[0].append(obstacleElement)
		
		this.elementsPositionsInGrid = [...this.elementsPositionsInGrid, obstacle.position.toString()]
	}
	
	//FIXME REFACTOR THIS TO RETUN WITH && I COULDN´T MAKE IT WORK (T_T)
	checkFreeGrid (rover, command) {
		let foundObstacle = this.checkObstacle(rover)
		let foundRover = this.checkRover(rover, command)
	
		if (!foundObstacle && !foundRover){
			return true
		}
		else {
			return false
		}
		
	}
	
	checkObstacle (rover, command) {
		let position = command === FORWARD ? rover.arrowPosition : rover.backwardArrowPosition

		return (this.elementsPositionsInGrid.indexOf(position.toString()) !== -1)
	}
	
	checkRover (rover, command) {
		let positionsArray = new Array()
		
		let elementsBBoxPositionsInGrid = command === FORWARD ? this.elementsFuturePositionsInGrid : this.elementsFuturePositionsInGridBackward
		
		
		for (let position in elementsBBoxPositionsInGrid) {
			if (position.indexOf(rover.id) === -1) {
				positionsArray = [...positionsArray, this.elementsFuturePositionsInGrid[position]]
			}
		}
	
		let position = command === FORWARD ? rover.arrowPosition : rover.backwardArrowPosition

		return (positionsArray.indexOf(position.toString()) !== -1)
	}
}


function chooseDirectionForRover (event) {
	const directionsArray = [FORWARD, BACKWARD, RIGHT, LEFT]
	if (directionsArray.indexOf(event.key.toLowerCase()) > -1) {
		window.rovers.map((rover) => {
			rover.moveRover(window.grid, event.key.toLowerCase())
		})
	}
}

const executeSequence = () => {
	const directionsArray = [FORWARD, BACKWARD, RIGHT, LEFT]

	const instructions = Array.from(document.getElementById('sequence').value)
	
	instructions.map((instruction, index) => {
		if (directionsArray.indexOf(instruction.toLowerCase()) > -1) {
			window.rovers.map((rover) => {
				setTimeout(() => {
					rover.moveRover(window.grid, instruction.toLowerCase())
				}, (index + 1) * 1000)
			})
		}
	})
}

const launchRoversInMars = () => {
	
	if (!window.grid) {
		let gridWidth = parseInt(document.getElementById('gridWidth').value)
		let gridHeight = parseInt(document.getElementById('gridHeight').value)
		
		let grid = new MarsGrid(gridWidth, gridHeight)

		let obstacles = []
		let repeatedPositions = []
		
		window.repeatedPositions = repeatedPositions

		for (let i= 0; i < parseInt(document.getElementById('obstaclesNumber').value); i++) {
			let uniquePosition = getUniquePosition(gridWidth, gridHeight)
			obstacles = [...obstacles, new Obstacle('obstacle_' + i, uniquePosition)]
		}
		
		this.elementsPositionsInGrid = window.repeatedPositions
		
		let rovers = []
		
		let orientations = [NORTH, EAST, SOUTH, WEST]
		
		for (let i = 0; i < parseInt(document.getElementById('roversNumber').value); i++) {
			let uniquePosition = getUniquePosition(gridWidth, gridHeight)
			let orientationIndex = Math.floor(Math.random() * (orientations.length - 1 + 1)) + 0
			rovers = [...rovers, new Rover('rover_' + i, uniquePosition, orientations[orientationIndex])]
		}
		
		window.rovers = rovers
		grid.createMarsGrid(obstacles)
		grid.drawObstaclesInMarsGrid()
		grid.initRoverInMars(rovers)
		
		window.grid = grid
	}
}

const getUniquePosition = (gridWidth, gridHeight) => {
	let x
	let y
	
	do {
		x = Math.floor(Math.random() * (gridWidth - 1 + 1)) + 0
		y = Math.floor(Math.random() * (gridHeight - 1 + 1)) + 0
	} while (window.repeatedPositions.indexOf([x, y].toString()) !== -1)
	
	window.repeatedPositions = [...window.repeatedPositions, [x, y].toString()]
	
	return [x,y]
}