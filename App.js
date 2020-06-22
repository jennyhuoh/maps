import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from "react-native-maps";

const App=() => {
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
  return(
    <View style = {{flex: 1}}>
      <MapView
        region = {region}
        style = {{flex: 1}}
        showsTraffic
        provider = "google"
      >
        <Marker
          coordinate = {marker.coord}
          title = {marker.name}
          description = {marker.address}
        />
      </MapView>
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
});

export default App;