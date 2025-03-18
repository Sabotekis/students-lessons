import React from "react";
import styled from "styled-components";

const Container = styled.div`
    margin-top: 80px;
    padding: 20px;
    text-align: center;
`;


const Description = styled.p`
    margin-bottom: 20px;
`;

const Home = () => {
    return (
        <Container>
            <Description>
                This website is designed to manage students and groups. You can add, edit, and view students and groups, as well as manage various other aspects related to student management.
            </Description>
        </Container>
    );
};

export default Home;