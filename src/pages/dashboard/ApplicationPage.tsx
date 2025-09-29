import ApplicantList from "@/components/dashboard/employerDashboard/ApplicantList";
import Wrapper from "@/components/dashboard/Wrapper";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Dot } from "lucide-react";

const ApplicationPage = () => {
  const { user } = useAuth();
  return (
    <>
      {user?.role === "corps_member" ? (
        <div className="space-y-6">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              My Applications
            </h4>
            <p>All my job Applications</p>
          </div>

          <div className="flex flex-col space-y-4 ">
            <Wrapper>
              <div className="flex gap-8 justify-between ">
                <div className="flex flex-col gap-3">
                  <h4 className="scroll-m-20 text-xl text-primary font-semibold tracking-tight">
                    User Expirence Designer
                  </h4>
                  <div className="flex text-sm text-muted-foreground items-center">
                    <p className="">Safari Ltd</p>
                    <Dot />
                    <p className="">Permanent</p>
                    <Dot />
                    <p className="">Applied Sept 12, 2019</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <Bookmark />
                  <Button>Pending</Button>
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
      ) : (
        <ApplicantList />
      )}
    </>
  );
};

export default ApplicationPage;
