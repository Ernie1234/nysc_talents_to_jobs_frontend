/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Search, Filter, List, Grid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import JobCard from "@/components/findWork/JobCard";
import type { IJob } from "@/features/job/jobTypes";
import { useGetPublicJobsQuery } from "@/features/job/jobAPI";

type ViewMode = "list" | "grid";

// Map API job data to JobCard props
const mapJobToCardProps = (job: IJob) => ({
  jobId: job.id || job.id,
  companyInitial: job.staffId?.firstName?.charAt(0) || "C",
  jobTitle: job.title,
  companyName:
    job.staffId?.companyName ||
    `${job.staffId?.firstName} ${job.staffId?.lastName}`,
  location:
    job.hiringLocation.type === "state"
      ? job.hiringLocation.state || "Nationwide"
      : "Nationwide",
  description: job.aboutJob,
  postedTime: getTimeAgo(job.publishedAt || job.createdAt),
  applicants: job.applicationCount,
  jobType: mapJobType(job.jobType),
  experienceLevel: mapExperienceLevel(job.experienceLevel),
  jobStyle: mapWorkLocation(job.workLocation),
  isFeatured: job.viewCount > 50,
  salaryRange: job.salaryRange,
  skills: job.skills,
  viewCounts: job.viewCount,
});

// Helper functions
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const mapJobType = (jobType: string): string => {
  const mapping: { [key: string]: string } = {
    fulltime: "full time",
    "part-time": "part time",
    contract: "contract",
    freelance: "contract",
    intern: "internship",
    "co-founder": "full time",
  };
  return mapping[jobType] || jobType;
};

const mapExperienceLevel = (level: string): string => {
  const mapping: { [key: string]: string } = {
    intern: "intern",
    "entry-level": "entry level",
    "mid-level": "intermediate level",
    "senior-level": "senior level",
    executive: "senior level",
  };
  return mapping[level] || level;
};

const mapWorkLocation = (location: string): string => {
  const mapping: { [key: string]: string } = {
    remote: "remote",
    "on-site": "onsite",
    hybrid: "hybrid",
  };
  return mapping[location] || location;
};

const FindWorkPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    experienceLevel: [] as string[],
    workLocation: [] as string[],
  });
  const [page, setPage] = useState(1);

  // Prepare API parameters based on backend expectations
  const apiParams = useMemo(() => {
    const params: any = {
      page,
      limit: 12,
    };

    // Add search if provided
    if (searchTerm) {
      params.search = searchTerm;
    }

    // Add filters - backend expects exact enum values
    if (filters.jobType.length > 0) {
      // Take the first selected job type (or modify backend to accept array)
      params.jobType = filters.jobType[0];
    }

    if (filters.experienceLevel.length > 0) {
      params.experienceLevel = filters.experienceLevel[0];
    }

    if (filters.workLocation.length > 0) {
      params.workLocation = filters.workLocation[0];
    }

    return params;
  }, [page, searchTerm, filters]);

  // API call with properly mapped parameters
  const { data: jobsData, isLoading, error } = useGetPublicJobsQuery(apiParams);

  console.log("API Params:", apiParams);
  console.log("JOBS LIST: ", jobsData);

  const jobs = jobsData?.data?.jobs || [];
  const totalJobs = jobsData?.data?.total || 0;

  // Filter jobs locally for multiple selections and featured filter
  const filteredJobs = useMemo(() => {
    if (!jobs.length) return [];

    return jobs.filter((job) => {
      const mappedJob = mapJobToCardProps(job);

      const matchesFeatured = !showFeaturedOnly || mappedJob.isFeatured;

      // Convert backend values to frontend format for comparison
      const frontendJobType = mapJobType(job.jobType);
      const frontendExperienceLevel = mapExperienceLevel(job.experienceLevel);
      const frontendJobStyle = mapWorkLocation(job.workLocation);

      const matchesJobType =
        filters.jobType.length === 0 ||
        filters.jobType.some(
          (filterType) => frontendJobType === mapJobType(filterType)
        );

      const matchesExperienceLevel =
        filters.experienceLevel.length === 0 ||
        filters.experienceLevel.some(
          (filterLevel) =>
            frontendExperienceLevel === mapExperienceLevel(filterLevel)
        );

      const matchesWorkLocation =
        filters.workLocation.length === 0 ||
        filters.workLocation.some(
          (filterLocation) =>
            frontendJobStyle === mapWorkLocation(filterLocation)
        );

      return (
        matchesFeatured &&
        matchesJobType &&
        matchesExperienceLevel &&
        matchesWorkLocation
      );
    });
  }, [jobs, showFeaturedOnly, filters]);

  // Filter options - using backend enum values but displaying user-friendly labels
  const jobTypeOptions = [
    { value: "fulltime", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "intern", label: "Internship" },
    { value: "co-founder", label: "Co-founder" },
  ];

  const experienceLevelOptions = [
    { value: "intern", label: "Intern" },
    { value: "entry-level", label: "Entry Level" },
    { value: "mid-level", label: "Mid Level" },
    { value: "senior-level", label: "Senior Level" },
    { value: "executive", label: "Executive" },
  ];

  const workLocationOptions = [
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On Site" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      workLocation: [],
    });
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
  };

  const hasActiveFilters =
    filters.jobType.length > 0 ||
    filters.experienceLevel.length > 0 ||
    filters.workLocation.length > 0;

  // Get display label for active filters
  const getFilterLabel = (category: keyof typeof filters, value: string) => {
    const optionMap: Record<string, Array<{ value: string; label: string }>> = {
      jobType: jobTypeOptions,
      experienceLevel: experienceLevelOptions,
      workLocation: workLocationOptions,
    };

    const option = optionMap[category]?.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Loading skeletons
  const renderSkeletons = () => {
    const skeletons = Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className={viewMode === "grid" ? "col-span-1" : "w-full"}
      >
        <JobCardSkeleton viewMode={viewMode} />
      </div>
    ));

    return viewMode === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons}
      </div>
    ) : (
      <div className="space-y-6">{skeletons}</div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load jobs
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the job listings.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600">
            Discover {totalJobs} amazing opportunity
            {totalJobs !== 1 ? "ies" : ""} waiting for you
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 pr-4 py-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={showFeaturedOnly ? "primary" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFeaturedOnly ? "Featured" : "All Jobs"}
            </Button>

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as ViewMode)}
              className="ml-2"
            >
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <div className="flex flex-wrap gap-2">
                {jobTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.jobType.includes(option.value)
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleFilter("jobType", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <div className="flex flex-wrap gap-2">
                {experienceLevelOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.experienceLevel.includes(option.value)
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      toggleFilter("experienceLevel", option.value)
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Work Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location
              </label>
              <div className="flex flex-wrap gap-2">
                {workLocationOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.workLocation.includes(option.value)
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleFilter("workLocation", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.jobType.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="capitalize cursor-pointer"
                onClick={() => toggleFilter("jobType", type)}
              >
                {getFilterLabel("jobType", type)} ×
              </Badge>
            ))}
            {filters.experienceLevel.map((level) => (
              <Badge
                key={level}
                variant="secondary"
                className="capitalize cursor-pointer"
                onClick={() => toggleFilter("experienceLevel", level)}
              >
                {getFilterLabel("experienceLevel", level)} ×
              </Badge>
            ))}
            {filters.workLocation.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="capitalize cursor-pointer"
                onClick={() => toggleFilter("workLocation", location)}
              >
                {getFilterLabel("workLocation", location)} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Jobs List/Grid */}
        {isLoading ? (
          renderSkeletons()
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id || job.id}
                    {...mapJobToCardProps(job)}
                    viewMode={viewMode}
                    jobId={job.id || job.id}
                  />
                ))
              ) : (
                <div
                  className={`text-center py-12 ${
                    viewMode === "grid" ? "col-span-full" : ""
                  }`}
                >
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {jobs.length < totalJobs && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/85 transition-colors font-medium"
                >
                  {isLoading ? "Loading..." : "Load More Jobs"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Skeleton component for loading state
const JobCardSkeleton = ({ viewMode }: { viewMode: ViewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
};

export default FindWorkPage;
