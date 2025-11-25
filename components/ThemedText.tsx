import { Colors } from "@/constants/Color"
import { useThemeColors } from "@/hooks/useThemeColors"
import { StyleSheet, Text, type TextProps } from "react-native"

const styles = StyleSheet.create({
    body3: {
        fontSize: 10,
        lineHeight: 16
    },
    headline: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 8,
        lineHeight: 12
    },
    subtitle1: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold'
    },
    subtitle2: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: 'bold'
    },
    subtitle3: {
        fontSize: 10,
        lineHeight: 16,
        fontWeight: 'bold'
    },
})

type IProps = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors['light']
}

export default function ThemedText({variant, color, style, ...rest}: IProps) {
    const colors = useThemeColors()
    return <Text style={[styles[variant ?? 'body3'], {color: colors[color ?? 'grayDark']}, style]} {...rest}/>
}

