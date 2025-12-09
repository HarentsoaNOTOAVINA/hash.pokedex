import { Row } from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Image, ImageSourcePropType, StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
    title: string;
    description: string;
    image?: ImageSourcePropType;
}

export function PokemonSpec({style, image, title, description, ...rest}: Props) {

    return (
        <View style={[style, styles.root]} {...rest}>
            <Row>
                {image && <Image source={image} width={16} height={16} style={styles.image}/>}
                <ThemedText style={styles.title}>{title}</ThemedText>
            </Row>
            <ThemedText variant={"caption"} color={"grayMedium"} style={styles.description}   >{description}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        marginRight: 4,
    },
    title: {
        textAlign: 'center',
    },
    description: {
        lineHeight: 16,
        alignItems: 'center',
    },
})