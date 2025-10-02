import Logo from "@/components/logo";
import RegisterForm from "@/components/auth/register-form";

const RegisterPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block -mt-3">
        <div className="relative max-w-3xl h-full w-full overflow-hidden mt-3">
          <img
            src="https://nitda.gov.ng/wp-content/uploads/2020/08/PHOTO-2020-08-08-08-10-33-1024x665.jpg"
            alt="Dashboard"
            className="top-0 right-0 w-full h-full object-cover absolute"
            style={{
              objectPosition: "right top",
              transform: "scale(1)",
              transformOrigin: "right top",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
