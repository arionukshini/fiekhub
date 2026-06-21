import SiteHeader from '../components/SiteHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'

function DashboardPage() {
  const { user } = useAuth()
  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] || user?.email || 'Student'

  return (
    <div className="app-shell dashboard-shell">
      <SiteHeader />

      <main className="dashboard-page">
        <section className="dashboard-hero" aria-labelledby="dashboard-title">
          <p className="eyebrow">Dashboard</p>
          <h1 id="dashboard-title">Welcome, {firstName}</h1>
          <p>
            This is the first protected dashboard template. Schedule, materials,
            and notifications will be connected later.
          </p>
        </section>

        <section className="dashboard-grid" aria-label="Dashboard overview">
          <article className="dashboard-card">
            <span className="card-label">Today</span>
            <h2>No verified classes yet</h2>
            <p>Class schedule data will appear here after it is reviewed.</p>
          </article>

          <article className="dashboard-card">
            <span className="card-label">Materials</span>
            <h2>Course files</h2>
            <p>PDFs, presentations, and other files will live here later.</p>
          </article>

          <article className="dashboard-card">
            <span className="card-label">Profile</span>
            <h2>Student details</h2>
            <p>Faculty, program, year, and group selection will be added next.</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
