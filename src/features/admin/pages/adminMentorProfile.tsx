// AdminMentorProfilePage.tsx
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  LogOut,
  CheckCircle2,
  XCircle,
  Mail,
  Clock,
  Award,
  GraduationCap,
  Briefcase,
  Languages,
  Wrench,
  ShieldCheck,
  ArrowLeft,
  BadgeCheck,
  Star,
  Globe,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NavItem,
  StatBadge,
  SectionCard,
  WorkEntry,
  EducationEntry,
  AwardEntry,
  SkillTag,
  LanguageTag,
} from "@/components/shared";
import { useParams } from "react-router";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useMentorProfile } from "../hooks/useMentorProfile";
import { useMentorProfileState } from "../hooks/useMentorProfileState";

// ── All reusable components from shared barrel ────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

type MentorStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "SELF_EMPLOYED"
  | "VOLUNTEER";
type AchievementType =
  | "AWARD"
  | "CERTIFICATE"
  | "PUBLICATION"
  | "PROJECT"
  | "HONOR"
  | "OTHER";

interface MentorProfileDto {
  userId: string;
  name: string;
  email: string;
  profileImageKey: string | null;
  timezone: string | null;
  status: MentorStatus;
  isVerified: boolean;
  headline: string | null;
  shortBio: string | null;
  averageRating: number;
  reviewCount: number;
  domain: { id: string; name: string } | null;
  socialLinks: { platform: string; url: string }[];
  languages: {
    languageId: string;
    name: string;
    code: string;
    proficiency: string;
  }[];
  skills: { skillId: string; name: string; yearsExperience: number | null }[];
  experiences: {
    id: string;
    role: string;
    company: string;
    employmentType: EmploymentType;
    startMonth: number;
    startYear: number;
    endMonth: number | null;
    endYear: number | null;
    isCurrent: boolean;
    description: string | null;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startMonth: number;
    startYear: number;
    endMonth: number | null;
    endYear: number | null;
    isCurrent: boolean;
    grade: string | null;
    description: string | null;
  }[];
  achievements: {
    id: string;
    title: string | null;
    type: AchievementType;
    year: number | null;
  }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const STATUS_OPTIONS: { value: MentorStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REJECTED", label: "Rejected" },
];

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
  SELF_EMPLOYED: "Self-employed",
  VOLUNTEER: "Volunteer",
};

