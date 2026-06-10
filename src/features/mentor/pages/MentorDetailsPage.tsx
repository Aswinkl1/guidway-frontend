// MentorPublicProfilePage.tsx
import { Fragment, useState } from "react";
import {
  MapPin,
  Languages,
  BadgeCheck,
  Clock,
  ChevronRight,
  Star,
  CalendarDays,
  ArrowRight,
  Tag,
  Home,
  DollarSign,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SkillTag,
  SectionCard,
  WorkEntry,
  EducationEntry,
  AwardEntry,
  Header,
} from "@/components/shared";
import { useMentor } from "../hooks/useMentor";
import { useNavigate, useParams } from "react-router";
import { getSocialIcon } from "@/constants/SocailIcons";
import { ROUTES } from "@/constants/apiRoutes";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";

// ── Reused from shared barrel ─────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface AvailableSlot {
  label: string; // e.g. "Today, 10:00 AM PST"
}

interface ReviewDto {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  timeAgo: string;
  body: string;
  sessionTag: string;
}

const SLOTS: AvailableSlot[] = [
  { label: "Tomorrow, 10:00 AM PST" },
  { label: "Thu, 2:00 PM PST" },
];

const REVIEWS: ReviewDto[] = [
  {
    id: "r1",
    authorName: "Alex Cruz",
    rating: 5,
    timeAgo: "1 Review",
    body: `"Really love this stuff. The mock interviews felt exactly like my actual Google loop. The feedback on my submission and the strategy was eye-opening. Highly recommend!"`,
    sessionTag: "Session: System Design Mock",
  },
  {
    id: "r2",
    authorName: "Sarah Ross",
    rating: 5,
    timeAgo: "1 week ago",
    body: `"Great insights into what hiring managers look for. I helped restructure my resume effectively."`,
    sessionTag: "Session: Career Strategy",
  },
];

const AVG_RATING = 4.9;
const REVIEW_COUNT = 150;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const StarRow = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={
          n <= Math.round(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-slate-200 fill-slate-200"
        }
      />
    ))}
  </div>
);

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb: React.FC<{ name: string }> = ({ name }) => (
  <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
    <button className="hover:text-slate-600 flex items-center gap-1">
      <Home size={12} /> Home
    </button>
    <ChevronRight size={11} />
    <button className="hover:text-slate-600">Mentors</button>
    <ChevronRight size={11} />
    <span className="text-slate-600 font-medium">{name}</span>
  </nav>
);

// ── Social icon button ─────────────────────────────────────────────────────────
const SocialBtn: React.FC<{ type: string; href: string }> = ({
  type,
  href,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center
        text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-colors"
    >
      {getSocialIcon(type)}
    </a>
  );
};

