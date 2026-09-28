/** @format */
import { Link } from "react-router-dom";
import type { InfoContent } from "./infoContent";

interface InfoPageProps {
  content: InfoContent;
}

// صفحة نصية عامة: About وPrivacy، وصفحات الشحن والإرجاع والشروط لاحقًا
const InfoPage = ({ content }: InfoPageProps) => {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
      {content.lastUpdated && (
        <p className="mt-1 text-xs text-gray-400">
          Last updated: {content.lastUpdated}
        </p>
      )}
      <p className="mt-4 leading-relaxed text-gray-700">{content.intro}</p>

      {content.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">
            {section.heading}
          </h2>
          {section.list && (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((p) => (
            <p key={p} className="mt-3 text-sm leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
        </section>
      ))}

      <div className="mt-10 rounded-2xl bg-sky-50 p-5 text-sm text-gray-700">
        Questions?{" "}
        <Link to="/support#contact" className="font-medium text-sky-600">
          Contact our support team
        </Link>
        .
      </div>
    </article>
  );
};

export default InfoPage;
