interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const DEFAULT_PRESETS = ["#ad8a3f", "#1b1a17", "#4a4740", "#8a6d3b", "#c9a961", "#2d2a24"];

export function ColorPicker({
  label = "Colour",
  value,
  onChange,
  presets = DEFAULT_PRESETS,
}: ColorPickerProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1.5">{label}</label>
      <div className="flex items-center gap-2.5 flex-wrap">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform ${
              value === color ? "border-ink scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Use ${color}`}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full overflow-hidden border border-gold-line cursor-pointer"
          aria-label="Custom colour"
        />
      </div>
    </div>
  );
}