import React, {useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    makeStyles,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import {AllQuadrantNumbers, QuadrantNo} from "../../../solArWorld/genesisRegion";

const useStyles = makeStyles((theme) => ({
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
    lineItemWithHelpIcon: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
    }
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
                                color={'textPrimary'}
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
                                            {n}
                                        </MenuItem>
                                    ))}
                                </TextField>
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