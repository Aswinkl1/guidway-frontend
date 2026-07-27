import {
  useUpdateBlockStatus,
  useUserFilter,
  useUsers,
  useVerifyMentor,
} from "../hooks/useUsers";

import { UsersTable } from "../components/UsersTable";
import { Navbar } from "../components/Navbar";
import type { User } from "../types/user.types";
import { Role } from "@/types/role";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMentorPanel() {
  const { filter, setFilter } = useUserFilter();
  const { data, isLoading } = useUsers(Role.MENTOR, filter);
  const { mutate: updateBlockStatus } = useUpdateBlockStatus(Role.MENTOR);
  const { mutate: verifyMentor } = useVerifyMentor(Role.MENTOR);
  console.log("we got data again", data);

  const toggleBlock = (user: User) => {
    updateBlockStatus({ userId: user.id, newBlockStatus: !user.isBlocked });
  };

  const handleVerifyMentor = (user: User) => {
    if (!user.id) {
      console.log("user id not found");
      return;
    }
    verifyMentor({ mentorId: user.id });
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
          handleVerifyMentor={handleVerifyMentor}
          setFilter={setFilter}
          filter={filter}
          title={Role.MENTOR}
        />
      )}
    </>
  );
}
