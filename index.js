document.addEventListener("DOMContentLoaded", (event) => {
	const Max = 1000;
	let battery = 0;
	let x;
	let y;
	let z;

	const ac = new Accelerometer({ frequency: 4 });
	ac.addEventListener("reading", () => {
		const total = ac.x + ac.y + ac.z;

		battery = Math.Min(battery + total, Max);
	});
	ac.addEventListener("error", (event) => {
		if (event.error.name === "NotAllowedError") {
			// todo: Branch to code for requesting permission.
		} else if (event.error.name === "NotReadableError") {
			console.log("Cannot connect to the sensor.");
		}
	});
	ac.start();

	window.setInterval(function() {
		const brightness = (battery / Max) * 255;

		document.body.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;

		battery = Math.max(battery--, 0);

		document.getElementById("x").innerHTML = x;
		document.getElementById("y").innerHTML = y;
		document.getElementById("z").innerHTML = z;
		document.getElementById("battery").innerHTML = battery;
	}, 4);
});