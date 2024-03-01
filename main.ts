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
				if (this.currentDirection === Direction.North)
				{
					this.currentPosition.y += delta;
				}
				else if (this.currentDirection === Direction.South)
				{
					this.currentPosition.y -= delta;
				}
				else if (this.currentDirection === Direction.East)
				{
					this.currentPosition.x += delta;
				}
				else if (this.currentDirection === Direction.West)
				{
					this.currentPosition.x -= delta;
				}
				else if (this.currentDirection === Direction.Up)
				{
					this.currentPosition.z += delta;
				}
				else if (this.currentDirection === Direction.Down)
				{
					this.currentPosition.z -= delta;
				}
			}

			// handle left and right turn
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

			// handle up and down
			if ([Commands.u, Commands.d].includes(c))
			{
				this.currentDirection = (c === Commands.u) ? Direction.Up : Direction.Down;
			}
		}
	}
}

describe("Chandrayan Movement", () =>
{
	describe("Setup For Initial Position, Direction and Move function", () =>
	{
		it("Chandrayaan has an x,y and z position co-ordinates and direction, can be constructed with defaults", () =>
		{
			let ch = new Chayndrayan();
		});

		it("Chandrayaan can take as input an initial position and direction", () =>
		{
			let ch = new Chayndrayan({ x: 3, y: 4, z: 5 }, Direction.East);
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
	});

	describe("Forward and Backward Movement Tests", () =>
	{
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
	});

	describe("Left and Right Movement Tests", () =>
	{
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
	});

	describe("Movement on X-Y Plane using f,b,l,r combined", () =>
	{
		it("Start facing North , Move via [f,r] should reach (0,1,0) East", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.r]);
			assert.deepStrictEqual({ x: 0, y: 1, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.East, ch.currentDirection);
		});

		it("Start facing North , Move via [f,r,f] should reach (1,1,0) East", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.r, Commands.f]);
			assert.deepStrictEqual({ x: 1, y: 1, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.East, ch.currentDirection);
		});

		it("Start facing North , Move via [r,f,l,f] should reach (1,1,0) North", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.r, Commands.f, Commands.l, Commands.f]);
			assert.deepStrictEqual({ x: 1, y: 1, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});

		it("Start facing North , Move via [f,r,f,r,b] should reach (1,2,0) South", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.r, Commands.f, Commands.r, Commands.b]);
			assert.deepStrictEqual({ x: 1, y: 2, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.South, ch.currentDirection);
		});

		it("Start facing North , Move via [f,r,b,r,b] should reach (-1,2,0) South", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.r, Commands.b, Commands.r, Commands.b]);
			assert.deepStrictEqual({ x: -1, y: 2, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.South, ch.currentDirection);
		});

		it("Start facing North , Full Circle Move via [f,l,f,l,f,l,f,l] should reach (0,0,0) North", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.l, Commands.f, Commands.l, Commands.f, Commands.l, Commands.f, Commands.l]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
		});

		it("Start at (2,3) East , Move via [f,l,f,f] should reach (3,5,0) North", () =>
		{
			let ch = new Chayndrayan({ x: 2, y: 3, z: 0 }, Direction.East);
			ch.move([Commands.f, Commands.l, Commands.f, Commands.f]);
			assert.deepStrictEqual({ x: 3, y: 5, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});
	});

	describe("Up Down Movement", () =>
	{
		it("Move via [u] should reach (0,0,0) Up", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.u]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Up, ch.currentDirection);
		});

		it("Move via [d] should reach (0,0,0) Down", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.d]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Down, ch.currentDirection);
		});
	});

	describe("Up Down Combined with f,b Movement", () =>
	{
		it("Move via [u,f] should reach (0,0,1) Up", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.u, Commands.f]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 1 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Up, ch.currentDirection);
		});

		it("Move via [u,b] should reach (0,0,-1) Up", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.u, Commands.b]);
			assert.deepStrictEqual({ x: 0, y: 0, z: -1 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Up, ch.currentDirection);
		});

		it("Move via [d,f] should reach (0,0,-1) Down", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.d, Commands.f]);
			assert.deepStrictEqual({ x: 0, y: 0, z: -1 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Down, ch.currentDirection);
		});

		it("Move via [d,b] should reach (0,0,1) Down", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.d, Commands.b]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 1 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Down, ch.currentDirection);
		});

		it("Start at (3,4,5) Up and Move via [f] should reach (3,4,6) Up", () =>
		{
			let ch = new Chayndrayan({ x: 3, y: 4, z: 5 }, Direction.Up);
			ch.move([Commands.f]);
			assert.deepStrictEqual({ x: 3, y: 4, z: 6 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Up, ch.currentDirection);
		});

		it("Start at (3,4,5) Up and Move via [b] should reach (3,4,4) Up", () =>
		{
			let ch = new Chayndrayan({ x: 3, y: 4, z: 5 }, Direction.Up);
			ch.move([Commands.b]);
			assert.deepStrictEqual({ x: 3, y: 4, z: 4 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Up, ch.currentDirection);
		});

		it("Start at (3,4,5) Up and Move via [d,f] should reach (3,4,4) Down", () =>
		{
			let ch = new Chayndrayan({ x: 3, y: 4, z: 5 }, Direction.Up);
			ch.move([Commands.d, Commands.f]);
			assert.deepStrictEqual({ x: 3, y: 4, z: 4 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Down, ch.currentDirection);
		});

		it("Start at (3,4,5) Down and Move via [b,u] should reach (3,4,6) Up", () =>
		{
			let ch = new Chayndrayan({ x: 3, y: 4, z: 5 }, Direction.Down);
			ch.move([Commands.b, Commands.u]);
			assert.deepStrictEqual({ x: 3, y: 4, z: 6 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.Up, ch.currentDirection);
		});
	});

	describe("Move in all Axes", () =>
	{
		it("Move via [f,r,f,u,f,l] should reach (1,1,1) North", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.r, Commands.f, Commands.u, Commands.f, Commands.l]);
			assert.deepStrictEqual({ x: 1, y: 1, z: 1 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});

		it("Start at (4,6,8) North andMove via [f,r,f,u,f,l] should reach (1,1,1) North", () =>
		{
			let ch = new Chayndrayan({ x: 4, y: 6, z: 8 }, Direction.North);
			ch.move([Commands.f, Commands.r, Commands.f, Commands.u, Commands.f, Commands.l]);
			assert.deepStrictEqual({ x: 5, y: 7, z: 9 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});

		it("[EXAMPLE CASE GIVEN] : Move via  [f,r,u,b,l] should reach (0,1,-1) North", () =>
		{
			let ch = new Chayndrayan();
			ch.move([Commands.f, Commands.r, Commands.u, Commands.b, Commands.l]);
			assert.deepStrictEqual({ x: 0, y: 1, z: -1 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});

		it("Circle Move forward via [f,r,f,u,f,d,f,r,f,r,f,r] should reach (0,0,0) North", () =>
		{
			let ch = new Chayndrayan();
			ch.move([
				Commands.f,
				Commands.r,
				Commands.f,
				Commands.u,
				Commands.f,
				Commands.d,
				Commands.f,
				Commands.r,
				Commands.f,
				Commands.r,
				Commands.f,
				Commands.r
			]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});
		it("Circle Move backward via [b,r,b,u,b,d,b,r,b,r,b,r] should reach (0,0,0) North", () =>
		{
			let ch = new Chayndrayan();
			ch.move([
				Commands.b,
				Commands.r,
				Commands.b,
				Commands.u,
				Commands.b,
				Commands.d,
				Commands.b,
				Commands.r,
				Commands.b,
				Commands.r,
				Commands.b,
				Commands.r
			]);
			assert.deepStrictEqual({ x: 0, y: 0, z: 0 }, ch.currentPosition);
			assert.deepStrictEqual(Direction.North, ch.currentDirection);
		});
	});
});
