import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-scroll";

export const Title = () => {
  return (
    <div className=" flex h-screen w-full flex-col items-center justify-center gap-4 bg-stone-100 bg-gradient">
      <h1 className="text-center text-3xl font-bold uppercase italic text-grey-100 sm:text-5xl lg:text-6xl">
        Mbta <span className="gradient-text drop-shadow-2xl">pride</span> bus
        tracker
      </h1>
      <div className="flex flex-row items-center">
        <h1 className="text-md font-bold italic text-grey-100">by</h1>
        <div className="w-32 md:w-64 lg:w-52 pl-1 md:pl-2 flex flex-row">
          <a href="https://transitmatters.org">
            <img src={"Logo_wordmark.png"} />
          </a>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-x-2 mt-6 border-2 hover:scale-105 border-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        <ChevronDoubleRightIcon
          className="-ml-0.5 h-5 w-5"
          aria-hidden="true"
        />
        <Link to="center" smooth={true} duration={500} offset={1000}>
          Bring me to the pride bus
        </Link>
        <ChevronDoubleLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};
