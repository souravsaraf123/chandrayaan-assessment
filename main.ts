import { describe, it } from "node:test";

import assert from "node:assert";

interface Position
{
	x: number;
	y: number;
	z: number;
}

enum Direction
{
	"North" = "North",
	"South" = "South",
	"East" = "East",
	"West" = "West",
	"Up" = "Up",
	"Down" = "Down",
}

type XYDirection = Exclude<Direction, Direction.Up | Direction.Down>;

enum Commands
{
	"f" = "f",
	"b" = "b",
	"l" = "l",
	"r" = "r",
	"u" = "u",
	"d" = "d",
}

class Chayndrayan
{
	initialPosition: Position = { x: 0, y: 0, z: 0 };
	initialDirection: Direction = Direction.North;

	currentPosition: Position = { x: 0, y: 0, z: 0 };
	currentDirection: Direction = Direction.North;

	// we need to store this variable to know the last XY direction when the spacecraft is facing up or down
	// this is needed to calculate the left and right movement
	// Example : if the spacecraft is facing up and we move left, then the last XY direction is used to calculate the new direction

	lastXYDirection: XYDirection = Direction.North;

	constructor(inputPosition?: Position, inputDirection?: Direction)
	{
		// If user provides the initial position and direction, then use it, otherwise use the default values
		this.initialPosition = structuredClone(inputPosition || this.initialPosition);
		this.initialDirection = inputDirection || this.initialDirection;

		// the current position of the spacecraft without any movement will be the initial position
		this.currentPosition = structuredClone(this.initialPosition); // need to clone , otherwise they will have the same reference
		this.currentDirection = this.initialDirection;

		// if the initial direction is Up or Down, then the last XY direction is North, otherwise it is the same as the initial direction
		if ([Direction.Up, Direction.Down].includes(this.currentDirection))
		{
			this.lastXYDirection = Direction.North;
		}
		else
		{
			this.lastXYDirection = this.currentDirection as XYDirection;
		}
	}

	move(commands: Commands[])
	{
		for (let c of commands)
		{
			// handle forward and backward movement
			if ([Commands.f, Commands.b].includes(c))
			{
				// calculate delta to add to the coordinate
				let delta = c === Commands.f ? 1 : -1;

				// figure out the axis to move on
				if (this.currentDirection === Direction.North || this.currentDirection === Direction.South)
				{
					this.currentPosition.y += delta;
				}
				else if (this.currentDirection === Direction.East || this.currentDirection === Direction.West)
				{
					this.currentPosition.x += delta;
				}
				else if (this.currentDirection === Direction.Up || this.currentDirection === Direction.Down)
				{
					this.currentPosition.z += delta;
				}
			}

			// handle left and right movement
			if ([Commands.l, Commands.r].includes(c))
			{
				let clockWiseDirections: XYDirection[] = [
					Direction.North,
					Direction.East,
					Direction.South,
					Direction.West
				];

				// Since this array is clockwise ,
				// moving right means moving +1 in the array (wrappping around if needed)
				// moving left means moving -1 in the array (wrappping around if needed)
				let step = c === Commands.r ? 1 : -1;

				// get the current index of the lastXY direction in the array
				let currentIndex = clockWiseDirections.indexOf(this.lastXYDirection);
				let updatedIndex = (currentIndex + step + clockWiseDirections.length) % clockWiseDirections.length; // adding clockWiseDirections.length to handle negative numbers and wrap around

				// update the lastXY direction
				this.lastXYDirection = clockWiseDirections[updatedIndex];
				this.currentDirection = this.lastXYDirection;
			}
		}
	}
}

