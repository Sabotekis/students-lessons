import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div>
        <style>
            {`
                .container {
                    margin-top: 80px;
                    padding: 20px;
                    text-align: center;
                }


                .description {
                    margin-bottom: 20px;
                }
            `}
        </style>
            <div className="container">
                <p className="description">
                    {t("app_description")}                
                </p>
            </div>
        </div>
    );
};

export default Home;