import React from "react";

interface Props {
  description: string;
}

export const DescriptionFormatter: React.FC<Props> = ({ description }) => {
  const formatDescription = (text: string) => {
    // Split the text into sections based on various delimiters
    const sections = text.split(/(?:\r?\n|\r)|(?:\d+[\)\.]\s+)/g);

    return sections
      .filter((section) => section && section.trim())
      .map((section, index) => {
        const trimmedSection = section.trim();

        // Detect different types of sections
        const isMainHeader =
          /^[A-Z\s]{3,}$/.test(trimmedSection) || trimmedSection.endsWith(":");
        const isBulletPoint =
          trimmedSection.startsWith("•") || trimmedSection.startsWith("-");
        const isSubSection = /^[a-z]\)|\d+\)/.test(trimmedSection);

        let className = "text-gray-600 mb-2 ";

        if (isMainHeader) {
          className = "font-semibold text-gray-800 text-lg mt-4 mb-3";
        } else if (isBulletPoint) {
          className =
            'text-gray-600 mb-2 pl-6 before:content-["•"] before:mr-2';
        } else if (isSubSection) {
          className = "text-gray-600 mb-2 pl-8";
        } else {
          className = "text-gray-600 mb-2 pl-4";
        }

        return (
          <div key={index} className={className}>
            {trimmedSection}
          </div>
        );
      });
  };

  return (
    <div className="description-content">{formatDescription(description)}</div>
  );
};
