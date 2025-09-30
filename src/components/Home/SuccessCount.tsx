import { CountingNumber } from "../ui/counting-number";

const SuccessCount = () => {
  return (
    <div className="flex flex-wrap gap-16 py-16 items-center justify-center">
      <div className="flex items-center justify-center flex-col">
        <div className="flex">
          <CountingNumber
            from={0}
            to={15}
            duration={3}
            className="text-4xl font-bold text-green-800"
          />
          <p className="text-4xl font-bold text-green-800">K+</p>
        </div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Active Jobs
        </h4>
      </div>
      <div className="flex items-center justify-center flex-col">
        <div className="flex">
          <CountingNumber
            from={0}
            to={300}
            duration={3}
            className="text-4xl font-bold text-green-800"
          />
          <p className="text-4xl font-bold text-green-800">K+</p>
        </div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Job Seekers
        </h4>
      </div>
      <div className="flex items-center justify-center flex-col">
        <div className="flex">
          <CountingNumber
            from={0}
            to={12}
            duration={3}
            className="text-4xl font-bold text-green-800"
          />
          <p className="text-4xl font-bold text-green-800">K+</p>
        </div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Companies
        </h4>
      </div>
    </div>
  );
};

export default SuccessCount;
