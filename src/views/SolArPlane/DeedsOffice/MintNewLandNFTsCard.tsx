import React from 'react';
import {Button, Card, CardContent, CardHeader, Grid, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    newNFTCardHeaderRoot: {
        display: 'grid',
        minWidth: 400,
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    newNTFCardLineItem: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1)
    },
}))

export function MintNewLandNFTsCard() {
    const classes = useStyles();

    return (
        <Card>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.newNFTCardHeaderRoot}>
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
                        <Typography
                            variant={'body2'}
                            color={'textPrimary'}
                        >
                            Select the quadrant in which you would like to mint new land.
                        </Typography>
                    ]).map((n, idx) => (
                        <Grid
                            className={classes.newNTFCardLineItem}
                            key={idx}
                            item
                        >{n}</Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}