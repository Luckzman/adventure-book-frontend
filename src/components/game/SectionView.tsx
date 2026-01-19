import { ChoicesList } from "./ChoicesList";
import { mockGameData } from "./mockGameData";

interface SectionViewProps {
    title: string;
    content: string[];
}

export const SectionView = ({ title, content }: SectionViewProps) => {

    const handleChoiceSelect = (choiceId: string) => {
        const choice = mockGameData.choices.find((c) => c.id === choiceId);
        if (choice) {
            // TODO: Navigate to next section or handle choice logic
            console.log('Choice selected:', choiceId, 'Next section:', choice.nextSectionId);
        }
    };

    // Convert GameChoice to Choice format for ChoicesList
    const choices = mockGameData.choices.map((choice) => ({
        id: choice.id,
        number: choice.number,
        text: choice.text,
        description: choice.description,
        requirement: choice.requirement,
    }));
    return (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-[#F9ECD5]">
            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl font-serif text-center font-bold text-[#433025] mb-6">
                {title}
            </h2>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-[#433025] leading-relaxed border-b border-[#F9ECD5] pb-8">
                {content.map((paragraph, index) => (
                    <p key={index} className="text-base sm:text-lg">
                        {paragraph}
                    </p>
                ))}
            </div>
            <ChoicesList choices={choices} onChoiceSelect={handleChoiceSelect} />
        </div>
    );
};
