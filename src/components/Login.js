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
                response = await iAxios.get('/api/getPage', { params: { pageName: url } });
            } else if (method === 'POST') {
                response = await iAxios.post('/api/getPage', { pageName: url });
            }

            const cleanResponse = response.data.replace(/\\r|\\n|\\t/g, '').replace(/"/g, '');
            setRespuesta(cleanResponse);
            setError('');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError('Página no encontrada. Verifica la URL e inténtalo de nuevo.');
                } else if (error.response.status === 400) {
                    setError('Solicitud incorrecta. Verifica los datos e inténtalo de nuevo.');
                } else if (error.response.status === 500) {
                    setError(`Error del servidor: ${error.response.data.message || 'Internal Server Error'}`);
                } else {
                    setError('Ocurrió un error inesperado:${error.response.status}');
                }
                setRespuesta('');
            } else {
                setError('Error en la solicitud. Por favor, inténtalo de nuevo.');
                setRespuesta('');
            }

            /*if (error.response) {
                // Si hay un error de respuesta del servidor
                setRespuesta(error.response.data); // Mostrar el mensaje de error del servidor en el iframe
                setError('');
            } else {
                // Si ocurre un error de red u otro tipo de error
                setRespuesta({ error: 'Error en la solicitud. Por favor, inténtalo de nuevo.' }); // Mostrar un mensaje genérico de error
                setError('Error en la solicitud. Por favor, inténtalo de nuevo.');
            }
            */
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
                                Consultar
                            </Button>
                        </div>
                    </Form>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {respuesta && (
                        <div className="iframe-container" style={{ width: '100%' }}>
                            <iframe
                                key={iframeKey}
                                //srcDoc={`<pre>${JSON.stringify(respuesta, null, 2)}</pre>`}
                                srcDoc={respuesta}
                                title="Respuesta del servidor"
                                width="100%"
                                height="200px"
                                style={{ border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}
                            />
                        </div>                        
                    )}
                    <div>
                        <p>Andrés Camilo Novoa</p>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}

export default Login;
