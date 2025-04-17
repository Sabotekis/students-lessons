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
                    Šī vietne ir paredzēta studentu un grupu pārvaldībai. Varat pievienot, rediģēt un skatīt studentus un grupas, kā arī pārvaldīt dažādus citus ar studentu pārvaldību saistītus aspektus.                
                </p>
            </div>
        </div>
    );
};

export default Home;