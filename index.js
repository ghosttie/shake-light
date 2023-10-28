document.addEventListener("DOMContentLoaded", (event) => {
	const MaxBattery = 1000;
	const MaxBatteryIncrease = 10;
	const BatteryDecay = 2;

	let battery = 0;
	let x;
	let y;
	let z;

	const ac = new Accelerometer({ frequency: 4 });
	ac.addEventListener("reading", () => {
		const totalAbsoluteMovement = Math.abs(ac.x) + Math.abs(ac.y) + Math.abs(ac.z);
		const total = Math.min(totalAbsoluteMovement, MaxBatteryIncrease);

		battery = Math.min(battery + total, MaxBattery);
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
		const brightness = (battery / MaxBattery) * 255;

		document.body.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;

		battery = Math.max(battery - BatteryDecay, 0);

		document.getElementById("x").innerHTML = x;
		document.getElementById("y").innerHTML = y;
		document.getElementById("z").innerHTML = z;
		document.getElementById("battery").innerHTML = battery;
	}, 4);
});