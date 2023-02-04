import { Dispatch, SetStateAction, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';

import { EventManager, Tag } from '../models/event';
import { useAsyncEffects } from '../util';

type TagValue = string;
type TagWithValue = Tag & { value: TagValue };

type DropdownProps = Omit<
    Extract<DropDownPickerProps<TagValue>, { multiple: true }>,
    'open' | 'setOpen' | 'items' | 'setItems' | 'value' | 'setValue' | 'multiple'
>;
type Props = DropdownProps & {
    // tag IDs (not full tag objects)
    selectedTags: TagValue[];
    setSelectedTags: Dispatch<SetStateAction<TagValue[]>>;

    showBackground?: boolean;
    dropdownStyle?: StyleProp<ViewStyle>;
};

export default function TagDropdown({
    selectedTags,
    setSelectedTags,
    showBackground,
    dropdownStyle,
    maxHeight,
    style,
    ...props
}: Props) {
    const [tags, setTags] = useState<TagWithValue[]>([]);

    const [open, setOpen] = useState(false);

    useAsyncEffects(
        async () => {
            const response = await EventManager.fetchAllTags();
            const mappedTags: TagWithValue[] = response.map((tag: Tag) => ({
                ...tag,
                value: tag.id,
            }));
            setTags(mappedTags);
        },
        [],
        { prefix: 'Failed to fetch tags' }
    );

    return (
        <View style={[styles.container, style]}>
            <DropDownPicker<TagValue>
                style={dropdownStyle}
                multiple={true}
                open={open}
                setOpen={setOpen}
                items={tags}
                setItems={setTags}
                value={selectedTags}
                setValue={setSelectedTags}
                maxHeight={maxHeight}
                categorySelectable={false}
                placeholder="Select tags"
                mode="BADGE"
                badgeDotColors={[
                    '#e76f51',
                    '#00b4d8',
                    '#e9c46a',
                    '#e76f51',
                    '#8ac926',
                    '#00b4d8',
                    '#e9c46a',
                ]}
                {...props}
            />
            {showBackground && open ? (
                <View style={{ height: maxHeight ?? 200 }} pointerEvents="none"></View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
    },
});
