import {useThemeColors} from "@/hooks/useThemeColors";
import {Dimensions, Image, Modal, Pressable, StyleSheet, View} from "react-native";
import {useRef, useState} from "react";
import ThemedText from "@/components/ThemedText";
import {Card} from "@/components/Card";
import {Row} from "@/components/Row";
import {Radio} from "@/components/Radio";
import {Shadows} from "@/constants/Shadows";

type Props = {
    value: "id" | "name",
    onChange: (v: "id" | "name") => void
}

const options = [
    {label: "Number", value: "id"},
    {label: "Nom", value: "name"}
] as const;

export function SortButton({value, onChange}: Props) {
    const buttonRef = useRef<View>(null);
    const colors = useThemeColors();
    const [isModalVisible, setModalVisibility] = useState(false);
    const [position, setPosition] = useState<null | {top: number, right: number}>(null)

    const onButtonPress = () => {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setPosition({
                top: y + height,
                right: Dimensions.get("window").width - x - width
            })
            setModalVisibility(true)
        })
    }

    const onclose = () => {
        setModalVisibility(false);
    }

    return (
        <>
            <Pressable onPress={onButtonPress}>
                <View
                    ref={buttonRef}
                    style={[styles.button, {backgroundColor: colors.grayWhite}]}>
                    <Image
                        source={
                            value === "id" ?
                                require("@/assets/images/number.png") :
                                require("@/assets/images/alpha.png")
                        }
                        width={16}
                        height={16}
                    />
                </View>
            </Pressable>
            <Modal
                animationType={"fade"}
                transparent
                visible={isModalVisible}
                onRequestClose={onclose}
            >
                <Pressable style={styles.backdrop} onPress={onclose}>
                    <View style={[styles.popup, {backgroundColor: colors.tint, ...position}]}>
                        <ThemedText style={styles.title} variant={"subtitle2"} color={"grayWhite"}>Sort by:</ThemedText>
                        <Card style={styles.card}>
                            {options.map(o => (
                                <Pressable key={o.value} onPress={() => onChange(o.value)}>
                                    <Row key={o.value} gap={8}>
                                        <Radio checked={o.value === value}/>
                                        <ThemedText>{o.label}</ThemedText>
                                    </Row>
                                </Pressable>
                            ))}
                        </Card>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        borderRadius: 32,
        flex: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    popup: {
        position: "absolute",
        width: 113,
        padding: 4,
        paddingTop: 16,
        gap: 16,
        borderRadius: 12,
        ...Shadows.dp2
    },
    title: {
        paddingLeft: 20
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
    }
})