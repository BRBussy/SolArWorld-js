import React, {useRef, useState} from 'react';
import {
    makeStyles,
    Popover as MUIPopover,
    PopoverOrigin as MUIPopoverOrigin,
    PopoverPosition as MUIPopoverPosition
} from '@material-ui/core';

export interface Props {
    children?: React.ReactNode;
    popOverComponent?: React.ReactNode;
    anchorOrigin?: MUIPopoverOrigin;
    transformOrigin?: MUIPopoverOrigin;
    anchorPosition?: MUIPopoverPosition;
    anchorReference?: 'none' | 'anchorPosition' | 'anchorEl' | undefined;
    rootClassName?: string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        border: `solid 1px ${theme.palette.text.hint}`
    }
}));

export default function Popover(
    {
        children,
        popOverComponent,
        anchorOrigin,
        transformOrigin,
        anchorPosition,
        anchorReference,
        rootClassName
    }: Props) {
    const [open, setOpen] = useState(false);
    const anchorEl = useRef(null);
    const classes = useStyles();

    const handleToggleOpen = () => {
        setOpen(!open);
    };

    return (
        <>
            <div ref={anchorEl} onClick={handleToggleOpen}>
                {children}
            </div>
            <MUIPopover
                onClick={(e) => e.stopPropagation()}
                PaperProps={{classes: {root: rootClassName ? rootClassName : classes.root}}}
                open={open}
                anchorEl={anchorEl.current}
                onClose={handleToggleOpen}
                anchorOrigin={
                    anchorOrigin
                        ? anchorOrigin
                        : {
                            vertical: 'bottom',
                            horizontal: 'center'
                        }
                }
                transformOrigin={
                    transformOrigin
                        ? transformOrigin
                        : {
                            vertical: 'top',
                            horizontal: 'center'
                        }
                }
                anchorPosition={
                    anchorPosition
                        ? anchorPosition
                        : {
                            top: 200,
                            left: 200
                        }
                }
                anchorReference={anchorReference}
            >
                {popOverComponent}
            </MUIPopover>
        </>
    );
}