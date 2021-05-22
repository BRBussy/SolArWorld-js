import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core'
import {Router, publicRoutes} from './route';
import Header from './components/Header';
import Sidebar, {drawerMiniWidth, drawerWidth} from './components/Sidebar';
import cx from 'classnames';

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'hidden'
    },
    mainPanel: {
        transitionProperty: 'top, bottom, width',
        transitionDuration: '.2s, .2s, .35s',
        transitionTimingFunction: 'linear, linear, ease',
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`
        },
        overflow: 'hidden',
        position: 'relative',
        float: 'right',
        transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
        maxHeight: '100%',
        width: '100%',
        overflowScrolling: 'touch'
    },
    mainPanelSidebarMini: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerMiniWidth}px)`
        }
    },
    content: {
        marginTop: '50px',
        height: 'calc(100vh)',
        overflowY: 'hidden'
    },
    container: {
        height: 'calc(100vh - 55px)',
        overflow: 'hidden'
    }
}));

function App() {
    const classes = useStyles();
    const [sideBarOpen, setSidebarOpen] = useState(false);
    const [miniActive, setMiniActive] = useState(true);

    return (
        <BrowserRouter>
            <div
                className={classes.root}
                style={{height: window.innerHeight}}
            >
                <Sidebar
                    open={sideBarOpen}
                    handleSidebarToggle={() => setSidebarOpen(!sideBarOpen)}
                    miniActive={miniActive}
                />
                <div
                    className={
                        classes.mainPanel + ' ' +
                        cx({
                            [classes.mainPanelSidebarMini]: miniActive
                        })
                    }
                >
                    <Header
                        miniActive={miniActive}
                        sidebarMinimize={() => setMiniActive(!miniActive)}
                        handleSidebarToggle={() => setSidebarOpen(!sideBarOpen)}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <Router routes={publicRoutes}/>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
