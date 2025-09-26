import JobCard from "@/components/findWork/JobCard";
import { Search, Filter, List, Grid } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

const jobsData = [
  {
    companyInitial: "G",
    jobTitle: "Quality Assurance",
    companyName: "Google",
    location: "Jakarta Pusat",
    description:
      "Google LLC is an American multinational technology company that focuses on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.",
    postedTime: "2 Days ago",
    applicants: 719,
    jobType: "full time",
    experienceLevel: "mid-senior level",
    jobStyle: "onsite",
    isFeatured: true,
  },
  {
    companyInitial: "M",
    jobTitle: "Frontend Developer",
    companyName: "Microsoft",
    location: "Singapore",
    description:
      "Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.",
    postedTime: "1 Day ago",
    applicants: 423,
    jobType: "full time",
    experienceLevel: "senior level",
    jobStyle: "remote",
    isFeatured: true,
  },
  {
    companyInitial: "A",
    jobTitle: "UX Designer",
    companyName: "Apple",
    location: "Tokyo, Japan",
    description:
      "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.",
    postedTime: "3 Days ago",
    applicants: 289,
    jobType: "part time",
    experienceLevel: "intermediate level",
    jobStyle: "hybrid",
    isFeatured: false,
  },
  {
    companyInitial: "F",
    jobTitle: "Data Scientist",
    companyName: "Facebook",
    location: "Seoul, South Korea",
    description:
      "Meta Platforms, Inc., doing business as Meta, and formerly named Facebook, Inc., is an American multinational technology conglomerate.",
    postedTime: "5 Hours ago",
    applicants: 156,
    jobType: "full time",
    experienceLevel: "senior level",
    jobStyle: "remote",
    isFeatured: true,
  },
  {
    companyInitial: "N",
    jobTitle: "DevOps Engineer",
    companyName: "Netflix",
    location: "Sydney, Australia",
    description:
      "Netflix, Inc. is an American subscription video on-demand over-the-top streaming service and production company.",
    postedTime: "1 Week ago",
    applicants: 892,
    jobType: "contract",
    experienceLevel: "mid-senior level",
    jobStyle: "onsite",
    isFeatured: false,
  },
  {
    companyInitial: "A",
    jobTitle: "Backend Developer",
    companyName: "Amazon",
    location: "Bangalore, India",
    description:
      "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.",
    postedTime: "Just now",
    applicants: 34,
    jobType: "full time",
    experienceLevel: "entry level",
    jobStyle: "hybrid",
    isFeatured: true,
  },
  {
    companyInitial: "S",
    jobTitle: "Full Stack Developer",
    companyName: "Spotify",
    location: "Stockholm, Sweden",
    description:
      "Spotify Technology S.A. is a Swedish audio streaming and media services provider founded in 2006 by Daniel Ek and Martin Lorentzon.",
    postedTime: "2 Days ago",
    applicants: 567,
    jobType: "part time",
    experienceLevel: "intermediate level",
    jobStyle: "remote",
    isFeatured: false,
  },
  {
    companyInitial: "U",
    jobTitle: "Product Manager",
    companyName: "Uber",
    location: "San Francisco, USA",
    description:
      "Uber Technologies, Inc., commonly referred to as Uber, is an American multinational transportation network company.",
    postedTime: "4 Days ago",
    applicants: 234,
    jobType: "full time",
    experienceLevel: "senior level",
    jobStyle: "onsite",
    isFeatured: true,
  },
  {
    companyInitial: "T",
    jobTitle: "Software Engineer Intern",
    companyName: "Tesla",
    location: "Austin, USA",
    description:
      "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas.",
    postedTime: "1 Day ago",
    applicants: 189,
    jobType: "internship",
    experienceLevel: "intern",
    jobStyle: "onsite",
    isFeatured: false,
  },
  {
    companyInitial: "I",
    jobTitle: "AI Research Scientist",
    companyName: "IBM",
    location: "London, UK",
    description:
      "International Business Machines Corporation is an American multinational technology company headquartered in Armonk, New York.",
    postedTime: "3 Days ago",
    applicants: 76,
    jobType: "full time",
    experienceLevel: "senior level",
    jobStyle: "remote",
    isFeatured: true,
  },
  {
    companyInitial: "D",
    jobTitle: "Database Administrator",
    companyName: "Dropbox",
    location: "Berlin, Germany",
    description:
      "Dropbox, Inc. is an American company that operates Dropbox, a file hosting service offering cloud storage, file synchronization, personal cloud, and client software.",
    postedTime: "6 Hours ago",
    applicants: 123,
    jobType: "contract",
    experienceLevel: "associate level",
    jobStyle: "hybrid",
    isFeatured: false,
  },
  {
    companyInitial: "O",
    jobTitle: "Mobile Developer",
    companyName: "Oracle",
    location: "Toronto, Canada",
    description:
      "Oracle Corporation is an American multinational computer technology company headquartered in Austin, Texas.",
    postedTime: "2 Days ago",
    applicants: 298,
    jobType: "full time",
    experienceLevel: "mid-senior level",
    jobStyle: "remote",
    isFeatured: true,
  },
];

