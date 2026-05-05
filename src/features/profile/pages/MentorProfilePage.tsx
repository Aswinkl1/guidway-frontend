import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Plus,
  MapPin,
  ExternalLink,
  Monitor,
  Clock,
  Trophy,
  GraduationCap,
  Globe,
  Star,
  List,
  CalendarCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  StatBadge,
  SectionCard,
  SkillTag,
  LanguageTag,
  WorkEntry,
  AwardEntry,
  EducationEntry,
  QuickActionRow,
  VisibilityToggle,
} from "@/components/shared";
import { EducationModal, ExperienceModal } from "../components/modals";
import { useAddExperience } from "../hooks/useExperienceMutation";
import { useAddEducation } from "../hooks/useEducationMutation";
import { AchievementModal } from "../components/modals/AchievementModal";
import { useAddAchievement } from "../hooks/useAchievementMutation";

const MentorProfilePage = () => {
  const [publicProfile, setPublicProfile] = useState(true);
  const [acceptingBookings, setAcceptingBookings] = useState(true);
  const [expOpen, setExpOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [achOpen, setAchOpen] = useState(false);

  const {
    mutateAsync: mutateAsyncForExperience,
    isPending: isPendingForExperience,
  } = useAddExperience();
  const {
    mutateAsync: mutateAsyncForEducation,
    isPending: isPendingForEducation,
  } = useAddEducation();

  const {
    mutateAsync: mutateAsyncForAchievement,
    isPending: isPendingForAchievement,
  } = useAddAchievement();
  const skills = [
    "Python",
    "System Design",
    "Cloud Architecture",
    "Leadership",
    "React",
  ];

  return (
    <>
      <AchievementModal
        open={achOpen}
        onClose={() => setAchOpen(false)}
        onSave={mutateAsyncForAchievement}
      />
      <EducationModal
        open={eduOpen}
        onClose={() => setEduOpen(false)}
        onSave={mutateAsyncForEducation}
      />
      <ExperienceModal
        open={expOpen}
        onClose={() => setExpOpen(false)}
        onSave={mutateAsyncForExperience}
      />
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">My Profile</h1>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-slate-100">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100">
            <MessageSquare size={18} className="text-slate-500" />
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

      <div className="px-8 py-6 max-w-5xl">
        {/* Page heading */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage how your professional identity appears to mentees.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 border-slate-300"
            >
              View Public Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-700 border-slate-300"
            >
              Edit Profile
            </Button>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Alert */}
        <Alert className="mb-5 border-blue-200 bg-blue-50 rounded-xl">
          <Bell size={14} className="text-blue-500 mt-0.5" />
          <AlertDescription className="text-blue-700 text-sm flex items-center justify-between w-full ml-2">
            <span>Your profile is currently live and visible to mentees.</span>
            <button className="flex items-center gap-1 font-medium hover:underline whitespace-nowrap ml-4">
              Preview public view <ExternalLink size={12} />
            </button>
          </AlertDescription>
        </Alert>

        {/* Two columns */}
        <div className="grid grid-cols-[1fr_224px] gap-5">
          {/* Left column */}
          <div className="space-y-4">
            {/* Hero card */}
            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <Avatar className="w-20 h-20 border-2 border-slate-100">
                    <AvatarImage
                      src="https://i.pravatar.cc/80?img=47"
                      alt="Sarah Jenkins"
                    />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Sarah Jenkins
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Senior Staff Engineer at Google
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Primary Domain: Software Engineering
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-blue-400" />
                      <span className="text-xs text-blue-500">
                        San Francisco, CA
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href="#"
                        className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white"
                        aria-label="LinkedIn"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-7 h-7 bg-slate-800 rounded flex items-center justify-center text-white"
                        aria-label="GitHub"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-7 h-7 bg-slate-200 rounded flex items-center justify-center text-slate-600"
                        aria-label="Website"
                      >
                        <Globe size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="flex items-center justify-around">
                  <StatBadge
                    icon={<Star size={14} />}
                    value="4.9"
                    label="Rating"
                    colorClass="text-amber-600"
                  />
                  <div className="w-px h-10 bg-slate-100" />
                  <StatBadge
                    icon={<Monitor size={14} />}
                    value="150+"
                    label="Sessions"
                    colorClass="text-blue-600"
                  />
                  <div className="w-px h-10 bg-slate-100" />
                  <StatBadge
                    icon={<Clock size={14} />}
                    value="10+ Yrs"
                    label="Experience"
                    colorClass="text-emerald-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* About Me */}
            <SectionCard
              title="About Me"
              actionLabel={<Plus size={14} />}
              onAction={() => {}}
            >
              <p className="text-sm text-slate-600 leading-relaxed">
                I am a Senior Staff Engineer with over 10 years of experience
                building scalable distributed systems...
              </p>
            </SectionCard>

            {/* Languages */}
            <SectionCard
              title="Languages"
              actionLabel="Edit"
              onAction={() => {}}
            >
              <div className="flex flex-wrap gap-2">
                <LanguageTag lang="English" level="Native" />
                <LanguageTag lang="Spanish" level="Fluent" />
              </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard
              title="Skills & Expertise"
              actionLabel="Manage Skills"
              onAction={() => {}}
            >
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mt-3">
                <Plus size={14} /> Add Skill
              </button>
            </SectionCard>

            {/* Work Experience */}
            <SectionCard
              title="Work Experience"
              actionLabel={
                <span className="flex items-center gap-1">
                  <Plus size={13} /> Add Experience
                </span>
              }
              onAction={() => {
                setExpOpen(true);
              }}
            >
              <WorkEntry
                company="Google"
                role="Senior Staff Engineer"
                period="Jan 2019 – Present"
                duration="5 yrs 4 mos"
              />
              <Separator />
              <WorkEntry
                company="Uber"
                role="Senior Software Engineer"
                period="Mar 2015 – Dec 2018"
                duration="3 yrs 10 mos"
              />
            </SectionCard>

            {/* Awards  */}
            <SectionCard
              title="Awards "
              actionLabel={
                <span className="flex items-center gap-1">
                  <Plus size={13} /> Add
                </span>
              }
              onAction={() => {
                setAchOpen(true);
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Trophy size={13} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Achievements & Awards
                </span>
              </div>
              <AwardEntry
                title="Best Engineering Mentor"
                type="Award"
                year="2023"
              />
              <Separator />
              <AwardEntry
                title="Cloud Architecture Certification"
                type="Certificate"
                year="2021"
              />
            </SectionCard>
            <SectionCard
              title="Education"
              actionLabel={
                <span className="flex items-center gap-1">
                  <Plus size={13} /> Add
                </span>
              }
              onAction={() => setEduOpen(true)}
            >
              <div className="flex items-center gap-1.5 mt-4 mb-2">
                <GraduationCap size={13} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Education
                </span>
              </div>
              <EducationEntry
                school="Stanford University"
                degree="M.S. Computer Science"
                years="2013 – 2015"
                gpa="4.0 GPA"
              />
              <Separator />
              <EducationEntry
                school="UC Berkeley"
                degree="B.S. Electrical Engineering"
                years="2009 – 2013"
                gpa="3.8 GPA"
              />
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Quick Actions
                </p>
              </CardHeader>
              <CardContent className="px-2 pb-3 space-y-0.5">
                <QuickActionRow
                  icon={<List size={15} />}
                  title="Manage Sessions"
                  subtitle="View upcoming & past"
                />
                <QuickActionRow
                  icon={<CalendarCheck size={15} />}
                  title="Set Availability"
                  subtitle="Update your calendar"
                />
              </CardContent>
            </Card>

            <Card className="shadow-none border border-slate-200 rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Profile Visibility
                </p>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1 divide-y divide-slate-100">
                <VisibilityToggle
                  label="Public Profile"
                  subtitle="Visible to all mentees"
                  checked={publicProfile}
                  onChange={setPublicProfile}
                />
                <VisibilityToggle
                  label="Accepting Bookings"
                  subtitle="Pause new requests"
                  checked={acceptingBookings}
                  onChange={setAcceptingBookings}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorProfilePage;
