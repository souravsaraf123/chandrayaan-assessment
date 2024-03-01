import { describe, it } from "node:test";

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
});