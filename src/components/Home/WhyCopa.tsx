import Wrapper from "../dashboard/Wrapper";

const WhyCopa = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h4 className="scroll-m-20 text-3xl font-semibold tracking-tight">
        Why Choose <span className="text-green-900">COPA</span>
      </h4>
      <div className="flex flex-col md:flex-row gap-10">
        <Wrapper className="shadow-2xl space-y-4 max-w-sm p-8 rounded-xl text-center">
          <p className="text-5xl">🔍</p>
          <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Easy Job Search
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Find the perfect job with our advanced search filters. Search by
            location, salary, company size, and more
          </p>
        </Wrapper>
        <Wrapper className="shadow-2xl space-y-4 max-w-sm p-8 rounded-xl text-center">
          <p className="text-5xl">🤖</p>
          <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            AI And Automation
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Find the perfect job with our advanced search filters. Search by
            location, salary, company size, and more
          </p>
        </Wrapper>
        <Wrapper className="shadow-2xl space-y-4 max-w-sm p-8 rounded-xl text-center">
          <p className="text-5xl">🤵</p>
          <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Mentorship/Career Support
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Find the perfect job with our advanced search filters. Search by
            location, salary, company size, and more
          </p>
        </Wrapper>
      </div>
    </div>
  );
};

export default WhyCopa;
