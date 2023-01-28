import { useState } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { asyncHandler, useAsyncEffects } from '../util';

interface Props<ItemT> {
    fetchItems: () => Promise<ItemT[]>;
    filterItems?: (items: ItemT[], searchText: string) => ItemT[];
    extractItemKey: (item: ItemT) => string;
    renderItem: (info: ListRenderItemInfo<ItemT>) => JSX.Element;
}

export default function SearchableList<ItemT>({
    fetchItems,
    filterItems,
    extractItemKey,
    renderItem,
}: Props<ItemT>) {
    const [items, setItems] = useState<ItemT[]>();
    const [searchText, setSearchText] = useState<string>();

    const fetchData = async () => {
        setItems(undefined);
        const items = await fetchItems();
        setItems(items);
    };

    const filterData = () => {
        if (!items) return [];
        if (!filterItems) return items;
        if (searchText === undefined) return items;
        return filterItems(items, searchText);
    };

    useAsyncEffects(fetchData, []);

    return (
        <SafeAreaProvider>
            <FlatList
                data={filterData()}
                renderItem={renderItem}
                keyExtractor={extractItemKey}
                refreshing={items === undefined}
                onRefresh={asyncHandler(fetchData)}
            />
        </SafeAreaProvider>
    );
}