type ViewMode = "list" | "grid";

const FindWorkPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    experienceLevel: [] as string[],
    jobStyle: [] as string[],
  });

  // Filter jobs based on search term and all filters
  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const matchesSearch =
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFeatured = !showFeaturedOnly || job.isFeatured;

      const matchesJobType =
        filters.jobType.length === 0 || filters.jobType.includes(job.jobType);
      const matchesExperienceLevel =
        filters.experienceLevel.length === 0 ||
        filters.experienceLevel.includes(job.experienceLevel);
      const matchesJobStyle =
        filters.jobStyle.length === 0 ||
        filters.jobStyle.includes(job.jobStyle);

      return (
        matchesSearch &&
        matchesFeatured &&
        matchesJobType &&
        matchesExperienceLevel &&
        matchesJobStyle
      );
    });
  }, [searchTerm, showFeaturedOnly, filters]);

  // Filter options
  const jobTypeOptions = ["full time", "part time", "contract", "internship"];
  const experienceLevelOptions = [
    "entry level",
    "intern",
    "intermediate level",
    "mid-senior level",
    "senior level",
    "associate level",
  ];
  const jobStyleOptions = ["onsite", "remote", "hybrid"];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      jobStyle: [],
    });
  };

  const hasActiveFilters =
    filters.jobType.length > 0 ||
    filters.experienceLevel.length > 0 ||
    filters.jobStyle.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600">
            Discover {filteredJobs.length} amazing opportunity
            {filteredJobs.length !== 1 ? "ies" : ""} waiting for you
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
                {jobTypeOptions.map((type) => (
                  <Button
                    key={type}
                    variant={
                      filters.jobType.includes(type) ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleFilter("jobType", type)}
                    className="capitalize"
                  >
                    {type}
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
                {experienceLevelOptions.map((level) => (
                  <Button
                    key={level}
                    variant={
                      filters.experienceLevel.includes(level)
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleFilter("experienceLevel", level)}
                    className="capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Job Style Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Style
              </label>
              <div className="flex flex-wrap gap-2">
                {jobStyleOptions.map((style) => (
                  <Button
                    key={style}
                    variant={
                      filters.jobStyle.includes(style) ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleFilter("jobStyle", style)}
                    className="capitalize"
                  >
                    {style}
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
              <Badge key={type} variant="secondary" className="capitalize">
                {type} ×
              </Badge>
            ))}
            {filters.experienceLevel.map((level) => (
              <Badge key={level} variant="secondary" className="capitalize">
                {level} ×
              </Badge>
            ))}
            {filters.jobStyle.map((style) => (
              <Badge key={style} variant="secondary" className="capitalize">
                {style} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Jobs List/Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <JobCard
                key={`${job.companyName}-${job.jobTitle}-${index}`}
                {...job}
                viewMode={viewMode}
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

        {/* Load More Button (optional) */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/85 transition-colors font-medium">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWorkPage;
