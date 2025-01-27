export function load({ cookies }) {
	const sessId = cookies.get('PHPSESSID');

	return {
		isPlanningLoaded: !!sessId
	};
}
