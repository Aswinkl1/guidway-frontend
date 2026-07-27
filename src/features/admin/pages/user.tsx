import {
  useUpdateBlockStatus,
  useUserFilter,
  useUsers,
} from "../hooks/useUsers";

import { UsersTable } from "../components/UsersTable";
import { Navbar } from "../components/Navbar";
import { Role } from "@/types/role";

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  profileImageUrl: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminUsersPanel() {
  const { filter, setFilter } = useUserFilter();
  const { data, isLoading } = useUsers(Role.MENTEE, filter);
  const { mutate: updateBlockStatus } = useUpdateBlockStatus(Role.MENTEE);

  console.log("we got data again", data);

  const toggleBlock = (user: User) => {
    updateBlockStatus({ userId: user.id, newBlockStatus: !user.isBlocked });
  };

  return (
    <>
      {isLoading ? (
        <main className="flex-1 flex items-center justify-center">
          <span>Loading...</span>
        </main>
      ) : (
        <UsersTable
          data={data}
          toggleBlock={toggleBlock}
          setFilter={setFilter}
          filter={filter}
          title={Role.MENTEE}
          handleVerifyMentor={() => {}}
        />
      )}
    </>
  );
}
