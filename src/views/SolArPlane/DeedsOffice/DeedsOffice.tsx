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
import {LAND_PLANE_ACC_SIZE, LandProgram} from "../../../solArWorld/solana/smartContracts";

const useStyles = makeStyles((theme) => ({
    field: {
        minWidth: 500
    }
}))

export default function DeedsOffice() {
    const classes = useStyles();
    const {wallet} = useWalletContext();
    const {solanaRPCConnection} = useSolanaContext();
    const [apiLoading, setAPILoading] = useState(false);
    const [landProgramID, setLandProgramID] = useState('3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA');
    const [newLandPlaneAccountKP, setNewLandPlaneAccountKP] = useState<Keypair | null>(null);

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
                            children={'Initialise Land Acc'}
                            onClick={async () => {
                                if (!solanaRPCConnection) {
                                    return;
                                }

                                setAPILoading(true);

                                try {
                                    // parse program public key
                                    const landProgramPublicKey = new PublicKey(landProgramID);

                                    // generate a keypair for the new land plane account
                                    const newLandPlaneAccountKP = Keypair.generate();

                                    // prepare a system program instruction to create the new land plane account
                                    const createNewLandPlaneAccInstruction = SystemProgram.createAccount({
                                        // new account to be owned by the land program
                                        programId: landProgramPublicKey,
                                        // no of bytes to allocate to acc
                                        space: LAND_PLANE_ACC_SIZE,
                                        // no. of lamports for new acc
                                        lamports: await solanaRPCConnection.getMinimumBalanceForRentExemption(
                                            LAND_PLANE_ACC_SIZE,
                                            'singleGossip',
                                        ),
                                        // The account that will transfer lamports to the created account
                                        fromPubkey: wallet.solanaKeys[0].solanaKeyPair.publicKey,
                                        // public key of the acc to be created
                                        newAccountPubkey: newLandPlaneAccountKP.publicKey
                                    });

                                    // prepare instruction to initialise new land acc
                                    const initialiseNewLandAcc = LandProgram.initialiseLandPlaneAccount({
                                        landProgramID: landProgramPublicKey,
                                        landPlaneAccountToInitialise: newLandPlaneAccountKP.publicKey
                                    })

                                    // create a new transaction and add instructions
                                    const txn = (new Transaction())
                                        .add(createNewLandPlaneAccInstruction)
                                        .add(initialiseNewLandAcc);

                                    // subscribe to logs
                                    const subNo = solanaRPCConnection.onLogs(
                                        'all',
                                        (logs: Logs, ctx: Context) => {
                                            console.debug(`slot no. ${ctx.slot}`)
                                            if (logs.err) {
                                                console.error(logs.err.toString())
                                            }
                                            logs.logs.forEach((l) => console.debug(l));
                                        }
                                    )

                                    // sign and submit transaction
                                    const txnSignature = await solanaRPCConnection.sendTransaction(
                                        txn,
                                        [wallet.solanaKeys[0].solanaKeyPair, newLandPlaneAccountKP],
                                        {skipPreflight: false, preflightCommitment: 'finalized'},
                                    );
                                    console.debug(`txn signature ${txnSignature}`)

                                    // wait for confirmation
                                    await solanaRPCConnection.confirmTransaction(txnSignature);

                                    // unsubscribe from logs
                                    await solanaRPCConnection.removeOnLogsListener(subNo);
                                } catch (e) {
                                    console.log(`error initialising a new land plane account: ${e}`)
                                }

                                setAPILoading(true);
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}