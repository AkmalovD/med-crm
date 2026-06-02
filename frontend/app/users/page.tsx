import { DashboardScaffold } from '@/components/dashboard/DashboardScaffold'
import { UsersPage } from '@/components/users/UsersPage'

export default function Page() {
    return (
        <DashboardScaffold>
            <UsersPage />
        </DashboardScaffold>
    )
}