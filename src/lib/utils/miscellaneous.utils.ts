export function transformTextInColor(str: string) {
	if (str === 'AUCUN COURS') return '#5548dc';
	const hash = Array.from(str).reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
	return `#${[0, 1, 2].map((i) => ((hash >> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join('')}`;
}

export function formatHours(date: Date) {
	return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function areDateEquals(date1: Date, date2: Date) {
	return date1.toDateString() === date2.toDateString();
}

export function isDateInWeek(date: Date, week: Date) {
	const firstDay = new Date(week);
	firstDay.setDate(week.getDate() - week.getDay());
	const lastDay = new Date(week);
	lastDay.setDate(week.getDate() - week.getDay() + 6);
	return date >= firstDay && date <= lastDay;
}

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function getDayOfDate(date: Date) {
	return days[date.getDay()];
}

export const dayNameAbbreviation: { [key: string]: string } = {
	lundi: 'Lun.',
	mardi: 'Mar.',
	mercredi: 'Mer.',
	jeudi: 'Jeu.',
	vendredi: 'Ven.',
	samedi: 'Sam.',
	dimanche: 'Dim.'
};
