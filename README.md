# Chandrayaan TDD Assessment

#### The assignment is written in Typescript and can be run via Node.js. Steps to run the project : 

- Download the repository 

```
git clone https://github.com/souravsaraf123/chandrayaan-assessment.git
```
```
cd chandrayaan-assessment
```

- Assuming Node.js in installed. Install the packages via 

```
npm install
```

- Run the test 

```
npm start
```

## Problem Statement
### Chandrayaan 3 Lunar Craft: Galactic Space Craft Control

#### Description
As a scientist at ISRO controlling the latest lunar spacecraft Chandrayaan 3, your task is to develop a program that translates commands sent from Earth into instructions understood by the spacecraft. The spacecraft navigates through the galaxy using galactic coordinates, represented by x, y, z coordinates (x for east or west location, y for north or south location, and z for distance above or below the galactic plane).

#### Requirements : 

You will be given the initial starting point (x, y, z) of the spacecraft and the direction it is facing (N, S, E, W, Up, Down). The spacecraft receives a character array of commands, and you are required to implement the following functionalities:

Move the spacecraft forward/backward (f, b): The spacecraft moves one step forward or backward based on its current direction.
Turn the spacecraft left/right (l, r): The spacecraft rotates 90 degrees to the left or right, changing its facing direction.
Turn the spacecraft up/down (u, d): The spacecraft changes its angle, rotating upwards or downwards.

<b>Note:</b>

The spacecraft’s initial direction (N, S, E, W, Up, Down) represents the reference frame for movement and rotation.

The spacecraft cannot move or rotate diagonally; it can only move in the direction it is currently facing.

Assume that the spacecraft’s movement and rotations are rigid, and it cannot move beyond the galactic boundaries.

Example
Given the starting point (0, 0, 0) following (x, y, z) and initial direction N, the following commands should result in the indicated final position and direction:

Commands: [f, r, u, b, l]

Starting Position: (0, 0, 0)

Initial Direction: N

“f” - (0, 1, 0) - N

“r” - (0, 1, 0) - E

“u” - (0, 1, 0) - U

“b” - (0, 1, -1) - U

“l” - (0, 1, -1) - N

Final Position: (0, 1, -1)

Final Direction: N

#### My program will produce the following output : 

```
ℹ tests 47
ℹ suites 8
ℹ pass 47
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 61.619301
```

![image](https://github.com/souravsaraf123/chandrayaan-assessment/assets/40688353/639b078e-7702-4971-8ce0-a463a1c8d68a)
![image](https://github.com/souravsaraf123/chandrayaan-assessment/assets/40688353/c0f0a3e8-cee7-4694-bcaf-9112549ee26d)

