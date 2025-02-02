export default function CorrectIcon({ color, width, height }) {
  // customize if params are there, else leave default values.
  const classes = "flex justify-center items-center" + (color ? ` text-${color}` : "");
  const svgWidth = width ? width : "64";
  const svgHeight = height ? height : "64";

  return (
    <div className={classes}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
        fill="currentColor"
        className="bi bi-check-circle-fill"
        viewBox="0 0 16 16"
        aria-label="correct tick image"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
    </div>
  );
}
