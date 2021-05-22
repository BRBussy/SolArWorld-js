import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeContext from './context/Theme';
import {ArweaveContext} from './context/Arweave';
import {WalletContext} from './context/Wallet';
import {CssBaseline} from '@material-ui/core';
import ColorContext from './context/Color';
import {SnackbarProvider} from 'notistack';
import {SolanaContext} from "./context/Solana";

ReactDOM.render(
    <ThemeContext>
        <ColorContext>
            <SnackbarProvider>
                <WalletContext>
                    <SolanaContext>
                        <ArweaveContext>
                            <CssBaseline/>
                            <App/>
                        </ArweaveContext>
                    </SolanaContext>
                </WalletContext>
            </SnackbarProvider>
        </ColorContext>
    </ThemeContext>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
