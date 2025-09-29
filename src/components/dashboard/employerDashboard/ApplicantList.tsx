import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Applicant {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  site: string;
  startDate: string;
  status: "Invited" | "Absent";
  email: string;
  phone: string;
}

const ApplicantList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const applicants: Applicant[] = [
    {
      id: "1",
      name: "Anarchy Belk",
      jobTitle: "Head of Design",
      department: "Product",
      site: "Stockholm",
      startDate: "Mar 13, 2023",
      status: "Invited",
      email: "anarchy.belk@example.com",
      phone: "+1-555-0123",
    },
    {
      id: "2",
      name: "Ksenia Bator",
      jobTitle: "Fullstack Engineer",
      department: "Engineering",
      site: "Miami",
      startDate: "Oct 13, 2023",
      status: "Absent",
      email: "ksenia.bator@example.com",
      phone: "+1-555-0124",
    },
    {
      id: "3",
      name: "Bogdan Nikitin",
      jobTitle: "Mobile Lead",
      department: "Product",
      site: "Kyiv",
      startDate: "Nov 4, 2023",
      status: "Invited",
      email: "bogdan.nikitin@example.com",
      phone: "+1-555-0125",
    },
    {
      id: "4",
      name: "Arsen Yatsenko",
      jobTitle: "Sales Manager",
      department: "Operations",
      site: "Ottawa",
      startDate: "Sep 4, 2021",
      status: "Invited",
      email: "arsen.yatsenko@example.com",
      phone: "+1-555-0126",
    },
    {
      id: "5",
      name: "Daria Yurchenko",
      jobTitle: "Network Engineer",
      department: "Product",
      site: "Sao Paulo",
      startDate: "Feb 21, 2023",
      status: "Invited",
      email: "daria.yurchenko@example.com",
      phone: "+1-555-0127",
    },
    {
      id: "6",
      name: "Yulia Polishchuk",
      jobTitle: "Head of Design",
      department: "Product",
      site: "London",
      startDate: "Aug 2, 2024",
      status: "Absent",
      email: "yulia.polishchuk@example.com",
      phone: "+1-555-0128",
    },
  ];

  const departments = ["All", "Product", "Engineering", "Operations"];
  const statuses = ["All", "Invited", "Absent"];
  //   const lifecycles = ["Hired", "Employed"];

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" ||
      applicant.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All" || applicant.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Invited":
        return "default";
      case "Absent":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
            <p className="text-gray-600 mt-2">
              Manage your hiring strategy and hire the right applicants
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Applicant
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hired</span>
                  <span className="font-semibold">23%</span>
                </div>
                <Progress value={23} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Employed</span>
                  <span className="font-semibold">51%</span>
                </div>
                <Progress value={51} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Project Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Output</span>
                  <span className="font-semibold">10%</span>
                </div>
                <Progress value={10} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Efficiency</span>
                  <span className="font-semibold">14%</span>
                </div>
                <Progress value={14} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">
                  Organize
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  Insights
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Columns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {[
                  "Department",
                  "Site",
                  "Lifecycle",
                  "Status",
                  "Entity",
                  "Search",
                ].map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="justify-center text-xs"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Department: {selectedDepartment}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {departments.map((dept) => (
                        <DropdownMenuItem
                          key={dept}
                          onClick={() => setSelectedDepartment(dept)}
                        >
                          {dept}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Status: {selectedStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applicants</CardTitle>
            <CardDescription>
              {filteredApplicants.length} applicants found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium">
                      {applicant.name}
                    </TableCell>
                    <TableCell>{applicant.jobTitle}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{applicant.department}</Badge>
                    </TableCell>
                    <TableCell>{applicant.site}</TableCell>

                    <TableCell>{applicant.startDate}</TableCell>

                    <TableCell>
                      <Badge variant={getStatusVariant(applicant.status)}>
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Candidate
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem className="text-red-600">
                            Remove Applicant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantList;
