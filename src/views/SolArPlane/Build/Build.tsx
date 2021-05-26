import React from "react";
import {
    Button,
    Card, CardContent,
    makeStyles, TextField,
} from "@material-ui/core";
import {useSolanaContext} from "../../../context/Solana";
import {SystemInstruction, SystemProgram, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction} from "@solana/web3.js";
import {useWalletContext} from "../../../context/Wallet";
import {LandProgram} from "../../../solArWorld/solana/smartContracts";

const useStyles = makeStyles((theme) => ({
    field: {
        minWidth: 500
    }
}))

export default function Build() {
    const classes = useStyles();
    const {wallet} = useWalletContext();
    const {solanaRPCConnection} = useSolanaContext();

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
                <Button
                    variant={'contained'}
                    color={'primary'}
                    children={'See Stuff!!!'}
                    onClick={async () => {
                        console.log('-----------------------click!-----------------------')
                        // 3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA
                        if (!solanaRPCConnection) {
                            return;
                        }
                        try {
                            const pubKey = new PublicKey('3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA');
                            console.log(('Program Acc info:'))
                            const accInfo = await solanaRPCConnection.getAccountInfo(pubKey)
                            console.log(accInfo)

                            console.log(('Program Acc info and contex?:'))
                            const accInfoAndCtx = await solanaRPCConnection.getAccountInfoAndContext(pubKey)
                            console.log(accInfoAndCtx)

                            console.log(('Parsed Program Acc:'))
                            const parsedAccInfo = await solanaRPCConnection.getParsedAccountInfo(pubKey)
                            console.log(parsedAccInfo)

                            const parsedProgramAccs = await solanaRPCConnection.getParsedProgramAccounts(pubKey);
                            console.log(('Accounts Owned By Program:'))
                            console.log(parsedProgramAccs);
                        } catch (e) {
                            console.log(`error doing thing! ${e}`)
                        }
                    }}
                />
                <Button
                    variant={'contained'}
                    color={'primary'}
                    children={'DO STUFF!!'}
                    onClick={async () => {
                        console.log('-----------------------click!-----------------------')
                        if (!solanaRPCConnection) {
                            return;
                        }
                        try {
                            // parse program public key
                            const programPubKey = new PublicKey('3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA');

                            // prepare a key pair for a new acc
                            const testNewAccKP = Keypair.generate();

                            console.log(`create acc: ${testNewAccKP.publicKey}`)

                            // prepare a create account instruction
                            const createAccInstruction = SystemProgram.createAccount({
                                // The account that will transfer lamports to the created account
                                fromPubkey: wallet.solanaKeys[0].solanaKeyPair.publicKey,
                                // public key of the acc to be created
                                newAccountPubkey: testNewAccKP.publicKey,
                                // no. of lamports for new acc
                                lamports: 2 * LAMPORTS_PER_SOL,
                                // no of bytes to allocate to acc
                                space: 1,
                                // program that owns the acc
                                programId: programPubKey,
                            })

                            // create a new transaction
                            // and add instructions
                            const txn = (new Transaction()).add(createAccInstruction);

                            const someResult = await solanaRPCConnection.sendTransaction(
                                txn,
                                [wallet.solanaKeys[0].solanaKeyPair, testNewAccKP],
                                {skipPreflight: false, preflightCommitment: 'finalized'},
                            );
                            await solanaRPCConnection.confirmTransaction(someResult);

                            console.log('done!')
                        } catch (e) {
                            console.log(`error doing thing! ${e}`)
                        }
                    }}
                />
                <Button
                    variant={'contained'}
                    color={'primary'}
                    children={'Landio!'}
                    onClick={async () => {
                        console.log('-----------------------click!-----------------------')
                        if (!solanaRPCConnection) {
                            return;
                        }
                        try {
                            // parse program public key
                            const programPubKey = new PublicKey('3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA');

                            // prepare a key pair for a new acc
                            const testNewAccKP = Keypair.generate();

                            console.log(`create acc: ${testNewAccKP.publicKey}`)

                            // prepare a land program instruction
                            const landProgramInstruction = LandProgram.mintPositiveLandPieces({
                                landProgramID: programPubKey
                            });

                            // create a new transaction
                            // and add instructions
                            const txn = (new Transaction()).add(landProgramInstruction);

                            const someResult = await solanaRPCConnection.sendTransaction(
                                txn,
                                // [wallet.solanaKeys[0].solanaKeyPair, testNewAccKP],
                                [],
                                {skipPreflight: false, preflightCommitment: 'finalized'},
                            );

                            console.log(someResult)

                            await solanaRPCConnection.confirmTransaction(someResult);

                            console.log('done!')
                        } catch (e) {
                            console.log(`error doing thing! ${e}`)
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
}