import { ChoicesList, type Choice } from "./ChoicesList";

interface SectionViewProps {
    title: string;
    content: string[];
    choices: Choice[];
    onChoiceSelect: (choiceId: string) => void;
    disabled?: boolean;
}

export const SectionView = ({ title, content, choices, onChoiceSelect, disabled = false }: SectionViewProps) => {

    return (
        <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-[#F9ECD5]">
            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl font-serif text-center font-bold text-[#433025] mb-6">
                {title}
            </h2>

            {/* Content Paragraphs */}
            <div className={`space-y-4 text-[#433025] leading-relaxed ${choices.length > 0 ? 'border-b border-[#F9ECD5] pb-8' : ''}`}>
                {content.map((paragraph, index) => (
                    <p key={index} className="text-base sm:text-lg">
                        {paragraph}
                    </p>
                ))}
            </div>

            {choices.length > 0 && (
                <ChoicesList choices={choices} onChoiceSelect={onChoiceSelect} disabled={disabled} />
            )}
        </article>
    );
};