describe("Chandrayan Movement", () =>
{
	it("nothing", () =>
	{
	});

	//#region Setup For Initial Position, Direction and Move function

	it("Chandrayaan has an x,y and z position co-ordinates and direction, can be constructed with defaults", () =>
	{
		let ch = new Chayndrayan();
		console.log(ch);
	});

	it("Chandrayaan can take as input an initial position and direction", () =>
	{
		let ch = new Chayndrayan({ x: 3, y: 4, z: 5 }, Direction.East);
		console.log(ch);
	});

	it("Chandrayaan can move when given an array of commands", () =>
	{
		let ch = new Chayndrayan();
		ch.move([]);
	});

	it("Chandraayan stays put when command is []", () =>
	{
		let ch = new Chayndrayan();
		ch.move([]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	//#endregion

	//#region Forward and Backward Movement Tests

	it("Move via [f] should reach (0,1,0)", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.f]);
		assert.deepStrictEqual({ x: 0, y: 1, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Move via [f,f] should reach (0,2,0)", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.f, Commands.f]);
		assert.deepStrictEqual({ x: 0, y: 2, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Move via [b] should reach (0,-1,0)", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.b]);
		assert.deepStrictEqual({ x: 0, y: -1, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Move via [b,b] should reach (0,-2,0)", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.b, Commands.b]);
		assert.deepStrictEqual({ x: 0, y: -2, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Move via [f,f,b] should reach (0,1,0)", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.f, Commands.f, Commands.b]);
		assert.deepStrictEqual({ x: 0, y: 1, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Start facing East , Move via [f] should reach (1,0,0)", () =>
	{
		let ch = new Chayndrayan({ x: 0, y: 0, z: 0, }, Direction.East);
		ch.move([Commands.f]);
		assert.deepStrictEqual({ x: 1, y: 0, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Start facing Up , Move via [f] should reach (0,0,1)", () =>
	{
		let ch = new Chayndrayan({ x: 0, y: 0, z: 0, }, Direction.Up);
		ch.move([Commands.f]);
		assert.deepStrictEqual({ x: 0, y: 0, z: 1 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Start at (3,4,5) facing East, Move via [f,f,f,f,f,b] should reach (7,4,5)", () =>
	{
		let ch = new Chayndrayan({ x: 3, y: 4, z: 5, }, Direction.East);
		ch.move([Commands.f, Commands.f, Commands.f, Commands.f, Commands.f, Commands.b]);
		assert.deepStrictEqual({ x: 7, y: 4, z: 5 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	//#endregion

	//#region Left and Right Movement Tests

	it("Start facing North , Move via [l] should face West", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.West, ch.currentDirection);
	});

	it("Start facing North , Move via [l,l] should face South", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l, Commands.l]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.South, ch.currentDirection);
	});

	it("Start facing North , Move via [l,l,l] should face East", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l, Commands.l, Commands.l]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.East, ch.currentDirection);
	});

	it("Start facing North , Move via [l,l,l,l] should face North", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l, Commands.l, Commands.l, Commands.l]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.North, ch.currentDirection);
	});

	it("Start facing North , Move via [l,l,l,l,l] should face West", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l, Commands.l, Commands.l, Commands.l, Commands.l]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.West, ch.currentDirection);
	});

	it("Start facing North , Move via [r] should face East", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.East, ch.currentDirection);
	});

	it("Start facing North , Move via [r,r] should face South", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.r, Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.South, ch.currentDirection);
	});

	it("Start facing North , Move via [r,r,r] should face West", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.r, Commands.r, Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.West, ch.currentDirection);
	});

	it("Start facing North , Move via [r,r,r,r] should face North", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.r, Commands.r, Commands.r, Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.North, ch.currentDirection);
	});

	it("Start facing North , Move via [r,r,r,r,r] should face East", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.r, Commands.r, Commands.r, Commands.r, Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.East, ch.currentDirection);
	});

	// l and r combined
	it("Start facing North , Move via [l,r] should face West", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l, Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.North, ch.currentDirection);
	});

	it("Start facing North , Move via [l,l,r] should face West", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.l, Commands.l, Commands.r]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.West, ch.currentDirection);
	});

	it("Start facing East , Move via [l] should face North", () =>
	{
		let ch = new Chayndrayan({ x: 0, y: 0, z: 0, }, Direction.East);
		ch.move([Commands.l]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(Direction.North, ch.currentDirection);
	});

	//#endregion

});