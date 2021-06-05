import { faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Profile() {
  return (
    <div className="w-full flex flex-col content-center justify-center">
      <FontAwesomeIcon icon={faPortrait} className="w-1/5" />
      <p className="text-base font-semibold text-gray-600">sihamais</p>
    </div>
  );
}
