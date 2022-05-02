import React from 'react'
import styled from 'styled-components'


const Title = styled.h1`
    background: rgb(2,0,36);
    background: linear-gradient(120deg, rgba(2,0,36,1) -30%, rgba(87,87,142,1) 35%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 8em;
    margin: auto;
`;


const Landing = () => {
    return(
        <div id="logo-container">
            <Title className="logo">fullproof</Title>
        </div>
    )
}

export default Landing;