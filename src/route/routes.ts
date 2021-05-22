import RouteType from './Route';
import {
    AccountBalanceWallet as WalletIcon,
    Storage as ARWeaveIcon,
    Settings as SolanaIcon
} from '@material-ui/icons';
import Wallet from '../views/Wallet';
import Arweave from '../views/Arweave';
import Solana from '../views/Solana';

export const defaultRoute: RouteType = {
    name: 'Wallet',
    id: 'wallet',
    path: '/wallet',
    component: Wallet,
    icon: WalletIcon
}

export const publicRoutes: RouteType[] = [
    defaultRoute,
    {
        name: 'Arweave',
        id: 'arweave',
        path: '/arweave',
        component: Arweave,
        icon: ARWeaveIcon,
        allowSubPaths: true
    },
    {
        name: 'Solana',
        id: 'solana',
        path: '/solana',
        component: Solana,
        icon: SolanaIcon,
        allowSubPaths: true
    },
]
