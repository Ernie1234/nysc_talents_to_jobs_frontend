import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { WordRotate } from "../ui/word-rotate";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden">
      <GridBackground
        gridSize="4:4"
        colors={{
          background: "bg-gradient-to-br from-slate-900 to-green-900",
          borderColor: "border-purple-500/20",
          borderSize: "1px",
          borderStyle: "solid",
        }}
        beams={{
          count: 8,
          colors: [
            "bg-purple-400",
            "bg-indigo-400",
            "bg-cyan-400",
            "bg-violet-400",
            "bg-fuchsia-400",
          ],
          speed: 5,
          shadow: "shadow-lg shadow-current/60",
        }}
      >
        {/* Content */}
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto space-y-10 h-full px-8">
          {/* Main heading */}
          {/* <h1 className="text-center text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-fuchsia-400 bg-clip-text text-transparent animate-fade-in">
            AI Agents That
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Actually Perform
            </span>
          </h1> */}
          <WordRotate
            words={[
              "Find and Become a Professional with Passion",
              "Unlock your Career Potential with COPA",
              "Get desired Job from Top Companies",
            ]}
            animationStyle="fade"
            className="text-6xl text-center font-bold text-yellow-400 "
            duration={3200}
            pauseDuration={500}
            loop={true}
          />

          {/* Subtitle */}
          <p className="text-center text-xl text-purple-100 max-w-lg mx-auto animate-fade-in">
            Connect with opportunities that match your skills and location. Let
            our AI assistant guide you to your next career milestone
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              asChild
              size="lg"
              variant="primary"
              className="text-xl px-6 rounded-full"
            >
              <Link to="/auth/register">Get Started</Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="text-xl px-6 rounded-full"
            >
              <Link to="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </GridBackground>
    </div>
  );
}
