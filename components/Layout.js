
import React from 'react';
import Header from './Header';
import Head from 'next/Head'
import {Container} from 'semantic-ui-react';

const Layout = (props) =>{
    return(
        <Container>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css" />
            </Head>

            <Header/>
            {props.children}
        </Container>
    );
};

export default Layout;

