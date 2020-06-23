import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import MapView, {Marker} from "react-native-maps";
import mapStyle from "./styles/mapStyle.json";
import Constants from "expo-constants";
import * as Location from "expo-location";
import {Icon} from "react-native-elements";
import axios from 'axios';

const UBIKE_URL = "https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/json/preview"

const App=() => {
  const [onCurrentLocation, setOnCurrentLocation] = useState(false);
  const [ubike, setUbike] = useState([]);

  const [region, setRegion] = React.useState({
    longitude: 121.439276,
    latitude: 25.169993,
    longitudeDelta: 0.01,
    latitudeDelta: 0.02,
  });

  const [marker, setMarker] = useState({
    coord: {
      longitude: 121.439276,
      latitude: 25.169993,
    },
    name: "紅色穀倉美式餐廳",
    address: "新北市淡水區中正路129號 2F",
  });

  const onRegionChangeComplete = (rgn) => {
    if(
      Math.abs(rgn.latitude - region.latitude) > 0.002 ||
      Math.abs(rgn.longitude - region.longitude) > 0.002
    ) {
      setRegion(rgn);
      setOnCurrentLocation(false);
    }
  };

  const setRegionAndMarker = (location) => {
    setRegion({
      ...region,
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
    setMarker({
      ...marker,
      coord: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
    });
  };

  const getLocation = async () => {
    let {status} = await Location.requestPermissionsAsync();
    if(status !== "granted") {
      setMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setRegionAndMarker(location);
    setOnCurrentLocation(true);
  };
  
  const getUbikeAsync = async () => {
    let response = await axios.get(UBIKE_URL);
    setUbike(response.data);
  };

  useEffect(() => {
    if(Platform.OS === "android" && !Constants.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Sketch in an Android simulator. Try it on your device!"
      );
    } else {
        getLocation();
        getUbikeAsync();
      }
  }, {})

  return(
    <View style = {{flex: 1}}>
      <MapView
        region = {region}
        style = {{flex: 1}}
        showsTraffic
        provider = "google"
        onRegionChangeComplete = {onRegionChangeComplete}
        customMapStyle = {mapStyle}
        // onPanDrag = {() => setOnCurrentLocation(false)}
      >
        {ubike.map((site) => (
          <Marker
          coordinate = {{
            latitude: Number(site.lat),
            longitude: Number(site.lng),
          }}
          key = {site.sno}
          title = {`${site.sna} ${site.sbi}/${site.tot}`}
          description = {site.ar}
        >
           <View style = {styles.bike}></View>
        </Marker>
        ))}
      </MapView>
      {!onCurrentLocation && (
          <Icon
            raised
            name = "ios-locate"
            type = "ionicon"
            color = "black"
            containerStyle = {{
              backgroundColor: "#517fa4",
              position: "absolute",
              right: 20,
              bottom: 40,
            }}
            onPress = {getLocation}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bike: {
    width: 10,
    height: 10,
    backgroundColor: "red"
  }
});

export default App;