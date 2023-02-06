import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { ProfileStackNavProps } from '../../nav/types';

export default function AdminMainScreen({ navigation }: ProfileStackNavProps<'AdminMainScreen'>) {
    return (
        <SafeAreaProvider>
            <ScrollView alwaysBounceVertical={false}>
                <TableView style={{ width: '100%' }}>
                    <Section>
                        <Cell
                            image={<Ionicons name={'person-circle-outline'} size={27} />}
                            title="All Users"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.push('AdminUsersScreen');
                            }, [navigation])}
                        />
                    </Section>
                    <Section>
                        <Cell
                            image={<Ionicons name={'earth-outline'} size={27} />}
                            title="All Events"
                            accessory="DisclosureIndicator"
                            onPress={useCallback(() => {
                                navigation.push('AdminEventsScreen');
                            }, [navigation])}
                        />
                    </Section>
                </TableView>
            </ScrollView>
        </SafeAreaProvider>
    );
}
