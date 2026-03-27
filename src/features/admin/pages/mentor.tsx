import {
  useUpdateBlockStatus,
  useUserFilter,
  useUsers,
} from "../hooks/useUsers";

import { UsersTable } from "../components/UsersTable";
import { Navbar } from "../components/Navbar";

export interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  profileImageUrl: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMentorPanel() {
  const { filter, setFilter } = useUserFilter();
  const { data, isLoading } = useUsers("mentor", filter);
  const { mutate: updateBlockStatus } = useUpdateBlockStatus("mentor");

  console.log("we got data again", data);

  const toggleBlock = (user: User) => {
    updateBlockStatus({ userId: user.id, newBlockStatus: !user.isBlocked });
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
            setFilter={setFilter}
            filter={filter}
          />
        )}
      </div>
    </>
  );
}
