import React from "react";
import {Grid} from "@material-ui/core";
import {MintNewLandNFTsCard} from "./MintNewLandNFTsCard";

export default function LandBuilder() {
    return (
        <Grid container>
            <Grid item>
                <MintNewLandNFTsCard/>
            </Grid>
        </Grid>
    )
}