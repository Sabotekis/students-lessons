import { useTranslation } from 'react-i18next';
import { Container, Row, Col} from 'react-bootstrap';

const Home = () => {
    const { t } = useTranslation();
    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center align-items-center text-center">
                <Col xs={12} md={10} lg={8}>
                    {t("app_description")} 
                </Col>
            </Row>
        </Container>
    );
};

export default Home;