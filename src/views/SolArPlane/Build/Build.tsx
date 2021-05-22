import React from "react";
import {
    Card, CardContent,
    makeStyles, TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    field: {
        minWidth: 500
    }
}))

export default function Build() {
    const classes = useStyles();

    return (
        <Card>
            <CardContent>
                <TextField
                    className={classes.field}
                    label={'Positive Land Program Address'}
                    placeholder={'e.g. 6TkKqq15wXjqEjNg9zqTKADwuVATR9dW3rkNnsYme1ea'}
                />
                <TextField
                    className={classes.field}
                    label={'PLP NFT Owner (SPL Token Acc. Owner)'}
                    placeholder={'e.g. 6TkKqq15wXjqEjNg9zqTKADwuVATR9dW3rkNnsYme1ea'}
                />
                <TextField
                    className={classes.field}
                    label={'X Location'}
                />
                <TextField
                    className={classes.field}
                    label={'Y Location'}
                />
                <TextField
                    className={classes.field}
                    label={'PLP_X_Y Decorator Acc.'}
                    placeholder={'e.g. 6TkKqq15wXjqEjNg9zqTKADwuVATR9dW3rkNnsYme1ea'}
                />
            </CardContent>
        </Card>
    )
}