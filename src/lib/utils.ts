import type { LetterGrade } from '$lib/models/grades.model';
import { CurrentSemester, type Promotion, Semester } from '$lib/data/semester';

export function getGradeColor(letterGrade: LetterGrade, grade?: number) {
	if ((grade && grade < 8) || letterGrade === 'F') return 'note-module-f';
	if ((grade && grade >= 8 && grade < 10) || letterGrade === 'E') return 'note-module-e';
	if ((grade && grade >= 10 && grade < 12) || letterGrade === 'D') return 'note-module-d';
	if ((grade && grade >= 12 && grade < 14) || letterGrade === 'C') return 'note-module-c';
	if ((grade && grade >= 14 && grade < 16) || letterGrade === 'B') return 'note-module-b';
	return 'note-module-a';
}

export function getPreviousSemesters(promotion: Promotion) {
	const semestersForPromotion = Object.keys(Semester[promotion])
		.map((element) => parseInt(element))
		.sort((a, b) => a - b);
	const currentSemester = CurrentSemester[promotion];
	return semestersForPromotion.filter((semester) => semester <= currentSemester);
}

export async function getUserFromJwt() {
	const response = await fetch('/api/authentication/user');
	if (!response.ok) {
		console.error('Error fetching user data');
		return;
	}
	return await response.json();
}
