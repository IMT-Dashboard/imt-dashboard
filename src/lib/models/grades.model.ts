export interface AcademicRecord {
	[semester: number]: {
		isAllowed: boolean;
		gpa?: Gpa;
		grades: Grade[];
		modules: Module[];
		error?: string;
	};

	hasError: boolean;
}

export enum LetterGrade {
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	E = 'E',
	F = 'F'
}

export interface Gpa {
	ectsScore: number;
	gpaScore: number;
	letters: {
		[letterGrade in LetterGrade]: number;
	};
	details: Details;
}

export interface Details {
	min: number;
	max: number;
	average: number;
	total: number;
	ranking: number;
	hasBeenSeen: boolean;
}

export interface ModuleDetails {
	details: Details;
	letters: { [letterGrade in LetterGrade]: number };
}

export interface Module {
	name: string;
	ects: string;
	mark: number | undefined;
	calculatedGrade: number | undefined;
	letterGrade: LetterGrade;
	details?: ModuleDetails;
}

export interface Grade {
	name: string;
	mark: number;
	associatedModule: string | null;
	coeff: number;
	details?: Details;
}
