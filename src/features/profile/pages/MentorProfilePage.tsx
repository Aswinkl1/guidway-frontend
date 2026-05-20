import { Fragment, useState } from "react";
import {
  Bell,
  MessageSquare,
  Plus,
  MapPin,
  Monitor,
  Clock,
  Trophy,
  GraduationCap,
  Star,
  List,
  CalendarCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const S3_BASE_URL =
  "https://mentor-marketplace-storage.s3.ap-south-1.amazonaws.com/";
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
import { useProfile } from "../hooks/useProfile";
import { SkillModal } from "../components/modals/skill-modal/SkillModal";
import { LanguageModal } from "../components/modals/LanguageModal";
import { EditProfileModal } from "../components/modals/EditProfile.modal";
import { useFetchDomain } from "../hooks/useDomain";
import {
  useEditProfile,
  useMentorVisibilityInProfile,
} from "../hooks/useEditProfileMutation";
import { getSocialIcon } from "@/constants/SocailIcons";
import { MentorStatus } from "../types/profile.types";

import type { UpdateVisibilityDTO } from "../types/settings.types";
import { useNavigate } from "react-router";

const MentorProfilePage = () => {
  const [publicProfile, setPublicProfile] = useState(true);
  const [acceptingBookings, setAcceptingBookings] = useState(true);
  const [expOpen, setExpOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [achOpen, setAchOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const navigator = useNavigate();

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

  const { data: mentorData, isPending } = useProfile();
  const { data: domainData, isPending: isPendingForDomain } =
    useFetchDomain(true);
  console.log(mentorData);
  const { mutateAsync: mutateAsyncForEditProfile } = useEditProfile();
  const { mutateAsync: mutateAsyncForMentorVisibility } =
    useMentorVisibilityInProfile();
  if (isPending || isPendingForDomain) {
    return <></>;
  }
  console.log("i have renteded ");
  function handleMentorVisibility(isVisible: boolean) {
    const data: UpdateVisibilityDTO = {
      status: isVisible ? MentorStatus.ACTIVE : MentorStatus.PAUSED,
    };
    setPublicProfile(isVisible);
    mutateAsyncForMentorVisibility(data);
  }

  return (
    <>
      <EditProfileModal
        domains={domainData}
        onClose={() => {
          setProfileEditOpen(false);
        }}
        onSave={mutateAsyncForEditProfile}
        open={profileEditOpen}
        initialData={{
          phoneNumber: mentorData.phoneNumber,
          name: mentorData.name,
          domainId: mentorData.domain.id,
          avatarFile: mentorData.profileImageKay,
          headline: mentorData.headline,
          links: mentorData.socialLinks.map(
            (obj: { patform: string; url: string }) => ({ value: obj.url }),
          ),
          shortBio: mentorData.shortBio,
          timezone: mentorData.timezone,
        }}
      />
      <LanguageModal
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
        onSave={() => {}}
        initialData={mentorData.languages}
      />
      <SkillModal
        open={skillOpen}
        onClose={() => setSkillOpen(false)}
        onSave={() => {}}
        initialData={mentorData.skills}
      />
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
            {/* <Button
              variant="outline"
              size="sm"
              className="text-slate-600 border-slate-300"
            >
              View Public Profile
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              className="text-slate-700 border-slate-300"
              onClick={() => {
                setProfileEditOpen(true);
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Alert
        <Alert className="mb-5 border-blue-200 bg-blue-50 rounded-xl">
          <Bell size={14} className="text-blue-500 mt-0.5" />
          <AlertDescription className="text-blue-700 text-sm flex items-center justify-between w-full ml-2">
            <span>Your profile is currently live and visible to mentees.</span>
            <button className="flex items-center gap-1 font-medium hover:underline whitespace-nowrap ml-4">
              Preview public view <ExternalLink size={12} />
            </button>
          </AlertDescription>
        </Alert> */}

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
                      src={S3_BASE_URL + mentorData.profileImageKey}
                      alt={mentorData.name}
                    />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {mentorData.name}
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {mentorData.headline}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Primary Domain: {mentorData.domain.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-blue-400" />
                      <span className="text-xs text-blue-500">
                        San Francisco, CA
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {mentorData.socialLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-600 transition-colors"
                          aria-label={link.platform}
                        >
                          {getSocialIcon(link.platform)}
                        </a>
                      ))}
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
              // actionLabel={<Plus size={14} />}
              // onAction={() => {
              //   setProfileEditOpen(true);
              // }}
            >
              <p className="text-sm text-slate-600 leading-relaxed">
                {mentorData.shortBio}
              </p>
            </SectionCard>

            {/* Languages */}
            <SectionCard
              title="Languages"
              actionLabel="Edit"
              onAction={() => {
                setLanguageOpen(true);
              }}
            >
              <div className="flex flex-wrap gap-2">
                {mentorData.languages.map((l) => (
                  <LanguageTag key={l.id} lang={l.name} level="" />
                ))}
              </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard
              title="Skills & Expertise"
              actionLabel="Manage Skills"
              onAction={() => setSkillOpen(true)}
            >
              <div className="flex flex-wrap gap-2">
                {mentorData.skills.map((s) => (
                  <SkillTag key={s.id} label={s.name} />
                ))}
              </div>
              {/* <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mt-3">
                <Plus size={14} /> Add Skill
              </button> */}
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
              {/* TODO give a type here for the e  */}
              {mentorData.experiences.map((e: any) => (
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
                    showActions={true}
                  />
                  <Separator />
                </>
              ))}
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
              {mentorData.achievements.map((v: any) => (
                <>
                  <AwardEntry
                    key={v.id}
                    title={v.title}
                    type={v.type}
                    year={v.year}
                    showActions={true}
                    id={v.id}
                  />
                  <Separator />
                </>
              ))}
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
              {mentorData.education.map((v: any) => (
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
                    showActions={true}
                  />
                  <Separator />
                </Fragment>
              ))}
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
                  handler={() => navigator("/mentor/sessions")}
                />
                <QuickActionRow
                  icon={<CalendarCheck size={15} />}
                  title="Set Availability"
                  subtitle="Update your calendar"
                  handler={() => {}}
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
                  checked={mentorData.status === MentorStatus.ACTIVE}
                  onChange={handleMentorVisibility}
                />
                {/* <VisibilityToggle
                  label="Accepting Bookings"
                  subtitle="Pause new requests"
                  checked={acceptingBookings}
                  onChange={setAcceptingBookings}
                /> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorProfilePage;
