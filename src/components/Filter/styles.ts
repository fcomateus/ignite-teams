import styled, { useTheme } from "styled-components/native";
import { TouchableOpacity } from 'react-native'

export type FilterStyleProps = {
    isActive?: boolean;
}

export const Container = styled(TouchableOpacity) <FilterStyleProps>`
    border: ${({ isActive }) => isActive ? `1px solid ${useTheme().COLORS.GREEN_700}` : 'none'};
    border-radius: 4px;
    
    margin-right: 12px;
   
    height: 38px;
    width: 70px;

    align-items: center;
    justify-content: center;
`

export const Title = styled.Text`
    text-transform: uppercase;
    font-family: ${() => useTheme().FONT_FAMILY.BOLD};
    font-size: ${() => useTheme().FONT_SIZE.SM}px;
    color: ${() => useTheme().COLORS.WHITE};
`