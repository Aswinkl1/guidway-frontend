// MentorListingPage.tsx
import { useRef, useCallback, useState } from "react";
import {
  Star,
  ChevronDown,
  SlidersHorizontal,
  Loader2,
  Users,
  BadgeCheck,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MentorCardDto } from "../types/mentor.types";
import { SearchBar } from "@/components/shared";
import { useMentorListing, userMentorFilter } from "../hooks/useMentorListing";
import { useDebouncedCallback } from "use-debounce";
import { useFetchDomain } from "@/hooks/useDomain";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatPrice = (price: number) => (price === 0 ? "Free" : `$${price}`);

// ── MentorCard ────────────────────────────────────────────────────────────────

interface MentorCardProps {
  mentor: MentorCardDto;
  domain?: string; // resolved domain name
  onClick: (id: string) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, domain, onClick }) => (
  <Card
    onClick={() => onClick(mentor.userId)}
    className="shadow-none border border-slate-200 rounded-2xl cursor-pointer
      hover:border-violet-200 hover:shadow-md transition-all group bg-white"
  >
    <CardContent className="p-5 flex flex-col gap-3">
      {/* Top row — avatar + name + verified */}
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12 border-2 border-slate-100 shrink-0">
          {mentor.profileImageKey && (
            <AvatarImage
              src={`${import.meta.env.VITE_S3_BASE_URL}${mentor.profileImageKey}`}
              alt={mentor.name}
            />
          )}
          <AvatarFallback className="text-sm font-semibold bg-violet-100 text-violet-700">
            {initials(mentor.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-violet-700 transition-colors">
              {mentor.name}
            </h3>
            {mentor.isVerified && (
              <BadgeCheck
                size={14}
                className="text-violet-500 shrink-0"
                aria-label="Verified"
              />
            )}
          </div>
          {mentor.headline && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
              {mentor.headline}
            </p>
          )}
        </div>
      </div>

      {/* Domain badge */}
      {domain && (
        <Badge
          variant="outline"
          className="w-fit text-xs rounded-full px-2.5 py-0.5 border-slate-200 text-slate-500 bg-slate-50"
        >
          {domain}
        </Badge>
      )}

      {/* Footer — rating + price */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-1">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-700">
            {mentor.avgRating > 0 ? mentor.avgRating.toFixed(1) : "New"}
          </span>
          {mentor.reviewCount > 0 && (
            <span className="text-xs text-slate-400">
              ({mentor.reviewCount})
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900">
            {formatPrice(mentor.startingAt)}
          </span>
          {mentor.startingAt > 0 && (
            <span className="text-xs text-slate-400 ml-0.5">/ session</span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// ── MentorCardSkeleton ────────────────────────────────────────────────────────

const MentorCardSkeleton: React.FC = () => (
  <div className="border border-slate-200 rounded-2xl bg-white p-5 animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
    <div className="h-5 bg-slate-100 rounded-full w-24 mb-3" />
    <div className="flex items-center justify-between">
      <div className="h-3 bg-slate-100 rounded w-16" />
      <div className="h-3.5 bg-slate-100 rounded w-14" />
    </div>
  </div>
);

// ── EmptyState ────────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ hasFilters: boolean; onReset: () => void }> = ({
  hasFilters,
  onReset,
}) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Users size={22} className="text-slate-400" />
    </div>
    <p className="text-base font-semibold text-slate-700 mb-1">
      No mentors found
    </p>
    <p className="text-sm text-slate-400 max-w-xs">
      {hasFilters
        ? "Try adjusting your search or filters to find more mentors."
        : "No mentors are available at the moment."}
    </p>
    {hasFilters && (
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="mt-4 border-slate-200 text-slate-600 rounded-xl"
      >
        Clear filters
      </Button>
    )}
  </div>
);

// ── InfiniteScrollSentinel ────────────────────────────────────────────────────
// Invisible div at the bottom — triggers load when it enters the viewport.

interface SentinelProps {
  onVisible: () => void;
  isFetching: boolean;
}

const useIntersection = (cb: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (node) {
        observer.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) cb();
          },
          { threshold: 0.1 },
        );
        observer.current.observe(node);
      }
      ref.current = node;
    },
    [cb],
  );

  return setRef;
};

