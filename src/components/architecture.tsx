const layers = [
  { label: "AI Agent / Automation", color: "text-aegis-300" },
  { label: "Aegis Gateway", color: "text-white" },
  { label: "Authentication", color: "text-surface-300" },
  { label: "Agent Identity", color: "text-surface-300" },
  { label: "Policy Evaluation", color: "text-aegis-400" },
  { label: "Authorization Decision", color: "text-white font-semibold" },
  { label: "Capability Execution", color: "text-surface-300" },
  { label: "Audit Trail", color: "text-surface-400" },
];

export function Architecture() {
  return (
    <div className="flex flex-col items-center gap-1" role="img" aria-label="Aegis architecture flow: AI Agent sends request through Aegis Gateway, which performs Authentication, identifies the Agent, evaluates against Policy, makes an Authorization Decision, executes the Capability, then records to the Audit Trail">
      {layers.map((layer, i) => (
        <div key={layer.label} className="flex flex-col items-center">
          <div className={`rounded-lg border border-surface-700 bg-surface-900 px-6 py-3 text-sm ${layer.color}`}>
            {layer.label}
          </div>
          {i < layers.length - 1 && (
            <div className="flex flex-col items-center py-1">
              <svg className="h-4 w-4 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
