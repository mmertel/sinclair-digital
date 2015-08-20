/**
 * Created by mmertel on 11/14/14.
 */
"use strict";

var grid;

document.getElementsByTagName("A")[0].onclick = function() {
    if (typeof grid === "undefined") {
        grid = new Grid(5, 5);
    } else {
        grid.clear();
    }
    var rover1 = new Rover("rover1", grid, 1, 2, "N");
    grid.display(rover1);
    var rover2 = new Rover("rover2", grid, 3, 3, "E");
    grid.display(rover2);

    rover1.execute("LMLMLMLMM");
    rover2.execute("MMRMMRMRRM");
};

function Grid(width, height) {
    this.height = height;
    this.table = document.createElement("TABLE");
    for (var i = 0; i <= height; i++) {
        var row = this.table.insertRow(i);
        for (var j = 0; j <= width; j++) { // add an extra column for the width
            var cell = row.insertCell(j);
            cell.innerHTML = j + "," + (this.height - i);
        }
    }
    document.getElementById("grid").appendChild(this.table);

    this.clear = function() {
        for (var i = 0; i < this.table.rows.length; i++) {
            for (var j = 0; j < this.table.rows[i].cells.length; j++) {
                this.table.rows[i].cells[j].className = "";
            }
        }
        this.rovers = {};
    };

    // contains the rovers and their current locations on the grid
    this.rovers = {};

    this.display = function(rover) {
        if (typeof this.rovers[rover.name] !== "undefined") {
            this.rovers[rover.name].className = "";
        }
        this.rovers[rover.name] = this.table.rows[this.height - rover.y].cells[rover.x];
        this.rovers[rover.name].className = rover.getHeading();
    };

    this.active = null;
}

function Rover(name, grid, x, y, heading) {
    var rover = this;

    rover.name = name;
    rover.grid = grid;
    rover.x = x;
    rover.y = y;

    var compass = {"N": 0, "E": 90, "S": 180, "W": 270};
    rover.bearing = compass[heading];

    this.getHeading = function () {
        for (var key in compass) {
            if (compass[key] === rover.bearing) {
                return key;
            }
        }
    };

    this.execute = function (commands) {
        var index = 0;
        rover.timer = setInterval(function () {
            if (rover.grid.active === null || rover.grid.active === rover) {
                rover.grid.active = rover;
                var command = commands[index];
                switch (command) {
                    case "L":
                        rover.bearing = rover.bearing === 0 ? 270 : rover.bearing - 90;
                        break;
                    case "M":
                        if (rover.bearing === 0) {
                            rover.y++;
                        } else if (rover.bearing === 90) {
                            rover.x++;
                        } else if (rover.bearing === 180) {
                            rover.y--;
                        } else if (rover.bearing === 270) {
                            rover.x--;
                        }
                        break;
                    case "R":
                        rover.bearing = rover.bearing === 270 ? 0 : rover.bearing + 90;
                        break;
                    default:
                        break;
                }
                rover.grid.display(rover);
                index++;
                if (index >= commands.length) {
                    clearInterval(rover.timer);
                    rover.grid.active = null;
                }
            }
        }, 1000);
    };
}