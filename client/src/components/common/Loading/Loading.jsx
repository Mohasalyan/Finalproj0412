import "./Loading.scss";
function Loading({ height = "" }) {
  return (
    <div className={`wrapper flex-center ${height === "small" ? "small" : ""}`}>
      <div className="loader" />
    </div>
  );
}

export default Loading;
