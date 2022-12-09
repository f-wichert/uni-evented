import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { asyncHandler } from '../util';

function eventDetailView() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
        </View>
      );
}

export default eventDetailView;