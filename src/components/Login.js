import React, { useState } from 'react';
import "./Login.css";
import { Button, Form, Alert, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { iAxios } from "../services/interceptors";

function Login() {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [iframeKey, setIframeKey] = useState(0);
    const [respuesta, setRespuesta] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIframeKey(prev => prev + 1);

        try {
            let response;
            if (method === 'GET') {
                response = await iAxios.get(url);
            } else if (method === 'POST') {
                response = await iAxios.post(url);
            }
            setRespuesta(response.data);
            setError('');
        } catch (error) {
            if (error.response) {
                // Si hay un error de respuesta del servidor
                setRespuesta(error.response.data); // Mostrar el mensaje de error del servidor en el iframe
                setError('');
            } else {
                // Si ocurre un error de red u otro tipo de error
                setRespuesta({ error: 'Error en la solicitud. Por favor, inténtalo de nuevo.' }); // Mostrar un mensaje genérico de error
                setError('Error en la solicitud. Por favor, inténtalo de nuevo.');
            }
        }
    };
    return (
        <Container className="login-container">
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit} className="mb-3">
                        <Form.Group controlId="idUrl" className="mb-3">
                            <Form.Label>URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Por favor Digite la URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between mb-3">
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-method">
                                    {method}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setMethod('GET')}>GET</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setMethod('POST')}>POST</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button variant="primary" type="submit">
                                Realiza petición
                            </Button>
                        </div>
                    </Form>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {respuesta && (
                        <div className="iframe-container" style={{width: '100%'}}>
                            <iframe
                                key={iframeKey}
                                srcDoc={`<pre>${JSON.stringify(respuesta, null, 2)}</pre>`}
                                title="Respuesta del servidor"
                                width="800px"
                                height="400"
                                style={{border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white'}}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
