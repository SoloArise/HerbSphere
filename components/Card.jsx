import { ArrowUpRight } from "lucide-react";

export default function Card({ title, description, image, buttonText }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-herb-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      {image && (
        <div className="h-44 overflow-hidden bg-herb-50">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-herb-900">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{description}</p>
        {buttonText && (
          <button
            type="button"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-md border border-herb-200 px-4 py-2 text-sm font-semibold text-herb-700 transition hover:border-herb-300 hover:bg-herb-50"
          >
            {buttonText}
            <ArrowUpRight size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
