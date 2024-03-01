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

	constructor(inputPosition?: Position, inputDirection?: Direction)
	{
		// If user provides the initial position and direction, then use it, otherwise use the default values
		this.initialPosition = structuredClone(inputPosition || this.initialPosition);
		this.initialDirection = inputDirection || this.initialDirection;

		// the current position of the spacecraft without any movement will be the initial position
		this.currentPosition = structuredClone(this.initialPosition); // need to clone , otherwise they will have the same reference
		this.currentDirection = this.initialDirection;
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
		}
	}
}

describe("Chandrayan Movement", () =>
{
	it("nothing", () =>
	{
	});

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

	it("Chandraayan stays at same position when no commands are given", () =>
	{
		let ch = new Chayndrayan();
		ch.move([]);
		assert.deepStrictEqual(ch.initialPosition, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});

	it("Chandrayaan moves forward by 1 step the current direction using f command", () =>
	{
		let ch = new Chayndrayan();
		ch.move([Commands.f]);
		assert.deepStrictEqual({ x: 0, y: 1, z: 0 }, ch.currentPosition);
		assert.deepStrictEqual(ch.initialDirection, ch.currentDirection);
	});
});