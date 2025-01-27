export type Promotion = 'infres16' | 'infres17';

export const Semester: { [key in Promotion]: { [key: number]: string } } = {
	infres16: {
		5: '971',
		6: '972',
		7: '1030',
		8: '1033'
	},
	infres17: {
		5: '1023',
		6: '1024',
		7: '1082',
		8: '1085'
	}
};

export const CurrentSemester: { [key in Promotion]: number } = {
	infres16: 7,
	infres17: 5
};
