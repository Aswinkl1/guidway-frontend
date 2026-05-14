// SessionsPage.tsx
import { useState } from "react";
import { List, Bell, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionTypeCard } from "../components/SessionCard";
import { CreateSessionModal } from "../components/modal/createSessionModal";
import { useAddSessionMutation } from "../hooks/useAddSessionMutation";
import type { CreateSessionDTO } from "../schema/session.dto";
import { useSessionQuery } from "../hooks/useGetSessionQuery";
import type { filterProps } from "../types/session.types";
import { Pagination } from "@/components/shared/Pagination";
import { useEditSessionMutation } from "../hooks/useEditSessionMutation";
import { useDebouncedCallback } from "use-debounce";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface SessionType {
  id: string;
  duration: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

const TABS = ["Sessions", "All"] as const;
type Tab = (typeof TABS)[number];

const MentorSessionsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Sessions");
  const [filter, setFilter] = useState<filterProps>({
    search: "",
    page: 1,
    isActive: undefined,
    limit: 5,
  });
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilter({ ...filter, search: value });
  }, 500);

  const [openModal, setOpenModal] = useState(false);

  const { mutateAsync } = useAddSessionMutation();

  async function handleSave(data: CreateSessionDTO) {
    await mutateAsync(data);
  }
  const { data, isLoading } = useSessionQuery(filter);
  if (isLoading) {
    return <></>;
  }

  console.log("data", data);
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <CreateSessionModal
        onClose={() => {
          setOpenModal(false);
        }}
        onSave={handleSave}
        open={openModal}
      />
      {/* ── Main ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-3.5 flex items-center justify-between">
          {/* Left — branding visible at top right in the design */}
          <div />

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Find Mentors
            </button>
            <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Messages
            </button>
            <button className="relative p-1.5 rounded-full hover:bg-slate-100">
              <Bell size={17} className="text-slate-500" />
            </button>
            <Avatar className="w-8 h-8">
              <AvatarImage
                src="https://i.pravatar.cc/40?img=47"
                alt="Sarah Jenkins"
              />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                SJ
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        {/* Content */}
        <div className="px-8 py-6 max-w-5xl">
          {/* Page heading row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Sessions</h2>
            <Button
              onClick={() => setOpenModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 gap-1.5"
            >
              <Plus size={15} />
              Add session type
            </Button>
          </div>

          {/* Tabs + Search/Filter row */}
          <div className="flex items-center justify-between mb-6">
            {/* Tabs */}
            <div className="flex items-center gap-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  // value={filter.search}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  placeholder="Search sessions..."
                  className="h-9 pl-8 pr-3 w-52 rounded-lg border border-slate-200 text-sm
                    bg-white text-slate-800 placeholder:text-slate-400
                    focus:outline-none focus:ring-1 focus:ring-slate-300"
                />
              </div>

              {/* <button
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200
                  bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filter
              </button> */}
            </div>
          </div>

          {/* Session cards grid */}
          {data.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {data.data.map((session: SessionType) => (
                <SessionTypeCard
                  id={session.id}
                  isActive={session.isActive}
                  key={session.id}
                  duration={session.duration}
                  name={session.name}
                  description={session.description}
                  price={session.price}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <List size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                No sessions found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {filter.search
                  ? `No sessions match "${filter.search}"`
                  : "Add a session type to get started"}
              </p>
            </div>
          )}
          <Pagination
            limit={filter.limit}
            onPageChange={(p) => {
              setFilter({ ...filter, page: p });
            }}
            page={filter.page}
            totalItems={data.totalItems}
          />

          {/* Footer note */}
          <p className="text-xs text-slate-400 text-center mt-12">
            All times are displayed in your local timezone (PST). <br />
            Need help?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorSessionsPage;
