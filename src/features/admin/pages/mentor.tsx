import {
  useUpdateBlockStatus,
  useUserFilter,
  useUsers,
  useVerifyMentor,
} from "../hooks/useUsers";

import { UsersTable } from "../components/UsersTable";
import { Navbar } from "../components/Navbar";
import type { User } from "../user.types";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMentorPanel() {
  const { filter, setFilter } = useUserFilter();
  const { data, isLoading } = useUsers("mentor", filter);
  const { mutate: updateBlockStatus } = useUpdateBlockStatus("mentor");
  const { mutate: verifyMentor } = useVerifyMentor("mentor");
  console.log("we got data again", data);

  const toggleBlock = (user: User) => {
    updateBlockStatus({ userId: user.id, newBlockStatus: !user.isBlocked });
  };

  const handleVerifyMentor = (user: User) => {
    if (!user.mentorId) {
      console.log("mentor id not found");
      return;
    }
    verifyMentor({ mentorId: user.mentorId });
  };

  return (
    <>
      <div
        className="flex h-screen bg-gray-50 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
        // onClick={() => {
        //   setStatusDropdownOpen(false);
        //   setVerifyDropdownOpen(false);
        // }}
      >
        {/* Sidebar */}
        <Navbar />
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
            title="Mentor"
          />
        )}
      </div>
    </>
  );
}