// ── Session card (right sidebar) ──────────────────────────────────────────────
interface SessionCardProps {
  session: SessionType;
  selected: boolean;
  onSelect: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  selected,
  onSelect,
}) => (
  <button
    onClick={onSelect}
    className={`w-full text-left p-3 rounded-xl border transition-all ${
      selected
        ? "border-violet-400 bg-violet-50"
        : "border-slate-200 bg-white hover:border-slate-300"
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-2">
        <div
          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
            selected ? "bg-violet-500" : "bg-slate-300"
          }`}
        />
        <div className="flex-1">
          <p
            className={`text-sm font-semibold ${
              selected ? "text-violet-800" : "text-slate-800"
            }`}
          >
            {session.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{session.description}</p>

          {/* New metadata row */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {session.duration} min
            </span>
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                selected ? "text-violet-600" : "text-slate-600"
              }`}
            >
              <DollarSign className="w-3 h-3" />
              {session.price.toFixed(2)} /session
            </span>
          </div>
        </div>
      </div>
    </div>
  </button>
);

// ── Review card ────────────────────────────────────────────────────────────────
const ReviewCard: React.FC<{ review: ReviewDto }> = ({ review }) => (
  <div className="py-5 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-3 mb-2">
      <Avatar className="w-8 h-8">
        {review.authorAvatar && <AvatarImage src={review.authorAvatar} />}
        <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
          {initials(review.authorName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {review.authorName}
        </p>
        <div className="flex items-center gap-2">
          <StarRow rating={review.rating} size={12} />
          <span className="text-xs text-slate-400">{review.timeAgo}</span>
        </div>
      </div>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">{review.body}</p>
    {review.sessionTag && (
      <div className="flex items-center gap-1.5 mt-2">
        <Tag size={11} className="text-slate-400" />
        <span className="text-xs text-slate-400">{review.sessionTag}</span>
      </div>
    )}
  </div>
);

// ── Tab bar ────────────────────────────────────────────────────────────────────
const tabs = ["Mentorship plans", "Sessions"] as const;
type Tab = (typeof tabs)[number];

const TabBar: React.FC<{ active: Tab; onChange: (t: Tab) => void }> = ({
  active,
  onChange,
}) => (
  <div className="flex border-b border-slate-200 mb-4">
    {tabs.map((t) => (
      <button
        key={t}
        onClick={() => onChange(t)}
        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
          active === t
            ? "border-violet-600 text-violet-700"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        {t}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const MentorPublicProfilePage: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Mentorship plans");
  const { data: MENTOR, isPending } = useMentor(params.id ?? "");
  const navigate = useNavigate();
  if (isPending) {
    return;
  }
  if (!MENTOR) {
    return <></>;
  }

  function handleOnBook() {
    navigate(
      `${CLIENT_ROUTES.MENTOR.ROOT}/${MENTOR?.userId}/book?session=${selectedSession}`,
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <Breadcrumb name={MENTOR.name} />

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div className="space-y-5">
            {/* ── Hero card ── */}
            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="w-20 h-20 border-2 border-slate-100">
                      <AvatarImage
                        src={`${import.meta.env.VITE_S3_BASE_URL + MENTOR.profileImageKey}`}
                        alt={MENTOR.name}
                      />
                      <AvatarFallback className="text-xl bg-violet-100 text-violet-700">
                        {initials(MENTOR.name)}
                      </AvatarFallback>
                    </Avatar>
                    {MENTOR.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white">
                        <BadgeCheck size={11} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                      {MENTOR.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-sm text-slate-600 font-medium">
                        {MENTOR.headline}
                      </p>
                      <span className="text-slate-300">·</span>
                      <p className="text-sm text-slate-500">
                        {
                          MENTOR.experiences.filter((e) => e.isCurrent)[0]
                            .company
                        }
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {/* <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} className="text-slate-400" />{" "}
                        {MENTOR.yearsExp}
                      </span> */}
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} className="text-slate-400" />{" "}
                        {MENTOR.timezone}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Languages size={12} className="text-slate-400" />
                        {MENTOR.languages.map((l) => l.name).join(", ")}
                      </div>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-1.5 mt-3">
                      {MENTOR.socialLinks.map((s) => (
                        <SocialBtn key={s.url} type={s.platform} href={s.url} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-slate-600 leading-relaxed mt-5">
                  {MENTOR.shortBio}
                </p>

                {/* Skills — reuses SkillTag from shared */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {MENTOR.skills.map((s) => (
                    <SkillTag key={s.skillId} label={s.name} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ── Next Available Sessions ── */}
            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardContent className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-800">
                      Next Available Sessions
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-violet-600 hover:underline font-medium">
                    View full availability <ArrowRight size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {SLOTS.map((slot) => (
                    <div key={slot.label} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs text-slate-600">
                        {slot.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ── Work Experience — reuses WorkEntry + SectionCard ── */}
            <SectionCard title="Work Experience">
              <div className="divide-y divide-slate-100">
                {MENTOR.experiences.map((e) => (
                  <>
                    <WorkEntry
                      key={e.id}
                      company={e.company}
                      role={e.role}
                      description={e.description}
                      employmentType={e.employmentType}
                      endMonth={e.endMonth}
                      endYear={e.endYear}
                      id={e.id}
                      isCurrent={e.isCurrent}
                      startMonth={e.startMonth}
                      startYear={e.startYear}
                      showActions={false}
                    />
                    <Separator />
                  </>
                ))}
              </div>
            </SectionCard>

            {/* ── Education & Achievements in a 2-col grid ── */}
            <div className="grid grid-cols-2 gap-5">
              {/* Education — reuses EducationEntry + SectionCard */}
              <SectionCard title="Education">
                <div className="divide-y divide-slate-100">
                  {MENTOR.education.map((v) => (
                    <Fragment key={v.id}>
                      <EducationEntry
                        key={v.id}
                        institution={v.institution}
                        degree={v.degree}
                        startYear={v.startYear}
                        grade={v.grade}
                        description={v.description}
                        endMonth={v.endMonth}
                        endYear={v.endYear}
                        fieldOfStudy={v.fieldOfStudy}
                        id={v.id}
                        isCurrent={v.isCurrent}
                        startMonth={v.startMonth}
                        showActions={false}
                      />
                      <Separator />
                    </Fragment>
                  ))}
                </div>
              </SectionCard>

              {/* Achievements — reuses AwardEntry + SectionCard */}
              <SectionCard title="Achievements">
                <div className="divide-y divide-slate-100">
                  {MENTOR.achievements.map((v) => (
                    <>
                      <AwardEntry
                        key={v.id}
                        title={v.title ?? ""}
                        type={v.type}
                        year={v.year + ""}
                        showActions={false}
                        id={v.id}
                      />
                      <Separator />
                    </>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* ── Reviews & Ratings ── */}
            <SectionCard
              title="Reviews & Ratings"
              actionLabel={
                <span className="flex items-center gap-1">
                  Show all {REVIEW_COUNT} reviews <ChevronRight size={13} />
                </span>
              }
              onAction={() => {}}
            >
              {/* Rating summary */}
              <div className="flex items-center gap-5 mb-4 pb-4 border-b border-slate-100">
                <div className="text-center">
                  <p className="text-4xl font-black text-slate-900">
                    {AVG_RATING}
                  </p>
                  <StarRow rating={AVG_RATING} size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Outstanding Feedback
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Based on {REVIEW_COUNT}+ verified sessions. Highest rated
                    for{" "}
                    <span className="font-medium text-slate-700">
                      "System Design"
                    </span>
                  </p>
                </div>
              </div>

              {/* Individual reviews */}
              <div>
                {REVIEWS.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ══════════════ RIGHT COLUMN ══════════════ */}
          <div className="sticky top-20 space-y-4">
            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardContent className="p-4">
                {/* Tab bar */}
                <TabBar active={activeTab} onChange={setActiveTab} />

                {/* Session list */}
                <div className="space-y-2 mb-4">
                  {MENTOR.sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      selected={selectedSession === session.id}
                      onSelect={() => setSelectedSession(session.id)}
                    />
                  ))}
                </div>

                {/* Book now */}
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-10 font-semibold"
                  onClick={handleOnBook}
                >
                  Book now
                </Button>

                <button className="w-full mt-2 text-xs text-violet-600 hover:underline font-medium text-center">
                  View all sessions
                </button>

                {/* Availability note */}
                <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
                  Limited availability. One security booked 10 weeks in advance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPublicProfilePage;
