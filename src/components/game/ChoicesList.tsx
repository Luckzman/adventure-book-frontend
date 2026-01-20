export interface Choice {
    id: string;
    number: number;
    text: string;
    description: string;
    requirement?: string;
    consequence?: {
        type: string;
        value: string;
        text: string;
    } | null;
}

interface ChoicesListProps {
    choices: Choice[];
    onChoiceSelect: (gotoId: string) => void;
    disabled?: boolean;
}

export const ChoicesList = ({ choices, onChoiceSelect, disabled = false }: ChoicesListProps) => {
    return (
        <section className="mt-8" aria-labelledby="choices-heading">
            <h3 id="choices-heading" className="text-xl font-semibold text-stone-900 mb-4">
                What do you choose?
            </h3>
            <div className="space-y-4" role="list">
                {choices.map((choice) => (
                    <div key={choice.id} role="listitem">
                        <button
                            onClick={() => onChoiceSelect(choice.id)}
                            disabled={disabled}
                            aria-label={`Choice ${choice.number}: ${choice.text}`}
                            aria-describedby={choice.description ? `choice-desc-${choice.id}` : undefined}
                            className={`w-full text-left bg-white rounded-lg shadow-md p-5 border border-[#F9ECD5] transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:shadow-lg hover:border-amber-400 cursor-pointer'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Number Badge */}
                                <div className="shrink-0 w-9 h-6 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-sm">
                                    {choice.number}
                                </div>

                                {/* Choice Content */}
                                <div className="grow">
                                    <p className="text-base sm:text-lg font-medium text-stone-900 mb-2">
                                        {choice.text}
                                    </p>
                                    <p id={`choice-desc-${choice.id}`} className="text-sm text-stone-700 mb-2">
                                        {choice.description}
                                    </p>
                                    {choice.requirement && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-stone-200 text-stone-900 text-xs font-medium rounded-lg">
                                            Requires: {choice.requirement}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};
