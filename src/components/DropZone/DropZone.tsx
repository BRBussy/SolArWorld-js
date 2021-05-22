import React from "react";
import {useSnackbar} from "notistack";
import {useDropzone} from "react-dropzone";
import cx from "classnames";
import {fade, makeStyles} from "@material-ui/core/styles";
import {Button, Typography} from "@material-ui/core";
import {
    Block as NotAllowedIcon,
    PublishOutlined as UploadIcon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    dropZone: {
        padding: theme.spacing(1),
        mimWidth: 200,
        height: 100,
        border: `1px dashed ${theme.palette.text.primary}`,
        backgroundColor: fade(theme.palette.text.secondary, .1),
        display: 'grid',
        gridTemplateColumns: '1fr',
        alignItems: 'center',
        rowGap: theme.spacing(.5),
        justifyItems: 'center'
    },
    dropZoneAccept: {
        border: `1px dashed ${theme.palette.success.main}`,
        backgroundColor: fade(theme.palette.success.main, .2)
    },
    dropZoneReject: {
        border: `1px dashed ${theme.palette.error.main}`,
        backgroundColor: fade(theme.palette.error.main, .2)
    },
    successText: {color: theme.palette.success.light},
    errorText: {color: theme.palette.error.main},
}))

export interface Props {
    fileTypes: string[],
    noFiles?: number;
    onFilesLoaded?: (files: ArrayBuffer[]) => void;
    helperTextAbove?: string;
    helperTextBelow?: string;
}

export default function DropZrone(props: Props) {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const dropZoneProps = useDropzone({
        maxFiles: props.noFiles ? props.noFiles : 1,
        validator: (f: File) => {
            if (!props.fileTypes.includes(f.type)) {
                enqueueSnackbar(
                    `File Type Not Supported`,
                    {variant: 'warning'}
                );
                return [{
                    message: 'Unsupported File Type',
                    code: 'unsupported-file-type'
                }];
            }

            return null;
        },

        onDrop: async (acceptedFiles: File[]) => {
            const fileData: ArrayBuffer[] = await Promise.all(acceptedFiles.map(
                async (f) => (await f.arrayBuffer()),
            ));
            if (props.onFilesLoaded) {
                props.onFilesLoaded(fileData);
            }
        }
    })

    return (
        <div
            {...dropZoneProps.getRootProps()}
            className={cx(
                classes.dropZone,
                {
                    [classes.dropZoneAccept]: dropZoneProps.isDragAccept,
                    [classes.dropZoneReject]: dropZoneProps.isDragReject
                }
            )}
        >
            <input
                {...dropZoneProps.getInputProps()}
            />

            {(() => {
                if (dropZoneProps.isDragActive) {
                    return (dropZoneProps.isDragAccept
                            ? (
                                <>
                                    <Typography
                                        variant={'body1'}
                                        className={classes.successText}
                                        children={'Drop File...'}
                                    />
                                    <UploadIcon className={classes.successText}/>
                                </>
                            )
                            : (<>
                                <Typography
                                    variant={'body1'}
                                    color={'error'}
                                    children={'Unsupported Document Type'}
                                />
                                <NotAllowedIcon color={'error'}/>
                            </>)
                    );
                } else {
                    return (
                        <>
                            <Typography
                                variant={'body2'}
                                children={props.helperTextAbove ? props.helperTextAbove : 'Drag \'n Drop File'}
                            />
                            <Button
                                size={'small'}
                                variant={'contained'}
                                color={'secondary'}
                                children={'Or Select It'}
                            />
                            <Typography
                                variant={'body2'}
                                color={'textSecondary'}
                                children={props.helperTextBelow ? props.helperTextBelow : 'Helper'}
                            />
                        </>
                    );
                }
            })()}
        </div>
    )
}