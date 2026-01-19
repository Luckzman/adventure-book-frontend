interface Choice {
    id: string;
    number: number;
    text: string;
    description: string;
    requirement?: string;
}

interface ChoicesListProps {
    choices: Choice[];
    onChoiceSelect: (choiceId: string) => void;
}

export const ChoicesList = ({ choices, onChoiceSelect }: ChoicesListProps) => {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#433025] mb-4">What do you choose?</h3>
            <div className="space-y-4">
                {choices.map((choice) => (
                    <button
                        key={choice.id}
                        onClick={() => onChoiceSelect(choice.id)}
                        className="w-full text-left bg-white rounded-lg shadow-md p-5 border border-[#F9ECD5] hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        <div className="flex items-start gap-4">
                            {/* Number Badge */}
                            <div className="flex-shrink-0 w-9 h-6 rounded-full bg-[#433025] text-white flex items-center justify-center font-bold text-sm">
                                {choice.number}
                            </div>

                            {/* Choice Content */}
                            <div className="flex-grow">
                                <p className="text-base sm:text-lg font-medium text-[#433025] mb-2">
                                    {choice.text}
                                </p>
                                <p className="text-sm text-[#92827A] mb-2">{choice.description}</p>
                                {choice.requirement && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-[#E4DFDC] text-[#4D3E34] text-xs font-medium rounded-lg">
                                        Requires: {choice.requirement}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
