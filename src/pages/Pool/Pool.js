import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import styled from 'styled-components'

const StyledContainer = styled(Container)`
    margin: 9%;
    max-width: 800px;
`

const Pool = () => {
    
    return (
        <>
        <StyledContainer>
            <Form>
                <h1>Create New Pool</h1>
                <Row className="justify-content-md-center">
                    <Col>
                        <select class="form-select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </Col>
                    <Col>
                        <select class="form-select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <div>
                            <span>Total fee</span>
                        </div>
                    </Col>
                    <Col>
                        <div class="btn-group">
                                    <button type="button" class="btn btn-primary">Apple</button>
                                    <button type="button" class="btn btn-primary">Samsung</button>
                                    <button type="button" class="btn btn-primary">Sony</button>
                        </div>
                    </Col>
                </Row>
                <Button className="mt-4" type="submit">Submit</Button>
            </Form>
        </StyledContainer>
        </>
    )
}

export default Pool