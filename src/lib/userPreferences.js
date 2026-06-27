export function shouldShowAcceptanceExams(user) {
  const metadata = user?.user_metadata ?? {}

  return metadata.show_acceptance_exams !== false
}
