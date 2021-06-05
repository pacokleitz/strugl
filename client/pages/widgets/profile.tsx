import { faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Profile() {
  return (
    <div className="w-full flex-grow-0 mx-auto text-center flex flex-col">
      <div><FontAwesomeIcon icon={faPortrait} className="w-1/5"/></div>
    </div>
  );
}
