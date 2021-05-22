import {createStyles, makeStyles, Theme} from '@material-ui/core';
import {hexToRGBA} from '../../../utilities/color';

const tableTitleRowHeight: number = 60;
const tableFilterPanelHeight: number = 80;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    tableTitleLayout: {
        height: tableTitleRowHeight,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        padding: theme.spacing(1),
        alignItems: 'center'
    },
    tableTitle: {},
    tableTitleControlLayout: {
        display: 'flex',
        flexDirection: 'row'
    },
    filterLayout: {
        height: tableFilterPanelHeight,
        borderTop: `1px solid ${hexToRGBA(theme.palette.text.primary, '0.2')}`,
        padding: theme.spacing(1),
        display: 'grid',
        alignItems: 'center'
    },
    tableWrapper: {
        transition: 'height 0.3s ease-out',
        overflow: 'auto'
    }
}));

export default useStyles;
export {
    tableFilterPanelHeight,
    tableTitleRowHeight
};