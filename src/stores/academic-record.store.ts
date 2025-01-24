import type { AcademicRecord } from '$lib/models/grades.model';
import { writable, type Writable } from 'svelte/store';

export const academicRecordStore: Writable<AcademicRecord> = writable({});
