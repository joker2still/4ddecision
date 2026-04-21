export default function ScoreSlider({
  id,
  label,
  name,
  value,
  onChange,
  rangeHint = "0 - 100",
  min = 0,
  max = 100,
  step = 1,
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>

      <div className="slider-row">
        <div className="slider-meta">
          <span>{rangeHint}</span>
          <span className="slider-value">{value}</span>
        </div>

        <input
          id={id}
          max={max}
          min={min}
          name={name}
          onChange={onChange}
          step={step}
          type="range"
          value={value}
        />

        <input
          max={max}
          min={min}
          name={name}
          onChange={onChange}
          step={step}
          type="number"
          value={value}
        />
      </div>
    </div>
  );
}
