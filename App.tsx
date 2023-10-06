import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Button,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import {MAP_API_KEY} from '@env';
import {useCallback, useState, useEffect, useRef} from 'react';
import MapView, {Circle, LatLng, Marker, Point} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const useStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

type Location = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

function distance(coords1: Location, coords2: Location) {
  const {latitude: lat1, longitude: lon1} = coords1;
  const {latitude: lat2, longitude: lon2} = coords2;
  const degToRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const halfDLat = degToRad(lat2 - lat1) / 2;
  const halfDLon = degToRad(lon2 - lon1) / 2;
  const a =
    Math.sin(halfDLat) * Math.sin(halfDLat) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(halfDLon) *
      Math.sin(halfDLon);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // 100m
}
const App = () => {
  const _map = useRef<MapView | null>(null);
  const [focus, setFocus] = useState(true);
  const [marker, setMarker] = useState<Location>({
    latitude: 10.370855,
    longitude: 107.082665,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });
  const [location, setLocation] = useState<Location>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });
  const Location = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const init = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        };
        setLocation(init);
      },
      error => console.log('loi', error.message),
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000},
    );
  };
  const getLocation = async () => {
    console.log('hi');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Pokemon App Location Permission',
          message: 'Cool Pokemon App Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Location();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const permission = async () => {
      await getLocation();
    };
    permission();
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={map => (_map.current = map)}
        style={useStyle.container}
        region={location}
        showsUserLocation={true}
        zoomEnabled={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsIndoors={true}
        onUserLocationChange={event => {
          if (!focus) return;

          _map.current?.animateToRegion(
            {
              latitude: event.nativeEvent.coordinate?.latitude!,
              longitude: event.nativeEvent.coordinate?.longitude!,
              latitudeDelta: 0.01,
              longitudeDelta: 0.005,
            },
            500,
          );
          setLocation({
            latitude: event.nativeEvent.coordinate?.latitude!,
            longitude: event.nativeEvent.coordinate?.longitude!,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          });
        }}>
        <Circle
          center={location}
          strokeWidth={1}
          radius={100}
          strokeColor={'#1a66ff'}
          fillColor={'rgba(230,238,255,0.5)'}
        />
        <Marker
          draggable
          onDragEnd={event => {
            setMarker({
              latitude: event.nativeEvent.coordinate?.latitude!,
              longitude: event.nativeEvent.coordinate?.longitude!,
              latitudeDelta: 0.01,
              longitudeDelta: 0.005,
            });
          }}
          coordinate={marker!}
          title={'huy'}
          description={'Nè'}
        />
      </MapView>
      <View style={{position: 'absolute', bottom: 10, right: 10}}>
        <TouchableOpacity
          style={{
            ...useStyle.button,
            backgroundColor: focus ? 'black' : '#DDDDDD',
          }}
          onPress={() => {
            setFocus(!focus);
          }}>
          <Text>Focus</Text>
        </TouchableOpacity>
      </View>
      <View style={{position: 'absolute', bottom: 10, left: 10}}>
        <TouchableOpacity
          style={{
            ...useStyle.button,
          }}
          onPress={() => {
            const value =
              Math.sqrt(
                Math.pow(location.latitude - marker.latitude, 2) +
                  Math.pow(location.longitude - marker.longitude, 2),
              ) * 100;
            console.log('value', value);
            console.log('result', distance(location, marker));
          }}>
          <Text>Find Pokemon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
