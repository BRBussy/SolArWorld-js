import React, {useState} from "react";
import {
    Button,
    Card, CardContent, Grid,
    makeStyles, TextField,
} from "@material-ui/core";
import {useSolanaContext} from "../../../context/Solana";
import {
    SystemInstruction,
    SystemProgram,
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction,
    Logs, Context
} from "@solana/web3.js";
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
    const [landProgramID, setLandProgramID] = useState('3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA');

    return (
        <Card>
            <CardContent>
                <Grid container direction={'column'} spacing={1}>
                    <Grid item>
                        <TextField
                            className={classes.field}
                            label={'Land Program Acc'}
                            value={landProgramID}
                        />
                    </Grid>
                    <Grid item>
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
                    </Grid>
                    <Grid item>
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
                    </Grid>
                    <Grid item>
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

                                    // // prepare a key pair for a new acc
                                    // const testNewAccKP = Keypair.generate();
                                    //
                                    // console.log(`thing to do here: ${testNewAccKP.publicKey}`)

                                    // subscribe to logs
                                    const subNo = solanaRPCConnection.onLogs(
                                        'all',
                                        (logs: Logs, ctx: Context) => {
                                            console.log('things here?', logs, ctx)
                                        }
                                    )

                                    // prepare a land program instruction
                                    const landProgramInstruction = LandProgram.mintLandPieces({
                                        landProgramID: programPubKey,
                                        nftTokenAccOwnerAccPubKey: wallet.solanaKeys[0].solanaKeyPair.publicKey
                                    });

                                    // create a new transaction
                                    // and add instructions
                                    const txn = (new Transaction()).add(landProgramInstruction);

                                    const someResult = await solanaRPCConnection.sendTransaction(
                                        txn,
                                        [wallet.solanaKeys[0].solanaKeyPair],
                                        {skipPreflight: false, preflightCommitment: 'finalized'},
                                    );

                                    console.log(someResult)

                                    await solanaRPCConnection.confirmTransaction(someResult);

                                    await solanaRPCConnection.removeOnLogsListener(subNo)

                                    console.log('done!')
                                } catch (e) {
                                    console.log(`error doing thing! ${e}`)
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}