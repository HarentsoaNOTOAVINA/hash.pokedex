import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, StyleSheet, TextInput } from "react-native";
import { Row } from "./Row";

type Props = {
    value: string,
    onChange: (s: string) => void
}

export function SearchBar({value, onChange}: Props) {
    const colors = useThemeColors()
    return (
        <Row
            gap={8}
            style={[styles.wrapper, {backgroundColor: colors.grayWhite}]}
        >
            <Image
                source={require('@/assets/images/search.png')}
                width={16}
                height={16}
            />
            <TextInput 
                style={[styles.input, {color: colors.grayDark}]} 
                onChangeText={onChange} 
                value={value}
                placeholder="Search"
                placeholderTextColor={colors.grayMedium}
            />
        </Row>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: 16,
        height: 32,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 10,
        lineHeight: 16,
    }
})