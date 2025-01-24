import { type Cookies, error, type RequestHandler } from '@sveltejs/kit';
import { jwtDecode } from '$lib/server/jwt';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { type Promotion, Semester } from '$lib/data/semester';
import type { Gpa, AcademicRecord, Module } from '$lib/models/grades.model';

export const GET: RequestHandler = async ({ cookies, params }) => {
	try {
		let semester = parseInt(params.semester!);
		if (!semester) error(400, 'Invalid semester');
		const user = jwtDecode(cookies);
		if (!user) error(401, 'Unauthorized');

		const academicRecord = await getAcademicRecord(semester, user.promotion, cookies);

		return new Response(JSON.stringify(academicRecord), { status: 200 });
	} catch (err) {
		console.log(err);
		error(500, 'Error while fetching academic record');
	}
};

async function getAcademicRecord(semester: number, promotion: Promotion, cookies: Cookies) {
	const cookie = cookies.get('cybernotes');

	const baseUrl = 'https://webdfd.mines-ales.fr/cybernotes/notes.php?SEM=';
	const sem = Semester[promotion][semester];

	const response = await axios.get(`${baseUrl}${sem}`, {
		headers: { Cookie: `cybernotes=${cookie}` },
		responseType: 'arraybuffer',
		responseEncoding: 'utf-8'
	});
	const decodedHtml = response.data.toString('latin1');

	const [grades, modulesTemp] = parseGrades(decodedHtml, semester);

	grades[semester].gpa =
		modulesTemp.length > 0
			? ({
					ectsScore: 0,
					gpaScore: parseGpaScore(decodedHtml),
					letters: {}
				} as Gpa)
			: undefined;

	for (const module of modulesTemp) {
		const associatedGrades = grades[semester].grades.filter((g) => g.associatedModule === module.name);
		let sum = associatedGrades.map((value) => value.grade * value.coeff).reduce((acc, value) => acc + value, 0);
		let coeffSum = associatedGrades.map((value) => value.coeff).reduce((acc, value) => acc + value, 0);
		const average = sum / coeffSum;
		const previousLetterNumber = grades[semester].gpa!.letters[module.letterGrade] ?? 0;
		grades[semester].gpa!.letters[module.letterGrade] =
			previousLetterNumber !== 0 ? previousLetterNumber + parseInt(module.ects) : parseInt(module.ects);
		grades[semester].gpa!.ectsScore += parseFloat(module.ects);
		grades[semester].modules.push({
			name: module.name,
			ects: module.ects,
			grade: !isNaN(average) ? average : undefined,
			letterGrade: module.letterGrade
		} as Module);
	}

	return grades;
}

function parseGpaScore(html: string): number | undefined {
	const $ = cheerio.load(html);
	const gpaElement = $('font[color="EE0000"] b').first();
	if (gpaElement.length) {
		const content = gpaElement.text();
		const gpaScore = content.match(/\d.\d{2}/);
		return gpaScore ? parseFloat(gpaScore[0]) : undefined;
	}
	return undefined;
}

function parseGrades(html: string, semester: number): [AcademicRecord, Module[]] {
	const $ = cheerio.load(html);
	const tables = $('table');

	let grades: AcademicRecord = {
		[semester]: {
			gpa: undefined,
			grades: [],
			modules: [],
			isAllowed: true
		}
	};

	let modules: Module[] = [];

	tables.each((_, table) => {
		const subjectElement = $(table).find('.SousTitre').first();
		const gradeElement = $(table).find('font B').first();
		const coeffOrEctsElement = $(table).find('td').first();

		if (subjectElement.length && gradeElement.length && coeffOrEctsElement.length) {
			const rawSubject = subjectElement.text().trim();
			const subject = parseSubject(rawSubject);
			const rawGrade = gradeElement.text().trim();
			const grade = parseFloat(rawGrade);

			const match = rawSubject.match(new RegExp(/\d\.\d\s[A-Za-z0-9]+/g));
			const match2 = rawSubject.match(new RegExp(/\d\.\d(?:\.\d)?/g));
			let associatedModule = null;
			if (match) {
				associatedModule = match[0];
			} else if (match2) {
				associatedModule = match2[0].length > 3 ? match2[0].substring(0, 3) : match2[0];
			}

			const rawCoeff = coeffOrEctsElement.text().match(/Coef\. \d/);
			const coeff = rawCoeff ? parseInt(rawCoeff[0].match(/\d/)?.[0] || '0') : 0;

			if (isNaN(grade)) {
				const rawEcts = coeffOrEctsElement.text().match(/\d{1,2} ECTS/);
				const ects = rawEcts ? rawEcts[0] : '0 ECTS';
				const module = rawSubject.replace(/\s\(\d{2}\/\d{2}\/\d{4}\)/, '').trim();
				const letterGrade = rawGrade;
				modules.push({ name: module, ects, grade: undefined, letterGrade } as Module);
			} else {
				grades[semester].grades.push({
					name: subject,
					grade,
					associatedModule,
					coeff
				});
			}
		}
	});

	return [grades, modules];
}

function parseSubject(subject: string): string {
	const removeDate = subject.trim().replace(/\s\(\d{2}\/\d{2}\/\d{4}\)/, '');
	return removeDate.includes(':') ? removeDate.split(':')[1].trim() : removeDate.trim();
}
