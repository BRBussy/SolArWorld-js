import React, {useContext, useRef} from 'react';
import {getRandomColor} from '../../utilities/color';

interface ContextType {
    colorContextGetRandomColorForKey: (key: string) => string;
}

const Context = React.createContext({} as ContextType);

const ColorContext: React.FC = ({children}: { children?: React.ReactNode }) => {
    const usedColors = useRef<{ [key: string]: string }>({})

    const getRandomColorForKey = (key: string) => {
        // if a color is already stored for this key, use it
        if (usedColors.current[key]) {
            return usedColors.current[key]
        }

        // otherwise get a new random color
        usedColors.current[key] = getRandomColor([
            ...Object.values(usedColors.current)
        ])
        return usedColors.current[key];
    }

    return (
        <Context.Provider
            value={{
                colorContextGetRandomColorForKey: getRandomColorForKey
            }}
        >
            {children}
        </Context.Provider>
    )
}

const useColorContext = () => useContext(Context);
export {
    useColorContext
};
export default ColorContext;