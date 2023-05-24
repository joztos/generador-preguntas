import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div>
        Created by <span className="font-bold">Samasat Group</span> for <span className="font-bold">EMDI</span> school, powered via{" "}
        <a
          href="https://samasat.com/"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline transition underline-offset-2"
        >
          Navi AI
        </a>
      </div>
      <div className="flex space-x-4 pb-4 sm:pb-0">
        <Link href="https://samasat.com/" aria-label="TaxPal on Twitter">
          <a className="group">
            <svg
              aria-hidden="true"
              className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
            >
              {/* SVG Path Here */}
            </svg>
          </a>
        </Link>
        <Link href="https://samasat.com/" aria-label="TaxPal on GitHub">
          <a className="group">
            <svg
              aria-hidden="true"
              className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
            >
              {/* SVG Path Here */}
            </svg>
          </a>
        </Link>
      </div>
    </footer>
  );
}
