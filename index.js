document.addEventListener("DOMContentLoaded", (event) => {
	const MaxBattery = 1000;
	const MaxBatteryIncrease = 100;
	const BatteryDecay = 0.1;

	let battery = 0;
	let maxmovement = 0;

	const ac = new Accelerometer({ frequency: 4 });
	ac.addEventListener("reading", () => {
		const totalAbsoluteMovement = Math.abs(ac.x) + Math.abs(ac.y) + Math.abs(ac.z);
		const total = Math.min(totalAbsoluteMovement, MaxBatteryIncrease);

		battery = Math.min(battery + total, MaxBattery);

		if (totalAbsoluteMovement > maxmovement) {
			maxmovement = totalAbsoluteMovement;
		}
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

		document.getElementById("battery").innerHTML = battery;
		document.getElementById("maxmovement").innerHTML = maxmovement;
	}, 4);
});