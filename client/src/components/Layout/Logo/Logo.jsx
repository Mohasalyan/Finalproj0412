import { Link } from "react-router-dom";
import "./Logo.scss";
function Logo() {
  return (
    <div className="logo">
      <Link to={"/"}>
        <div>Swap</div> <span> Moqaida </span>
      </Link>
    </div>
  );
}

export default Logo;
