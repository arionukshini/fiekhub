export const studyYears = [
  { label: 'First year', value: 'first-year', groupCount: 5 },
  { label: 'Second year', value: 'second-year', groupCount: 3 },
  { label: 'Third year', value: 'third-year', groupCount: 3 },
  { label: 'Master', value: 'master', groupCount: 1 },
]

export function getStudyYearLabel(value) {
  return studyYears.find((year) => year.value === value)?.label ?? value
}

export function getGroupsForYear(yearValue) {
  const groupCount =
    studyYears.find((year) => year.value === yearValue)?.groupCount ?? 0

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
      metadata.study_year &&
      metadata.study_group &&
      getGroupsForYear(metadata.study_year).some(
        (group) => group.value === metadata.study_group,
      ),
  )
}
