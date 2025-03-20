import React from "react";

const Home = () => {
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
                    This website is designed to manage students and groups. You can add, edit, and view students and groups, as well as manage various other aspects related to student management.
                </p>
            </div>
        </div>
    );
};

export default Home;