const STATUS_COLORS: Record<MentorStatus, string> = {
  ACTIVE: "text-emerald-700 border-emerald-200 bg-emerald-50",
  PENDING: "text-amber-700 border-amber-200 bg-amber-50",
  SUSPENDED: "text-red-700 border-red-200 bg-red-50",
  REJECTED: "text-slate-600 border-slate-200 bg-slate-50",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (month: number | null, year: number | null) =>
  month && year ? `${MONTHS[month - 1]} ${year}` : "";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ─── Admin-specific small components ─────────────────────────────────────────

const StatusBadge: React.FC<{ status: MentorStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

const VerifiedBadge: React.FC<{ verified: boolean }> = ({ verified }) =>
  verified ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
      <CheckCircle2 size={13} /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
      <XCircle size={13} /> Unverified
    </span>
  );

// ─── Mock data — replace with useQuery ───────────────────────────────────────

const MOCK_MENTOR: MentorProfileDto = {
  userId: "usr_01",
  name: "Sarah Jenkins",
  email: "sarah@example.com",
  profileImageKey: null,
  timezone: "America/New_York",
  status: "ACTIVE",
  isVerified: true,
  headline: "Senior Staff Engineer at Google",
  shortBio:
    "Over 10 years building scalable distributed systems. Passionate about helping junior engineers grow.",
  averageRating: 4.9,
  reviewCount: 142,
  domain: { id: "d1", name: "Software Engineering" },
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/sarah" },
    { platform: "GitHub", url: "https://github.com/sarah" },
  ],
  languages: [
    { languageId: "l1", name: "English", code: "en", proficiency: "NATIVE" },
    { languageId: "l2", name: "Spanish", code: "es", proficiency: "FLUENT" },
  ],
  skills: [
    { skillId: "s1", name: "Python", yearsExperience: 8 },
    { skillId: "s2", name: "System Design", yearsExperience: 6 },
    { skillId: "s3", name: "Cloud Architecture", yearsExperience: 5 },
    { skillId: "s4", name: "Leadership", yearsExperience: 4 },
    { skillId: "s5", name: "React", yearsExperience: 3 },
  ],
  experiences: [
    {
      id: "e1",
      role: "Senior Staff Engineer",
      company: "Google",
      employmentType: "FULL_TIME",
      startMonth: 1,
      startYear: 2019,
      endMonth: null,
      endYear: null,
      isCurrent: true,
      description: "Cloud infrastructure and developer productivity tools.",
    },
    {
      id: "e2",
      role: "Senior Software Engineer",
      company: "Uber",
      employmentType: "FULL_TIME",
      startMonth: 3,
      startYear: 2015,
      endMonth: 12,
      endYear: 2018,
      isCurrent: false,
      description: null,
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "Stanford University",
      degree: "M.S.",
      fieldOfStudy: "Computer Science",
      startMonth: 9,
      startYear: 2013,
      endMonth: 6,
      endYear: 2015,
      isCurrent: false,
      grade: "4.0 GPA",
      description: null,
    },
    {
      id: "ed2",
      institution: "UC Berkeley",
      degree: "B.S.",
      fieldOfStudy: "Electrical Engineering",
      startMonth: 9,
      startYear: 2009,
      endMonth: 6,
      endYear: 2013,
      isCurrent: false,
      grade: "3.8 GPA",
      description: null,
    },
  ],
  achievements: [
    { id: "a1", title: "Best Engineering Mentor", type: "AWARD", year: 2023 },
    {
      id: "a2",
      title: "Cloud Architecture Cert",
      type: "CERTIFICATE",
      year: 2021,
    },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminMentorProfilePage = () => {
  // const mentor = MOCK_MENTOR;
  const params = useParams();

  const { isVerified, isPending, mentor, status, handleVerify, verifying } =
    useMentorProfileState(params.id ?? "");

  if (isPending) {
    return;
  }

  const navLinks = [
    { icon: <LayoutDashboard size={15} />, label: "Dashboard" },
    { icon: <Users size={15} />, label: "Mentors", active: true },
    { icon: <BookOpen size={15} />, label: "Bookings" },
    { icon: <DollarSign size={15} />, label: "Earnings" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* ── Sidebar — reuses NavItem from shared ── */}
      <aside className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-100">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              Admin Panel
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              Mentor Booking
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {navLinks.map(({ icon, label, active }) => (
            <NavItem
              key={label}
              icon={icon}
              label={label}
              active={active ?? false}
              // activeClassName="bg-violet-50 text-violet-700 font-medium"
            />
          ))}
        </nav>
        <div className="px-3 pb-3 border-t border-slate-100 pt-3 space-y-2">
          <NavItem icon={<LogOut size={15} />} label="Logout" />
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                AU
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-400 truncate">admin@...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 max-w-5xl">
          {/* Back */}
          <button
            onClick={() => history.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-5"
          >
            <ArrowLeft size={14} /> Back to Mentors
          </button>

          {/* ── Hero card ── */}
          <Card className="shadow-none border border-slate-200 rounded-2xl mb-5">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <Avatar className="w-20 h-20 border-2 border-slate-100 shrink-0">
                  <AvatarFallback className="text-xl bg-violet-100 text-violet-700">
                    {initials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold text-slate-900">
                          {mentor.name}
                        </h1>
                        <VerifiedBadge verified={isVerified} />
                      </div>
                      {mentor.headline && (
                        <p className="text-sm text-slate-500 mt-0.5">
                          {mentor.headline}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Mail size={12} /> {mentor.email}
                        </span>
                        {mentor.timezone && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock size={12} /> {mentor.timezone}
                          </span>
                        )}
                        {mentor.domain && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Globe size={12} /> {mentor.domain.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin controls */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <Select
                        value={status}
                        onValueChange={(v) => setStatus(v as MentorStatus)}
                      >
                        <SelectTrigger
                          className={`h-8 text-xs font-medium rounded-lg border px-3 w-36 ${STATUS_COLORS[status]}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(({ value, label }) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="text-sm"
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!isVerified ? (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(mentor.userId)}
                          disabled={verifying}
                          className="h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 gap-1.5"
                        >
                          <BadgeCheck size={13} />
                          {verifying ? "Verifying…" : "Verify Mentor"}
                        </Button>
                      ) : (
                        <span className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <CheckCircle2 size={13} /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats — reuses StatBadge from shared */}
                  <Separator className="my-4" />
                  <div className="flex items-center">
                    <StatBadge
                      icon={<Star size={13} className="fill-amber-400" />}
                      value={mentor.averageRating.toFixed(1)}
                      label="Avg Rating"
                      colorClass="text-amber-600"
                    />
                    <div className="w-px h-8 bg-slate-100 mx-2" />
                    <StatBadge
                      icon={<Users size={13} />}
                      value={String(mentor.reviewCount)}
                      label="Reviews"
                      colorClass="text-blue-600"
                    />
                    <div className="w-px h-8 bg-slate-100 mx-2" />
                    <StatBadge
                      icon={<Briefcase size={13} />}
                      value={String(mentor.experiences.length)}
                      label="Experiences"
                      colorClass="text-slate-600"
                    />
                    <div className="w-px h-8 bg-slate-100 mx-2" />
                    <StatBadge
                      icon={<Wrench size={13} />}
                      value={String(mentor.skills.length)}
                      label="Skills"
                      colorClass="text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-[1fr_280px] gap-5">
            {/* Left — reuses SectionCard, WorkEntry, EducationEntry, AwardEntry */}
            <div className="space-y-4">
              {mentor.shortBio && (
                <SectionCard title="About" icon={<Users size={14} />}>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {mentor.shortBio}
                  </p>
                </SectionCard>
              )}

              {mentor.experiences.length > 0 && (
                <SectionCard
                  title="Work Experience"
                  icon={<Briefcase size={14} />}
                >
                  <div className="divide-y divide-slate-100">
                    {mentor.experiences.map((e) => (
                      <>
                        <WorkEntry
                          key={e.id}
                          company={e.company}
                          role={e.role}
                          description={e.description}
                          // employmentType={e.employmentType}
                          endMonth={e.endMonth}
                          endYear={e.endYear}
                          id={e.id}
                          isCurrent={e.isCurrent}
                          startMonth={e.startMonth}
                          startYear={e.startYear}
                        />
                        <Separator />
                      </>
                    ))}
                  </div>
                </SectionCard>
              )}

              {mentor.education.length > 0 && (
                <SectionCard
                  title="Education"
                  icon={<GraduationCap size={14} />}
                >
                  <div className="divide-y divide-slate-100">
                    {mentor.education.map((v) => (
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
                      />
                    ))}
                  </div>
                </SectionCard>
              )}

              {mentor.achievements.length > 0 && (
                <SectionCard title="Achievements" icon={<Award size={14} />}>
                  <div className="divide-y divide-slate-100">
                    {mentor.achievements.map((ach) => (
                      <AwardEntry
                        key={ach.id}
                        title={ach.title ?? "—"}
                        type={
                          ach.type.charAt(0) + ach.type.slice(1).toLowerCase()
                        }
                        year={ach.year ? String(ach.year) : "—"}
                        showEdit={false}
                      />
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Right — reuses SectionCard, SkillTag, LanguageTag */}
            <div className="space-y-4">
              {mentor.skills.length > 0 && (
                <SectionCard title="Skills" icon={<Wrench size={14} />}>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((sk) => (
                      <SkillTag key={sk.skillId} label={sk.name} />
                    ))}
                  </div>
                </SectionCard>
              )}

              {mentor.languages.length > 0 && (
                <SectionCard title="Languages" icon={<Languages size={14} />}>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((lang) => (
                      <LanguageTag
                        key={lang.languageId}
                        lang={lang.name}
                        level={
                          lang.proficiency.charAt(0) +
                          lang.proficiency.slice(1).toLowerCase()
                        }
                      />
                    ))}
                  </div>
                </SectionCard>
              )}

              {mentor.socialLinks.length > 0 && (
                <SectionCard title="Social Links" icon={<Globe size={14} />}>
                  <div className="flex flex-col gap-2">
                    {mentor.socialLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm hover:underline"
                      >
                        <span className="text-slate-600 font-medium w-20 shrink-0">
                          {link.platform}
                        </span>
                        <span className="truncate text-xs text-slate-400">
                          {link.url}
                        </span>
                      </a>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Account meta */}
              <SectionCard title="Account" icon={<ShieldCheck size={14} />}>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">User ID</span>
                    <span className="text-xs font-mono text-slate-600 truncate max-w-[140px]">
                      {mentor.userId}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Status</span>
                    <StatusBadge status={status} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Verified</span>
                    <VerifiedBadge verified={isVerified} />
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMentorProfilePage;
