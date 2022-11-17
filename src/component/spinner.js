//import Button from 'react-bootstrap';
import '../css/style.css';

function Spinner() {
    return (
        <div
            className="spinner-grow text-primary position-absolute top-50 start-50"
            role="status"
        >
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}

export default Spinner;