const InfiniteScrollSentinel: React.FC<SentinelProps> = ({
  onVisible,
  isFetching,
}) => {
  const ref = useIntersection(onVisible);
  return (
    <div
      ref={ref}
      className="col-span-full flex items-center justify-center py-8"
    >
      {isFetching && (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading more mentors…</span>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const MentorListingPage: React.FC = () => {
  const { filter, setFilter } = userMentorFilter();

  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  const debounceSetFilter = useDebouncedCallback((val) => {
    setFilter({ search: val });
  }, 400);
  const handleSearchChange = (val: string) => {
    setSearch(val);
    debounceSetFilter(val);
  };
  console.log("yep tis is happenig");

  const handleSearchClear = () => {
    setSearch("");
    debounceSetFilter("");
  };

  const handleReset = () => {
    handleSearchClear();
    setSelectedDomain("all");
    setFilter({ search: "", domainId: "" });
  };

  function handleDomainChange(id: string) {
    setSelectedDomain(id);
    setFilter({ domainId: id });
  }

  const hasFilters = filter.search !== "" || selectedDomain !== "all";

  // ── Domains query ──────────────────────────────────────────────────────────

  const { data: domains = [] } = useFetchDomain(true);
  console.log("domain", domains);
  // ── Infinite mentors query ─────────────────────────────────────────────────
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMentorListing(filter);
  console.log("data", data);
  // Flatten pages into a single array
  const mentors = data?.pages[0].data ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Domain map for label lookup in cards
  const domainMap = domains;

  // Sentinel callback
  const handleSentinelVisible = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Find a Mentor</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified mentors and book a session that fits your goals.
          </p>
        </div>

        {/* ── Filters bar ── */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />

          {/* Domain filter */}
          <Select value={selectedDomain} onValueChange={handleDomainChange}>
            <SelectTrigger
              className="h-9 w-48 text-sm border-slate-200 bg-white rounded-xl
                focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
            >
              <SlidersHorizontal
                size={13}
                className="text-slate-400 shrink-0"
              />
              <SelectValue placeholder="All Domains" />
              <ChevronDown
                size={13}
                className="text-slate-400 shrink-0 ml-auto"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">
                All Domains
              </SelectItem>
              {domains.map((d) => (
                <SelectItem key={d.id} value={d.id} className="text-sm">
                  {d.domainName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Total count */}
          {!isLoading && (
            <p className="text-xs text-slate-400 ml-auto">
              {mentors.length} of {total} mentor{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {/* {debouncedSearch && (
              <FilterPill
                label={`"${debouncedSearch}"`}
                onRemove={handleSearchClear}
              />
            )}
            {selectedDomain !== "all" && (
              <FilterPill
                label={domainMap[selectedDomain] ?? selectedDomain}
                onRemove={() => setSelectedDomain("all")}
              />
            )} */}
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-700 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Error state ── */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-red-600 mb-2">
              Failed to load mentors
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-slate-200 text-slate-600 rounded-xl"
            >
              Try again
            </Button>
          </div>
        )}

        {/* ── Cards grid ── */}
        {!isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Skeleton — first load only */}
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <MentorCardSkeleton key={i} />
              ))}

            {/* Mentor cards */}
            {!isLoading &&
              mentors.map((mentor) => (
                <MentorCard
                  key={mentor.userId}
                  mentor={mentor}
                  domain={domainMap[mentor.domainId]}
                  onClick={(id) => {
                    // navigate(`/mentors/${id}`)
                    console.log("Navigate to mentor:", id);
                  }}
                />
              ))}

            {/* Empty state */}
            {!isLoading && mentors.length === 0 && (
              <EmptyState hasFilters={hasFilters} onReset={handleReset} />
            )}

            {/* Infinite scroll sentinel */}
            {!isLoading && mentors.length > 0 && (
              <InfiniteScrollSentinel
                onVisible={handleSentinelVisible}
                isFetching={isFetchingNextPage}
              />
            )}
          </div>
        )}

        {/* End of results message */}
        {!isLoading && !hasNextPage && mentors.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-8">
            You've seen all {total} mentor{total !== 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </div>
  );
};

export default MentorListingPage;
