import ShowInvitations from '@/components/features/settings/users/show-invitations';
import ShowUsers from '@/components/features/settings/users/show-users';
import { ROLE_TYPES, RoleType } from '@/libs/constants/roles';

interface SettingsContainerProps {
    role: RoleType;
}

const SettingsContainer = ({ role }: SettingsContainerProps) => {
    return (
        <div className="flex size-full flex-col gap-3 p-2.5">
            {role === ROLE_TYPES.ADMIN && (
                <>
                    <ShowUsers />
                    <ShowInvitations />
                </>
            )}
        </div>
    );
};

export default SettingsContainer;
