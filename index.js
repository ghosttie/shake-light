document.addEventListener("DOMContentLoaded", (event) => {
	let battery = 0;

	const ac = new Accelerometer({ frequency: 4 });
	ac.addEventListener("reading", () => {
		const total = ac.x + ac.y + ac.z;

		battery += total;
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
		const batteryAdjusted = Math.min(battery, 1000);
		const brightness = (battery / 1000) * 255;

		document.body.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;

		battery = Math.max(battery--, 0);
	}, 4);
});