import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Tag(props:any){
      return (
        <Text {...props} style={[styles.basicTagStyle, props.style]}>{props.children}</Text>
      )
    }

  const styles = StyleSheet.create({
    basicTagStyle: {
      fontSize: 16,
      backgroundColor:'orange',
      fontWeight:'bold',
      padding:5,
      borderRadius:3
    },
  });
