import { ArrowRightIcon, HeartIcon } from "@heroicons/react/20/solid";
import { STATUSES, STATUS_TO_BG, useScreenDetector } from "../utils";

export const Footer = ({
  busStatus,
  stopName,
  status,
  routeId,
  direction,
}: any) => {
  const { isMobile } = useScreenDetector();

  return (
    <div className="sticky bottom-0 z-[1000] bg-white p-2 border-t-2 border-gray-600 md:gap-2 flex flex-row justify-between font-bold drop-shadow-2xl">
      {busStatus === "pending" && (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1  gap-3 text-xs font-medium ${STATUS_TO_BG["INCOMING_AT"]}`}
        >
          Searching for pride bus
          <svg
            className="animate-spin -ml-1 h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      {busStatus === "error" && (
        <span
          className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ${STATUS_TO_BG["STOPPED_AT"]}`}
        >
          The pride bus is sleeping :(
        </span>
      )}

      {busStatus === "success" && (
        <>
          <div className="flex flex-row">
            <p className="flex flex-row justify-between items-center">
              <span
                className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ${STATUS_TO_BG[status]}`}
              >
                {STATUSES[status]}
              </span>
              <ArrowRightIcon className="mx-2 h-5 w-5" />

              <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {stopName}
              </span>
              <ArrowRightIcon className="mx-2 h-5 w-5" />
              <span className="inline-flex items-center rounded-md bg-yellow-300 px-2 py-1 text-xs font-medium ">
                {direction} Route {routeId}
              </span>
            </p>
          </div>

          {!isMobile && (
            <div className="flex flex-row justify-end">
              <a href="https://transitmatters.org/donate">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Donate
                  <HeartIcon className="h-3 w-3" />
                </button>
              </a>

              <div className="w-32 md:w-42 lg:w-46 pl-1 md:pl-2 flex flex-row items-center ">
                <a href="https://transitmatters.org ">
                  <img src={"Logo_wordmark.png"} alt="TransitMatters Logo" />
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
