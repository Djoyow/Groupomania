import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
function LoginIcon() {
    return (
        <>
            <div className="disconnect">
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    size="lg"
                    pull="left"
                />
                <p>Déconnecter</p>
            </div>
        </>
    );
}

export default LoginIcon;
