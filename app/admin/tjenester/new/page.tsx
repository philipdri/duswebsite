import Link from 'next/link'
import NewServiceForm from './NewServiceForm'
import { adminPageShell, adminSubtleLink, adminTitle } from '../../adminStyles'

export default function NewServicePage() {
  return (
    <div className={adminPageShell}>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link href="/admin/tjenester" className={adminSubtleLink}>
          {'\u2190 TJENESTER'}
        </Link>
        <h1 className={adminTitle}>Ny tjeneste</h1>
      </div>
      <NewServiceForm />
    </div>
  )
}
