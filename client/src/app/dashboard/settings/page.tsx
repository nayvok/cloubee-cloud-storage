import SettingsContainer from '@/components/features/settings/settings-container';
import { getUserRole } from '@/libs/utils/get-user-role';

export default async function Page() {
    const role = await getUserRole();

    return <SettingsContainer role={role} />;
}
