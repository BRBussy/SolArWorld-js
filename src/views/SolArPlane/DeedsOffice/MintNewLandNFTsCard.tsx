import React, {useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid, Icon,
    makeStyles,
    MenuItem,
    TextField, Theme,
    Typography
} from "@material-ui/core";
import {AllQuadrantNumbers, QuadrantNo} from "../../../solArWorld/genesisRegion";
import {InfoOutlined} from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
    headerRoot: {
        display: 'grid',
        minWidth: 400,
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    lineItem: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1)
    },
    lineItemHelperText: {
        color: theme.palette.text.hint
    },
    lineItemWithHelpIcon: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    },
    helpIcon: {
        color: theme.palette.text.hint,
        '&:hover': {
            color: theme.palette.text.primary
        },
        cursor: 'pointer'
    },
}))

export function MintNewLandNFTsCard() {
    const classes = useStyles();
    const [quadrantToMintNewLand, setQuadrantToMintNewLand] = useState(QuadrantNo.One);

    return (
        <Card>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.headerRoot}>
                        <Grid container>
                            {([
                                <Typography
                                    variant={'h5'}
                                    children={'Mint New Land NFTs'}
                                />
                            ]).map((n, idx) => (<Grid key={idx} item>{n}</Grid>))}
                        </Grid>
                        <Grid container>
                            {([
                                <Button
                                    color={'secondary'}
                                    variant={'contained'}
                                    children={'Mint'}
                                />
                            ]).map((n, idx) => (<Grid key={idx} item>{n}</Grid>))}
                        </Grid>
                    </div>
                }
            />
            <CardContent>
                <Grid container direction={'column'}>
                    {([
                        <>
                            <Typography
                                variant={'body2'}
                                className={classes.lineItemHelperText}
                            >
                                Select the quadrant in which you would like to mint new land.
                            </Typography>
                            <div className={classes.lineItemWithHelpIcon}>
                                <TextField
                                    select
                                    label={'Quadrant'}
                                    value={quadrantToMintNewLand}
                                    onChange={(e) => setQuadrantToMintNewLand(+e.target.value as QuadrantNo)}
                                >
                                    {AllQuadrantNumbers.map((n) => (
                                        <MenuItem key={n} value={n}>
                                            {`Quadrant ${n}`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Icon className={classes.helpIcon}>
                                    <InfoOutlined/>
                                </Icon>
                            </div>
                        </>
                    ]).map((n, idx) => (
                        <Grid
                            className={classes.lineItem}
                            key={idx}
                            item
                        >{n}</Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}