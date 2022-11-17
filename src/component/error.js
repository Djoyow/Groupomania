//import Button from 'react-bootstrap';
import '../css/style.css'

function App() {
    return (
        < >
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Cette page n'existe pas.</p>
                <a href="/" className="btn btn-primary bt">Retour à l'accueil</a>
            </div>
        </div>
        </>
    );
}

export default App;
