document.addEventListener('DOMContentLoaded', (event) => {
	const MaxBattery = 1000; // you'd have to shake it about ten times to fully charge the battery
	const MaxBatteryIncrease = 100; // seems to be about the most we get violently shaking the phone
	const MovementThreshold = 10; // we get a nine point something sitting motionless
	const BatteryDecayAmount = 8; // 8 * 4 decays per second means we go from full to empty in about 30 seconds
	const BatteryDecayRate = 250; // 250ms is four times per second

	const url = new URL(window.location.href);
	const debug = !!url.searchParams.get('debug');

	let battery = 0;

	let debugMovement = 0;
	let debugMaxMovement = 0;

	if (debug) {
		document.getElementById('debug').style.display = 'initial';
	}

	const ac = new Accelerometer({ frequency: 4 });
	ac.addEventListener('reading', () => {
		const totalAbsoluteMovement = Math.abs(ac.x) + Math.abs(ac.y) + Math.abs(ac.z);
		const total = totalAbsoluteMovement > MovementThreshold
			? Math.min(Math.max(totalAbsoluteMovement - MovementThreshold, 0), MaxBatteryIncrease)
			: 0;

		battery = Math.min(battery + total, MaxBattery);

		if (debug) {
			debugMovement = totalAbsoluteMovement;

			if (totalAbsoluteMovement > debugMaxMovement) {
				debugMaxMovement = totalAbsoluteMovement;
			}
		}
	});
	ac.addEventListener('error', (event) => {
		if (event.error.name === 'NotAllowedError') {
			// todo: Branch to code for requesting permission.
		} else if (event.error.name === 'NotReadableError') {
			console.log('Cannot connect to the sensor.');
		}
	});
	ac.start();

	window.setInterval(function() {
		const brightness = (battery / MaxBattery) * 255;

		document.body.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;

		battery = Math.max(battery - BatteryDecayAmount, 0);

		if (debug) {
			document.getElementById('battery').innerHTML = battery;
			document.getElementById('movement').innerHTML = debugMovement;
			document.getElementById('maxmovement').innerHTML = debugMaxMovement;
		}
	}, BatteryDecayRate);
});