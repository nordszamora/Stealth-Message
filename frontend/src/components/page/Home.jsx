import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./style.css";

export default function Home() {
   return (
     <div>
       <Container>
         <Row className="mt-4">
           <Col>
            <h1 className='banner'>StealthMessage</h1>
            <h4 style={{fontFamily: 'monospace', color: 'white', textAlign: 'center'}}>Message Anonymously</h4>
           </Col>
         </Row>

         <Row>
           <Col className="d-flex align-items-center justify-content-center">
            <nav>
             <Link to={`/signup`} className="signup">Signup</Link>
             <Link to={`/signin`} className="signin">Signin</Link>
            </nav>
           </Col>
         </Row>
       </Container>
     </div>
   );
}