export const studyYears = [
  { label: 'First year', value: 'first-year' },
  { label: 'Second year', value: 'second-year' },
  { label: 'Third year', value: 'third-year' },
  { label: 'Master', value: 'master' },
]

export const studyDepartments = [
  { label: 'IKS', value: 'iks' },
  { label: 'EAR', value: 'ear' },
  { label: 'EEn', value: 'een' },
  { label: 'TIK', value: 'tik' },
]

export function getStudyYearLabel(value) {
  return studyYears.find((year) => year.value === value)?.label ?? value
}

export function getStudyDepartmentLabel(value) {
  return (
    studyDepartments.find((department) => department.value === value)?.label ??
    value
  )
}

export function getGroupsForStudy(departmentValue, yearValue) {
  const hasDepartment = studyDepartments.some(
    (department) => department.value === departmentValue,
  )
  const hasYear = studyYears.some((year) => year.value === yearValue)

  if (!hasDepartment || !hasYear) return []

  let groupCount = 1

  if (yearValue === 'first-year') {
    groupCount = 5
  } else if (
    (yearValue === 'second-year' || yearValue === 'third-year') &&
    (departmentValue === 'iks' || departmentValue === 'ear')
  ) {
    groupCount = 3
  }

  return Array.from({ length: groupCount }, (_, index) => ({
    label: `Group ${index + 1}`,
    value: `group-${index + 1}`,
  }))
}

export function getStudyGroupLabel(value) {
  if (!value) return value

  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function isStudentSetupComplete(user) {
  const metadata = user?.user_metadata ?? {}

  return Boolean(
    metadata.setup_completed &&
      metadata.study_department &&
      metadata.study_year &&
      metadata.study_group &&
      getGroupsForStudy(metadata.study_department, metadata.study_year).some(
        (group) => group.value === metadata.study_group,
      ),
  )
}
